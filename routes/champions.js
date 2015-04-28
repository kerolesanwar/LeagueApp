var request = require('request');
var url = require('url');
var search = require('./search');
var fs = require('fs');
var Summoner = require('../models/summoners');
module.exports = function(req, res){

	//new url to request
	options.pathname='/api/lol/na/v1.3/stats/by-summoner/' + sumId + '/ranked';
	options.query={ season: 'SEASON4', api_key: '5db573b0-7260-4bc6-9f44-3bdc3d1e1547' };

	//Public json file containing champion information
	championList = JSON.parse(fs.readFileSync('public/dragontail/4.21.5/data/en_US/champion.json'));

	request(url.format(options), function(err, resp, body){
		if(!err && resp.statusCode == 200) {
			championsPlayed = JSON.parse(body); //Ranked Statistics by Champion (Wins, kills, Damage Dealt, etc)
			for(champId in championsPlayed.champions){ //User's stats with each champion
				for(champ in championList.data){ //Each Champions information
					if(championsPlayed.champions[champId].id == championList.data[champ].key) {//ID's are the same ==> same champ
						Object.keys(championList.data[champ]).forEach(function(key){
							championsPlayed.champions[champId].stats[key]=championList.data[champ][key]; //Append Champ Info to users championsPlayed
						});
					}
				}

				
			}
			/*Sorting By Most Played
				Messy, fix Later
			*/
			var arr=[];
			Object.keys(championsPlayed.champions).sort(function(x, y){
				return championsPlayed.champions[y].stats.totalSessionsPlayed -
				 championsPlayed.champions[x].stats.totalSessionsPlayed;
			}).forEach(function(key){
				arr.push(championsPlayed.champions[key]);
			})

			Summoner.findOne({summonerId: sumId}, function(err, summoner){
				if(err) console.error(err);

				summoner.mostPlayedChamp = arr[1]['stats']['name'];
				summoner.rankedStats = arr[0]['stats'];
				console.log(summoner.mostPlayedChamp);
				console.log(summoner.rankedStats);

				summoner.save(function(err){
					if(err){
						console.log(err);
					}else{
						console.log('saved successfully');
					}
				})
			});

			res.render('champions', {title: 'Champions Played', champs:arr});
		} else res.json(resp.statusCode + ' champions not found');
	});

};
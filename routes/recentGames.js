var request = require('request');
var url = require('url');
var search = require('./search');
var fs = require('fs');
var Summoner = require('../models/summoners');
module.exports = function(req, res){

	options.pathname ='/api/lol/na/v1.3/game/by-summoner/' + sumId + '/recent';
	options.query= {api_key: '5db573b0-7260-4bc6-9f44-3bdc3d1e1547'}
	championList = JSON.parse(fs.readFileSync('public/dragontail/4.21.5/data/en_US/champion.json'));

	request(url.format(options), function(err, resp, body){
	 if(!err && resp.statusCode == 200) {
		 recentGames = JSON.parse(body);
		 for(game in recentGames['games']) {
		 	for(champ in championList.data){
		 		if(recentGames['games'][game].championId == championList.data[champ].key){
		 			console.log('test');
		 			recentGames['games'][game].image = championList.data[champ]['image'];
		 		}
		 	}
		 }

 		Summoner.findOne({summonerId: sumId}, function(err, summoner){
			if(err) console.error(err);
			summoner.recentGames = recentGames;

			summoner.save(function(err){
				if(err){
					console.log(err);
				}else{
					console.log('saved successfully');
				}
			});
		});
	 } else res.json(resp.statusCode + ' recent games not found');

		res.render('recentgames', {title:'Recent Games', games: recentGames});
	});
}
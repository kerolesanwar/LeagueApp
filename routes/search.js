var request = require('request');
var url = require('url');
var Summoner = require('../models/summoners');
module.exports = function(req, res){
	sumName = req.query.username;
	sumNameFixed = sumName.toLowerCase().split(' ').join(''); //Get Rid of Spacing

	//hide api key later
	options = {
		protocol: 'https:',
		host: 'na.api.pvp.net',
		pathname: '/api/lol/na/v1.4/summoner/by-name/' + sumNameFixed,
		query: { api_key: '2699f062-a9e2-4b00-a527-54b2276b326f'}
	}

	request(url.format(options), function(err, resp, body){
		if(!err && resp.statusCode == 200) {
			sumData = JSON.parse(body);
			sumId=sumData[sumNameFixed].id;
			exports.sumId = sumId;
			exports.options = options;

			Summoner.findOne({username: sumName}, function(err, summoner){
				if(err) console.error(err);
				if(summoner){
					summoner.summonerId = sumId
				} else {
					summoner = new Summoner({
						username: sumName,
						summonerId: sumId
					});

					summoner.save(function(err, summoner){
						if(err) console.error(err);
						console.dir(summoner);
					})	
				}
			});



			res.render('search', {title: 'Search Results', sumData: sumData[sumNameFixed]});
		} else res.json(resp.statusCode + ' summoner not found');
	});
};	
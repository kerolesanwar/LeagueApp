var request = require('request');
var url = require('url');
var search = require('./search');
var fs = require('fs');
var Q = require('q');

module.exports = function(req, res){

	deferred = Q.defer();
	promises=[];
	options.pathname ='/api/lol/na/v1.3/game/by-summoner/' + sumId + '/recent';
	options.query= {api_key: '5db573b0-7260-4bc6-9f44-3bdc3d1e1547'}

	request(url.format(options), function(err, resp, body){


	 matchIds=[];
	 results=[];
	 recentGames = JSON.parse(body);

	 for(game in recentGames.games){
		// console.log(recentGames.games[game].gameId);
		matchIds.push(recentGames.games[game].gameId);	
	 }


	 for(id in matchIds){
		options.pathname='/api/lol/na/v2.2/match/' + matchIds[id];
		promise=deferred.promise;
		promises.push(promise);
		request(url.format(options), function(err, resp, body){
			results.push(JSON.parse(body));
			deferred.resolve();
		});
	 }

	});

	Q.all(promises).then(function(){
	 // console.log(results);
	 res.render('recentgames', {title:'Recent Games', games: results});
	});
}
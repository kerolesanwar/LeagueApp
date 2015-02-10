var request = require('request');
var url = require('url');
var search = require('./search');
var fs = require('fs');

module.exports = function(req, res){
	console.log('test');
	//new url to request
	options.pathname='/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/' + sumId;
	options.query=={ api_key: '5db573b0-7260-4bc6-9f44-3bdc3d1e1547' };

	championList = JSON.parse(fs.readFileSync('public/dragontail/4.21.5/data/en_US/champion.json'));
	spellList = JSON.parse(fs.readFileSync('public/dragontail/4.21.5/data/en_US/summoner.json'));

	request(url.format(options), function(err, resp, body){
		currentGame = JSON.parse(body);
		//console.log(currentGame);
		for(player in currentGame.participants){
			for(champ in championList.data){
				if(championList.data[champ].key == currentGame.participants[player].championId){
					currentGame.participants[player].champ = champ;
				}
			}

			for(spell in spellList.data){
				if(spellList.data[spell].key == currentGame.participants[player].spell1Id){
					currentGame.participants[player].spell1 = spell;
				}
				if(spellList.data[spell].key == currentGame.participants[player].spell2Id){
					currentGame.participants[player].spell2 = spell;
				}
			}
		}
		res.render('currentGame', {title: "Current Game", game: currentGame});
	});

};
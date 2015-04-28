var request = require('request');
var url = require('url');
var search = require('./search');
var fs = require('fs');
var Summoner = require('../models/summoners');
module.exports = function(req, res){

	//new url
	options.pathname ='/api/lol/na/v1.4/summoner/' + sumId + '/runes';
	options.query= {api_key: '5db573b0-7260-4bc6-9f44-3bdc3d1e1547'}

	//Public json file containing rune information
	runeList = JSON.parse(fs.readFileSync('public/dragontail/4.21.5/data/en_US/rune.json'));

	request(url.format(options), function(err, resp, body){
		if(!err && resp.statusCode == 200) {
			runes = (JSON.parse(body))[sumId];

			/*Add extra data to user runes retrieved from api including
			  Name, Description, Image & Type
			*/
			Object.keys(runeList.data).forEach(function(key){
				for(page in runes.pages){
					for(slot in runes.pages[page].slots){
						if(runes.pages[page].slots[slot].runeId == key){
							Object.keys(runeList.data[key]).forEach(function(key2){
								runes.pages[page].slots[slot][key2] = runeList.data[key][key2];
							});
						}
					
					}
				}
			});
			console.log(runes);
			Summoner.findOne({summonerId: sumId}, function(err, summoner){
				if(err) console.error(err);
				summoner.runes = runes;
				summoner.save(function(err){
					if(err){
						console.log(err);
					}else{
						console.log('saved successfully');
					}
				})
			});
			res.render('runes', {title: 'Runes', runes: runes});
		} else res.json(resp.statusCode + ' runes not found');
	});
}
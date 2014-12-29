var request = require('request');
var url = require('url');
var search = require('./search');
var fs = require('fs');

module.exports = function(req, res){
	//new url
	options.pathname ='/api/lol/na/v1.4/summoner/' + sumId + '/masteries';
	options.query= {api_key: '5db573b0-7260-4bc6-9f44-3bdc3d1e1547'}

	//public json file containing masteries information
	masteryList = JSON.parse(fs.readFileSync('public/dragontail/4.21.5/data/en_US/mastery.json'));

	//Add Mastery description, image, rank, etc.
	request(url.format(options), function(err, resp, body){
		masteries = (JSON.parse(body))[sumId];
		Object.keys(masteryList.data).forEach(function(key){
			for(page in masteries.pages){
				for(mastery in masteries.pages[page].masteries){
					if(masteries.pages[page].masteries[mastery].id==key){
						Object.keys(masteryList.data[key]).forEach(function(key2){
							masteries.pages[page].masteries[mastery][key2] = masteryList.data[key][key2];
						});
					}
				}
			}
		});

		Object.keys(masteryList.tree).forEach(function(treeName){
			for(row in masteryList.tree[treeName]){
				for(column in masteryList.tree[treeName][row]){
					
					if(masteryList.tree[treeName][row][column]){
						for(page in masteries.pages){
							for(mastery in masteries.pages[page].masteries){
								//Add the relative Tree Name and its position on the tree for use in rendering
								if(masteries.pages[page].masteries[mastery].id == masteryList.tree[treeName][row][column].masteryId){
									masteries.pages[page].masteries[mastery].tree = treeName;
									masteries.pages[page].masteries[mastery].row = row
									masteries.pages[page].masteries[mastery].column = column;

								}								
							}
						}
					}
					

				}
			}
		})
		res.render('masteries', {title: 'Masteries', masteries: masteries, masteryList: masteryList});
	});
}

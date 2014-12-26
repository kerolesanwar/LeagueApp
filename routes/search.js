var request = require('request');
var url = require('url');
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
		sumData = JSON.parse(body);
		res.json(sumData);
	});
};	
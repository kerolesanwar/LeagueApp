var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var summonerSchema = new Schema({
	username: String,
	summonerId: Number,
	mostPlayedChamp: String,
	rankedStats: Object,
	runes: Object,
	masteries: Object,
	recentGames: Object
});

var Summoner = mongoose.model('Summoner', summonerSchema);
module.exports = Summoner;
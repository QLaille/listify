const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://laqu19dt:0lwKd9uIKWUPqbPm@cluster0-0iynr.mongodb.net/Listify?retryWrites=true&w=majority');//TODO Remove this file from git tracker
var connection = mongoose.connection;

module.exports = connection;
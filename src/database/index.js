const mongoose = require('mongoose');

const USERN = '';
const PSSWD = '';
const HOSTN = '';

const DBNAME = '';
const PORT = '';

mongoose.connect('mongodb+srv://laqu19dt:0lwKd9uIKWUPqbPm@cluster0-0iynr.mongodb.net/Listify?retryWrites=true&w=majority');
var connection = mongoose.connection;

module.exports = connection;
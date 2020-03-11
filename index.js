const cors = require('cors');
const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const hbs = require( 'express-handlebars');
const cookieParser = require('cookie-parser');
const Handlebars = require('handlebars');

const router = require('./src/routes')();

const PORT = 1234;
const app = express();

require('./src/config/passport');
require('./src/database');

app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(cors({ origin:true, credentials:true }));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use('/', router);

app.engine('hbs', hbs({
	extname: 'hbs',
	defaultView: 'default',
	layoutsDir: __dirname + '/src/views/layouts/',
	partialsDir: __dirname + '/src/views/partials/',
	allowProtoPropertiesByDefault:true,
	allowProtoMethodsByDefault:true,
	allowInsecurePrototypeAccess:true
}));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'hbs');

app.listen(PORT, () => {
	console.log(`Server is listening on port: ${PORT}`);
});
import express from "express";
import bodyParser from 'body-parser';
const morgan = require('morgan');

// Routes

import { census } from './routes/census';
import { fatalEncounters } from "./routes/fatalEncounters";
import { allowedExt } from './constants';

// dev .env variables

if (process.env.NODE_ENV !== 'production') {
	const dotenv = require("dotenv").config();
	if (dotenv.error) { console.log(dotenv.error); }
}

const PORT = process.env.PORT || 8080;
console.log(PORT)
const app = express();
app.use(bodyParser.json());


// Logging

app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

// register routes

app.use('/api/census', census);
app.use('/api/fatalEncounters', fatalEncounters);

// ==== if its production environment
const clientPath = '../../build/';
if (process.env.NODE_ENV === 'production') {
	const path = require('path')
	app.use('/static', express.static(path.join(__dirname, clientPath, 'static')));
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, clientPath, 'index.html'))
	})

	app.get('*', (req, res) => {

		// if there is a file extension, send the file
		if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
			// remove any querystring like '?q=search-terms'
			req.url = req.url.replace(/\?.*/g, '');

			res.sendFile(path.resolve(__dirname, `${clientPath}${req.url}`));
		} else {
			res.sendFile(path.resolve(__dirname, `${clientPath}index.html`));
		}
	});
}

// Starting Server

app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
})
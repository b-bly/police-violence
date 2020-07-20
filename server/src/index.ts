import express from "express";
import bodyParser from 'body-parser';
const morgan = require('morgan');

// Routes

import { census } from './routes/census';
import { fatalEncounters } from "./routes/fatalEncounters";

// dev .env variables

if (process.env.NODE_ENV !== 'production') {
	const dotenv = require("dotenv").config();
	if (dotenv.error) { console.log(dotenv.error); }
}

const PORT = process.env.PORT || 8080;
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
const clientPath = '../../build/static/';
if (process.env.NODE_ENV === 'production') {
	const path = require('path')
	app.use('/static', express.static(path.join(__dirname, clientPath)))
	app.get('/', (req, res) => {
		console.log('dirname');
		console.log(__dirname);
		res.sendFile(path.join(__dirname, '../../build/', 'index.html'))
	})
}

// Starting Server

app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
})
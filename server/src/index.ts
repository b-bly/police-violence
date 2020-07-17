import express from "express";
import bodyParser from 'body-parser';
const morgan = require('morgan')
import fetchJsonp from 'fetch-jsonp';

// Routes

import { census } from './routes/census';
import { fatalEncounters } from "./routes/fatalEncounters";

const port = 8080;
const app = express();
app.use(bodyParser.json())

// Logging

app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.use('/api/census', census);
app.use('/api/fatalEncounters', fatalEncounters);

// Starting Server

app.listen(port, () => {
	console.log(`App listening on PORT: ${port}`)
})
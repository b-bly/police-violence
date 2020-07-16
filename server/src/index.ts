import express from "express";
import bodyParser from 'body-parser';
const clientPath = '../../build/';
const port = 8080;
const morgan = require('morgan')

// Routes

import { census } from './routes/census';
import { fatalEncounters } from "./routes/fatalEncounters";

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
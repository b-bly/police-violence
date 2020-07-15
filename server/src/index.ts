import express from "express";
import bodyParser from 'body-parser';
const clientPath = '../../build/';
const port = 8080;

// Routes

import { census } from './routes/census';
import { fatalEncounters } from "./routes/fatalEncounters";

const app = express();
app.use(bodyParser.json())

app.use('/api/census', census);
app.use('/api/fatalEncounters', fatalEncounters);

// Starting Server

app.listen(port, () => {
	console.log(`App listening on PORT: ${port}`)
})
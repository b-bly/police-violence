import express from "express";
import bodyParser from 'body-parser';
const clientPath = '../../build/';
const port = 8080;
// Routes

import { census } from './routes/census';

const app = express();
app.use(bodyParser.json())

app.use('/api/census', census);

// Starting Server
app.listen(port, () => {
	console.log(`App listening on PORT: ${port}`)
})
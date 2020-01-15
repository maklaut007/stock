const http = require('http');
const express = require('express');
const apiroute = require('./api/routes/api');

const app = express();

const server = http.createServer(app);


app.use(express.json());

app.use('/api', apiroute);
app.use((req, res, next) => {
	res.status(404).json();
    next();
})
const port = process.env.PORT || 5000;;

server.listen(port, () => `Server running on port ${port}`);
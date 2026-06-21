const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./Routes/routes');

dotenv.config();
require('./config/db');

//app
const app = express();
const PORT = 5000;

//middlewares
app.use(cors());
app.use(express.json());

//welcome message
app.get('/', (req, res) => {
    res.send('API is running...');
});


//routes
app.use('/api', routes);

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







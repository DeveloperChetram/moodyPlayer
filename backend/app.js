const express = require('express');
const songRoutes = require('./src/routes/routes.song');
const connectToDB = require('./src/db/db');
const app = express();

 connectToDB();

app.use(express.json());

app.use('/',songRoutes)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
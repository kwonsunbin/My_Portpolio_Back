const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./config/db');
const cors = require('cors');
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const coins = require('./routes/coins');

app.use(express.json());
app.use(cors());

app.use('/api/v1/coins', coins);

app.listen(process.env.PORT, () => {
  console.log(
    '\x1b[36m%s\x1b[0m',
    `App listening on port ${process.env.PORT}!`
  );
});

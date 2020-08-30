const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const checkoutRoutes = require('./Routes/checkoutRoutes');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(checkoutRoutes);
// createCharge();
app.listen(8000, () => {
  console.log('Server is up');
});

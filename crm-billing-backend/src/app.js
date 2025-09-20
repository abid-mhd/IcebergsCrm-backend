const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const authStub = require('./middleware/authStub');

const clients = require('./routes/clients');
const products = require('./routes/products');
const invoices = require('./routes/invoices');
const payments = require('./routes/payments');

const app = express();
app.use(cors());
app.use(bodyParser());
app.use(authStub);

app.use('/api/clients', clients);
app.use('/api/products', products);
app.use('/api/invoices', invoices);
app.use('/api/payments', payments);

app.get('/', (req, res) => res.json({ message: 'CRM Billing API' }));

const partyRoutes = require("./routes/parties");
app.use("/api/parties", partyRoutes);

module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const util = require('util');
const cors = require('cors');
require('dotenv').config();

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const rootDir = require('../helper/path');

const filePath = path.join(rootDir, 'data', 'internetBankingCharge.json');

const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

const omiseCheckoutCreditCard = async (req, res, next) => {
  console.log(req.body);
  const { email, name, amount, token } = req.body;
  try {
    const customer = await omise.customers.create({
      email,
      description: name,
      card: token,
    });
    const charge = await omise.charges.create({
      amount: amount,
      currency: 'thb',
      customer: customer.id,
    });
    // console.log(charge);
    res.send({
      authorizeUri: charge.authorize_uri,
      status: charge.status,
      amount: charge.amount / 100,
    });
  } catch (error) {
    console.log(error);
  }
  next();
};

const omiseCheckoutInternetBanking = async (req, res, next) => {
  try {
    const { email, name, amount, token } = req.body;

    const charge = await omise.charges.create({
      amount,
      source: token,
      currency: 'thb',
      return_uri: 'http://localhost:3000/message',
    });

    res.send({ authorizeUri: charge.authorize_uri });
    // console.log(charge);
  } catch (err) {
    console.log(err);
  }
  next();
};

const omiseTransfer = async (req, res, next) => {
  console.log(req.body);
  const { email, name, amount, token } = req.body;
  try {
    const recipient = await omise.recipients.create({
      email,
      name,
      type: 'individual',
      bank_account: {
        brand: 'bbl',
        number: '1234567890',
        name,
      },
    });
    const transfer = await omise.transfers.create({
      amount,
      recipient: recipient,
    });
    console.log(transfer);

    res.send({
      authorizeUri: charge.authorize_uri,
      status: charge.status,
      amount: charge.amount / 100,
    });
  } catch (error) {
    console.log(error);
  }
  next();
};

const omiseWebHooks = async (req, res, next) => {
  try {
    const { data } = req.body;

    // console.log(data);
    if (data.status === 'successful' || data.status === 'failed') {
      const charge = {
        id: data.id,
        status: data.status,
        amount: data.funding_amount,
      };

      await writeFile(filePath, JSON.stringify(charge));
    }
  } catch (err) {
    console.log(err);
  }
  next();
};

const readFileData = async () => {
  try {
    const chargeData = await readFile(filePath, 'utf8');

    if (!chargeData) {
      return {};
    }

    return JSON.parse(chargeData);
  } catch (err) {
    console.log(err);
  }
};
const getInternetBankingCharge = async (req, res, next) => {
  try {
    const charge = await readFileData();

    res.send({ ...charge });
    await writeFile(filePath, JSON.stringify({}));
  } catch (err) {
    console.log(err);
  }
  next();
};
module.exports = {
  omiseCheckoutCreditCard,
  omiseCheckoutInternetBanking,
  omiseWebHooks,
  getInternetBankingCharge,
  omiseTransfer,
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

const omiseCheckoutCreditCard = async (req, res, next) => {
  // console.log(req.body.card);
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
    res.send({
      authorizeUri: charge.authorize_uri,
      status: charge.status,
      amount: charge.amount / 100,
    });
    console.log(charge);
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
      return_uri: 'http://localhost:3000/checkout',
    });

    res.send({ authorizeUri: charge.authorize_uri });
  } catch (err) {
    console.log(err);
  }
  next();
};

module.exports = {
  omiseCheckoutCreditCard,
  omiseCheckoutInternetBanking,
  // omiseWebHooks,
  // getInternetBankingCharge
};

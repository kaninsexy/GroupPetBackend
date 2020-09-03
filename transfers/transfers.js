const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const util = require('util');
const cors = require('cors');
require('dotenv').config();
const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});
let recipientId;
const omiseCreateRecipients = async (req, res, next) => {
  try {
    const recipient = await omise.recipients.create({
      name: 'Somchai Prasert',
      email: 'somchai.prasert@example.com',
      type: 'individual',
      bank_account: {
        brand: 'bbl',
        number: '1234567890',
        name: 'SOMCHAI PRASERT',
      },
    });
    recipientId = recipient.id;
    console.log(recipientId);
  } catch (error) {
    console.log(error);
  }
  next();
};
const omiseTransfer = async (req, res, next) => {
  try {
    const transfers = await omise.transfers.create({
      amount: 999999,
      recipient: 'recp_test_5l377dfrgbgq9klbox8',
    });
    console.log(transfers);
  } catch (error) {
    console.log(error);
  }
  next();
};
module.exports = {
  omiseTransfer,
  omiseCreateRecipients,
};

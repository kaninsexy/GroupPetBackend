const express = require('express');

const {
  omiseCheckoutCreditCard,
  omiseCheckoutInternetBanking,
  omiseWebHooks,
  getInternetBankingCharge,
} = require('../checkoutControl/checkout');
const {
  omiseTransfer,
  omiseCreateRecipients,
} = require('../transfers/transfers');

const checkoutRoutes = express.Router();

checkoutRoutes.post('/checkout-credit-card', omiseCheckoutCreditCard);
checkoutRoutes.post('/checkout-internetBanking', omiseCheckoutInternetBanking);
checkoutRoutes.post('/webhooks', omiseWebHooks);
checkoutRoutes.get('/bank-charge', getInternetBankingCharge);
checkoutRoutes.post('/transfers', omiseTransfer);
checkoutRoutes.post('/create', omiseCreateRecipients);

module.exports = checkoutRoutes;

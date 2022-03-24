const express = require('express');

const {
  getCoins,
  getCoin,
  createCoin,
  updateCoinCount,
  updateCoinsPrice,
  deleteCoin,
} = require('../controllers/coins');
const router = express.Router({ mergeParams: true });

const Coin = require('../models/Coin');

router.route('/').get(getCoins).post(createCoin).put(updateCoinsPrice);

router.route('/:ticker').get(getCoin).put(updateCoinCount).delete(deleteCoin);

module.exports = router;

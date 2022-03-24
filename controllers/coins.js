const ErrorResponse = require('../utils/errorResponse');
const { Coin } = require('../models/Coin');
const asyncHandler = require('../middlewares/async');
const errorHandler = require('../middlewares/error');
const axios = require('axios');
const { getPrice, getPrices } = require('../utils/binance');

exports.getCoins = asyncHandler(async (req, res, next) => {
  const coins = await Coin.find();

  if (!coins) {
    return next(new ErrorResponse(`DB fauilure`));
  }
  res.status(200).json({
    success: true,
    data: coins,
  });
});

exports.getCoin = asyncHandler(async (req, res, next) => {
  const { ticker } = req.params;
  const coin = await Coin.findOne({ ticker });

  if (!coin) {
    return next(
      new ErrorResponse(
        `resource not found with the ticker of ${req.params.ticker}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: coin,
  });
});

exports.createCoin = asyncHandler(async (req, res, next) => {
  const { name, ticker, count } = req.body;
  const price = await getPrice(ticker);
  const haveInUSD = price * count;

  var obj = {
    name,
    ticker,
    count,
    price,
    haveInUSD,
  };

  Coin.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `${obj.count} amount of ${obj.ticker} were just added to my portpolio!`
      );
      res.status(200).json({ success: true, data: obj });
    }
  });
});

exports.updateCoinCount = asyncHandler(async (req, res, next) => {
  const { count } = req.body;
  const { ticker } = req.params;
  const price = await getPrice(ticker);
  const haveInUSD = price * count;

  const coin = await Coin.findOneAndUpdate(
    { ticker },
    { $set: { count, haveInUSD } },
    {
      returnOriginal: false,
    }
  );

  if (!coin) {
    return next(
      new ErrorResponse(
        `resource not found with the ticker of ${req.params.ticker}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: coin });
});

exports.updateCoinsPrice = asyncHandler(async (req, res, next) => {
  let price;
  let haveInUSD;
  var updatedPrices = {};

  const coins = await Coin.find();

  for (const coin of coins) {
    price = await getPrice(coin.ticker);
    haveInUSD = price * coin.count;
    updatedPrices[coin.ticker] = price;
    const coinUpdating = await Coin.findOneAndUpdate(
      { ticker: coin.ticker },
      { $set: { price, haveInUSD } },
      {
        returnOriginal: false,
      }
    );
  }
  console.log('Prices just got updated!');
  console.log(updatedPrices);

  res.status(200).json({ success: true, data: `Price updated! check logger.` });
});

exports.deleteCoin = asyncHandler(async (req, res, next) => {
  const coin = await Coin.findOneAndDelete({ ticker: req.params.ticker });

  if (!coin) {
    return next(
      new ErrorResponse(
        `resource not found with the ticker of ${req.params.ticker}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: {} });
});

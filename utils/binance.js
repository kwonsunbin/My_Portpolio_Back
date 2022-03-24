const Binance = require('node-binance-api');
const asyncHandler = require('../middlewares/async');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SCRT,
});

exports.getPrice = async (ticker) => {
  const tickerUSDT = ticker + 'USDT';
  const tickers = await binance.prices();
  console.info(`Price of ${ticker}: ${tickers[tickerUSDT]}`);
  return tickers[tickerUSDT];
};

exports.getPrices = async (tickerList) => {
  const tickers = await binance.prices();
  let tickerPriceList = [];
  tickerList.forEach((ticker) => {
    let tickerUSDT = ticker + 'USDT';
    tickerPriceList.append(tickers[tickerUSDT]);
    console.info(`Price of ${ticker}: ${tickers[tickerUSDT]}`);
  });
  return tickerPriceList;
};

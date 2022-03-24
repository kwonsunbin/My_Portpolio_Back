const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  ticker: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  price: { type: Number },
  haveInUSD: { type: Number },
});

const Coin = mongoose.model('Coin', schema);

module.exports = {
  Coin,
};

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const routeSchema = new Schema({
  number: String,
  status: String
})

module.exports = mongoose.model('Route', routeSchema);
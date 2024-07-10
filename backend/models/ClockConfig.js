const mongoose = require('mongoose');

const clockSchema= new mongoose.Schema({
    speed: Number,
    timestamp: Date,
  });

  const ClockConfig=mongoose.model('ClockConfig', clockSchema);

  module.exports = ClockConfig;
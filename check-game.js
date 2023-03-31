const moment = require('moment-timezone')
const dodgers = require('./dodgers')

module.exports = function (cb) {
  const date = moment()
    .tz('America/Los_Angeles')
    .format('YYYY-MM-DD')
    .split('-')

  dodgers(date, function (err, game) {
    if (err) return cb(err)

    if (!game.hasHomeGame) return cb(new Error('No Games'))

    cb(null, game)
  })
}

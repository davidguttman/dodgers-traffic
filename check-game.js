const moment = require('moment-timezone')
const Mlbgames = require('mlbgames')

module.exports = function (cb) {
  const [year, month, day] = moment()
    .tz('America/Los_Angeles')
    .format('YYYY-MM-DD')
    .split('-')

  const options = { path: `year_${year}/month_${month}/day_${day}/` }
  const mlbgames = new Mlbgames(options)

  mlbgames.get(function (err, games) {
    if (err) return cb(err)

    cb(null, games
      .filter(g => g.status.status !== 'Postponed')
      .filter(g => g.venue === 'Dodger Stadium')[0]
    )
  })
}

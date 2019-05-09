const Mlbgames = require('mlbgames')

module.exports = function (cb) {
  const [year, month, day] = new Date().toISOString().split('T')[0].split('-')

  const options = { path: `year_${year}/month_${month}/day_${day}/` }
  console.log('options', options)
  const mlbgames = new Mlbgames(options)

  mlbgames.get(function (err, games) {
    if (err) return cb(err)

    cb(null, games.filter(g => g.venue === 'Dodger Stadium')[0])
  })
}

const check = require('./check-game')
var moment = require('moment')
const sendEmail = require('./send-email')

module.exports = function send (cb) {
  check(function (err, game) {
    if (err) return cb(err)

    if (!game) return cb()
    if (game.day === 'SUN') return cb()
    if (game.day === 'SAT') return cb()

    console.log(game)

    sendEmail(
      {
        from: { name: 'Dodger Games', email: 'dodgers@thhis.com' },
        to: 'dodgers@guttman.io',
        subject: `Dodger Game Tonight: ${moment(
          game.original_date,
          'YYYY/MM/DD'
        ).format('LL')}`,
        html: `Hate to be the bearer of bad news, but the ${game.home_team_name} are playing the ${game.away_team_name} at ${game.home_time} ${game.ampm} tonight.
        <br/><br/><br/>
        <img src="https://thumbs.gfycat.com/GrippingInexperiencedJerboa-small.gif" />
        `
      },
      cb
    )
  })
}

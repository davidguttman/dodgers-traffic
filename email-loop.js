const check = require('./check-game')
const sendEmail = require('./send-email')

loop()

function loop () {
  setTimeout(loop, 60 * 60 * 1000)

  const time = new Date().toISOString()
  const hour = time.split('T')[1].split(':')[0]
  if (hour !== '20') return

  check(function (err, game) {
    if (err) return console.log(err)
    if (!game) return
    if (game.day === 'SUN') return
    if (game.day === 'SAT') return

    sendEmail({
        from: {name: 'Dodger Games', email: 'dodgers@thhis.com'},
        to: 'dodgers@guttman.io',
        subject: `Dodger Game Tonight`,
        html: `Hate to be the bearer of bad news, but the ${game.home_team_name} are playing the ${game.away_team_name} at ${game.home_time} ${game.ampm} tonight.
        <br/><br/><br/>
        <img src="https://thumbs.gfycat.com/GrippingInexperiencedJerboa-small.gif" />
        `
      }, function (err) {
        if (err) return console.error(err)
      })
  })

}

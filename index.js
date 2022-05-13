const http = require('http')
const html = require('nanohtml')
const moment = require('moment')

const check = require('./check-game')
const emailCheck = require('./email-check')
// const emailLoop = require('./email-loop')

const port = process.env.PORT || 5000

http.createServer(function (req, res) {
  if (req.url === '/no') return res.end(createNoGamePage().toString())

  if (req.url === '/email') {
    return emailCheck(function (err) {
      if (err) console.error(err)
      res.end()
    })
  }

  check(function (err, game) {
    if (err) return res.end(JSON.stringify(err))

    const page = game ? createGamePage(game) : createNoGamePage()

    res.end( page.toString() )
  })
}).listen(port)

console.log('Dodgers listening on port', port)

function createGamePage (game) {
  return html`
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"/>
        <title>Uh Oh</title>
      </head>
      <body>
        <section class="vh-100 bg-white baskerville">
          <header class="tc ph5 lh-copy">
              <h1 class="f1 f-headline-l code mb3 fw9 dib tracked-tight" style="color: dodgerblue">Uh Oh</h1>
              <h2 class="tc f1-l fw1">
                The ${game.home_team_name} are playing the ${game.away_team_name}
                <br />
                at ${game.home_time} ${game.ampm} tonight.
              </h2>
              <div>
                <video
                  style="width: 480px; height: 480px; left: 0px; top: 0px;"
                  src="https://media2.giphy.com/media/AOMAKouVm1A2Y/giphy.mp4?cid=790b76115cd4951d6c36647436130e2a&amp;rid=giphy.mp4" poster="https://media2.giphy.com/media/AOMAKouVm1A2Y/giphy_s.gif?cid=790b76115cd4951d6c36647436130e2a&amp;rid=giphy_s.gif"
                  autoplay
                  loop
                  muted
                  playsinline>
                </video>
              </div>
          </header>
          <p class='tc'>
            <a href='http://mlb.com${game.links.home_preview}' style='color: dodgerblue'>
              Sorry to say, but there's a game at ${game.venue} on
              ${moment(game.original_date, 'YYYY/MM/DD').format('LL')} at ${game.home_time} ${game.ampm}.</a>
          </p>
        </section>
      </body>
    </html>
  `
}

function createNoGamePage () {

  return html`
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"/>
        <title>Good News</title>
      </head>
      <body>
        <section class="vh-100 bg-white baskerville">
          <header class="tc ph5 lh-copy">
              <h1 class="f1 f-headline-l code mb3 fw9 dib tracked-tight">Good News</h1>
              <h2 class="tc f1-l fw1">
                There's no game at Dodger Stadium tonight.
              </h2>
              <div>
                <video
                  style="width: 480px; height: 285.68px; left: 0px; top: 0px;"
                  alt="antonio banderas relief GIF"
                  src="https://media0.giphy.com/media/1guRIRFV5gN4ikrUakg/giphy.mp4?cid=790b76115cd4971a594b3271732fd348&amp;rid=giphy.mp4" poster="https://media0.giphy.com/media/1guRIRFV5gN4ikrUakg/giphy_s.gif?cid=790b76115cd4971a594b3271732fd348&amp;rid=giphy_s.gif"
                  autoplay
                  loop
                  muted
                  playsinline>
                </video>
              </div>
          </header>
        </section>
      </body>
    </html>
  `
}

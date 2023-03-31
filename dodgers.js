// dodgers.js
const axios = require('axios')

const espnUrl = 'http://site.web.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/lad/schedule?region=us&lang=en&seasontype=2&half=1'

module.exports = function getDodgersGameData (date, callback) {
  const baseURL = 'https://statsapi.mlb.com/api/v1/schedule'
  const queryParams = {
    lang: 'en',
    sportId: 1,
    hydrate: 'team(venue(timezone)),venue(timezone),game(content(summary))',
    startDate: date,
    endDate: date,
    teamId: 119,
    eventTypes: 'primary',
    scheduleTypes: 'games,events,xref'
  }

  axios
    .get(baseURL, { params: queryParams })
    .then(response => {
      if (response.data.totalGames === 0) {
        return callback(null, { hasHomeGame: false, date })
      }

      const gameData = response.data.dates[0].games[0]

      if (gameData.teams.home.team.id !== 119) {
        return callback(null, { hasHomeGame: false, date })
      }

      const gameDate = new Date(gameData.gameDate)

      callback(null, {
        hasHomeGame: true,
        date,
        gameTime: gameDate.toLocaleTimeString('en-US', {
          timeZone: gameData.venue.timeZone.id
        }),
        opponent: gameData.teams.away.team.name
      })
    })
    .catch(error => {
      console.error('Error fetching game data:', error)
      callback(error, { hasHomeGame: false, date })
    })
}

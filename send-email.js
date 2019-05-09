var _ = require('lodash')
var SparkPost = require('sparkpost')

var key = require('./config').sparkpost.apiKey
var client = new SparkPost(key)

module.exports = function send (opts, cb) {
  cb = cb || function () {}

  var reqOpts = defaults()
  _.set(reqOpts, 'transmissionBody.content.from', opts.from)
  _.set(reqOpts, 'transmissionBody.content.reply_to',
    `${opts.from.name} <${opts.from.email}>`)
  _.set(reqOpts, 'transmissionBody.recipients[0].address.email', opts.to)

  if (opts.cc) {
    reqOpts.transmissionBody.recipients.push({
      address: {
        email: opts.cc,
        header_to: opts.to
      }
    })
    _.set(reqOpts, 'transmissionBody.content.headers.CC', opts.cc)
  }

  if (opts.bcc) {
    reqOpts.transmissionBody.recipients.push({
      address: {
        email: opts.bcc,
        header_to: opts.to
      }
    })
  }

  _.set(reqOpts, 'transmissionBody.content.subject', opts.subject)
  _.set(reqOpts, 'transmissionBody.content.html', opts.html)

  if (process.env.NODE_ENV === 'production') {
    client.transmissions.send(reqOpts, cb)
  } else {
    console.log(JSON.stringify(reqOpts, null, 2))
    cb()
  }
}

function defaults () {
  return {
    transmissionBody: {
      options: {
        open_tracking: true,
        click_tracking: false
      },
      campaign_id: 'dodgers',
      recipients: [ { address: { email: null } } ],
      content: {
        from: 'dodgers@thhis.com',
        subject: null,
        html: null
      }
    }
  }
}

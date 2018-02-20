const request = require('request')
const Datastore = require('@google-cloud/datastore')

const datastore = new Datastore()

exports.getPrice = (event, callback) => {
  request.get('https://api.bitfinex.com/v1/pubticker/btcusd', (error, response, body) => {
    const data = JSON.parse(body)
    const price = datastore.double(data.last_price)
    const timestamp = datastore.int(Date.now())

    const key = datastore.key({
      namespace: 'bitfinex',
      path: ['PriceData', timestamp]
    })

    const entity = {
      key: key,
      data: {
        price: price,
        timestamp: new Date()
      }
    }

    datastore.insert(entity).then(() => callback())
  })
}

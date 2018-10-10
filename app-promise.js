const axios = require('axios')
const yargs = require('yargs')

const argv = yargs
  .options({

    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }

  })
  .help()
  .alias('help', 'h')
  .argv


var encodedAddress = encodeURIComponent(argv.address)

var mapQuestKey = 'Xf4fog2aELGi56tFn8z5Mh6kFAhr1NMV'

var geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=${mapQuestKey}&location=${encodedAddress}`

axios.get(geocodeUrl).then((response) => {

  var firstResult = response.data.results[0]

  var firstLocation = firstResult.locations[0]

  if (firstLocation === undefined) {

    throw new Error('Unable to find that address')

  }

  var city = firstLocation.adminArea5

  var state = firstLocation.adminArea3

  var postalCode = firstLocation.postalCode

  var country = firstLocation.adminArea1

  console.log(`${city}, ${state} ${postalCode}, ${country}`)

  var lat = firstLocation.latLng.lat

  var lng = firstLocation.latLng.lng

  var weatherUrl = `https://api.darksky.net/forecast/726274a504a050b822de3728ea6ecb64/${lat},${lng}`

  return axios.get(weatherUrl)

}).then((response) => {

  var currently = response.data.currently

  var temperature = currently.temperature

  var apparentTemperature = currently.apparentTemperature

  console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`)

}).catch((e) => {

  if (e.code === 'ENOTFOUND') {

    console.log('Unable to connect to API servers')

  } else {

    console.log(e.message)

  }

})

'use strict'
const NodeGeocoder = require('node-geocoder');
const Location = use('App/Models/Location')

class LocationController {
  async index() {
    return await Location.all()
  }

  async save({ request }) {
    const { lat, lon } = request.all()
    const details = await this.getCoordinates(lat, lon)

    const {
      formattedAddress,
      streetNumber,
      streetName,
      city,
      country,
      countryCode,
      zipcode,
      provider,
    } = details[0]

    const location = new Location()

    location.lat = lat
    location.lon = lon
    location.address = formattedAddress
    location.streetNumber = streetNumber
    location.streetName = streetName
    location.city = city
    location.country = country
    location.countryCode = countryCode
    location.zipcode = zipcode
    location.provider = provider

    // this.getImageURL(city, country)
    await location.save()

    return {
      id: location.id,
      address: formattedAddress,
      streetNumber,
      streetName,
      city,
      country,
      zipcode,
      lat,
      lon,
      dateTime: location.created_at
    }
  }

  async getImageURL(city, country) {
    // const images = await gis(`${city} ${country}`);
    console.log(images)
  }

  async getCoordinates(lat, lon) {
    const options = {
      provider: 'google',
      apiKey: process.env.MAPS_API_KEY,
      formatter: null
    };

    const geocoder = NodeGeocoder(options);
    const res = await geocoder.reverse({ lat, lon })

    return res
  }
}

module.exports = LocationController

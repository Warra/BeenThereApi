'use strict'
const NodeGeocoder = require('node-geocoder');
const Location = use('App/Models/Location')
const imageSearch = require('image-search-google');

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

    const imageURL = await this.getImageURL(city, country)

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
    location.imageURL = imageURL

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
      dateTime: location.created_at,
      imageURL,
    }
  }

  async getImageURL(city, country) {
    const client = new imageSearch(process.env.CSE_ID, process.env.SEARCH_API_KEY);
    const searchTerm = `${city} ${country}`
    const images = await client.search(searchTerm, { type: "photo" });
    if (images.length > 0) {
      return images[0].url
    }
    const term = `${city}`
    const retry = await client.search(term);
    return retry[0].url
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

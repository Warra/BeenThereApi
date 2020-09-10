'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LocationSchema extends Schema {
  up () {
    this.create('locations', (table) => {
      table.increments()
      table.string('lat')
      table.string('lon')
      table.string('address')
      table.string('streetNumber')
      table.string('streetName')
      table.string('city')
      table.string('country')
      table.string('countryCode')
      table.string('zipcode')
      table.string('provider')
      table.timestamps()
    })
  }

  down () {
    this.drop('locations')
  }
}

module.exports = LocationSchema

const router = require('express').Router()
const Country = require('./../function/country')
const World = require('./../function/world')


router.get('/country', Country.getCountry)
router.get('/world', World.getWorld)


module.exports = router
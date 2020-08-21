const router = require('express').Router()
const Country = require('./../function/country')
const World = require('./../function/world')
const News = require('./../function/news');

router.get('/country', Country.getCountry)
router.get('/world', World.getWorld)
router.get('/new', News.getNews)


module.exports = router
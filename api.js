const router = require('express').Router();


router.get('/', (req, res) => {
    return res.json("21321321")
})

router.use('/', require('./routes/covid'))

module.exports = router;
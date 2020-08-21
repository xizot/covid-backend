
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors')
const World = require('./services/world');
const Country = require('./services/country');
const News = require('./services/news');
const db = require('./services/db');
const crawler = require('./crawler')

app.use(cors());

app.use('/api', require('./api'))

app.use('/', (req, res) => {
    return res.end('demo')
})


db.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })

})
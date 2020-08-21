if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const request = require('request');
const World = require('./services/world');
const Country = require('./services/country');
const Moment = require('moment');
const getWorld = () => {
    request("https://covid19.mathdro.id/api/", async (err, request, body) => {
        let data = JSON.parse(body);
        const { confirmed, recovered, deaths, lastUpdate } = data;
        const formatTime = Moment(lastUpdate).format("DD-MM-YYYY hh:mm:ss")
        await World.AddNew({
            confirmed: confirmed.value,
            recovered: recovered.value,
            deaths: deaths.value,
            date: formatTime
        })

    })
}

const getCountryName = () => {
    request("https://covid19.mathdro.id/api/countries", (err, request, body) => {
        let data = JSON.parse(body);
        data.countries.map(async item => {
            if (item.iso2) {
                const name = item.name;
                const shortName = (item.iso2 + "").toLowerCase();
                if (!await Country.isExist(shortName)) {
                    Country.addNew({
                        name,
                        shortName,
                        img: `https://disease.sh/assets/img/flags/${shortName}.png`
                    })
                }
            }
        })
    })
}

const getCaseByCountry = async () => {
    const found = await Country.getShortName({
        order: [['id', 'DESC']]
    })
    if (found.length) {
        found.map(item => {
            request(`https://covid19.mathdro.id/api/countries/${item}`, async (err, request, body) => {
                let data = JSON.parse(body);
                if (data.confirmed && data.recovered && data.deaths) {
                    const confirmed = data.confirmed.value;
                    const recovered = data.recovered.value;
                    const deaths = data.deaths.value;
                    const lastUpdate = data.lastUpdate || Moment();


                    const formatTime = Moment(lastUpdate).format("DD-MM-YYYY hh:mm:ss")
                    await Country.updateCase(item, confirmed, recovered, deaths, formatTime)
                }
            })
        })
    }
}
getWorld()
getCountryName()
getCaseByCountry()

// get data each 2 hours
setInterval(() => {
    getWorld()
    getCountryName()
    getCaseByCountry()

}, 1000 * 60 * 60 * 2)
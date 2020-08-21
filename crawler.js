if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const request = require('request');
const World = require('./services/world');
const Country = require('./services/country');
const Moment = require('moment');
let Parser = require('rss-parser');
let parser = new Parser();
const News = require('./services/news');



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


const getImgLink = link => {
    return link.match(/(?=<a href).*(?<=<\/a>)/gs);
}
const rssLink = ['https://vnexpress.net/rss/tin-moi-nhat.rss', 'https://tuoitre.vn/rss/tin-moi-nhat.rss']

const ncovid = ["covid", "ncovid", "covid-19", "ncov", "ncov-19"];

const crawPost = async linkrss => {
    let feed = await parser.parseURL(linkrss);
    feed.items.forEach(async item => {
        const aboutCV19 = ncovid.some(s => item.title.toLowerCase().includes(s));
        if (aboutCV19) {
            const newItem = {
                link: item.link,
                title: item.title,
                image: getImgLink(item.content).toString(),
                content: item.contentSnippet,
                date: item.pubDate,
            }
            await News.addNew(newItem);
        }

    });
}

//first




setTimeout(() => {
    getWorld()
    getCountryName()
    crawPost(rssLink[0])
    crawPost(rssLink[1])
}, 2000);

setTimeout(() => {
    getCaseByCountry()
}, 3000)

// get data each 2 hours
setInterval(() => {
    //craw news
    crawPost(rssLink[0])
    crawPost(rssLink[1])

    //craw cases
    getWorld()
    getCountryName()
    getCaseByCountry()
}, 1000 * 60 * 60 * 2)
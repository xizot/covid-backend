const Sequelize = require('sequelize')
const db = require('./db');
const World = require('./world');
const Model = Sequelize.Model;


class Country extends Model {

    static async isExist(shortName) {
        const found = await Country.findOne({
            where: {
                shortName,
            }
        })
        if (!found) return false;
        return true;
    }
    static async addNew(data) {
        return await Country.create(data)
    }
    static async getShortName() {
        const found = await Country.findAll({
            order: [['id', 'DESC']]
        })

        return found.map(item => item.shortName)
    }
    static async updateCase(shortName, confirmed, recovered, deaths, lastUpdate) {
        return Country.update({
            confirmed,
            recovered,
            deaths,
            date: lastUpdate
        }, {
            where: {
                shortName
            }
        })
    }
}

Country.init({
    name: {
        type: Sequelize.STRING,
    },
    shortName: {
        type: Sequelize.STRING,
    },
    img: {
        type: Sequelize.STRING,
    },
    confirmed: {
        type: Sequelize.STRING,
        defaultValue: 0,
    },
    recovered: {
        type: Sequelize.STRING,
        defaultValue: 0,
    },
    deaths: {
        type: Sequelize.STRING,
        defaultValue: 0,
    },
    date: {
        type: Sequelize.STRING,
    }
}, {
    sequelize: db,
    modelName: 'country'
})

module.exports = Country;
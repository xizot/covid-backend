const Sequelize = require('sequelize')
const db = require('./db')
const Model = Sequelize.Model;


class World extends Model {


    static async AddNew(data) {
        return await World.create(data)
    }

}

World.init({
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
    modelName: 'world'
})

module.exports = World;
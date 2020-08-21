const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;



class News extends Model {

    static async getNews(limit, page) {
        return await News.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit,
            offset: page * limit
        })
    }

    static async findByLink(link) {
        return News.findOne({
            where: { link, }
        })
    }

    static async addNew(item) {
        const found = await News.findByLink(item.link);
        if (!found) {
            return this.create(item);
        }
    }
}

News.init({
    link: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: Sequelize.TEXT,
    },
    content: {
        type: Sequelize.TEXT,
    },
    date: {
        type: Sequelize.DATE,
    }
}, {
    sequelize: db,
    modelName: "news",
})
module.exports = News;
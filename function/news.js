const News = require("../services/news");

module.exports.getNews = async (req, res) => {
    const limit = req.body && req.body.limit || req.query && req.query.limit || 8;
    const page = req.body && req.body.page || req.query && req.query.page || 0;

    const found = await News.getNews(limit, page)
    return res.json(found)

};
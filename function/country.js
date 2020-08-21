const Country = require('../services/country');

module.exports.getCountry = async (req, res) => {
    const found = await Country.findAll({
        order: [['createdAt', 'ASC']]
    })

    return res.json(found);
}


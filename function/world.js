const World = require('./../services/world')

module.exports.getWorld = async (req, res) => {
    const found = await World.findAll({
        order: [['id', 'DESC']]
    })
    return res.json(found[0]);
}


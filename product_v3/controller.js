const { ObjectId } = require("mongodb");
const db = require("../config/mongodb");
const path = require("path");
const fs = require("fs");

const index = (req, res) => {
    db.collection('products').find()
        .toArray()
        .then(result => res.send(result))
        .catch(error => res.send(error));
}

const view = (req, res) => {
    const { id } = req.params;
    db.collection('products').findOne({ _id: ObjectId(id) })
        .then(result => res.send(result))
        .catch(error => res.send(error));
}

const store = (req, res) => {
    const { name, price, stok, status } = req.body;
    const image = req.file;

    if (!image) {
        res.status(400).json({
            status: 'failed',
            response: 'Image is required',
        });
    } else {
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target);
        db.collection('products').insertOne({ name, price, stok, status, image_url: `http://localhost:3000/public/${image.originalname}` })
            .then(result => res.send(result))
            .catch(error => res.send(error));
    }
}

module.exports = {
    index,
    view,
    store
};
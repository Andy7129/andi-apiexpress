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
    
    try {
        const objectId = new ObjectId(id);
        db.collection('products').findOne({ _id: objectId })
            .then(result => {
                if (result) {
                    res.send(result);
                } else {
                    res.status(404).send({ message: 'Product not found' });
                }
            })
            .catch(error => res.send(error));
    } catch (error) {
        res.status(400).send({ message: 'Invalid ObjectId format' });
    }
}

const store = (req, res) => {
    const { name, price, stok, status } = req.body;
    const image = req.file;

    if (image) {
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target);
        db.collection('products').insertOne({ name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}` })
            .then(result => res.send(result))
            .catch(error => res.send(error));
    }
}

module.exports = {
    index,
    view,
    store
};
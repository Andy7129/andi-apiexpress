const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const db = require ('../config/mongodb');
const productController = require("./controller");

router.get('/product', productController.index);
router.get('/product/:id', productController.view);

module.exports = router;
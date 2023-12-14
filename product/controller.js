const connection = require('../config/mysql');
const path = require('path');
const fs = require('fs');

const index = (req, res) => {
    const {search} = req.query;
    let exec = {};
    if(search){
      exec = {  
        sql: 'SELECT * FROM product WHERE name LIKE ?',
        values: [`%${search}%`]
      }
    }else {
      exec = {
        sql : 'SELECT * FROM product'
      }
    }
    connection.query(exec, _response(res));
}

const view = (req, res) => {
 connection.query({
      sql: 'SELECT * FROM product WHERE id = ?',
      values: [req.params.id]
    },
     _response(res)
    );
}

const destroy = (req, res) => {
  connection.query(
    {
      sql: 'DELETE FROM product WHERE id = ?',
      values: [req.params.id]
    }, _response(res));
};

const store = (req, res) => {
  const { users_id, name, price, stok, status } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({
      status: 'failed',
      message: 'Image is required',
    });
  }

  const target = path.join(__dirname, '../uploads', image.originalname);
  fs.renameSync(image.path, target);

  connection.query(
    {
      sql: 'INSERT INTO product (users_id, name, price, stok, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      values: [users_id, name, price, stok, status, `http://localhost:3000/public/${image.originalname}`],
    },
    _response(res)
  );
};

const update = (req, res) => {
  const { users_id, name, price, stok, status } = req.body;
  const image = req.file;

  let sql = '';
  let values = [];

  if (image) {
    const target = path.join(__dirname, '../uploads', image.originalname);
    fs.renameSync(image.path, target);

    sql = 'UPDATE product SET users_id = ?, name = ?, price = ?, stok = ?, status = ?, image_url = ? WHERE id = ?';
    values = [parseInt(users_id), name, price, stok, status, `http://localhost:3000/public/${image.originalname}`, req.params.id];
  } else {
    sql = 'UPDATE product SET users_id = ?, name = ?, price = ?, stok = ?, status = ? WHERE id = ?';
    values = [parseInt(users_id), name, price, stok, status, req.params.id];
  }

  connection.query({ sql, values }, _response(res));
};

const _response = (res) => {
  return (error, result) => {
    if (error) {
      res.status(500).json({
        status: 'failed',
        response: error.message,
      });
    } else {
      res.status(200).json({
        status: 'success',
        response: result,
      });
    }
  };
};

module.exports = {
  index,
  view,
  store,
  update,
  destroy
};

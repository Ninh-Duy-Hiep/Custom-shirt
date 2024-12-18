const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Thay bằng username MySQL của bạn
    password: '', // Thay bằng password MySQL của bạn
    database: 'clothing_store' // Thay bằng tên database của bạn
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

module.exports = connection;

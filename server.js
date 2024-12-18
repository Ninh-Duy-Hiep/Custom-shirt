const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

// Kết nối cơ sở dữ liệu MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clothing_store'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.use(express.static('public'));
app.use(bodyParser.json({ limit: '60mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '60mb' }))

app.use(session({
    secret: '3a680dd8016de2bf05f0241890d1ab95de3e0ffcc8c57d4cf8e35e9e3d7299af',
    resave: false,
    saveUninitialized: true
}));

// Route cho login
app.post('/login', (req, res) => {
    const { nameuser, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(query, [nameuser, password], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Lỗi khi thực hiện truy vấn' });
            return;
        }
        if (results.length > 0) {
            req.session.user = results[0];
            res.json({ message: 'Đăng nhập thành công!' });
        } else {
            res.json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
        }
    });
});

// Route để lấy userId từ session
app.get('/api/get-user-id', (req, res) => {
    if (req.session.user) {
        res.json({ userId: req.session.user.user_id });
    } else {
        res.status(401).json({ message: 'Chưa đăng nhập' });
    }
});

// Route cho trang chủ
app.get('/design-online', (req, res) => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (req.session.user) {
        res.sendFile(__dirname + '/design-online.html');
    } else {
        res.redirect('/login'); // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    }
});

//Lấy tên người dùng
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({ username: req.session.user.username });
    } else {
        res.status(401).json({ message: 'Chưa đăng nhập' });
    }
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Kiểm tra các giá trị đầu vào
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
    }

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    db.query(query, [username, email, password], (err, results) => {
        if (err) {
            console.error('Error during registration:', err);
            return res.status(500).json({ message: 'Lỗi khi thực hiện đăng ký' });
        }
        res.json({ message: 'Đăng ký thành công!' });
    });
});




// Thêm sản phẩm vào cart
app.post('/add-to-cart', (req, res) => {
    const { userId, productName, size, color, price, quantity, img_data } = req.body;

    // Check if the product exists in the products table
    const checkProductQuery = `SELECT product_id FROM products WHERE name = ? AND size = ? AND color = ?`;

    db.query(checkProductQuery, [productName, size, color], (err, result) => {
        if (err) throw err;

        let productId;
        if (result.length > 0) {
            // Product exists
            productId = result[0].product_id;
            addToCart(userId, productId, size, color, price, quantity, img_data, res);
        } else {

            // Product doesn't exist, insert it
            const insertProductQuery = `INSERT INTO products (name, price, size, color, img_data) VALUES (?, ?, ?, ?, ?)`;

            db.query(insertProductQuery, [productName, price, size, color, img_data], (err, result) => {
                if (err) throw err;
                productId = result.insertId;
                addToCart(userId, productId, size, color, price, quantity, img_data, res);
            });
        }
    });
});
// Hàm thêm sản phẩm
function addToCart(userId, productId, size, color, price, quantity, img_data, res) {
    const insertCartItemQuery = `INSERT INTO cart_items (user_id, product_id, size, color, price, quantity,img_data) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertCartItemQuery, [userId, productId, size, color, price, quantity, img_data], (err, result) => {
        if (err) throw err;

        // res.json({ message: 'Item added to cart' });
    });
}
// Route để cập nhật sản phẩm trong giỏ hàng
app.put('/cart/:cartItemId', async (req, res) => {
    const cartItemId = req.params.cartItemId;
    const { quantity, price } = req.body;

    try {
        const query = 'UPDATE cart_items SET quantity = ?, price = ? WHERE cart_item_id = ?';
        const result = await db.query(query, [quantity, price, cartItemId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Cart item updated successfully' });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Lấy sản phẩm 
app.get('/cart-items/:userId', (req, res) => {
    const userId = req.params.userId;

    const fetchCartItemsQuery = `
        SELECT 
          cart_items.cart_item_id, 
          products.name, 
          cart_items.size, 
          cart_items.color, 
          cart_items.price, 
          cart_items.quantity, 
          cart_items.added_at ,
          cart_items.img_data
        FROM cart_items 
        JOIN products ON cart_items.product_id = products.product_id 
        WHERE cart_items.user_id = ?
      `;

    db.query(fetchCartItemsQuery, [userId], (err, results) => {
        if (err) throw err;

        res.json(results);
    });
});


// Định nghĩa route DELETE trong Express.js
app.delete('/cart/:cartItemId', (req, res) => {
    const cartItemId = req.params.cartItemId;

    // Thực hiện xóa sản phẩm khỏi giỏ hàng trong cơ sở dữ liệu
    const deleteCartItemQuery = `DELETE FROM cart_items WHERE cart_item_id = ?`;

    db.query(deleteCartItemQuery, [cartItemId], (err, result) => {
        if (err) {
            console.error('Error deleting item from cart:', err);
            res.status(500).json({ error: 'Could not delete item from cart' });
        } else {
            res.json({ message: 'Item removed from cart' });
        }
    });
});

// Xử lý thanh toán
app.post('/checkout', (req, res) => {
    const { recipientName, email, address, phone, userId } = req.body;

    const fetchCartItemsQuery = `SELECT * FROM cart_items WHERE user_id = ?`;
    db.query(fetchCartItemsQuery, [userId], (err, cartItems) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (cartItems.length === 0) {
            res.status(400).json({ message: 'Cart is empty' });
            return;
        }

        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const insertOrderQuery = `INSERT INTO orders (user_id, order_date, status, total, name, email, phone, address) VALUES (?, NOW(), 'Đang xử lí', ?, ?, ?, ?, ?)`;
        db.query(insertOrderQuery, [userId, total, recipientName, email, phone, address], (err, orderResult) => {
            if (err) {
                console.error('Error inserting order:', err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            const orderId = orderResult.insertId;

            const insertOrderItemPromises = cartItems.map(item => {
                const insertOrderItemQuery = `
            INSERT INTO order_items (order_id, product_id, size, color, price, quantity)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
                return new Promise((resolve, reject) => {
                    db.query(insertOrderItemQuery, [orderId, item.product_id, item.size, item.color, item.price, item.quantity], (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            });

            Promise.all(insertOrderItemPromises)
                .then(() => {
                    const deleteCartItemsQuery = `DELETE FROM cart_items WHERE user_id = ?`;
                    db.query(deleteCartItemsQuery, [userId], (err, result) => {
                        if (err) {
                            console.error('Error deleting cart items:', err);
                            res.status(500).json({ message: 'Internal server error' });
                            return;
                        }
                        res.json({ success: true, message: 'Order placed successfully' });
                    });
                })
                .catch(err => {
                    console.error('Error inserting order items:', err);
                    res.status(500).json({ message: 'Internal server error' });
                });
        });
    });
});

// Lấy thông tin đơn hàng
app.get('/orders/:userId', (req, res) => {
    const userId = req.params.userId;

    const fetchOrdersQuery = `
      SELECT 
        orders.order_id, 
        orders.order_date, 
        orders.status, 
        orders.total,
        orders.name AS recipient_name,
        orders.email,
        orders.phone,
        orders.address,
        order_items.product_id,
        order_items.size,
        order_items.color,
        order_items.price,
        order_items.quantity,
        products.name AS product_name
      FROM orders 
      JOIN order_items ON orders.order_id = order_items.order_id 
      JOIN products ON order_items.product_id = products.product_id
      WHERE orders.user_id = ?
    `;

    db.query(fetchOrdersQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ error: 'Could not fetch orders' });
            return;
        }

        console.log('Orders fetched for user:', userId, results);
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' hoặc 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    img_data LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    img_data LONGBLOB,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL, -- 'pending', 'shipped', 'delivered', v.v.
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Bảng users: Lưu thông tin người dùng bao gồm tên đăng nhập, email, mật khẩu, vai trò (người dùng hoặc quản trị viên), và thời gian tạo.

-- Bảng products: Lưu thông tin các sản phẩm bao gồm tên, giá, kích thước, màu sắc, và thời gian tạo.

-- Bảng cart_items: Lưu thông tin các mục trong giỏ hàng của người dùng bao gồm ID người dùng, ID sản phẩm, kích thước, màu sắc, giá, số lượng và thời gian thêm vào giỏ hàng.

-- Bảng orders: Lưu thông tin đơn hàng bao gồm ID người dùng, thời gian đặt hàng, trạng thái đơn hàng, tổng giá trị đơn hàng.

-- Bảng order_items: Lưu thông tin các mục trong đơn hàng bao gồm ID đơn hàng, ID sản phẩm, kích thước, màu sắc, giá, số lượng.
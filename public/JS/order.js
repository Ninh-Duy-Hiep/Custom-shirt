document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/get-user-id')
        .then(response => response.json())
        .then(data => {
            if (data.userId) {
                const userId = data.userId;
                loadOrders(userId);
            } else {
                alert('Chưa đăng nhập');
            }
        })
        .catch(error => {
            console.error('Error fetching user ID:', error);
            alert('Error fetching user ID');
        });
});

function loadOrders(userId) {
    fetch(`http://localhost:3000/orders/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(orders => {
            console.log('Orders:', orders);
            const ordersList = document.getElementById('ordersList');

            if (orders.length === 0) {
                ordersList.innerHTML = '<li style="font-family:"Roboto",sans-serif;">Không có đơn hàng nào.</li>';
            } else {
                const ordersMap = orders.reduce((acc, order) => {
                    if (!acc[order.order_id]) {
                        acc[order.order_id] = {
                            order_date: order.order_date,
                            status: order.status,
                            total: order.total,
                            recipient_name: order.recipient_name,
                            email: order.email,
                            phone: order.phone,
                            address: order.address,
                            items: []
                        };
                    }
                    acc[order.order_id].items.push({
                        product_name: order.product_name,
                        size: order.size,
                        color: order.color,
                        price: order.price,
                        quantity: order.quantity
                    });
                    return acc;
                }, {});

                for (const orderId in ordersMap) {
                    const order = ordersMap[orderId];
                    const orderElement = document.createElement('li');
                    orderElement.innerHTML = `
                        <div class="order-infor-container">
                        <p>Mã đơn: ${orderId}</p>
                        <p>Ngày & Giờ: ${new Date(order.order_date).toLocaleString()}</p>
                        <p>Trạng thái: ${order.status}</p>
                        <p>Tổng tiền: ${order.total.toLocaleString()}đ</p>
                        <p>Tên người mua: ${order.recipient_name}</p>
                        <p>Email: ${order.email}</p>
                        <p>Số điện thoại: ${order.phone}</p>
                        <p>Địa chỉ : ${order.address}</p>
                        </div>
                        <div class="order-product-container">
                        <p>Sản phẩm của bạn</p>
                        ${order.items.map(item => `
                            ${item.product_name} - ${item.size} - ${item.color} - ${item.price.toLocaleString()}đ x ${item.quantity}
                            <br>
                        `).join('')}
                        </div>
                    `;
                    ordersList.appendChild(orderElement);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            const ordersList = document.getElementById('ordersList');
            ordersList.innerHTML = '<li>Error fetching orders</li>';
        });
}

// Gửi yêu cầu để lấy tên người dùng 
document.addEventListener("DOMContentLoaded", () => {
    // Gửi yêu cầu để lấy tên người dùng
    fetch("/api/user")
        .then((response) => response.json())
        .then((data) => {
            if (data.username) {
                // Cập nhật tên người dùng vào thẻ span
                document.getElementById("username").textContent = data.username;
            } else {
                // Nếu không có tên người dùng, chuyển hướng về trang đăng nhập
                window.location.href = "/login";
            }
        })
        .catch((error) => console.error("Error:", error));
});
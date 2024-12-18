document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/api/get-user-id')
        .then(response => response.json())
        .then(data => {
            if (data.userId) {
                const userId = data.userId;
                loadCartItems(userId);
                setupCheckoutForm(userId);
            } else {
                alert('Chưa đăng nhập');
            }
        })
        .catch(error => {
            console.error('Error fetching user ID:', error);
            alert('Error fetching user ID');
        });
});

function loadCartItems(userId) {
    fetch(`http://localhost:3000/cart-items/${userId}`)
        .then(response => response.json())
        .then(cartItems => {
            const cartItemsList = document.getElementById('cartItemsList');
            let totalAmount = 0;

            cartItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} - ${item.size} - ${item.color} - ${item.price.toLocaleString()}đ x ${item.quantity}`;
                cartItemsList.appendChild(li);
                totalAmount += item.price;
            });

            document.getElementById('totalAmount').textContent = totalAmount.toLocaleString();
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
        });
}

function setupCheckoutForm(userId) {
    document.getElementById('checkoutForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const recipientName = document.getElementById('recipientName').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;

        fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipientName, email, address, phone, userId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Thanh toán thành công');
                    location.reload();
                } else {
                    alert('Error placing order.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
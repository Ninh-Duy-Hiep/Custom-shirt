document.addEventListener("DOMContentLoaded", function () {
    // Function để tính tổng giá tiền
    function calculateTotalPrice(cartItems) {
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.price;
        });
        document.getElementById('total-price').textContent = `${totalPrice.toLocaleString()}đ`;
    }

    // Function để lấy userId từ server
    function fetchUserId() {
        return fetch('/api/get-user-id')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user ID");
                }
                return response.json();
            })
            .then(data => data.userId)
            .catch(error => {
                console.error("Error fetching user ID:", error);
                return null;
            });
    }

    // Function để lấy danh sách sản phẩm trong giỏ hàng từ server
    function fetchCartItems(userId) {
        fetch(`http://localhost:3000/cart-items/${userId}`)
            .then((response) => response.json())
            .then((cartItems) => {
                const container = document.getElementById("cart-items-container");
                container.innerHTML = ''; // Xóa nội dung cũ trước khi thêm nội dung mới

                if (cartItems.length === 0) {
                    container.innerHTML = '<p style="margin-top:30px;font-size:17px;font-family:"Roboto",sans-serif;">Chưa có sản phẩm nào trong giỏ hàng.</p>';
                    document.getElementById('total-price').textContent = '0đ';
                } else {
                    cartItems.forEach((item) => {
                        // Tạo phần tử hiển thị sản phẩm trong giỏ hàng
                        const cartItemDiv = document.createElement("div");
                        cartItemDiv.className = "cart-item";
                        cartItemDiv.id = `cart-item-${item.cart_item_id}`;

                        // Tạo và thêm phần tử hình ảnh
                        const imgElement = document.createElement("img");
                        imgElement.src = `data:image/png;base64,${item.img_data}`;
                        imgElement.alt = item.productName;
                        imgElement.className = "cart-item-image";
                        cartItemDiv.appendChild(imgElement);

                        // Tên
                        const nameDiv = document.createElement("div");
                        nameDiv.textContent = item.name;
                        cartItemDiv.appendChild(nameDiv);
                        // Size
                        const sizeDiv = document.createElement("div");
                        sizeDiv.textContent = item.size;
                        cartItemDiv.appendChild(sizeDiv);
                        // Màu
                        const colorDiv = document.createElement("div");
                        colorDiv.textContent = item.color;
                        cartItemDiv.appendChild(colorDiv);
                        // Giá
                        const priceDiv = document.createElement("span");
                        priceDiv.id = `price-item-${item.cart_item_id}`;
                        priceDiv.textContent = `${item.price.toLocaleString()}đ`;
                        cartItemDiv.appendChild(priceDiv);
                        // Số lượng
                        const quantityInput = document.createElement("input");
                        quantityInput.type = "number";
                        quantityInput.value = item.quantity;
                        quantityInput.min = "1";
                        quantityInput.className = "cart-item-quantity";
                        quantityInput.onchange = () => updateCartItem(item.cart_item_id, quantityInput.value);
                        cartItemDiv.appendChild(quantityInput);
                        // Thời gian 
                        const dateDiv = document.createElement("div");
                        dateDiv.textContent = new Date(item.added_at).toLocaleString();
                        cartItemDiv.appendChild(dateDiv);

                        // Nút xóa
                        const removeButton = document.createElement("button");
                        removeButton.className = "cart-item-button";
                        removeButton.textContent = "Xóa";
                        removeButton.onclick = () => removeFromCart(item.cart_item_id);
                        cartItemDiv.appendChild(removeButton);

                        // Thêm phần tử sản phẩm vào container
                        container.appendChild(cartItemDiv);
                    });

                    // Tính tổng giá tiền
                    calculateTotalPrice(cartItems);
                }
            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            });
    }

    // Gọi function để load danh sách giỏ hàng khi trang được tải
    fetchUserId().then(userId => {
        if (userId) {
            fetchCartItems(userId);
        } else {
            console.error("User is not logged in.");
        }
    });

    // Function để cập nhật sản phẩm trong giỏ hàng
    async function updateCartItem(cartItemId, newQuantity) {
        const pricePerUnit = 150000; // Giá mỗi đơn vị sản phẩm
        const newPrice = newQuantity * pricePerUnit;

        try {
            const response = await fetch(`/cart/${cartItemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity, price: newPrice }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data.message); // Hiển thị thông báo từ server

            // Cập nhật giá trong DOM
            const priceElement = document.getElementById(`price-item-${cartItemId}`);
            if (priceElement) {
                priceElement.textContent = `${newPrice.toLocaleString()}đ`;
            } else {
                console.error(`Price element for cart item with ID ${cartItemId} not found in DOM.`);
            }

            // Tải lại danh sách sản phẩm trong giỏ hàng để tính lại tổng giá
            fetchUserId().then(userId => {
                if (userId) {
                    fetchCartItems(userId);
                } else {
                    console.error("User is not logged in.");
                }
            });
        } catch (error) {
            console.error("Error updating item in cart:", error);
        }
    }

    async function removeFromCart(cartItemId) {
        try {
            const response = await fetch(`/cart/${cartItemId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data.message); // Hiển thị thông báo từ server

            // Xóa phần tử khỏi DOM
            const cartItemToRemove = document.getElementById(`cart-item-${cartItemId}`);
            if (cartItemToRemove) {
                cartItemToRemove.remove();
            } else {
                console.error(`Cart item with ID ${cartItemId} not found in DOM.`);
            }

            // Tải lại danh sách sản phẩm trong giỏ hàng để tính lại tổng giá
            fetchUserId().then(userId => {
                if (userId) {
                    fetchCartItems(userId);
                } else {
                    console.error("User is not logged in.");
                }
            });
        } catch (error) {
            console.error("Error removing item from cart:", error);
            // Xử lý lỗi nếu cần thiết
        }
    }
});


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
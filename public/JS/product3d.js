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

const pricePerS = 150000;
const pricePerM = 150000;
const pricePerL = 150000;
const pricePerXL = 150000;

function update_size_price() {
    const quantityS = parseInt(document.getElementById('quantityS').value) || 0;
    const quantityM = parseInt(document.getElementById('quantityM').value) || 0;
    const quantityL = parseInt(document.getElementById('quantityL').value) || 0;
    const quantityXL = parseInt(document.getElementById('quantityXL').value) || 0;

    const totalPrice = (quantityL * pricePerL) + (quantityS * pricePerS) + (quantityM * pricePerM) + (quantityXL * pricePerXL);

    const formattedPrice = totalPrice.toLocaleString();

    document.getElementById('price-product3d').innerText = formattedPrice;
}

//Thêm sản phẩm vào giỏ hàng 
function addToCart() {
    fetch('http://localhost:3000/api/get-user-id')
        .then(response => {
            if (!response.ok) {
                throw new Error('Chưa đăng nhập');
            }
            return response.json();
        })
        .then(data => {
            const userId = data.userId;

            const productName = document.getElementById("name-product3d").getAttribute('data-product-name');
            const price = parseFloat(document.getElementById('price-product3d').innerText.replace(/\D/g, ''));

            const sizes = ['S', 'L', 'M', 'XL'];
            const quantities = sizes.map(size => parseInt(document.getElementById(`quantity${size}`).value) || 0);
            const pricePerSize = { S: pricePerS, M: pricePerM, L: pricePerL, XL: pricePerXL };

            const color = 'Màu';

            const shirt = document.getElementById('shirt');
            html2canvas(shirt).then(canvas => {
                const url = canvas.toDataURL('image/png');
                const image = url.replace(/^data:image.+;base64,/, '');

                sizes.forEach((size, index) => {
                    const quantity = quantities[index];
                    if (quantity > 0) {
                        const totalPrice = pricePerSize[size] * quantity;

                        fetch('http://localhost:3000/add-to-cart', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId,
                                productName,
                                size,
                                color:color,
                                price: totalPrice,
                                quantity,
                                img_data: image
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('You must be logged in to add items to the cart.');
        });
}
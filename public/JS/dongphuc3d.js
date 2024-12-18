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

// xem thông tin sản phẩm 1
var information_circle1 = document.getElementById("information-circle1");
var information_circle_btn1 = document.getElementById("information-circle-btn1");
var close_information_circle1 = document.getElementsByClassName("close-information-circle1")[0];
information_circle_btn1.onclick = function () {
    information_circle1.style.display = "block";
}
close_information_circle1.onclick = function () {
    information_circle1.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == information_circle1) {
        information_circle1.style.display = "none";
    }
});
// xem thông tin sản phẩm 2
var information_circle2 = document.getElementById("information-circle2");
var information_circle_btn2 = document.getElementById("information-circle-btn2");
var close_information_circle2 = document.getElementsByClassName("close-information-circle2")[0];
information_circle_btn2.onclick = function () {
    information_circle2.style.display = "block";
}
close_information_circle2.onclick = function () {
    information_circle2.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == information_circle2) {
        information_circle2.style.display = "none";
    }
});
// xem thông tin sản phẩm 3
var information_circle3 = document.getElementById("information-circle3");
var information_circle_btn3 = document.getElementById("information-circle-btn3");
var close_information_circle3 = document.getElementsByClassName("close-information-circle3")[0];
information_circle_btn3.onclick = function () {
    information_circle3.style.display = "block";
}
close_information_circle3.onclick = function () {
    information_circle3.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == information_circle3) {
        information_circle3.style.display = "none";
    }
});
// xem thông tin sản phẩm 4
var information_circle4 = document.getElementById("information-circle4");
var information_circle_btn4 = document.getElementById("information-circle-btn4");
var close_information_circle4 = document.getElementsByClassName("close-information-circle4")[0];
information_circle_btn4.onclick = function () {
    information_circle4.style.display = "block";
}
close_information_circle4.onclick = function () {
    information_circle4.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == information_circle4) {
        information_circle4.style.display = "none";
    }
});
// xem thông tin sản phẩm 5
var information_circle5 = document.getElementById("information-circle5");
var information_circle_btn5 = document.getElementById("information-circle-btn5");
var close_information_circle5 = document.getElementsByClassName("close-information-circle5")[0];
information_circle_btn5.onclick = function () {
    information_circle5.style.display = "block";
}
close_information_circle5.onclick = function () {
    information_circle5.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == information_circle5) {
        information_circle5.style.display = "none";
    }
});
// xem thông tin sản phẩm 6
var information_circle6 = document.getElementById("information-circle6");
var information_circle_btn6 = document.getElementById("information-circle-btn6");
var close_information_circle6 = document.getElementsByClassName("close-information-circle6")[0];
information_circle_btn6.onclick = function () {
    information_circle6.style.display = "block";
}
close_information_circle6.onclick = function () {
    information_circle6.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == information_circle6) {
        information_circle6.style.display = "none";
    }
});

// Thêm sản phẩm vào giỏ hàng 
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

            const activeColorProduct = document.querySelector('.color-product.active');
            if (!activeColorProduct) {
                alert('Please select a product color.');
                return;
            }

            const productName = activeColorProduct.getAttribute('data-product-name');
            const color = activeColorProduct.style.backgroundColor;
            const price = parseFloat(document.getElementById('price-product-design').innerText.replace(/\D/g, ''));

            const sizes = ['S', 'L', 'M', 'XL'];
            const quantities = sizes.map(size => parseInt(document.getElementById(`quantity${size}`).value) || 0);
            const pricePerSize = { S: pricePerS, M: pricePerM, L: pricePerL, XL: pricePerXL };

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
                                color,
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
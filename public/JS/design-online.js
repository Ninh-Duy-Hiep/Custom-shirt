// JS cho "Thông tin sản phẩm"
var infor_product = document.getElementById("infor-product");
var infor_btn = document.getElementById("infor-btn");
var close_infor_btn = document.getElementsByClassName("close-infor-btn")[0];
infor_btn.onclick = function () {
    infor_product.style.display = "block";
}
close_infor_btn.onclick = function () {
    infor_product.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == infor_product) {
        infor_product.style.display = "none";
    }
});
// JS cho "Size"
var view_size = document.getElementById("view-size");
var size_btn = document.getElementById("size-btn");
var close_size_btn = document.getElementsByClassName("close-size-btn")[0];
size_btn.onclick = function () {
    view_size.style.display = "block";
}
close_size_btn.onclick = function () {
    view_size.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == view_size) {
        view_size.style.display = "none";
    }
});
// JS cho "Chọn sản phẩm"
var pick_product = document.getElementById("pick-product");
var shirt_btn = document.getElementById("shirt-btn");
var close_shirt_btn = document.getElementsByClassName("close-shirt-btn")[0];
shirt_btn.onclick = function () {
    pick_product.style.display = "block";
}
close_shirt_btn.onclick = function () {
    pick_product.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == pick_product) {
        pick_product.style.display = "none";
    }
});
function selectImage(image) {
    var images = document.getElementsByClassName("pick-product-image");
    for (var i = 0; i < images.length; i++) {
        images[i].classList.remove("selected");
    }
    image.classList.add("selected");
}
// Js cho "Thêm Text"
var add_text = document.getElementById("add-text");
var text_btn = document.getElementById("text-btn");
var close_text_btn = document.getElementsByClassName("close-text-btn")[0];
text_btn.onclick = function () {
    add_text.style.display = "block";
}
close_text_btn.onclick = function () {
    add_text.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == add_text) {
        add_text.style.display = "none";
    }
});
// Them Text
document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('textInput');
    const fontFamily = document.getElementById('fontFamily');
    const fontColor = document.getElementById('fontColor');
    const fontSize = document.getElementById('fontSize');
    const boldCheckbox = document.getElementById('boldCheckbox');
    const italicCheckbox = document.getElementById('italicCheckbox');
    const underlineCheckbox = document.getElementById('underlineCheckbox');
    const addTextBtn = document.getElementById('addTextBtn');
    const deleteTextBtn = document.getElementById('deleteTextBtn');
    const display = document.getElementById('display');

    let selectedText = null;
    addTextBtn.addEventListener('click', function () {
        const text = textInput.value;
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.classList.add('draggable');
        applyTextStyle(textElement);
        display.appendChild(textElement);

        makeElementDraggable(textElement);
    });


    deleteTextBtn.addEventListener('click', function () {
        if (selectedText) {
            display.removeChild(selectedText);
            selectedText = null;
        }
    });

    function applyTextStyle(element) {
        element.style.fontFamily = fontFamily.value;
        element.style.color = fontColor.value;
        element.style.fontSize = fontSize.value + 'px';
        element.style.fontWeight = boldCheckbox.checked ? 'bold' : 'normal';
        element.style.fontStyle = italicCheckbox.checked ? 'italic' : 'normal';
        element.style.textDecoration = underlineCheckbox.checked ? 'underline' : 'none';
    }

    function makeElementDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.addEventListener('mousedown', function (e) {
            e.preventDefault();
            selectedText = element;
            element.classList.add('selected'); // Thêm lớp selected khi chọn text
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mousemove', dragElement);
            document.addEventListener('mouseup', stopDragging);
        });

        function dragElement(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newX = element.offsetLeft - pos1;
            let newY = element.offsetTop - pos2;

            if (newX >= 0 && newX <= display.clientWidth - element.offsetWidth) {
                element.style.left = newX + 'px';
            }
            if (newY >= 0 && newY <= display.clientHeight - element.offsetHeight) {
                element.style.top = newY + 'px';
            }
        }

        function stopDragging() {
            document.removeEventListener('mousemove', dragElement);
            document.removeEventListener('mouseup', stopDragging);
            element.classList.remove('selected'); // Xóa lớp selected khi bỏ chọn text
        }
    }

});




// Js cho "Thêm Art"
var add_art = document.getElementById("add-art");
var art_btn = document.getElementById("art-btn");
var close_art_btn = document.getElementsByClassName("close-art-btn")[0];
art_btn.onclick = function () {
    add_art.style.display = "block";
}
close_art_btn.onclick = function () {
    add_art.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == add_art) {
        add_art.style.display = "none";
    }
});
// thêm art
const displayArea_art = document.getElementById('display');
let selectedImage_cart = null;

document.querySelectorAll('.add-art-content li img').forEach(img => {
    img.addEventListener('click', function () {
        const newImg = document.createElement('img');
        newImg.src = this.src;
        newImg.classList.add('draggable');
        displayArea_art.appendChild(newImg);

        interact(newImg)
            .draggable({
                listeners: {
                    move(event) {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                },
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ]
            });

        // Thêm sự kiện click để chọn ảnh
        newImg.addEventListener('click', function () {
            if (selectedImage_cart) {
                selectedImage_cart.classList.remove('selected_cart');
            }
            selectedImage_cart = newImg;
            newImg.classList.add('selected_cart');
        });
    });
});

// Lắng nghe sự kiện keydown để xóa ảnh
document.addEventListener('keydown', function (event) {
    if ((event.key === 'Delete') && selectedImage_cart) {
        selectedImage_cart.remove();
        selectedImage_cart = null;
    }
});
// Js cho "Tải lên hình ảnh"
var upload = document.getElementById("upload");
var upload_btn = document.getElementById("upload-btn");
var close_upload_btn = document.getElementsByClassName("close-upload-btn")[0];
upload_btn.onclick = function () {
    upload.style.display = "block";
}
close_upload_btn.onclick = function () {
    upload.style.display = "none";
}
window.addEventListener("click", function (event) {
    if (event.target == upload) {
        upload.style.display = "none";
    }
});
const imageUpload = document.getElementById('imageUpload');
const displayArea = document.querySelector('.display');
let uploadedImage = document.createElement('img');
uploadedImage.id = 'uploadedImage';
displayArea.appendChild(uploadedImage);

imageUpload.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
        if (file.size > 30 * 1024 * 1024) { // Kiểm tra kích thước không vượt quá 30MB
            alert('File quá lớn, vui lòng chọn file nhỏ hơn 30MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            uploadedImage.style.width = '150px'; // Đặt lại kích thước mặc định sau khi thay đổi
            uploadedImage.style.transform = 'translate(0px, 0px)'; // Đặt lại vị trí ban đầu
            uploadedImage.setAttribute('data-x', 0);
            uploadedImage.setAttribute('data-y', 0);
        };
        reader.readAsDataURL(file);
    }
    this.value = '';
});

interact('#uploadedImage')
    .draggable({
        listeners: {
            move(event) {
                let target = event.target;
                let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    })
    .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        restrictEdges: {
            outer: 'parent',
            endOnly: true,
        },
        restrictSize: {
            min: { width: 50, height: 50 },
            max: { width: 200, height: 400 },
        },
        listeners: {
            move(event) {
                let target = event.target;
                let x = parseFloat(target.getAttribute('data-x')) || 0;
                let y = parseFloat(target.getAttribute('data-y')) || 0;

                target.style.width = `${event.rect.width}px`;
                target.style.height = `${event.rect.height}px`;

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });

// Bắt sự kiện phím delete để xóa ảnh
document.addEventListener('keydown', function (event) {
    if (event.key === 'Delete') {
        uploadedImage.remove(); // Xóa phần tử img khỏi display

        // Tạo lại phần tử img để có thể tiếp tục tải ảnh mới vào
        uploadedImage = document.createElement('img');
        uploadedImage.id = 'uploadedImage';
        displayArea.appendChild(uploadedImage);

        interact('#uploadedImage')
            .draggable({
                listeners: {
                    move(event) {
                        let target = event.target;
                        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                }
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                restrictEdges: {
                    outer: 'parent',
                    endOnly: true,
                },
                restrictSize: {
                    min: { width: 50, height: 50 },
                    max: { width: 200, height: 400 },
                },
                listeners: {
                    move(event) {
                        let target = event.target;
                        let x = parseFloat(target.getAttribute('data-x')) || 0;
                        let y = parseFloat(target.getAttribute('data-y')) || 0;

                        target.style.width = `${event.rect.width}px`;
                        target.style.height = `${event.rect.height}px`;

                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                }
            });
    }
});


// Js cho color shirt
function showImage(imageId, element) {
    // Remove active class from all images
    const images = document.querySelectorAll(".image-container img");
    images.forEach((img) => {
        img.classList.remove("active");
    });
    document.getElementById(imageId).classList.add("active");

    // Remove active class from all color products
    const colorProducts = document.querySelectorAll('.color-product');
    colorProducts.forEach((product) => {
        product.classList.remove('active');
    });
    element.classList.add('active');
}

window.onload = function () {
    showImage("image1", document.querySelector('.color-product.active'));
};
// Js cho số lượng size và giá
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

    document.getElementById('price-product-design').innerText = formattedPrice;
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





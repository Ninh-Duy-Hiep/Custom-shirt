// Click để hiện nút đăng xuất 
let isVisible = false;

function toggleLogout() {
    const textElement = document.getElementById('infor-account');
    isVisible = !isVisible;

    if (isVisible) {
        textElement.style.display = 'block';
    } else {
        textElement.style.display = 'none';
    }
}
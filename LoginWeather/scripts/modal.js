function openPage(url) {
    var modal = document.getElementById('modal');
    var modalFrame = document.getElementById('modal-frame');
    modalFrame.src = url;
    modal.style.display = 'block';
}

function closePage() {
    var modal = document.getElementById('modal');
    var modalFrame = document.getElementById('modal-frame');
    modalFrame.src = '';
    modal.style.display = 'none';
}

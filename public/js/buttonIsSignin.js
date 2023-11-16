

var isSignin = sessionStorage.getItem('SESSION_isSignin');
var btnLogin = document.querySelector('.btn-login');
var btnCart = document.querySelector('.btn-cart');
var btnExitLogin = document.querySelector('.btn-exit')
var linkOrder = document.querySelector('.orderLink');

if (isSignin !== null) {
    if (isSignin == 'true') {
        btnLogin.style.display = 'none';
        btnCart.style.display = 'block';
        linkOrder.style.display = 'block';
    } else {
        btnLogin.style.display = 'block';
        btnCart.style.display = 'none';
        linkOrder.style.display = 'none';
        btnExitLogin.style.display = 'none';
    }

} else {
    btnLogin.style.display = 'block';
    btnCart.style.display = 'none';
    linkOrder.style.display = 'none';
    btnExitLogin.style.display = 'none';
}

btnExitLogin.addEventListener('click', function () {
    sessionStorage.removeItem('SESSION_isSignin');
    alert("Logout realizado com sucesso!");
    location.reload();
});
window.onload = function() {
    // Load the email from localStorage
    var email = localStorage.getItem('email');
    if (email !== null) {
        document.getElementById('email').value = email;
    }

    // Save the email to localStorage when the form is submitted
    document.getElementById('loginForm').onsubmit = function() {
        if (document.getElementById('rememberMe').checked) {
            localStorage.setItem('email', document.getElementById('email').value);
        } else {
            localStorage.removeItem('email');
        }
    };
};

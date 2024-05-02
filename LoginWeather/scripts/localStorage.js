window.onload = function() {
    try {
        // Load the email from localStorage
        var email = localStorage.getItem('email');
        if (email !== null) {
            document.getElementById('email').value = email;
        }

        // Save the email to localStorage when the form is submitted
        document.getElementById('loginForm').onsubmit = function() {
            try {
                if (document.getElementById('rememberMe').checked) {
                    localStorage.setItem('email', document.getElementById('email').value);
                } else {
                    localStorage.removeItem('email');
                }
            } catch (error) {
                console.error('Error occurred while accessing localStorage:', error);
                // Navigate to error page
                window.location.href = 'http://localhost/LoginWeather/templates/genError.html';
            }
        };
    } catch (error) {
        console.error('Error occurred during window.onload event:', error);
        // Navigate to error page
        window.location.href = 'http://localhost/LoginWeather/templates/genError.html';
    }
};

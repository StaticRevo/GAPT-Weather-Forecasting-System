function validateForm() {
    // Check if the checkbox is checked
    var agreeTermsCheckbox = document.getElementById('agreeTerms');
    if (!agreeTermsCheckbox.checked) {
        alert('You must agree to the terms & conditions');
        return false; // Prevent form submission
    }
    return true; // Allow form submission
}
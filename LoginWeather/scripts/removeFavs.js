// Get all elements with the class name 'removeFavsBtn'
const removeButtons = document.querySelectorAll('.removeFavsBtn');

// Loop through each remove button and attach click event listener
removeButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of the anchor tag

        // Get latitude and longitude from the data attributes
        const latitude = this.getAttribute('data-latitude');
        const longitude = this.getAttribute('data-longitude');

        // Make a GET request to removefavs.php
        fetch(`removefavs.php?latitude=${latitude}&longitude=${longitude}`)
            .then(response => response.json())
            .then(data => {
                // Display the response message as a popup based on success status
                if (data.success) {
                    alert(data.message);
                    // Reload the page
                    location.reload();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

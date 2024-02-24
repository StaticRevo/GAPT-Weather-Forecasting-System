document.addEventListener("DOMContentLoaded", function () {
    // Function to find the pressure widget and extract the value
    function findPressureWidget() {
        const widgets = document.querySelectorAll('.widget-small');
        for (const widget of widgets) {
            if (widget.querySelector('h3').innerText.includes('Pressure')) {
                return widget.querySelector('.widget-text').innerText;
            }
        }
        return null; // Widget not found
    }

    // Get the pressure value from the widget
    const pressureText = findPressureWidget();

    if (pressureText) {
        // Extract the numerical value from the pressure text
        const pressureValue = parseFloat(pressureText);

        // Define lower and upper bounds for pressure levels
        const lowerBound = 900;
        const upperBound = 1100;

        // Calculate the fill percentage based on the pressure value and bounds
        let fillPercentage = 0;

        if (pressureValue >= lowerBound && pressureValue <= upperBound) {
            fillPercentage = ((pressureValue - lowerBound) / (upperBound - lowerBound)) * 100;
        } else if (pressureValue < lowerBound) {
            fillPercentage = 0;
        } else if (pressureValue > upperBound) {
            fillPercentage = 100;
        }

        // Set the width of the pressure bar
        const pressureBar = document.getElementById('pressureBar');
        pressureBar.style.width = fillPercentage + '%';
    }
});
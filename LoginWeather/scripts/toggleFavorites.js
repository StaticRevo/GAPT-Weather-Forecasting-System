document.addEventListener('DOMContentLoaded', function () {
    var favoritesColumn = document.getElementById('favorites-column');
    var weatherColumn = document.getElementById('weather-column');
    var toggleButton = document.getElementById('toggleButton');
    var cloudImages = document.querySelectorAll('.cloud-overlay');

    toggleButton.addEventListener('click', function () {
        if (favoritesColumn && weatherColumn) {
            favoritesColumn.classList.toggle('collapsed');
            weatherColumn.classList.toggle('full-width'); 
        }
    });

    // Check screen width on load and hide if small
    if (window.innerWidth <= 768) {
        favoritesColumn.classList.add('collapsed');
        weatherColumn.classList.remove('full-width'); 
    }
});

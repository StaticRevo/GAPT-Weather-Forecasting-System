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
});
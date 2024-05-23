document.addEventListener('DOMContentLoaded', function() {
    handleWidgetClick('visibility-widget', 'visibility-iframe', 'templates/visibility.html');
    handleWidgetClick('pressure-widget', 'pressure-iframe', 'templates/pressure.html');
    handleWidgetClick('UV-widget', 'uv-iframe', 'templates/uv.html');

    //not implemented yet
    handleWidgetClick('precipitation-widget', 'precipitation-iframe', 'templates/precipitation.html');
    handleWidgetClick('realfeel-widget', 'realfeel-iframe', 'templates/realfeel.html');
    handleWidgetClick('wind-widget', 'wind-iframe', 'templates/wind.html');
    handleWidgetClick('sun-widget', 'sun-iframe', 'templates/sun.html');
    handleWidgetClick('humidity-widget', 'humidity-iframe', 'templates/humidity.html');
});

let currentIframe = null;

function handleWidgetClick(widgetId, iframeId, iframeSrc) {
    const widget = document.getElementById(widgetId);
    const iframe = document.getElementById(iframeId);

    if (widget && iframe) {
        widget.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent clicks inside iframe from closing it
            lat = getLat();
            lon = getLon();

            // If this iframe is already open, close it
            if (currentIframe === iframe) {
                iframe.style.display = 'none';
                currentIframe = null;
            } else {
                // If another iframe is open, close it
                if (currentIframe) {
                    currentIframe.style.display = 'none';
                }

                // Open this iframe and set it as the current iframe
                iframe.src = `${iframeSrc}?lat=${lat}&lon=${lon}`;
                iframe.style.display = 'block';
                currentIframe = iframe;
            }
        });

        // Add event listener to document to close iframe when clicking outside of it
        document.addEventListener('click', function(event) {
            if (currentIframe && !currentIframe.contains(event.target) && !widget.contains(event.target)) {
                currentIframe.style.display = 'none';
                currentIframe = null;
            }
        });
    }
}

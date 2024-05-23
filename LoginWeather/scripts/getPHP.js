"https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";

$(document).ready(function () {
  // Make AJAX request to PHP file
  $.ajax({
    url: "./fetchfavs.php",
    type: "GET",
    success: function (response) {
      // Update the content of a specific element with the response
      $("#dynamic-content").html(response);
    },
    error: function (xhr, status, error) {
      // Handle errors if any
      console.error(xhr.responseText);
    },
  });
});

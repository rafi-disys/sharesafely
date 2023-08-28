$(document).ready(function() {
  // Event listener for when a file is chosen in the input field using jQuery
  $('#chooseFile').bind('change', function() {
      // Get the selected file's name
      var filename = $("#chooseFile").val();
      
      // Check if a file was selected
      if (/^\s*$/.test(filename)) {
          // If no file selected, update UI accordingly
          $(".file-upload").removeClass('active');
          $("#noFile").text("No file chosen...");
      } else {
          // If file selected, update UI to show the selected filename
          $(".file-upload").addClass('active');
          $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
      }
  });

  // Event listener for the "Upload" button click using jQuery
  $('#uploadButton').on('click', function() {
      // Get the file input element
      var fileInput = $('#chooseFile')[0];

      // Check if a file was selected
      if (fileInput.files.length > 0) {
          // Get the selected file
          var file = fileInput.files[0];
          
          // Create a FormData object to send the file to the server using HTML5 FormData API
          var formData = new FormData();
          formData.append('file', file);

          // Send an AJAX request to the server using jQuery's AJAX function
          $.ajax({
              url: '/upload', // Backend endpoint to handle file upload
              type: 'POST',   // Using HTTP POST method
              data: formData, // Send the selected file as FormData
              cache: false,
              contentType: false, // Set content type to multipart/form-data
              processData: false,
              success: function(response) {
                  // Handle successful response from the server
                  console.log('File uploaded successfully:', response);
                  // Perform actions upon successful upload
              },
              error: function(error) {
                  // Handle error response from the server
                  console.error('Error uploading file:', error);
                  // Perform actions upon error
              }
          });
      } else {
          // Alert the user if no file was selected
          alert('Please select a file.');
      }
  });
});

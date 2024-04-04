function uploadFile() {
    var fileInput = document.getElementById('fileInput');
    var fileList = document.getElementById('fileList');

    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var row = fileList.insertRow();
        var filenameCell = row.insertCell(0);
        var sizeCell = row.insertCell(1);
        var shareCell = row.insertCell(2); // Add a new cell for the share button

        filenameCell.textContent = file.name;
        sizeCell.textContent = formatFileSize(file.size);

        // Create a share button
        var shareButton = document.createElement('button');
        shareButton.textContent = 'Share';
        shareButton.onclick = function (file) {
            return function () {
                uploadFileToService(file);
            };
        }(file);
        shareCell.appendChild(shareButton);
    }
}

function formatFileSize(bytes) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to display the modal with shareable link
function displayShareLink(link) {
    var modal = document.getElementById("myModal");
    var shareLink = document.getElementById("shareLink");
    shareLink.textContent = "Shareable link: " + link;
    modal.style.display = "block";

    // Close the modal when clicking on the close button (×)
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Close the modal when clicking anywhere outside of it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}


function uploadFileToService(file) {
    var formData = new FormData();
    formData.append('file', file);
  
    fetch('http://file.io/?expires=1d', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Display the shareable link in a modal
      if (data.success) {
        displayShareLink(data.link);
      } else {
        alert('Error uploading file: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again later.');
    });
  }
  
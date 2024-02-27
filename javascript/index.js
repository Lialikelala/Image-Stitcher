function combineImages() {
    const images = document.getElementById('fileInput').files;
    if (images.length < 1) {
        alert('Please select at least one image.');
        return;
    }

    let totalHeight = 0, maxWidth = 0;
    let loadedImages = [];
    let imagesLoaded = 0;

    for (let i = 0; i < images.length; i++) {
        let img = new Image();
        img.onload = function() {
            loadedImages[i] = img;
            maxWidth = Math.max(maxWidth, img.width);
            totalHeight += img.height;

            imagesLoaded++;
            if (imagesLoaded === images.length) {
                renderImages(loadedImages, maxWidth, totalHeight);
            }
        };
        img.src = URL.createObjectURL(images[i]);
    }
}

    function renderImages(images, maxWidth, totalHeight) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = maxWidth;
        canvas.height = totalHeight;

        let yOffset = 0;
        for (let img of images) {
        ctx.drawImage(img, 0, yOffset, img.width, img.height);
        yOffset += img.height;
    }

    // Create download link
    const downloadLink = document.getElementById('downloadLink');
    if(downloadLink.getAttribute("listener") !== "true") {
    downloadLink.addEventListener('click', function(e) {
        var fileName = prompt("Please enter a name for the downloaded file:", "combinedimage.png");
        if (fileName === null) {
            // If cancel is pressed, prevent the download
            e.preventDefault();
        } else {
            fileName = fileName.trim() !== '' ? fileName : 'combinedimage';
            this.download = fileName;
            this.href = canvas.toDataURL('image/png');
        }
    });

    // Mark this link as having an event listener to avoid adding another
    downloadLink.setAttribute("listener", "true");
}

    downloadLink.style.display = 'inline';
    downloadLink.innerText = 'Download Combined Image';
}

    document.addEventListener('DOMContentLoaded', function() {
        var dropArea = document.getElementById('dropArea');
        var fileInput = document.getElementById('fileInput'); // Make sure this matches the ID of your file input

        dropArea.addEventListener('click', function() {
            fileInput.click(); // Opens the file dialog when dropArea is clicked
        });

        fileInput.addEventListener('change', function(event) {
            // Your logic to handle file selection, such as calling combineImages()
            combineImages();
        });

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
         });

        // Highlight drop area when item is dragged over it
         ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
         });

        ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
         });

         // Handle dropped files
         dropArea.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;

        fileInput.files = files;
        combineImages();
    }
});
    function resetCanvas() {
        // Clear the file input
        var fileInput = document.getElementById('fileInput');
        fileInput.value = "";

        // Clear the canvas
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Hide the download link
        var downloadLink = document.getElementById('downloadLink');
        downloadLink.style.display = 'none';

        // Optionally, reset other elements on the page as needed
}
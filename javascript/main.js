// -----------------------------
// Initialization
// -----------------------------

// Global variables
let autoDownloadEnabled = false; // variable for handling automatic download
let batches = []; // Array to hold batches of images
let batchSize;
let batchModeEnabled = false; // Keep track of whether batch mode is enabled
let globalImages = []; // This array will hold all the images to be processed
let currentBatch = 0; 
let batchDownloaded = false; // Flag to track whether the current batch has been downloaded
let downloadedBatches = []; // Initialize an array to keep track of downloaded batches
let navigatingBackward = false;
let navigatingForward = false;

// DOM loader
document.addEventListener('DOMContentLoaded', function() {
setupEventListeners();
});

// -----------------------------
// Batch Processing
// -----------------------------

//Create image batches from files
function createBatches(files) {
    batches = [];
    if (batchModeEnabled) {
        batchSize = parseInt(document.getElementById('batchSizeInput').value, 10);
    } else {
        batchSize = files.length; // Treat all uploaded files as a single batch
    }
    console.log('Batch size:', batchSize); // Log the batch size

    const numBatches = Math.ceil(files.length / batchSize);

    for (let i = 0; i < numBatches; i++) {
        const startIdx = i * batchSize;
        const endIdx = Math.min(startIdx + batchSize, files.length);
        const batch = Array.prototype.slice.call(files, startIdx, endIdx);
        batches.push(batch);
        console.log('Batch', i + 1, 'created:', batch); // Log each batch created
    }

    console.log('Total number of batches:', batches.length); 
    return batches;
}

// Main function to combine images within a batch
function combineImages() {
    let batchModeEnabled = document.getElementById('batchModeCheckbox').checked;
    let imagesToRender; // Array to hold the images to render
    console.log("Batch mode enabled:", batchModeEnabled);  
    console.log("combineImages called");
    if (!batchModeEnabled) {
        // Non-batch mode: treat all uploaded files as a single batch
        imagesToRender = Array.from(document.getElementById('fileInput').files);
        changeVisibility('nextBatchButton', false);
        changeVisibility('prevBatchButton', false);
    } else {
        // Batch mode: use the current batch of images
        if (currentBatch < batches.length) {
            imagesToRender = batches[currentBatch];
        }
    }
    // Check if there are images to process
    if (!imagesToRender || imagesToRender.length === 0) {
        console.log('No images to process.');
        alert('Please select at least one image.');
        return;
    }
    let totalHeight = 0, maxWidth = 0;
    let loadedImages = [];
    let imagesLoaded = 0;
    for (let i = 0; i < imagesToRender.length; i++) {
        let img = new Image();
        img.onload = function() {
            console.log("Image loaded:", img.src);
            loadedImages[i] = img;
            maxWidth = Math.max(maxWidth, img.width);
            totalHeight += img.height;

            imagesLoaded++;
            if (imagesLoaded === imagesToRender.length) {
                renderImages(loadedImages, maxWidth, totalHeight);

                // Trigger automatic download if autoDownloadEnabled is true and the user is not navigating backward
                if (autoDownloadEnabled && !batchDownloaded) {
                    autoDownload();
                    downloadedBatches[currentBatch] = true;
                }
            }
        };
        img.onerror = function() {
            console.error("Error loading image:", img.src);
            // Handle the error, e.g., skip this image, show an error message, etc.
            imagesLoaded++;
            if (imagesLoaded === imagesToRender.length) {
                if(loadedImages.length > 0) { // Check if at least one image loaded successfully
                    renderImages(loadedImages, maxWidth, totalHeight);
                    // Existing automatic download logic...
                } else {
                    alert("Failed to load images. Please check the image files.");
                }
            }
        };
        img.src = URL.createObjectURL(imagesToRender[i]);
    }
    updateUI();
}

// Renders combined images on a canvas
function renderImages(images, maxWidth, totalHeight) {
    console.log("Rendering images:", images); // Log to inspect the array
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = maxWidth;
    canvas.height = totalHeight;

    let yOffset = 0;
    images.forEach(img => {
        if (img && img.width && img.height) { // Ensure img is defined and has size
            ctx.drawImage(img, 0, yOffset, img.width, img.height);
            yOffset += img.height;
        } else {
            console.error("Invalid image encountered during render.");
        }
    });


    // Setup download link for manual download (always visible after combining images)
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.style.display = 'inline'; // Always show download link after image combination
    downloadLink.innerText = 'Download Combined Image';

    if (!downloadLink.hasAttribute("listener")) {
        downloadLink.addEventListener('click', function(e) {
            let fileName = prompt("Please enter a name for the downloaded file:", "combined_image.png");
            if (fileName !== null) {
                fileName = fileName.trim() !== '' ? fileName : 'combined_image';
                this.download = fileName;
                this.href = canvas.toDataURL('image/png');

                // Set the corresponding index in downloadedBatches to true
                downloadedBatches[currentBatch] = true; 
            
            } else {
                // Prevent the download if cancel is pressed
                e.preventDefault();
            }
        });

    downloadLink.setAttribute("listener", "true");
    }
    }

    // Handles automatic downloading of the combined image.
    function autoDownload() {
    console.log("Attempting auto download...");
    if (autoDownloadEnabled) {
        console.log("Auto download enabled.");
        // Create a temporary link element
        const link = document.createElement('a');
        link.download = 'combined_image.png'; // Set the download attribute
        link.href = document.getElementById('canvas').toDataURL('image/png'); // Set the data URL as the link href
        link.click(); // Simulate a click on the link to trigger download
        console.log("Auto download triggered.");
    } else {
        console.log("Auto download disabled. Skipping...");
    }
}

// Modifies the number of images processed within a batch
function adjustBatchSize(increment) {
    let batchSizeInput = document.getElementById('batchSizeInput');
    let newSize = parseInt(batchSizeInput.value) + increment;

    // Validate new size to ensure it's a positive number
    if (newSize >= 1) { 
        batchSizeInput.value = newSize; // Apply valid size adjustment
        console.log("Batch size adjusted to:", newSize);
        combineImages(); // Re-process the current batch with the new size
    } else {
        console.error("Invalid adjustment. Batch size must be at least 1.");
    }
    updateUI();
}

// -----------------------------
// Functions for manually adjusting batch content
// -----------------------------

// Move an image from the beginning of the next batch to the end of the current batch
function addImageToBatch() {
    console.log("addImageToBatch called");
    // Check if there is a next batch to move an image from
    if (currentBatch < batches.length - 1) {
        // Ensure the next batch has at least one image to move
        if (batches[currentBatch + 1].length > 0) {
            // Move the first image of the next batch to the current batch
            let movedImage = batches[currentBatch + 1].shift();
            batches[currentBatch].push(movedImage);
            console.log("Moved one image from the next batch to the current batch.");
            console.log("Current batch size: " + batches[currentBatch].length);
        } else {
            console.log("The next batch has no images to move.");
        }
    } else {
        console.log("No next batch available to move images from.");
    }

    // If the next batch becomes empty after moving the image, remove the empty batch
    if (batches[currentBatch + 1] && batches[currentBatch + 1].length === 0) {
        batches.splice(currentBatch + 1, 1); // Remove the empty batch
        console.log("Removed an empty batch after moving its last image.");
    }

    document.getElementById('batchSizeInput').value = batches[currentBatch].length;
    adjustBatchSize(0); // Refresh UI
    updateUI(); // Update the UI to reflect changes
}

// Move an image from the current back to the next batch or a new batch (or removed)
function removeImageFromBatch() {
    console.log("removeImageFromBatch called");
    const numberOfImagesToRemove = 1; // Always remove one image per click

    console.log("Removing one image from the batch"); 

    // Check if there are multiple batches and we are not in the last batch
    if (currentBatch < batches.length - 1) {
        // If there is a next batch, move the last image of the current batch to the next
        let movedImage = batches[currentBatch].pop();
        batches[currentBatch + 1].unshift(movedImage);
        console.log("Moved one image to the next batch.");
    } else {
        // Modification for last batch case
        // Check if current batch has images to delete
        if (batches[currentBatch].length > 1) {
            // Remove the last image from the current batch
            batches[currentBatch].pop();
            console.log("Removed one image from the current batch.");
        } else if (batches[currentBatch].length === 1) {
            // If it's the last image in the last batch, delete the image and the batch itself //note: remove this. Figure out a different way to handle edge cases.
            batches[currentBatch].pop();
            // Check if after removing the image, the current batch is empty and it's not the only batch
            if (batches.length > 1) {
                batches.splice(currentBatch, 1); // Remove the now empty batch
                currentBatch = batches.length - 1; // Adjust currentBatch index to the new last batch
                console.log("Removed the last image and the empty batch.");
            }
        }
    }
    document.getElementById('batchSizeInput').value = batches[currentBatch] ? batches[currentBatch].length : 0;
    adjustBatchSize(0); // Refresh UI
    updateUI(); // Update the UI to reflect changes
}

// -----------------------------
// Event Handling
// -----------------------------

// Handles changes to the file input (new images selected)
function handleFileInputChange(e) {
    const files = e.target.files;
    console.log("Files selected:", files.length); // Log the number of selected files
    createBatches(files); // Create batches from the selected files
    console.log("Batches created:", batches.length); // Log the number of created batches
    currentBatch = 0; // Reset the batch count to 0 when selecting new files
    downloadedBatches = [];
    console.log("downloadedBatches have been reset");
    combineImages(); // Call combineImages to process the first batch
    updateUI(); 
}

// Checks if uploaded files are supported image types
function filesAreSupported(files) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    for (let i = 0; i < files.length; i++) {
        if (!allowedTypes.includes(files[i].type)) {
            return false;
        }
    }
    return true;
}

// Manages drag-and-drop file inputs
function handleDrop(e) {
    e.preventDefault(); // Prevent the default browser action
    const dt = e.dataTransfer;
    const files = dt.files;
    if (!filesAreSupported(files)) {
        console.log('Unsupported files detected:', files);
        alert('Error: One or more files are not supported. Please upload image files in JPEG, PNG, or GIF format.');
        return; 
    }
    fileInput.files = files;
    combineImages();
}

// Toggles auto-download feature
function handleAutoDownloadChange() {
    autoDownloadEnabled = this.checked;
}

// Toggles batch mode on and off
    function handleBatchModeChange() {
    batchModeEnabled = this.checked;
    currentBatch = 0; // Reset the batch count to 0 when switching processing modes
    // Possibly call a function to handle UI updates or logic related to changing batch mode
}   

// Adjusts the size of batches when the batch size input changes
function handleBatchSizeChange(e) {
    batchSize = parseInt(e.target.value, 10);
    combineImages(); // Process and display the current batch based on the new batch size
}

// -----------------------------
// Navigation & UI Management
// -----------------------------

// Navigate forward or backward through batches. (offset) parameter allows for dynamic navigation among batches based on the given offset value. Specifies how many batches to move forward or backwards. For ex: if 'offset' is '1', the function would move to the next batch. If 'offset' is '-1', it would move to the previous batch.
function adjustBatch(offset) {
    currentBatch += offset;
    combineImages();
}

// Navigate forward through batches
function nextBatch() {
    navigatingBackward = false;
    navigatingForward = true;
    if (currentBatch < batches.length - 1) {
        currentBatch++;
        combineImages(); // Redraw the canvas with the new batch of images
        batchDownloaded = downloadedBatches[currentBatch]; // Set the flag based on the downloaded status of the batch
        updateUI();
    }
}

// Navigate backwards through batches
function prevBatch() {
    navigatingForward = false;
    navigatingBackward = true; 
    if (currentBatch > 0) {
        currentBatch--;
        combineImages(); // Redraw the canvas with the new batch of images
        batchDownloaded = downloadedBatches[currentBatch]; // Set the flag based on the downloaded status of the batch
        updateUI();
    }
}

// Updates the UI based on the current state (e.g., visibility of buttons)
function updateUI() {
    // Update the batch navigation buttons first
    updateBatchNavigationButtons();
    // Determine the visibility of add/remove buttons based on the number of batches
    let addImageBtn = document.getElementById('addImageToBatchButton');
    let removeImageBtn = document.getElementById('removeImageFromBatchButton');
    if (batches.length > 1) {
        // Show buttons if there are multiple batches
        addImageBtn.style.display = 'inline';
        removeImageBtn.style.display = 'inline';
    } else {
        // Hide buttons if there's only one batch or none
        addImageBtn.style.display = 'none';
        removeImageBtn.style.display = 'none';
    }
    console.log("UI updated to reflect current changes.");
}

// Clears the canvas and resets various states.
function resetCanvas() {
    const fileInput = document.getElementById('fileInput');
    fileInput.value = "";
    // Clear the canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Hide the download link
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.style.display = 'none';
    // Reset the batch number to 0
    currentBatch = 0;
    // Reset the downloadedBatches array
    downloadedBatches = [];
    updateUI()
}

// -----------------------------
// Helper functions
// -----------------------------

function updateBatchNavigationButtons() {
    const nextBatchButton = document.getElementById('nextBatchButton');
    const prevBatchButton = document.getElementById('prevBatchButton');

    changeVisibility('nextBatchButton', currentBatch < batches.length - 1); // Show the "Next Batch" button only if there are more batches ahead
    changeVisibility('prevBatchButton', currentBatch > 0) // Show the "Previous Batch" button only if not on the first batch
}

function changeVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    element.style.display = isVisible ? 'block' : 'none';
}

// -----------------------------
// Utility Functions for drag-and-drop UI interactions
// -----------------------------
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

// -----------------------------
// Setup Event Listeners
// -----------------------------

function setupEventListeners() {
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput'); 

// Batch mode listener
document.getElementById('batchModeCheckbox').addEventListener('change', handleBatchModeChange);
document.getElementById('batchSizeInput').addEventListener('change', handleBatchSizeChange);
document.getElementById('nextBatchButton').addEventListener('click', nextBatch);
document.getElementById('prevBatchButton').addEventListener('click', prevBatch);
document.getElementById('addImageToBatchButton').addEventListener('click', addImageToBatch);
document.getElementById('removeImageFromBatchButton').addEventListener('click', removeImageFromBatch);

// File input event listener
document.getElementById('fileInput').addEventListener('change', handleFileInputChange);

// Drag and drop listeners
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults);
});
document.getElementById('dropArea').addEventListener('drop', handleDrop);
document.getElementById('dropArea').addEventListener('dragenter', highlight);
document.getElementById('dropArea').addEventListener('dragover', highlight);
document.getElementById('dropArea').addEventListener('dragleave', unhighlight);
document.getElementById('dropArea').addEventListener('click', () => fileInput.click());

// Event listener for the "Automatically Download Combined Image" checkbox
document.getElementById('autoDownloadCheckbox').addEventListener('change', handleAutoDownloadChange);

// Reset canvas button listener
document.getElementById('resetCanvasButton').addEventListener('click', resetCanvas);

}
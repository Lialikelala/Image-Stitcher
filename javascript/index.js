class ImageStitcher {
    constructor(options) {
        this.fileInput = options.fileInput;
        this.dropArea = options.dropArea;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.downloadLink = options.downloadLink;
        this.messageArea = options.messageArea;
        this.resetButton = options.resetButton;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.dropArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', () => this.combineImages());
        this.dropArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.resetButton.addEventListener('click', () => this.resetCanvas());

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, ImageStitcher.preventDefaults, false);
            document.body.addEventListener(eventName, ImageStitcher.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => this.dropArea.addEventListener(eventName, () => this.highlight(), false));
        ['dragleave', 'drop'].forEach(eventName => this.dropArea.addEventListener(eventName, () => this.unhighlight(), false));
    }

    static preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight() {
        this.dropArea.classList.add('highlight');
    }

    unhighlight() {
        this.dropArea.classList.remove('highlight');
    }

    handleDrop(e) {
        e.preventDefault();
        this.fileInput.files = e.dataTransfer.files;
        this.combineImages();
    }

    filesAreSupported(files) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return Array.from(files).every(file => allowedTypes.includes(file.type));
    }

    loadImage(imageFile) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(`Error loading image: ${imageFile.name}. Please ensure it is an accessible image file.`);
            img.src = URL.createObjectURL(imageFile);
        });
    }

    calculateMaxWidth(images) {
        return images.reduce((max, img) => Math.max(max, img.width), 0);
    }
    
    calculateTotalHeight(images) {
        return images.reduce((total, img) => total + img.height, 0);
    }    

    renderImages(loadedImages, maxWidth, totalHeight) {
        let yOffset = 0;
        this.canvas.width = maxWidth;
        this.canvas.height = totalHeight;

        loadedImages.forEach(img => {
            this.ctx.drawImage(img, 0, yOffset, img.width, img.height);
            yOffset += img.height;
        });

        this.setupDownloadLink();
    }

    combineImages() {
        const images = this.fileInput.files;
        if (images.length < 1) {
            alert('Please select at least one image.');
            return;
        }
    
        if (!this.filesAreSupported(images)) {
            this.messageArea.textContent = 'Please upload only supported image files (JPEG, PNG, GIF).';
            return;
        }
    
        this.messageArea.textContent = 'Loading images...';
    
        const loadPromises = Array.from(images).map(image => this.loadImage(image));
    
        Promise.all(loadPromises)
            .then(loadedImages => {
                // Use the utility methods to calculate dimensions
                const maxWidth = this.calculateMaxWidth(loadedImages);
                const totalHeight = this.calculateTotalHeight(loadedImages);
                this.renderImages(loadedImages, maxWidth, totalHeight);
                this.messageArea.textContent = ''; // Clear message after successful load
            })
            .catch(error => {
                this.messageArea.textContent = error; // Display loading error
            });
    }    

    setupDownloadLink() {
        this.downloadLink.onclick = (e) => {
            let fileName = prompt("Please enter a name for the downloaded file:", "Page.png");
            if (!fileName) {
                e.preventDefault();
                return;
            }
            fileName = fileName.trim() !== '' ? fileName : 'combinedimage';
            this.downloadLink.download = fileName;
            this.downloadLink.href = this.canvas.toDataURL('image/png');
        };

        this.downloadLink.style.display = 'inline';
        this.downloadLink.innerText = 'Download Combined Image';
    }

    resetCanvas() {
        this.fileInput.value = "";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.downloadLink.style.display = 'none';
        this.messageArea.textContent = '';
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const stitcherConfig = {
        fileInput: document.getElementById('fileInput'),
        dropArea: document.getElementById('dropArea'),
        canvas: document.getElementById('canvas'),
        downloadLink: document.getElementById('downloadLink'),
        messageArea: document.getElementById('messageArea'),
        resetButton: document.getElementById('resetButton')
    };
    // Verify that none of the elements are undefined before proceeding
    if (Object.values(stitcherConfig).every(element => element !== null)) {
        new ImageStitcher(stitcherConfig);
    } else {
        console.error("One or more elements couldn't be found. Please check the IDs.");
    }
});

module.exports = ImageStitcher;

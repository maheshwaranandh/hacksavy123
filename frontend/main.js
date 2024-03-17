// Get DOM elements
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const upGrid = document.getElementById('upGrid');
const inGrid = document.getElementById('inGrid');

// Initialize variables
let uppass = [];
let inpass = [];
let iteration = 1;
let maxPasswordLength = 5;
let selectedImagesUp = []; // Store selected images during signup
let selectedImagesIn = [];

// Event listeners for sign up and sign in buttons
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Function to handle sign up process
function signup() {
    if(!validateSignUp()){
        return;
    }
    // Store email and selected images in session during sign up
    sessionStorage.setItem("upname", document.getElementById('upmail').value);
    sessionStorage.setItem("uppass", JSON.stringify(selectedImagesUp));
    alert("Account Created Successfully");
    const name = document.getElementById('upname').value;
    const email = document.getElementById('upmail').value;
    const signupData = {
        name: name,
        email: email,
        password: selectedImagesUp // Pass selected images array as password
    };
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to handle sign in process
function signin() {
    if(!validateSignIn()){
        return;
    }
    let str = document.getElementById('inmail').value;
    const email = document.getElementById('inmail').value;
    const signinData = {
        email: email,
        password: selectedImagesIn // Pass selected images array as password
    };
    fetch('/api/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signinData)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        if (data === 'Signed in successfully') {
            NewTab();
        } else {
            alert("Login Failed");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to validate sign-up fields and password array
function validateSignUp() {
    const name = document.getElementById('upname').value;
    const email = document.getElementById('upmail').value;

    // Check if name and email fields are filled
    if (name.trim() === '' || email.trim() === '') {
        alert("Please fill in all fields");
        return false;
    }

    // Check if password array is filled with maxPasswordLength images
    if (selectedImagesUp.length !== maxPasswordLength) {
        alert("Please select maxPasswordLength images as your password");
        return false;
    }

    return true;
}

// Function to validate sign-in fields and password array
function validateSignIn() {
    const email = document.getElementById('inmail').value;

    // Check if email field is filled
    if (email.trim() === '') {
        alert("Please enter your email");
        return false;
    }

    // Check if password array is filled with maxPasswordLength images
    if (selectedImagesIn.length !== maxPasswordLength) {
        alert("Please select maxPasswordLength images as your password");
        return false;
    }

    return true;
}


// Function to open a new tab
function NewTab() {
    window.open("https://stjosephs.ac.in/index.html", "_self");
}

// Function to create image grid
function createImageGrid(grid, folder, upOrin) {
    console.log("Current Folder:", folder);
    grid.innerHTML = '';
    const shuffledImageOrder = shuffleArray(Array.from({ length: 25 }, (_, i) => i + 1));
    for (let i = 0; i < 25; i++) {
        const img = document.createElement('img');
        img.src = `images/${folder}/image/${shuffledImageOrder[i]}.jpg`;
        img.alt = `${shuffledImageOrder[i]}`;   
        img.classList.add('grid-item');
        img.addEventListener('click', () => handleImageSelection(img, grid.id, folder, upOrin));
        grid.appendChild(img);
    }
}

// Function to handle image selection
function handleImageSelection(img, gridId, folder, upOrin) {
    const grid = document.getElementById(gridId);
    let selectedImages = upOrin === "Up" ? selectedImagesUp : selectedImagesIn;

    // Check if sign-up process is already completed
    if (selectedImages.length === maxPasswordLength) {
        alert("Please click on sign in.");
        return;
    }

    selectedImages.push(img.alt);
    if (iteration < maxPasswordLength) {
        iteration++;
        createImageGrid(grid, `folder${iteration}`, upOrin);
    } else {
        console.log("Images clicked", selectedImages);

        iteration = 1;
        // Disable event listeners on images
        // disableImageEventListeners(gridId);
    }
}

// Function to disable event listeners on images
function disableImageEventListeners(gridId) {
    const grid = document.getElementById(gridId);
    const images = grid.querySelectorAll('.grid-item');
    images.forEach(img => {
        img.removeEventListener('click', handleImageSelection);
        img.style.pointerEvents = 'none'; // Disable pointer events on images
    });
}

// Function to get the next folder name
function getNextFolder(currentFolder) {
    const folders = [];
    for (let i = 1; i <= maxPasswordLength; i++) {
        folders.push(`folder${i}`);
    }
    const currentIndex = folders.indexOf(currentFolder);
    const nextIndex = (currentIndex + 1) % folders.length;
    return folders[nextIndex];
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize grids with images from folder1
createImageGrid(upGrid, 'folder1', "Up");
createImageGrid(inGrid, 'folder1', "In");

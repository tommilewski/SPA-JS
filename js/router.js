const pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'
};

const galleryImages = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/300/200?random=${i + 1}`
}));

function OnStartUp() {
    popStateHandler();
}

OnStartUp();

document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">About Me</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
    `;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1>
        <form id="contact-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
            <label for="message">Message:</label>
            <textarea id="message" name="message"></textarea>
            <div class="g-recaptcha" id="recaptcha-container" data-sitekey="6Lf7af8qAAAAABFjH6DwT_qAbyevYeTODHzU-CaV"></div>
            <button type="submit">Send</button>
        </form>
        <p id="form-error" style="color: red;"></p>
    `;

    if (document.getElementById('recaptcha-container')) {
        grecaptcha.render('recaptcha-container', {
            'sitekey': '6Lf7af8qAAAAABFjH6DwT_qAbyevYeTODHzU-CaV'
        });
    }

    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const recaptchaResponse = grecaptcha.getResponse();
        const errorElement = document.getElementById('form-error');

        if (!name || !email || !message) {
            errorElement.textContent = "All fields are required!";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorElement.textContent = "Invalid email format!";
            return;
        }

        if (!recaptchaResponse) {
            errorElement.textContent = "Please complete the reCAPTCHA!";
            return;
        }

        errorElement.textContent = "";
        alert('Form submitted successfully!');
    });
}

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Photo Gallery</h1>
        <div class="gallery" id="gallery-container"></div>
        <div id="image-modal" class="modal">
            <span class="close">&times;</span>
            <img class="modal-content" id="modal-image">
        </div>
    `;

    const galleryContainer = document.getElementById('gallery-container');

    galleryImages.forEach(image => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img class="gallery-img lazy" 
                 data-src="${image.url}" 
                 data-id="${image.id}"
                 alt="Gallery image"
                 loading="lazy">
        `;
        galleryContainer.appendChild(item);
    });

    initLazyLoading();
    setupModal();
}

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                fetch(img.dataset.src)
                    .then(response => response.blob())
                    .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        img.src = blobUrl;
                        img.classList.remove('lazy');
                    });
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

function setupModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = modal.querySelector('.close');

    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
        });
    });

    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];

    if (loc === pageUrls.contact) {
        RenderContactPage();
    }

    if (loc === pageUrls.about) {
        RenderAboutPage();
    }

    if (loc === pageUrls.gallery) {
        RenderGalleryPage();
    }
}

window.onpopstate = popStateHandler;
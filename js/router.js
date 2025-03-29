let pageUrls = {
    about: '/index.html?about',
    contact:'/index.html?contact',
    gallery: '/index.html?gallery'
};

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
        <h1 class="title">Gallery</h1>
        <div class="gallery" id="gallery">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=1" alt="Image 1">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=2" alt="Image 2">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=3" alt="Image 3">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=4" alt="Image 4">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=5" alt="Image 5">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=6" alt="Image 6">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=7" alt="Image 7">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=8" alt="Image 8">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=9" alt="Image 9">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=10" alt="Image 10">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=11" alt="Image 11">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=12" alt="Image 12">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=13" alt="Image 13">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=14" alt="Image 14">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=15" alt="Image 15">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=16" alt="Image 16">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=17" alt="Image 17">
            <img class="lazy" src="https://placehold.co/300x200" data-src="https://picsum.photos/300/200?random=18" alt="Image 18">
        </div>
        <div class="modal" id="modal">
            <span class="close" id="close">&times;</span>
            <img id="modalImg">
        </div>
    `;

    const gallery = document.getElementById("gallery");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");
    const closeModal = document.getElementById("close");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add("visible");
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll("img").forEach(img => observer.observe(img));

    closeModal.addEventListener("click", () => modal.style.display = "none");

    gallery.querySelectorAll('img').forEach(img => {
        img.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = img.src;
        });
    });
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

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
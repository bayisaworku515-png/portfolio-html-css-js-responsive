/**
 * ==============================================================================
 * BAYISA WORKU - PORTFOLIO V2 JAVASCRIPT ENGINE
 * Stack: Pure Modern Vanilla JavaScript (ES6+)
 * Author: Bayisa Worku (Information Systems Student @ Haramaya University)
 * Description: Modular, accessible, and high-performance interactive controllers
 * ==============================================================================
 */

// Wait until the HTML document is fully parsed before running DOM manipulations
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MODULE 1: THEME TOGGLE CONTROLLER (DARK / LIGHT MODE + LOCALSTORAGE)
       Concepts: localStorage, classList.toggle, ternary operators, DOM updates
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Retrieve saved user theme from browser's localStorage, or default to system preference
    const savedTheme = localStorage.getItem('bayo_portfolio_theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply the saved theme immediately upon page load
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    // Toggle theme on button click
    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');

            // Swap icon between Moon (dark) and Sun (light)
            if (isDark) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('bayo_portfolio_theme', 'dark');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('bayo_portfolio_theme', 'light');
            }
        });
    }


    /* ==========================================================================
       MODULE 2: MOBILE NAVIGATION DRAWER & BACKDROP
       Concepts: Event listeners, toggling classes, preventing body scroll
       ========================================================================== */
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Helper function to toggle drawer state
    function toggleMobileMenu(forceClose = false) {
        if (!mobileDrawer || !drawerBackdrop || !hamburgerIcon) return;

        const shouldOpen = forceClose ? false : !mobileDrawer.classList.contains('open');

        if (shouldOpen) {
            mobileDrawer.classList.add('open');
            drawerBackdrop.classList.add('open');
            hamburgerIcon.classList.replace('fa-bars', 'fa-xmark');
            document.body.style.overflow = 'hidden'; // Prevent background page scroll
        } else {
            mobileDrawer.classList.remove('open');
            drawerBackdrop.classList.remove('open');
            hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
            document.body.style.overflow = ''; // Restore page scroll
        }
    }

    // Open/Close menu when clicking the hamburger button
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', () => toggleMobileMenu());
    }

    // Close menu when clicking the backdrop overlay
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', () => toggleMobileMenu(true));
    }

    // Close menu when any mobile navigation link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(true));
    });


    /* ==========================================================================
       MODULE 3: HERO DYNAMIC TYPEWRITER EFFECT
       Concepts: Arrays, string slicing, recursive setTimeout, asynchronous timers
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    
    // Array of roles representing your professional focus
    const roles = [
        "Frontend Developer",
        "Information Systems Student",
        "UI/UX Enthusiast",
        "Problem Solver"
    ];

    let roleIndex = 0;       // Index of current role string in the array
    let charIndex = 0;       // Current character position within the word
    let isDeleting = false;  // Flag to know whether we are typing or deleting

    function typeWriterLoop() {
        if (!typewriterElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Remove a character from the end
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add next character
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        // Determine typing speed (deleting is faster than typing)
        let typingSpeed = isDeleting ? 50 : 110;

        // When the entire word has been typed out
        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 1800; // Pause at end of word for visitor to read
            isDeleting = true;
        } 
        // When the word has been completely deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length; // Move to next role (loops back to 0)
            typingSpeed = 400; // Pause before starting to type the next word
        }

        // Schedule next character update
        setTimeout(typeWriterLoop, typingSpeed);
    }

    // Start the typewriter loop
    typeWriterLoop();


    /* ==========================================================================
       MODULE 4: CV DOWNLOAD BUTTON SIMULATION
       Concepts: UI state transition, timeout delays, user feedback
       ========================================================================== */
    const cvBtn = document.getElementById('cv-btn');
    const cvText = document.getElementById('cv-text');
    const cvIcon = document.getElementById('cv-icon');
    const cvToast = document.getElementById('cv-toast');

    if (cvBtn && cvText && cvIcon && cvToast) {
        cvBtn.addEventListener('click', () => {
            // Set temporary loading state
            cvText.textContent = "Downloading...";
            cvIcon.className = "fa-solid fa-spinner fa-spin";
            cvBtn.style.pointerEvents = "none";

            setTimeout(() => {
                // Restore button state
                cvText.textContent = "Download CV";
                cvIcon.className = "fa-solid fa-download";
                cvBtn.style.pointerEvents = "auto";

                // Show confirmation toast
                cvToast.classList.remove('hidden');

                // Auto-hide toast after 4 seconds
                setTimeout(() => {
                    cvToast.classList.add('hidden');
                }, 4000);
            }, 1200);
        });
    }


    /* ==========================================================================
       MODULE 5: SCROLLSPY (ACTIVE LINK HIGHLIGHT ON SCROLL) & BACK TO TOP
       Concepts: window.scrollY, getBoundingClientRect, scroll events
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    function handleScrollFeatures() {
        const scrollPosition = window.scrollY + 120; // Offset for fixed navbar

        // 1. Highlight currently visible section in navigation
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // 2. Show/Hide Back to Top Button
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0.7';
            }
        }
    }

    window.addEventListener('scroll', handleScrollFeatures);


    /* ==========================================================================
       MODULE 6: PROJECT CATEGORY FILTERING
       Concepts: dataset attributes, querySelectorAll, forEach iteration
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter project cards smoothly
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    /* ==========================================================================
       MODULE 7: PHOTO GALLERY LIGHTBOX MODAL
       Concepts: Event delegation, reading attributes, keyboard events (Escape)
       ========================================================================== */
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCloseBtn = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');

    // Open lightbox function
    function openLightbox(imgSrc, title, desc) {
        if (!lightboxModal || !lightboxImg) return;

        lightboxImg.src = imgSrc;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Freeze background scroll
    }

    // Close lightbox function
    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore background scroll
    }

    // Attach click events to each gallery card
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-image');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            openLightbox(imgSrc, title, desc);
        });
    });

    // Close when clicking close button or backdrop
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    // Close when pressing the 'Escape' key on the keyboard
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && !lightboxModal.classList.contains('hidden')) {
            closeLightbox();
        }
    });


    /* ==========================================================================
       MODULE 8: REAL-TIME CONTACT FORM VALIDATION & FEEDBACK
       Concepts: Regular Expressions (RegEx), e.preventDefault(), input events, form.reset()
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('char-counter');
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitIcon = document.getElementById('submit-icon');

    // Email validation Regular Expression pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper function to toggle input error status
    function setFieldStatus(inputElement, errorId, isValid) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            if (isValid) {
                formGroup.classList.remove('has-error');
            } else {
                formGroup.classList.add('has-error');
            }
        }
        return isValid;
    }

    // Field Validation Functions
    function validateName() {
        if (!nameInput) return true;
        const isValid = nameInput.value.trim().length >= 2;
        return setFieldStatus(nameInput, 'name-error', isValid);
    }

    function validateEmail() {
        if (!emailInput) return true;
        const isValid = emailRegex.test(emailInput.value.trim());
        return setFieldStatus(emailInput, 'email-error', isValid);
    }

    function validateSubject() {
        if (!subjectInput) return true;
        const isValid = subjectInput.value.trim().length >= 4;
        return setFieldStatus(subjectInput, 'subject-error', isValid);
    }

    function validateMessage() {
        if (!messageInput) return true;
        const len = messageInput.value.trim().length;

        // Update live character counter
        if (charCounter) {
            charCounter.textContent = `${len} / 250`;
            charCounter.style.color = len >= 15 ? 'var(--text-muted)' : 'var(--accent-rose)';
        }

        const isValid = len >= 15;
        return setFieldStatus(messageInput, 'message-error', isValid);
    }

    // Real-Time As-You-Type Listeners ('input' and 'blur')
    if (nameInput) {
        nameInput.addEventListener('input', validateName);
        nameInput.addEventListener('blur', validateName);
    }

    if (emailInput) {
        emailInput.addEventListener('input', validateEmail);
        emailInput.addEventListener('blur', validateEmail);
    }

    if (subjectInput) {
        subjectInput.addEventListener('input', validateSubject);
        subjectInput.addEventListener('blur', validateSubject);
    }

    if (messageInput) {
        messageInput.addEventListener('input', validateMessage);
        messageInput.addEventListener('blur', validateMessage);
    }

    // Form Submission Interception
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Prevent standard browser page reload
            e.preventDefault();

            // Run validation on all fields
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isSubjectValid = validateSubject();
            const isMessageValid = validateMessage();

            // If all fields are valid, execute submission
            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                
                // Show loading state on submit button
                if (submitText && submitIcon) {
                    submitText.textContent = "Sending...";
                    submitIcon.className = "fa-solid fa-spinner fa-spin";
                    submitBtn.style.pointerEvents = "none";
                }

                // Simulate server dispatch delay
                setTimeout(() => {
                    // Restore button state
                    if (submitText && submitIcon) {
                        submitText.textContent = "Send Message";
                        submitIcon.className = "fa-solid fa-paper-plane";
                        submitBtn.style.pointerEvents = "auto";
                    }

                    // Reveal success alert banner
                    if (formAlert) {
                        formAlert.classList.remove('hidden');
                    }

                    // Clear form inputs and reset character counter
                    contactForm.reset();
                    if (charCounter) charCounter.textContent = "0 / 250";

                    // Auto-hide success alert after 5 seconds
                    setTimeout(() => {
                        if (formAlert) formAlert.classList.add('hidden');
                    }, 5000);

                }, 1200);

            } else {
                // Focus on the first invalid field
                if (!isNameValid) nameInput.focus();
                else if (!isEmailValid) emailInput.focus();
                else if (!isSubjectValid) subjectInput.focus();
                else if (!isMessageValid) messageInput.focus();
            }
        });
    }


    /* ==========================================================================
       MODULE 9: DYNAMIC FOOTER YEAR
       Concepts: JavaScript Date API, getFullYear()
       ========================================================================== */
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

});

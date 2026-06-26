document.addEventListener("DOMContentLoaded", () => {
    
    /* ----------------------------------------------------
       LUCIDE ICONS SETUP
    ---------------------------------------------------- */
    if (window.lucide) {
        lucide.createIcons();
    }

    /* ----------------------------------------------------
       CUSTOM PREMIUM CURSOR FOLLOWERS
    ---------------------------------------------------- */
    const cursor = document.getElementById("customCursor");
    const cursorGlow = document.getElementById("customCursorGlow");

    if (cursor && cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let glowX = 0, glowY = 0;

        // Smooth follower speeds
        const speed = 0.25;
        const glowSpeed = 0.12;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Show cursor on first movement
            cursor.style.opacity = "1";
            cursorGlow.style.opacity = "1";
        });

        // Animation Loop
        const updateCursor = () => {
            // Lerp cursor position
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            // Lerp glow position (with more lag for fluid overlay feel)
            glowX += (mouseX - glowX) * glowSpeed;
            glowY += (mouseY - glowY) * glowSpeed;
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;

            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        // Hide when leaving viewport
        document.addEventListener("mouseleave", () => {
            cursor.style.opacity = "0";
            cursorGlow.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            cursor.style.opacity = "1";
            cursorGlow.style.opacity = "1";
        });

        // Toggle hover sizing on interactive links
        const interactiveElements = document.querySelectorAll("a, button, input, textarea, .project-card");
        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursor.classList.add("hover");
                cursorGlow.classList.add("hover");
            });
            el.addEventListener("mouseleave", () => {
                cursor.classList.remove("hover");
                cursorGlow.classList.remove("hover");
            });
        });
    }

    /* ----------------------------------------------------
       SCROLL NAV HIGHLIGHT & PILL INTERACTION
    ---------------------------------------------------- */
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const highlightNav = () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            // Subtract offset to trigger a bit earlier (like mid screen)
            const sectionTop = current.offsetTop - (window.innerHeight * 0.4);
            const sectionId = current.getAttribute("id");
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("data-sec") === sectionId) {
                        link.classList.add("active");
                    }
                });
            }
        });
    };

    window.addEventListener("scroll", highlightNav);
    highlightNav(); // Initial evaluation

    /* ----------------------------------------------------
       SCROLL REVEAL INTERSECTION OBSERVER
    ---------------------------------------------------- */
    const revealElements = document.querySelectorAll(".scroll-reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Once active, we don't need to keep checking it
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of element is in view
        rootMargin: "0px 0px -50px 0px" // Adjusts viewport bounds down slightly
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ----------------------------------------------------
       WORKS GRID FILTER LOGIC
    ---------------------------------------------------- */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".projects-grid > .project-card, .projects-grid > .more-apps-box");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach((card) => {
                const cardCompany = card.getAttribute("data-company");
                
                if (filterValue === "all" || cardCompany === filterValue) {
                    card.classList.remove("hide");
                    // Trigger reflow & visibility
                    card.style.display = "";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 50);
                } else {
                    card.classList.add("hide");
                }
            });
        });
    });

    /* ----------------------------------------------------
       CONTACT FORM VALIDATION & INTERACTIVE HANDLING
    ---------------------------------------------------- */
    const contactForm = document.getElementById("portfolioContactForm");
    const btnSubmit = document.getElementById("btnSubmitForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Visual loading state
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<span>Sending...</span><i class="lucide-refresh-cw animate-spin"></i>`;
            
            // Simulating API latency
            setTimeout(() => {
                const name = document.getElementById("name").value.trim();
                const email = document.getElementById("email").value.trim();
                const message = document.getElementById("message").value.trim();

                console.log("Contact form payload:", { name, email, message });

                // Simple simulated success
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `<span>Send Message</span><i data-lucide="send"></i>`;
                if (window.lucide) lucide.createIcons(); // refresh icon
                
                // Show success UI alert
                formStatus.className = "form-status success";
                formStatus.textContent = `Thank you, ${name}! Your message has been received successfully.`;
                
                // Reset form elements
                contactForm.reset();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.opacity = "0";
                    setTimeout(() => {
                        formStatus.className = "form-status";
                        formStatus.style.opacity = "";
                    }, 300);
                }, 5000);
                
            }, 1200);
        });
    }

});

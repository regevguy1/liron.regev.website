/**
 * Interior Design Studio - Main JavaScript
 * High-performance, RTL-ready interactions
 * With JSON Configuration Support
 */

(function() {
    'use strict';

    // ==========================================================================
    // Configuration
    // ==========================================================================
    let config = null;

    /**
     * Load configuration from JSON file
     */
    async function loadConfig() {
        try {
            const response = await fetch('config.json');
            if (!response.ok) throw new Error('Config not found');
            config = await response.json();
            return config;
        } catch (error) {
            console.warn('Could not load config.json, using default values:', error);
            return null;
        }
    }

    /**
     * Apply configuration to the page
     */
    function applyConfig() {
        if (!config) return;

        // Site metadata
        if (config.site) {
            document.title = config.site.title || document.title;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && config.site.description) {
                metaDesc.setAttribute('content', config.site.description);
            }
        }

        // Designer info & Logo
        if (config.designer) {
            // All logo texts
            document.querySelectorAll('.logo-text').forEach(el => {
                el.textContent = config.designer.name;
            });
            
            // Phone links
            document.querySelectorAll('[data-config="phone"]').forEach(el => {
                el.textContent = config.designer.phone;
                if (el.tagName === 'A') {
                    el.href = `tel:${config.designer.phone.replace(/-/g, '')}`;
                }
            });
            
            // Email links
            document.querySelectorAll('[data-config="email"]').forEach(el => {
                el.textContent = config.designer.email;
                if (el.tagName === 'A') {
                    el.href = `mailto:${config.designer.email}`;
                }
            });
            
            // Address
            document.querySelectorAll('[data-config="address"]').forEach(el => {
                el.textContent = config.designer.address;
            });
        }

        // Social links
        if (config.social) {
            document.querySelectorAll('[data-social="whatsapp"]').forEach(el => {
                el.href = config.social.whatsapp;
            });
            document.querySelectorAll('[data-social="instagram"]').forEach(el => {
                el.href = config.social.instagram;
            });
            document.querySelectorAll('[data-social="facebook"]').forEach(el => {
                el.href = config.social.facebook;
            });
        }

        // Hero section
        if (config.hero) {
            const heroTitle = document.querySelector('[data-config="hero-title"]');
            const heroSubtitle = document.querySelector('[data-config="hero-subtitle"]');
            const heroButton = document.querySelector('[data-config="hero-button"]');
            
            if (heroTitle) heroTitle.textContent = config.hero.title;
            if (heroSubtitle) heroSubtitle.textContent = config.hero.subtitle;
            if (heroButton) heroButton.textContent = config.hero.buttonText;
            
            // Hero images
            if (config.hero.images && config.hero.images.length > 0) {
                const heroSlides = document.querySelectorAll('.hero-slide');
                heroSlides.forEach((slide, index) => {
                    if (config.hero.images[index]) {
                        slide.style.backgroundImage = `url('${config.hero.images[index]}')`;
                    }
                });
            }
        }

        // Intro section
        if (config.intro) {
            const introText = document.querySelector('[data-config="intro-text"]');
            if (introText) introText.innerHTML = config.intro.text;
        }

        // About section
        if (config.about) {
            const aboutTitle = document.querySelector('[data-config="about-title"]');
            const aboutName = document.querySelector('[data-config="about-name"]');
            const aboutImage = document.querySelector('[data-config="about-image"]');
            const aboutButton = document.querySelector('[data-config="about-button"]');
            
            if (aboutTitle) aboutTitle.textContent = config.about.sectionTitle;
            if (aboutName) aboutName.textContent = config.about.name;
            if (aboutImage) {
                aboutImage.src = config.about.image;
                aboutImage.alt = config.designer?.name || 'תמונת המעצבת';
            }
            if (aboutButton) aboutButton.textContent = config.about.buttonText;
            
            // About paragraphs
            const aboutParagraphs = document.querySelectorAll('[data-config="about-paragraph"]');
            aboutParagraphs.forEach((p, index) => {
                if (config.about.paragraphs[index]) {
                    p.textContent = config.about.paragraphs[index];
                }
            });
        }

        // Projects section
        if (config.projects) {
            const projectsTitle = document.querySelector('[data-config="projects-title"]');
            const projectsViewAll = document.querySelector('[data-config="projects-view-all"]');
            
            if (projectsTitle) projectsTitle.textContent = config.projects.sectionTitle;
            if (projectsViewAll) projectsViewAll.textContent = config.projects.viewAllText;
            
            // Project cards
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                const project = config.projects.items[index];
                if (project) {
                    const img = card.querySelector('.project-image img');
                    const title = card.querySelector('.project-title');
                    const desc = card.querySelector('.project-description');
                    const link = card.querySelector('.project-overlay a');
                    
                    if (img) {
                        img.src = project.image;
                        img.alt = project.title;
                    }
                    if (title) title.textContent = project.title;
                    if (desc) desc.textContent = project.description;
                    if (link) {
                        link.href = project.link;
                        link.textContent = config.projects.viewProjectText;
                    }
                }
            });
        }

        // Process section
        if (config.process) {
            const processTitle = document.querySelector('[data-config="process-title"]');
            if (processTitle) processTitle.textContent = config.process.sectionTitle;
            
            const processSteps = document.querySelectorAll('.process-step');
            processSteps.forEach((step, index) => {
                const stepData = config.process.steps[index];
                if (stepData) {
                    const number = step.querySelector('.step-number');
                    const title = step.querySelector('.step-title');
                    const desc = step.querySelector('.step-description');
                    
                    if (number) number.textContent = stepData.number;
                    if (title) title.textContent = stepData.title;
                    if (desc) desc.textContent = stepData.description;
                }
            });
        }

        // Testimonials section
        if (config.testimonials) {
            const testimonialsTitle = document.querySelector('[data-config="testimonials-title"]');
            if (testimonialsTitle) testimonialsTitle.textContent = config.testimonials.sectionTitle;
            
            const testimonialItems = document.querySelectorAll('.testimonial');
            testimonialItems.forEach((item, index) => {
                const testimonial = config.testimonials.items[index];
                if (testimonial) {
                    const text = item.querySelector('.testimonial-text');
                    const author = item.querySelector('.testimonial-author');
                    
                    if (text) text.textContent = testimonial.text;
                    if (author) author.textContent = testimonial.author;
                }
            });
        }

        // Contact section
        if (config.contact) {
            const contactTitle = document.querySelector('[data-config="contact-title"]');
            const contactSubtitle = document.querySelector('[data-config="contact-subtitle"]');
            
            if (contactTitle) contactTitle.textContent = config.contact.sectionTitle;
            if (contactSubtitle) contactSubtitle.textContent = config.contact.subtitle;
            
            // Form labels
            if (config.contact.form) {
                const form = document.getElementById('contact-form');
                if (form) {
                    const nameLabel = form.querySelector('label[for="name"]');
                    const phoneLabel = form.querySelector('label[for="phone"]');
                    const emailLabel = form.querySelector('label[for="email"]');
                    const messageLabel = form.querySelector('label[for="message"]');
                    const submitBtn = form.querySelector('button[type="submit"]');
                    
                    if (nameLabel) nameLabel.textContent = config.contact.form.nameLabel;
                    if (phoneLabel) phoneLabel.textContent = config.contact.form.phoneLabel;
                    if (emailLabel) emailLabel.textContent = config.contact.form.emailLabel;
                    if (messageLabel) messageLabel.textContent = config.contact.form.messageLabel;
                    if (submitBtn) submitBtn.textContent = config.contact.form.submitText;
                }
            }
        }

        // Footer
        if (config.site?.copyright) {
            const copyright = document.querySelector('[data-config="copyright"]');
            if (copyright) copyright.textContent = config.site.copyright;
        }

        if (config.footer?.links) {
            const footerLinks = document.querySelectorAll('[data-config="footer-link"]');
            footerLinks.forEach((link, index) => {
                if (config.footer.links[index]) {
                    link.textContent = config.footer.links[index].text;
                    link.href = config.footer.links[index].href;
                }
            });
        }
    }

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    let header, nav, menuToggle, navLinks, heroSlider, heroSlides, heroIndicators;
    let testimonialsSlider, testimonials, testimonialPrev, testimonialNext, contactForm;

    function cacheElements() {
        header = document.getElementById('header');
        nav = document.getElementById('nav');
        menuToggle = document.getElementById('menu-toggle');
        navLinks = document.querySelectorAll('.nav-link');
        heroSlider = document.getElementById('hero-slider');
        heroSlides = heroSlider?.querySelectorAll('.hero-slide');
        heroIndicators = document.querySelectorAll('.indicator');
        testimonialsSlider = document.getElementById('testimonials-slider');
        testimonials = testimonialsSlider?.querySelectorAll('.testimonial');
        testimonialPrev = document.querySelector('.testimonial-prev');
        testimonialNext = document.querySelector('.testimonial-next');
        contactForm = document.getElementById('contact-form');
    }

    // ==========================================================================
    // State
    // ==========================================================================
    let currentHeroSlide = 0;
    let currentTestimonial = 0;
    let heroSliderInterval;
    let isMenuOpen = false;

    // ==========================================================================
    // Utilities
    // ==========================================================================
    
    /**
     * Debounce function for performance
     */
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    function handleHeaderScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ==========================================================================
    // Mobile Menu
    // ==========================================================================
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('active', isMenuOpen);
        nav.classList.toggle('active', isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ==========================================================================
    // Smooth Scroll Navigation
    // ==========================================================================
    function handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMenu();
                
                // Update active link
                updateActiveLink(href);
            }
        }
    }

    function updateActiveLink(href) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // Active Section Detection
    // ==========================================================================
    function detectActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveLink(`#${sectionId}`);
            }
        });
    }

    // ==========================================================================
    // Hero Slider
    // ==========================================================================
    function showHeroSlide(index) {
        if (!heroSlides || heroSlides.length === 0) return;
        
        // Wrap around
        if (index >= heroSlides.length) index = 0;
        if (index < 0) index = heroSlides.length - 1;
        
        // Update slides
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        // Update indicators
        heroIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        currentHeroSlide = index;
    }

    function nextHeroSlide() {
        showHeroSlide(currentHeroSlide + 1);
    }

    function startHeroSlider() {
        if (heroSlides && heroSlides.length > 1) {
            heroSliderInterval = setInterval(nextHeroSlide, 5000);
        }
    }

    function stopHeroSlider() {
        if (heroSliderInterval) {
            clearInterval(heroSliderInterval);
        }
    }

    // ==========================================================================
    // Testimonials Slider
    // ==========================================================================
    function showTestimonial(index) {
        if (!testimonials || testimonials.length === 0) return;
        
        // Wrap around
        if (index >= testimonials.length) index = 0;
        if (index < 0) index = testimonials.length - 1;
        
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        
        currentTestimonial = index;
    }

    function nextTestimonial() {
        showTestimonial(currentTestimonial + 1);
    }

    function prevTestimonial() {
        showTestimonial(currentTestimonial - 1);
    }

    // ==========================================================================
    // Contact Form
    // ==========================================================================
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Get messages from config or use defaults
        const errorMsg = config?.contact?.form?.errorMessage || 'אנא מלאו את השדות הנדרשים';
        const successMsg = config?.contact?.form?.successMessage || 'תודה! הפרטים התקבלו בהצלחה. ניצור איתך קשר בהקדם.';
        
        // Basic validation
        if (!data.name || !data.phone) {
            alert(errorMsg);
            return;
        }
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        console.log('Form submitted:', data);
        
        // Show success message
        alert(successMsg);
        
        // Reset form
        contactForm.reset();
    }

    // ==========================================================================
    // Intersection Observer for Animations
    // ==========================================================================
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.project-card, .process-step, .about-content, .about-image'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // ==========================================================================
    // Lazy Loading Images
    // ==========================================================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ==========================================================================
    // Keyboard Navigation
    // ==========================================================================
    function handleKeyDown(e) {
        // Close menu on Escape
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    }

    // ==========================================================================
    // Touch Support for Sliders
    // ==========================================================================
    function initTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Hero slider touch support
        if (heroSlider) {
            heroSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopHeroSlider();
            }, { passive: true });
            
            heroSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe('hero');
                startHeroSlider();
            }, { passive: true });
        }
        
        // Testimonials touch support
        if (testimonialsSlider) {
            testimonialsSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            testimonialsSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe('testimonials');
            }, { passive: true });
        }
        
        function handleSwipe(slider) {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            const isRTL = document.dir === 'rtl';
            
            if (Math.abs(diff) > swipeThreshold) {
                // In RTL, swipe directions are reversed
                const isSwipeLeft = isRTL ? diff < 0 : diff > 0;
                
                if (slider === 'hero') {
                    if (isSwipeLeft) {
                        showHeroSlide(currentHeroSlide + 1);
                    } else {
                        showHeroSlide(currentHeroSlide - 1);
                    }
                } else if (slider === 'testimonials') {
                    if (isSwipeLeft) {
                        nextTestimonial();
                    } else {
                        prevTestimonial();
                    }
                }
            }
        }
    }

    // ==========================================================================
    // Performance: requestAnimationFrame for scroll
    // ==========================================================================
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleHeaderScroll();
                detectActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }

    // ==========================================================================
    // Initialize
    // ==========================================================================
    async function init() {
        // Load configuration first
        await loadConfig();
        
        // Cache DOM elements
        cacheElements();
        
        // Apply configuration to the page
        applyConfig();
        
        // Scroll event with throttling
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Initial scroll check
        handleHeaderScroll();
        
        // Mobile menu
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMenu);
        }
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Hero slider indicators
        heroIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopHeroSlider();
                showHeroSlide(index);
                startHeroSlider();
            });
        });
        
        // Start hero slider
        startHeroSlider();
        
        // Testimonials navigation
        if (testimonialNext) {
            testimonialNext.addEventListener('click', nextTestimonial);
        }
        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', prevTestimonial);
        }
        
        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Initialize animations
        initScrollAnimations();
        
        // Initialize lazy loading
        initLazyLoading();
        
        // Initialize touch support
        initTouchSupport();
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        }, 250));
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

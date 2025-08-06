// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    animateSkillBars();
    setupFormSubmission();
    setupSmoothScrolling();
    setupScrollAnimations();
});

// Form submission handler with Formspree integration
function setupFormSubmission() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Set the _replyto field to match the email field
            const emailInput = document.getElementById('email');
            const replyToField = document.getElementById('_replyto');
            if (emailInput && replyToField) {
                replyToField.value = emailInput.value;
            }
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Message Sent!',
                        text: 'Thank you! I will get back to you soon.',
                        confirmButtonColor: '#3498db'
                    });
                    form.reset();
                } else {
                    // Error from Formspree
                    const errorData = await response.json();
                    let errorMessage = 'Something went wrong. Please try again later.';
                    
                    if (errorData.errors) {
                        errorMessage = errorData.errors.map(error => error.message).join(', ');
                    }
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Submission Error',
                        text: errorMessage,
                        confirmButtonColor: '#e74c3c'
                    });
                }
            } catch (error) {
                // Network error
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Check your internet connection and try again.',
                    confirmButtonColor: '#e74c3c'
                });
            }
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
}

// Scroll animations
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check
    checkScroll();
    
    // Check on scroll with debounce
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            checkScroll();
        }, 66);
    }, false);
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
    }
}

// Animate skill bars when they come into view
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                bar.style.width = width;
                observer.unobserve(bar);
            }
        }, {
            threshold: 0.5
        });
        
        observer.observe(bar);
    });
}
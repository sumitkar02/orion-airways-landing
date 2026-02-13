// Flight Search Form Validation
const flightForm = document.querySelector('.flight-search');
const searchInputs = document.querySelectorAll('.input-group input, .input-group select');

if (flightForm) {
    flightForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateFlightSearch()) {
            showNotification('Searching flights...', 'success');
            // Handle flight search logic here
        }
    });
}

function validateFlightSearch() {
    let isValid = true;
    
    searchInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('invalid');
            isValid = false;
        } else {
            input.classList.remove('invalid');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all fields', 'error');
    }
    
    return isValid;
}

// Modern Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.style.opacity = '1', 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Real-time Input Validation with Subtle Feedback
searchInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (!this.value.trim() && this.required) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });
    
    input.addEventListener('focus', function() {
        this.classList.remove('invalid');
    });
});

// Smooth Anchor Navigation
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Subtle Scroll Animation for Cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Trip Type Toggle Enhancement
const tripTypeInputs = document.querySelectorAll('input[name="trip"]');
const returnDateInput = document.querySelector('input[type="date"]:last-of-type');

if (tripTypeInputs.length > 0) {
    tripTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (returnDateInput) {
                returnDateInput.parentElement.style.opacity = this.value === 'return' ? '1' : '0.5';
                returnDateInput.required = !returnDateInput.required;
            }
        });
    });
}

// Mobile Menu Close on Link Click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        // Smooth scroll handles this, but helpful for future mobile menu enhancement
    });
});

// Performance Logging
console.log('%c✈️ Orion Airways Ready', 'color: #667eea; font-size: 14px; font-weight: 600;');
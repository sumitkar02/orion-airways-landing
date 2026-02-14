// Flight Search Form Validation
const flightForm = document.querySelector('.flight-search');
const searchInputs = document.querySelectorAll('.input-group input, .input-group select');
const departInput = document.querySelector('input[type="date"]:nth-of-type(1)');
const returnInput = document.querySelector('input[type="date"]:nth-of-type(2)');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
if (departInput) departInput.min = today;
if (returnInput) returnInput.min = today;

// Validate return date is after depart date
if (departInput && returnInput) {
    departInput.addEventListener('change', function() {
        if (this.value) {
            returnInput.min = this.value;
            if (returnInput.value && returnInput.value < this.value) {
                returnInput.value = '';
            }
        }
    });
}

if (flightForm) {
    flightForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateFlightSearch()) {
            const formData = {
                from: document.querySelector('input[list="departure-cities"]').value,
                to: document.querySelector('input[list="arrival-cities"]').value,
                depart: departInput.value,
                return: returnInput.value,
                passengers: document.querySelector('input[type="number"]').value,
                class: document.querySelector('select').value,
                tripType: document.querySelector('input[name="trip"]:checked').nextElementSibling?.textContent || 'Round Trip'
            };
            
            saveSearchHistory(formData);
            showNotification(`✈️ Searching for ${formData.from.split('-')[0]} → ${formData.to.split('-')[0]} flights...`, 'success');
            console.log('Search Data:', formData);
        }
    });
}

function validateFlightSearch() {
    let isValid = true;
    const errors = [];
    
    searchInputs.forEach(input => {
        const value = input.value.trim();
        
        if (!value) {
            input.classList.add('invalid');
            isValid = false;
            errors.push(`${input.previousElementSibling.textContent} is required`);
        } else {
            input.classList.remove('invalid');
        }
        
        // Validate date fields
        if (input.type === 'date' && value) {
            const selectedDate = new Date(value);
            const todayDate = new Date(today);
            if (selectedDate < todayDate) {
                input.classList.add('invalid');
                isValid = false;
                errors.push(`${input.previousElementSibling.textContent} cannot be in the past`);
            }
        }
    });
    
    // Validate return date is after depart date
    if (departInput && returnInput && departInput.value && returnInput.value) {
        if (new Date(returnInput.value) <= new Date(departInput.value)) {
            returnInput.classList.add('invalid');
            isValid = false;
            errors.push('Return date must be after departure date');
        }
    }
    
    if (!isValid) {
        const errorMsg = errors.length > 1 ? 'Please correct the errors' : errors[0];
        showNotification(errorMsg, 'error');
    }
    
    return isValid;
}

// Search History Management
function saveSearchHistory(searchData) {
    let history = JSON.parse(localStorage.getItem('flightSearchHistory')) || [];
    history.unshift({
        ...searchData,
        timestamp: new Date().toLocaleString()
    });
    history = history.slice(0, 5); // Keep last 5 searches
    localStorage.setItem('flightSearchHistory', JSON.stringify(history));
}

// Modern Notification System with Dynamic Styling
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    
    notification.innerHTML = `
        <span style="font-size: 1.2em; margin-right: 0.5rem;">${icon}</span>
        <span>${message}</span>
    `;
    
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
        transition: opacity 0.3s ease, transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: ${bgColor};
        display: flex;
        align-items: center;
        transform: translateX(400px);
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
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
    
    // Add input event for instant validation feedback
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('invalid');
        }
    });
});

// Smooth Anchor Navigation with Active State
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
                    
                    // Update active state
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    this.classList.add('active');
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
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Trip Type Toggle Enhancement - Show/Hide Return Date
const tripTypeInputs = document.querySelectorAll('input[name="trip"]');
const returnDateGroup = returnInput?.parentElement;

if (tripTypeInputs.length > 0 && returnDateGroup) {
    tripTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            const isRoundTrip = this.checked && this.nextElementSibling?.textContent.includes('Round');
            
            if (isRoundTrip) {
                returnDateGroup.style.opacity = '1';
                returnDateGroup.style.pointerEvents = 'auto';
                returnInput.required = true;
            } else {
                returnDateGroup.style.opacity = '0.5';
                returnDateGroup.style.pointerEvents = 'none';
                returnInput.required = false;
                returnInput.value = '';
                returnInput.classList.remove('invalid');
            }
        });
    });
    
    // Initialize
    const roundTripChecked = document.querySelector('input[name="trip"]:checked');
    if (roundTripChecked && !roundTripChecked.nextElementSibling?.textContent.includes('Round')) {
        returnDateGroup.style.opacity = '0.5';
        returnDateGroup.style.pointerEvents = 'none';
        returnInput.required = false;
    }
}

// Mobile Menu Close on Link Click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        // Future enhancement for mobile navigation
    });
});

// Add CSS for invalid input states
const style = document.createElement('style');
style.textContent = `
    .input-group input.invalid,
    .input-group select.invalid {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .nav-links a.active {
        background-color: rgba(102, 126, 234, 0.3);
        border-bottom: 2px solid #667eea;
    }
`;
document.head.appendChild(style);

// Dynamic Passenger Counter
const passengerInput = document.querySelector('input[type="number"]');
if (passengerInput) {
    passengerInput.addEventListener('input', function() {
        if (this.value > 9) this.value = 9;
        if (this.value < 1) this.value = 1;
    });
}

// Performance Logging
console.log('%c✈️ Orion Airways Ready', 'color: #667eea; font-size: 14px; font-weight: 600;');
console.log('%cFeatures: Flight Search, Smart Validation, Search History', 'color: #667eea; font-size: 12px;');

/**
 * MANNY KASHTO WEBSITE - MAIN JAVASCRIPT
 * Minimal, vanilla JavaScript for navigation, form validation, and calculators
 */

(function () {
    'use strict';

    // ===================================
    // MOBILE NAVIGATION TOGGLE
    // ===================================
    function initMobileNav() {
        const navToggle = document.querySelector('.nav__toggle');
        const nav = document.querySelector('.nav');

        if (!navToggle || !nav) return;

        navToggle.addEventListener('click', function () {
            nav.classList.toggle('nav--open');

            // Update aria-expanded for accessibility
            const isOpen = nav.classList.contains('nav--open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile nav when clicking a link
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('nav--open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function (event) {
            if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
                nav.classList.remove('nav--open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ===================================
    // ACTIVE NAVIGATION LINK
    // ===================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav__link');

        navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('nav__link--active');
            }
        });
    }

    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===================================
    // FORM VALIDATION
    // ===================================
    function initFormValidation() {
        const form = document.querySelector('.form');
        if (!form) return;

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Phone validation regex (flexible format)
        const phoneRegex = /^[\d\s\-\(\)\.]+$/;

        form.addEventListener('submit', function (e) {
            let isValid = true;

            // Clear previous errors
            const errorGroups = form.querySelectorAll('.form__group--error');
            errorGroups.forEach(function (group) {
                group.classList.remove('form__group--error');
            });

            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(function (field) {
                const formGroup = field.closest('.form__group');
                const errorElement = formGroup.querySelector('.form__error');

                if (!field.value.trim()) {
                    isValid = false;
                    formGroup.classList.add('form__group--error');
                    if (errorElement) {
                        errorElement.textContent = 'This field is required';
                    }
                }
            });

            // Validate email
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const formGroup = emailField.closest('.form__group');
                const errorElement = formGroup.querySelector('.form__error');

                if (!emailRegex.test(emailField.value.trim())) {
                    isValid = false;
                    formGroup.classList.add('form__group--error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                    }
                }
            }

            // Validate phone
            const phoneField = form.querySelector('input[type="tel"]');
            if (phoneField && phoneField.value.trim()) {
                const formGroup = phoneField.closest('.form__group');
                const errorElement = formGroup.querySelector('.form__error');
                const phoneValue = phoneField.value.trim();

                if (!phoneRegex.test(phoneValue) || phoneValue.replace(/\D/g, '').length < 10) {
                    isValid = false;
                    formGroup.classList.add('form__group--error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid phone number';
                    }
                }
            }

            if (!isValid) {
                e.preventDefault();

                // Scroll to first error
                const firstError = form.querySelector('.form__group--error');
                if (firstError) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const errorPosition = firstError.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: errorPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });

        // Real-time validation on blur
        const inputs = form.querySelectorAll('.form__input, .form__textarea');
        inputs.forEach(function (input) {
            input.addEventListener('blur', function () {
                const formGroup = this.closest('.form__group');
                const errorElement = formGroup.querySelector('.form__error');

                // Clear error state
                formGroup.classList.remove('form__group--error');

                // Check if required and empty
                if (this.hasAttribute('required') && !this.value.trim()) {
                    formGroup.classList.add('form__group--error');
                    if (errorElement) {
                        errorElement.textContent = 'This field is required';
                    }
                    return;
                }

                // Validate email
                if (this.type === 'email' && this.value.trim() && !emailRegex.test(this.value.trim())) {
                    formGroup.classList.add('form__group--error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                    }
                }

                // Validate phone
                if (this.type === 'tel' && this.value.trim()) {
                    const phoneValue = this.value.trim();
                    if (!phoneRegex.test(phoneValue) || phoneValue.replace(/\D/g, '').length < 10) {
                        formGroup.classList.add('form__group--error');
                        if (errorElement) {
                            errorElement.textContent = 'Please enter a valid phone number';
                        }
                    }
                }
            });
        });
    }

    // ===================================
    // MORTGAGE CALCULATORS
    // ===================================
    function initMortgageCalculators() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.calculator__tab');
        const tabPanels = document.querySelectorAll('.calculator__panel');

        tabButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const targetTab = this.getAttribute('data-tab');

                // Update tab buttons
                tabButtons.forEach(function (btn) {
                    btn.classList.remove('calculator__tab--active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('calculator__tab--active');
                this.setAttribute('aria-selected', 'true');

                // Update panels
                tabPanels.forEach(function (panel) {
                    panel.classList.remove('calculator__panel--active');
                });
                document.getElementById('tab-' + targetTab).classList.add('calculator__panel--active');
            });

            // Keyboard navigation
            button.addEventListener('keydown', function (e) {
                let index = Array.from(tabButtons).indexOf(this);

                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    index = (index + 1) % tabButtons.length;
                    tabButtons[index].click();
                    tabButtons[index].focus();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    index = (index - 1 + tabButtons.length) % tabButtons.length;
                    tabButtons[index].click();
                    tabButtons[index].focus();
                }
            });
        });

        // Helper: Calculate monthly payment
        function calculateMonthlyPayment(principal, annualRate, years) {
            const monthlyRate = annualRate / 100 / 12;
            const numPayments = years * 12;

            if (monthlyRate === 0) {
                return principal / numPayments;
            }

            const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
            return payment;
        }

        // Helper: Format currency
        function formatCurrency(value) {
            return '$' + Math.round(value).toLocaleString('en-US');
        }

        // Helper: Format percentage
        function formatPercentage(value) {
            return value.toFixed(2) + '%';
        }

        // Helper: Validate input
        function validateInput(input) {
            const value = parseFloat(input.value);
            const min = parseFloat(input.getAttribute('min'));
            const max = parseFloat(input.getAttribute('max'));
            const errorElement = document.getElementById(input.id + '-error');

            if (isNaN(value) || value < min || (max && value > max)) {
                input.closest('.form__group').classList.add('form__group--error');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid number';
                }
                return false;
            }

            input.closest('.form__group').classList.remove('form__group--error');
            if (errorElement) {
                errorElement.textContent = '';
            }
            return true;
        }

        // Monthly Payments Calculator
        const monthlyForm = document.getElementById('form-monthly');
        if (monthlyForm) {
            monthlyForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const price = document.getElementById('monthly-price');
                const downPercent = document.getElementById('monthly-down');
                const rate = document.getElementById('monthly-rate');
                const term = document.getElementById('monthly-term');

                // Validate all inputs
                const isValid = validateInput(price) && validateInput(downPercent) &&
                    validateInput(rate) && validateInput(term);

                if (!isValid) return;

                // Calculate
                const homePrice = parseFloat(price.value);
                const downPaymentPercent = parseFloat(downPercent.value);
                const interestRate = parseFloat(rate.value);
                const loanTerm = parseInt(term.value);

                const downPayment = homePrice * (downPaymentPercent / 100);
                const loanAmount = homePrice - downPayment;
                const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
                const totalPayments = monthlyPayment * loanTerm * 12;
                const totalInterest = totalPayments - loanAmount;

                // Display results
                document.getElementById('result-monthly-payment').textContent = formatCurrency(monthlyPayment);
                document.getElementById('result-monthly-loan').textContent = formatCurrency(loanAmount);
                document.getElementById('result-monthly-downpayment').textContent = formatCurrency(downPayment);
                document.getElementById('result-monthly-interest').textContent = formatCurrency(totalInterest);
                document.getElementById('results-monthly').style.display = 'block';
            });
        }

        // 3-2-1 Buydown Calculator
        const buydownForm = document.getElementById('form-buydown');
        if (buydownForm) {
            buydownForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const amountInput = document.getElementById('buydown-amount');
                const rateInput = document.getElementById('buydown-rate');
                const termInput = document.getElementById('buydown-term');

                // Validate all inputs
                const isValid = validateInput(amountInput) &&
                    validateInput(rateInput) && validateInput(termInput);

                if (!isValid) return;

                // Calculate
                const loanAmount = parseFloat(amountInput.value);
                const noteRate = parseFloat(rateInput.value);
                const loanTerm = parseInt(termInput.value);

                // Calculate rates ensuring they don't go below 0
                const rate1 = Math.max(0, noteRate - 3);
                const rate2 = Math.max(0, noteRate - 2);
                const rate3 = Math.max(0, noteRate - 1);
                const rate4 = noteRate;

                // Calculate payments for each year
                const year1Payment = calculateMonthlyPayment(loanAmount, rate1, loanTerm);
                const year2Payment = calculateMonthlyPayment(loanAmount, rate2, loanTerm);
                const year3Payment = calculateMonthlyPayment(loanAmount, rate3, loanTerm);
                const year4Payment = calculateMonthlyPayment(loanAmount, rate4, loanTerm);

                // Display results
                document.getElementById('result-buydown-year1').textContent = formatCurrency(year1Payment);
                document.getElementById('result-buydown-year2').textContent = formatCurrency(year2Payment);
                document.getElementById('result-buydown-year3').textContent = formatCurrency(year3Payment);
                document.getElementById('result-buydown-year4').textContent = formatCurrency(year4Payment);

                // Display rates
                if (document.getElementById('result-buydown-rate1')) {
                    document.getElementById('result-buydown-rate1').textContent = formatPercentage(rate1);
                    document.getElementById('result-buydown-rate2').textContent = formatPercentage(rate2);
                    document.getElementById('result-buydown-rate3').textContent = formatPercentage(rate3);
                    document.getElementById('result-buydown-rate4').textContent = formatPercentage(rate4);
                }

                document.getElementById('results-buydown').style.display = 'block';
            });
        }

        // Cost of Waiting Calculator
        const waitingForm = document.getElementById('form-waiting');
        if (waitingForm) {
            waitingForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const priceInput = document.getElementById('waiting-price');
                const dateInput = document.getElementById('waiting-date');
                const appreciationInput = document.getElementById('waiting-appreciation');
                const rateInput = document.getElementById('waiting-rate');
                const futureRateInput = document.getElementById('waiting-future-rate');
                const downInput = document.getElementById('waiting-down');

                // Validate Date
                const now = new Date();
                const futureParts = dateInput.value.split('-'); // YYYY-MM
                let monthsDiff = 0;

                if (futureParts.length === 2) {
                    const futureYear = parseInt(futureParts[0]);
                    const futureMonth = parseInt(futureParts[1]) - 1; // 0-11
                    monthsDiff = (futureYear - now.getFullYear()) * 12 + (futureMonth - now.getMonth());
                }

                if (monthsDiff <= 0) {
                    dateInput.closest('.form__group').classList.add('form__group--error');
                    const err = document.getElementById('waiting-date-error');
                    if (err) err.textContent = 'Date must be in the future';
                    return;
                } else {
                    dateInput.closest('.form__group').classList.remove('form__group--error');
                    const err = document.getElementById('waiting-date-error');
                    if (err) err.textContent = '';
                }

                // Validate other inputs
                const isValid = validateInput(priceInput) && validateInput(appreciationInput) &&
                    validateInput(rateInput) && validateInput(futureRateInput) &&
                    validateInput(downInput);

                if (!isValid) return;

                // Calculate
                const currentPrice = parseFloat(priceInput.value);
                const appreciation = parseFloat(appreciationInput.value);
                const currentRate = parseFloat(rateInput.value);
                const futureRate = parseFloat(futureRateInput.value);
                const downPercent = parseFloat(downInput.value);

                // Future Price = P * (1 + r/100)^(months/12)
                const futurePrice = currentPrice * Math.pow(1 + appreciation / 100, monthsDiff / 12);

                // Loans
                const loanNow = currentPrice * (1 - downPercent / 100);
                const loanFuture = futurePrice * (1 - downPercent / 100);

                // Payments (30 years default)
                const paymentNow = calculateMonthlyPayment(loanNow, currentRate, 30);
                const paymentFuture = calculateMonthlyPayment(loanFuture, futureRate, 30);

                const diff = paymentFuture - paymentNow;

                // Display results
                document.getElementById('result-waiting-future-price').textContent = formatCurrency(futurePrice);

                document.getElementById('result-waiting-loan-now').textContent = formatCurrency(loanNow);
                document.getElementById('result-waiting-loan-future').textContent = formatCurrency(loanFuture);

                document.getElementById('result-waiting-payment-now').textContent = formatCurrency(paymentNow);
                document.getElementById('result-waiting-payment-future').textContent = formatCurrency(paymentFuture);

                const diffFormatted = formatCurrency(Math.abs(diff));
                const sign = diff >= 0 ? '+' : '-';
                const diffElement = document.getElementById('result-waiting-diff');
                diffElement.textContent = sign + diffFormatted + '/mo';

                if (diff > 0) {
                    diffElement.style.color = '#dc2626'; // Red
                } else {
                    diffElement.style.color = '#16a34a'; // Green
                }

                document.getElementById('results-waiting').style.display = 'block';
            });
        }

        // Reset buttons
        const resetButtons = document.querySelectorAll('.calculator__reset');
        resetButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const formName = this.getAttribute('data-form');
                const form = document.getElementById('form-' + formName);
                const results = document.getElementById('results-' + formName);

                if (form) {
                    form.reset();
                    // Clear any error states
                    form.querySelectorAll('.form__group--error').forEach(function (group) {
                        group.classList.remove('form__group--error');
                    });
                }

                if (results) {
                    results.style.display = 'none';
                }
            });
        });
    }

    // ===================================
    // INITIALIZE ALL FUNCTIONS
    // ===================================
    function init() {
        initMobileNav();
        setActiveNavLink();
        initSmoothScroll();
        initFormValidation();
        initMortgageCalculators();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

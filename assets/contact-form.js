document.addEventListener('DOMContentLoaded', function () {
    // --- Elements ---
    const mortgageTypeSelect = document.getElementById('mortgage-type');
    const purchaseFields = document.getElementById('purchase-fields');
    const refinanceFields = document.getElementById('refinance-fields');

    // Purchase Inputs
    const purchaseValInput = document.getElementById('purchase-property-value');
    const purchaseValSlider = document.getElementById('purchase-property-value-slider');
    const purchaseDownInput = document.getElementById('purchase-down-payment');
    const purchaseDownDisplay = document.getElementById('purchase-down-payment-display');
    const purchaseScoreInput = document.getElementById('purchase-credit-score');
    const purchaseScoreSlider = document.getElementById('purchase-credit-score-slider');

    // Refinance Inputs
    const refiValInput = document.getElementById('refinance-property-value');
    const refiValSlider = document.getElementById('refinance-property-value-slider');
    const refiLoanBalInput = document.getElementById('refinance-loan-balance');
    const refiLtvDisplay = document.getElementById('refinance-ltv-display');
    const refiCashOutInput = document.getElementById('refinance-cash-out');
    const refiCashOutLtvDisplay = document.getElementById('refinance-cash-out-ltv-display');
    const refiIncomeInput = document.getElementById('refinance-income');
    const refiIncomeSlider = document.getElementById('refinance-income-slider');
    const refiScoreInput = document.getElementById('refinance-credit-score');
    const refiScoreSlider = document.getElementById('refinance-credit-score-slider');


    // --- 1. Toggle Workflow Sections ---
    mortgageTypeSelect.addEventListener('change', function () {
        const value = this.value;
        if (value === 'purchase') {
            purchaseFields.classList.remove('hidden');
            refinanceFields.classList.add('hidden');
        } else if (value === 'refinance') {
            purchaseFields.classList.add('hidden');
            refinanceFields.classList.remove('hidden');
        } else {
            purchaseFields.classList.add('hidden');
            refinanceFields.classList.add('hidden');
        }
    });


    // --- 2. Helper Functions ---

    // Format Number with Commas
    function formatNumber(num) {
        if (!num) return '';
        // Remove existing commas first to ensure clean parsing
        const cleanNum = num.toString().replace(/,/g, '');
        return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Strip Commas for Calculations
    function cleanNumber(str) {
        if (!str) return 0;
        return parseFloat(str.toString().replace(/,/g, '')) || 0;
    }

    // Auto-Format Inputs
    const moneyInputs = document.querySelectorAll('.js-format-money');
    moneyInputs.forEach(input => {
        input.addEventListener('input', function () {
            // Remove non-digit characters except maybe decimal?
            // For simplicity in this context, we assume integers as per sliders, but let's allow basic digit/comma handling.
            // Actually, best user experience is to strip everything non-numeric, then re-format.
            let value = this.value.replace(/[^0-9]/g, '');
            this.value = formatNumber(value);
        });
    });

    // Sync Input <-> Slider
    function syncInputSlider(input, slider) {
        // When input changes, update slider
        input.addEventListener('input', function () {
            slider.value = cleanNumber(this.value);
        });
        // When slider changes, update input
        slider.addEventListener('input', function () {
            // Format with commas when setting from slider
            input.value = formatNumber(this.value);
            // Trigger input event on the input field so calculations update manually
            input.dispatchEvent(new Event('input'));
        });
    }

    // Calculate Percentage: (Part / Total) * 100
    function updatePercentageDisplay(partInput, totalInput, displayElement, prefixText = "") {
        const part = cleanNumber(partInput.value);
        const total = cleanNumber(totalInput.value);

        let percent = 0;
        if (total > 0) {
            percent = (part / total) * 100;
        }

        displayElement.textContent = `${prefixText} ${percent.toFixed(2)}%`;
    }

    // --- 3. Purchase Logic ---

    // Sync Sliders
    syncInputSlider(purchaseValInput, purchaseValSlider);
    syncInputSlider(purchaseScoreInput, purchaseScoreSlider);

    // Calculate Down Payment %
    // Listen to both Property Value and Down Payment inputs
    function updatePurchaseCalc() {
        updatePercentageDisplay(purchaseDownInput, purchaseValInput, purchaseDownDisplay, "Down Payment:");
    }
    purchaseValInput.addEventListener('input', updatePurchaseCalc);
    purchaseDownInput.addEventListener('input', updatePurchaseCalc);


    // --- 4. Refinance Logic ---

    // Sync Sliders
    syncInputSlider(refiValInput, refiValSlider);
    syncInputSlider(refiIncomeInput, refiIncomeSlider);
    syncInputSlider(refiScoreInput, refiScoreSlider);

    // Calculate LTVs
    function updateRefiCalc() {
        const val = cleanNumber(refiValInput.value);
        const balance = cleanNumber(refiLoanBalInput.value);
        const cashOut = cleanNumber(refiCashOutInput.value);

        let ltv1 = 0;
        let ltv2 = 0;

        if (val > 0) {
            ltv1 = (balance / val) * 100;
            ltv2 = ((balance + cashOut) / val) * 100;
        }

        refiLtvDisplay.textContent = `Loan to value: ${ltv1.toFixed(2)}%`;
        refiCashOutLtvDisplay.textContent = `Loan to value: ${ltv2.toFixed(2)}%`;
    }

    refiValInput.addEventListener('input', updateRefiCalc);
    refiLoanBalInput.addEventListener('input', updateRefiCalc);
    refiCashOutInput.addEventListener('input', updateRefiCalc);

    // --- 5. Form Submission (Google Sheets) ---
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwp4e6uChTm01JEvnJj0vJ_76gmv-tGGuLzl-o_8gWa99Yeb-8Q03Zx80dq1MBYkgc/exec';
    const form = document.querySelector('#contact-form');
    const submitButton = form.querySelector('button[type="submit"]');

    // Modal Elements
    const successModal = document.getElementById('success-modal');
    const closeModalX = document.getElementById('close-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Close Modal Functions
    function closeModal() {
        if (successModal) successModal.classList.add('hidden');
    }

    if (closeModalX) closeModalX.addEventListener('click', closeModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    // Close on click outside
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) closeModal();
        });
    }

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            // UI: Show "Sending..." state
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Create a new FormData to hold the normalized data
            let body = new FormData();

            // Add common fields
            body.append('Name', form.querySelector('[name="name"]').value);
            body.append('Email', form.querySelector('[name="email"]').value);
            body.append('Phone', form.querySelector('[name="phone"]').value || '');
            body.append('Message', form.querySelector('[name="message"]').value || '');

            const mType = mortgageTypeSelect.value;
            body.append('Mortgage Type', mType);

            // Add workflow-specific fields
            if (mType === 'purchase') {
                body.append('Property Type', document.getElementById('purchase-property-type').value);
                body.append('Decision Process', document.getElementById('purchase-decision-process').value);
                body.append('Residency Usage', document.getElementById('purchase-residency-usage').value);
                body.append('State', document.getElementById('purchase-state').value);
                body.append('Zip', document.getElementById('purchase-zip').value);
                body.append('Property Value', document.getElementById('purchase-property-value').value);
                body.append('Down Payment', document.getElementById('purchase-down-payment').value);
                body.append('Income', document.getElementById('purchase-income').value);
                body.append('Credit Score', document.getElementById('purchase-credit-score').value);
                body.append('Military', document.getElementById('purchase-military').value);
            } else if (mType === 'refinance') {
                body.append('Property Type', document.getElementById('refinance-property-type').value);
                body.append('Decision Process', document.getElementById('refinance-decision-process').value);
                body.append('Residency Usage', document.getElementById('refinance-residency-usage').value);
                body.append('State', document.getElementById('refinance-state').value);
                body.append('Zip', document.getElementById('refinance-zip').value);
                body.append('Property Value', document.getElementById('refinance-property-value').value);
                // Refi doesn't have Down Payment, so we can leave it empty or skip
                body.append('Down Payment', 'N/A');
                body.append('Income', document.getElementById('refinance-income').value);
                body.append('Credit Score', document.getElementById('refinance-credit-score').value);
                body.append('Military', document.getElementById('refinance-military').value);
            }

            // 1. Fire the request in the background (Optimistic Approach)
            fetch(scriptURL, { method: 'POST', body: body })
                .then(response => {
                    if (!response.ok) console.error('Background submission failed:', response.statusText);
                })
                .catch(error => console.error('Background submission error:', error));

            // 2. Show Success Modal instantly (50ms) to feel immediate
            setTimeout(() => {
                // Reset UI
                submitButton.disabled = false;
                submitButton.textContent = originalText;

                form.reset();
                // Reset hidden/shown fields to default
                purchaseFields.classList.add('hidden');
                refinanceFields.classList.add('hidden');

                // Show Success Modal
                if (successModal) successModal.classList.remove('hidden');
            }, 50);
        });
    }

});

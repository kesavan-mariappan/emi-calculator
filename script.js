let emiChart; // Variable to hold the chart instance

// Function to format number with Indian numbering system
function formatIndianCurrency(num) {
    if (num === undefined || num === null || isNaN(num)) {
        return '';
    }
     const roundedNum = Math.round(num);
     return roundedNum.toLocaleString('en-IN');
}

// Function to update the slider's track fill based on its value
function updateSliderTrack(slider) {
     const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
     slider.style.setProperty('--value', percentage + '%');
}


// Function to calculate and display EMI and other details
function calculateEMI() {
    // Get input values from the NUMBER INPUTS (as they can be directly edited)
    const loanAmount = parseFloat(document.getElementById('loanAmountInput').value);
    const interestRate = parseFloat(document.getElementById('interestRateInput').value);
    const loanTenureYears = parseFloat(document.getElementById('loanTenureInput').value);
    const loanTenureMonths = loanTenureYears * 12; // Convert years to months

    // Get references to sliders and value displays for synchronization
    const loanAmountSlider = document.getElementById('loanAmountSlider');
    const loanAmountValueDisplay = document.getElementById('loanAmountValue');
    const interestRateSlider = document.getElementById('interestRateSlider');
    const interestRateValueDisplay = document.getElementById('interestRateValue');
    const loanTenureSlider = document.getElementById('loanTenureSlider');
    const loanTenureValueDisplay = document.getElementById('loanTenureValue');


    // Get elements where results will be displayed
    const monthlyEmiResultElement = document.getElementById('monthlyEmiResult');
    const principalAmountResultElement = document.getElementById('principalAmountResult');
    const totalInterestResultElement = document.getElementById('totalInterestResult');
    const totalAmountResultElement = document.getElementById('totalAmountResult');
    const chartContainer = document.querySelector('.chart-container');


    // Basic validation
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenureMonths) || loanAmount <= 0 || interestRate < 0 || loanTenureMonths <= 0) {
        monthlyEmiResultElement.textContent = '₹ Invalid Input';
        principalAmountResultElement.textContent = '₹ Invalid Input';
        totalInterestResultElement.textContent = '₹ Invalid Input';
        totalAmountResultElement.textContent = '₹ Invalid Input';

        monthlyEmiResultElement.style.color = 'red';
         principalAmountResultElement.style.color = '#333';
         totalInterestResultElement.style.color = '#333';
         totalAmountResultElement.style.color = '#333';

        chartContainer.style.display = 'none';

        return;
    } else {
         // Update value displays and slider positions from the number inputs
        loanAmountValueDisplay.textContent = formatIndianCurrency(loanAmount);
        loanAmountSlider.value = loanAmount; // Sync slider
        updateSliderTrack(loanAmountSlider); // Update slider track fill

        interestRateValueDisplay.textContent = interestRate.toFixed(1); // Display with one decimal
        interestRateSlider.value = interestRate; // Sync slider
         updateSliderTrack(interestRateSlider); // Update slider track fill

        loanTenureValueDisplay.textContent = loanTenureYears; // Display as whole number
        loanTenureSlider.value = loanTenureYears; // Sync slider
         updateSliderTrack(loanTenureSlider); // Update slider track fill

        // Set color for results back to default if input is valid
        monthlyEmiResultElement.style.color = '#4CAF50'; // Green color for EMI
        principalAmountResultElement.style.color = '#000';
        totalInterestResultElement.style.color = '#000';
        totalAmountResultElement.style.color = '#000';
        chartContainer.style.display = 'block'; // Show chart container
    }

    // Convert annual interest rate to monthly and percentage to decimal
    const monthlyInterestRate = (interestRate / 100) / 12;

    // Calculate EMI
    let emi;
    if (monthlyInterestRate === 0) {
        emi = loanAmount / loanTenureMonths;
    } else {
        emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureMonths) / (Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1);
    }

    // Calculate total amount and total interest
    const totalAmountPaid = emi * loanTenureMonths;
    const totalInterest = totalAmountPaid - loanAmount;

    // Display the results with formatting
    monthlyEmiResultElement.textContent = '₹' + formatIndianCurrency(emi);
    principalAmountResultElement.textContent = '₹' + formatIndianCurrency(loanAmount);
    totalInterestResultElement.textContent = '₹' + formatIndianCurrency(totalInterest);
    totalAmountResultElement.textContent = '₹' + formatIndianCurrency(totalAmountPaid);


    // --- Chart.js Implementation ---

    const ctx = document.getElementById('emiPieChart').getContext('2d');

    if (emiChart) {
        emiChart.destroy();
    }

    emiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Total Interest'],
            datasets: [{
                data: [loanAmount, totalInterest > 0 ? totalInterest : 0], // Ensure interest is not negative for chart
                backgroundColor: [
                    '#2193b0',
                    '#e67e22'
                ],
                borderColor: [
                    '#ffffff',
                    '#ffffff'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                 tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                             // Format tooltip value as currency
                            return label + ': ₹' + formatIndianCurrency(value);
                        }
                    }
                }
            },
            cutout: '70%',
             animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}

// Get references to input elements (sliders and number inputs) and value displays
const loanAmountSlider = document.getElementById('loanAmountSlider');
const loanAmountInput = document.getElementById('loanAmountInput');
const loanAmountValueDisplay = document.getElementById('loanAmountValue');

const interestRateSlider = document.getElementById('interestRateSlider');
const interestRateInput = document.getElementById('interestRateInput');
const interestRateValueDisplay = document.getElementById('interestRateValue');

const loanTenureSlider = document.getElementById('loanTenureSlider');
const loanTenureInput = document.getElementById('loanTenureInput');
const loanTenureValueDisplay = document.getElementById('loanTenureValue');


// --- Event Listeners for Synchronization ---

// When slider is moved, update number input and value display, then calculate
loanAmountSlider.addEventListener('input', function() {
    loanAmountInput.value = this.value; // Sync number input
    loanAmountValueDisplay.textContent = formatIndianCurrency(this.value); // Update value display
    updateSliderTrack(this); // Update slider track fill
    calculateEMI(); // Recalculate
});

interestRateSlider.addEventListener('input', function() {
    interestRateInput.value = this.value; // Sync number input
    interestRateValueDisplay.textContent = parseFloat(this.value).toFixed(1); // Update value display
     updateSliderTrack(this); // Update slider track fill
    calculateEMI(); // Recalculate
});

loanTenureSlider.addEventListener('input', function() {
    loanTenureInput.value = this.value; // Sync number input
    loanTenureValueDisplay.textContent = this.value; // Update value display
     updateSliderTrack(this); // Update slider track fill
    calculateEMI(); // Recalculate
});

// When number input is changed, update slider and value display, then calculate
loanAmountInput.addEventListener('input', function() {
    // Basic validation to stay within slider range
    let value = parseFloat(this.value);
    if (isNaN(value) || value < parseFloat(this.min)) value = parseFloat(this.min);
    if (value > parseFloat(this.max)) value = parseFloat(this.max);
    this.value = value; // Correct the input value if outside range

    loanAmountSlider.value = this.value; // Sync slider
    loanAmountValueDisplay.textContent = formatIndianCurrency(this.value); // Update value display
     updateSliderTrack(loanAmountSlider); // Update slider track fill
    calculateEMI(); // Recalculate
});

interestRateInput.addEventListener('input', function() {
     // Basic validation
    let value = parseFloat(this.value);
    if (isNaN(value) || value < parseFloat(this.min)) value = parseFloat(this.min);
    if (value > parseFloat(this.max)) value = parseFloat(this.max);
    this.value = value;

    interestRateSlider.value = this.value; // Sync slider
    interestRateValueDisplay.textContent = parseFloat(this.value).toFixed(1); // Update value display
     updateSliderTrack(interestRateSlider); // Update slider track fill
    calculateEMI(); // Recalculate
});

loanTenureInput.addEventListener('input', function() {
     // Basic validation
    let value = parseInt(this.value); // Parse as integer
     if (isNaN(value) || value < parseInt(this.min)) value = parseInt(this.min);
    if (value > parseInt(this.max)) value = parseInt(this.max);
    this.value = value;

    loanTenureSlider.value = this.value; // Sync slider
    loanTenureValueDisplay.textContent = this.value; // Update value display
     updateSliderTrack(loanTenureSlider); // Update slider track fill
    calculateEMI(); // Recalculate
});


// Initial calculation and display on page load, and update slider tracks
document.addEventListener('DOMContentLoaded', function() {
    // Initial calculation
    calculateEMI();

    // Update slider tracks on load
    updateSliderTrack(loanAmountSlider);
    updateSliderTrack(interestRateSlider);
    updateSliderTrack(loanTenureSlider);
});

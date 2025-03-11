// Fundraising functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    const adminButtons = document.querySelectorAll('.admin-only');
    adminButtons.forEach(button => {
        button.style.display = isAdmin ? 'block' : 'none';
    });
});

// Handle contribution initiation
function initiateContribution(campaignName) {
    const modal = document.getElementById('contributionModal');
    const campaignTitle = document.getElementById('campaignTitle');
    campaignTitle.textContent = campaignName;
    modal.style.display = 'block';
}

// Handle M-Pesa payment
async function handleContribution(event) {
    event.preventDefault();
    
    const amount = document.getElementById('amount').value;
    const phone = document.getElementById('phone').value;
    
    try {
        // Show loading state
        const submitButton = event.target.querySelector('button');
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        // Call Daraja API
        const response = await initiateMpesaPayment(phone, amount);
        
        if (response.ResponseCode === '0') {
            alert('Please check your phone for the STK push and enter your M-Pesa PIN');
            // Close modal after successful initiation
            document.getElementById('contributionModal').style.display = 'none';
        } else {
            alert('Failed to initiate payment. Please try again.');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
        console.error('Payment error:', error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Proceed to Pay';
    }
}

// Daraja API integration
async function initiateMpesaPayment(phone, amount) {
    const DARAJA_API_URL = 'YOUR_BACKEND_ENDPOINT';
    
    try {
        const response = await fetch(DARAJA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: phone,
                amount: amount
            })
        });
        
        return await response.json();
    } catch (error) {
        throw new Error('Failed to initiate payment');
    }
} 
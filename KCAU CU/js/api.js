// API endpoints
const API_ENDPOINTS = {
    campaignStats: '/api/campaign-stats',
    mpesa: '/api/mpesa/initiate',
    paypal: '/api/paypal/initiate',
    websocket: 'wss://your-websocket-server.com'
};

// Campaign data handling
class CampaignAPI {
    static async getCampaignStats() {
        try {
            const response = await fetch(API_ENDPOINTS.campaignStats);
            if (!response.ok) {
                throw new Error('Failed to fetch campaign stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching campaign stats:', error);
            // Return demo data for development
            return {
                amountRaised: 120000,
                goalAmount: 200000,
                contributorCount: 142
            };
        }
    }

    static async initiateMpesaPayment(amount, phone) {
        try {
            const response = await fetch(API_ENDPOINTS.mpesa, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, phone })
            });
            
            if (!response.ok) {
                throw new Error('Failed to initiate M-Pesa payment');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error initiating M-Pesa payment:', error);
            throw error;
        }
    }

    static async initiatePaypalPayment(amount) {
        try {
            const response = await fetch(API_ENDPOINTS.paypal, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });
            
            if (!response.ok) {
                throw new Error('Failed to initiate PayPal payment');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error initiating PayPal payment:', error);
            throw error;
        }
    }
}

// WebSocket connection handling
class WebSocketManager {
    constructor() {
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(API_ENDPOINTS.websocket);
        
        this.ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed. Reconnecting...');
            setTimeout(() => this.connect(), 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'campaign_update') {
                    this.handleCampaignUpdate(data);
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };
    }

    handleCampaignUpdate(data) {
        // Update UI elements
        const amountRaised = document.getElementById('amount-raised');
        const goalPercentage = document.getElementById('goal-percentage');
        const contributorCount = document.getElementById('contributor-count');
        const progressBar = document.getElementById('progress-bar');

        if (amountRaised && goalPercentage && contributorCount && progressBar) {
            const percentage = (data.amountRaised / data.goalAmount) * 100;
            
            amountRaised.textContent = `Ksh ${data.amountRaised.toLocaleString()}`;
            goalPercentage.textContent = `${Math.round(percentage)}%`;
            contributorCount.textContent = data.contributorCount;
            progressBar.style.width = `${percentage}%`;

            // Add animation class for smooth transition
            progressBar.style.transition = 'width 0.5s ease-in-out';
        }
    }
}

// Initialize WebSocket connection
const wsManager = new WebSocketManager();

// Export for use in other files
export { CampaignAPI, WebSocketManager }; 
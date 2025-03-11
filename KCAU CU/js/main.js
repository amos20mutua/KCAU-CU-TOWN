document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    // Debug line to check if script is loading
    console.log('Script loaded');

    // Initialize navigation
    initializeNavigation();
    
    // Show dashboard by default
    showSection('dashboard');
    
    // Load initial dashboard data
    loadDashboardData();

    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Debug line to check if nav links are found
    console.log('Found nav links:', navLinks.length);

    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Debug line to check if click is working
            console.log('Link clicked:', this.dataset.section);

            // Remove active class from all links
            navLinks.forEach(link => link.parentElement.classList.remove('active'));
            // Add active class to clicked link
            this.parentElement.classList.add('active');

            // Show the corresponding section
            showSection(this.dataset.section);
        });
    });

    // Add modal close handlers
    document.querySelectorAll('.modal').forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Add click handlers to all stats cards
    document.querySelectorAll('.stats-card').forEach(card => {
        card.addEventListener('click', function() {
            // Get the section to show from the data-section attribute
            const sectionToShow = this.getAttribute('data-section');
            console.log('Card clicked:', sectionToShow); // Debug line
            
            if (sectionToShow) {
                // Hide all sections first
                document.querySelectorAll('.content-section').forEach(section => {
                    section.style.display = 'none';
                });

                // Show the selected section
                const targetSection = document.getElementById(sectionToShow);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    
                    // Update navigation active state
                    document.querySelectorAll('.nav-links li').forEach(li => {
                        li.classList.remove('active');
                    });
                    document.querySelector(`.nav-links a[data-section="${sectionToShow}"]`)
                        ?.parentElement.classList.add('active');
                }
            }
        });
    });

    // Add click handlers to navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            console.log('Nav link clicked:', section); // Debug line

            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });

            // Show selected section
            const selectedSection = document.getElementById(section);
            if (selectedSection) {
                selectedSection.style.display = 'block';
            }

            // Update active state
            document.querySelectorAll('.nav-links li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });

    // Show dashboard by default
    document.getElementById('dashboard').style.display = 'block';

    // Add hover effect to cards
    document.querySelectorAll('.stats-card').forEach(card => {
        card.style.cursor = 'pointer';
    });

    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    
    // Update active state in navigation
    updateActiveNav(currentPage);
    
    // Initialize page-specific functionality
    initializePage(currentPage);
});

function initializeNavigation() {
    // Handle main navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            updateActiveNav(this);
        });
    });

    // Handle dashboard card clicks
    document.querySelectorAll('.stats-card').forEach(card => {
        card.addEventListener('click', function() {
            const section = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(section);
            updateActiveNav(document.querySelector(`[data-section="${section}"]`));
        });
    });
}

function updateActiveNav(currentPage) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
    });
    
    // Add active class to current page's nav item
    const activeLink = document.querySelector(`.nav-links a[href*="${currentPage}"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add('active');
    }
}

function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        
        // Load section specific content
        switch(sectionId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'teams':
                loadTeams();
                break;
            case 'events':
                loadEvents();
                break;
            case 'fundraising':
                loadFundraising();
                break;
            case 'messages':
                loadMessages();
                break;
        }
    }
}

function loadDashboardData() {
    // Load recent activities
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = `
            <div class="activity-item">
                <i class="fas fa-pray"></i>
                <div class="activity-details">
                    <h4>Sunday Service</h4>
                    <p>Tomorrow at 10:00 AM</p>
                </div>
            </div>
            <div class="activity-item">
                <i class="fas fa-users"></i>
                <div class="activity-details">
                    <h4>New Team Member</h4>
                    <p>John Doe joined Praise & Worship</p>
                </div>
            </div>
        `;
    }

    // Update stats numbers (replace with actual data later)
    updateDashboardStats();
}

function updateDashboardStats() {
    // This function will update the numbers on dashboard cards
    // For now using static numbers, replace with API data later
    const stats = {
        teams: 5,
        events: 3,
        fundraising: 2,
        messages: 5
    };

    // Update each stat card
    Object.keys(stats).forEach(key => {
        const card = document.querySelector(`.stats-card[onclick="showSection('${key}')"] .stats-info p`);
        if (card) {
            switch(key) {
                case 'teams':
                    card.textContent = `${stats[key]} Active Teams`;
                    break;
                case 'events':
                    card.textContent = `${stats[key]} Upcoming Events`;
                    break;
                case 'fundraising':
                    card.textContent = `${stats[key]} Active Campaigns`;
                    break;
                case 'messages':
                    card.textContent = `${stats[key]} New Messages`;
                    break;
            }
        }
    });
}

// Mock data (replace with API calls later)
const mockData = {
    teams: [
        { id: 1, name: 'Praise & Worship', members: 25, leader: 'John Doe' },
        { id: 2, name: 'Ushering', members: 15, leader: 'Jane Smith' },
        { id: 3, name: 'Media', members: 10, leader: 'Mike Johnson' }
    ],
    events: [
        { id: 1, name: 'Sunday Service', date: '2024-03-15', time: '10:00', location: 'Main Chapel' },
        { id: 2, name: 'Bible Study', date: '2024-03-17', time: '14:00', location: 'Room 201' }
    ],
    fundraising: [
        { id: 1, title: 'Mission Trip 2024', target: 100000, current: 50000, deadline: '2024-04-01' },
        { id: 2, title: 'Church Building', target: 500000, current: 200000, deadline: '2024-06-01' }
    ]
};

function loadSectionContent(sectionId) {
    switch(sectionId) {
        case 'teams':
            loadTeams();
            break;
        case 'events':
            loadEvents();
            break;
        case 'fundraising':
            loadFundraising();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'achievements':
            loadAchievements();
            break;
    }
}

function loadTeams() {
    const teamsGrid = document.querySelector('.teams-grid');
    if (!teamsGrid) return;

    teamsGrid.innerHTML = mockData.teams.map(team => `
        <div class="team-card" data-team-id="${team.id}">
            <div class="team-header">
                <i class="fas fa-users"></i>
                <h3>${team.name}</h3>
            </div>
            <div class="team-info">
                <p>Members: <span>${team.members}</span></p>
                <p>Leader: ${team.leader}</p>
            </div>
            <div class="team-actions">
                <button class="btn-join" onclick="joinTeam(${team.id})">Join Team</button>
                <button class="btn-view-members" onclick="viewTeamMembers(${team.id})">View Members</button>
            </div>
        </div>
    `).join('');
}

function loadEvents() {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = mockData.events.map(event => `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-date">
                <span class="day">${new Date(event.date).getDate()}</span>
                <span class="month">${new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div class="event-details">
                <h3>${event.name}</h3>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-location-dot"></i> ${event.location}</p>
                <button class="btn-attend" onclick="attendEvent(${event.id})">Attend</button>
            </div>
        </div>
    `).join('');
}

function loadFundraising() {
    const fundraisingGrid = document.querySelector('.fundraising-grid');
    if (!fundraisingGrid) return;

    fundraisingGrid.innerHTML = mockData.fundraising.map(campaign => `
        <div class="campaign-card" data-campaign-id="${campaign.id}">
            <h3>${campaign.title}</h3>
            <div class="progress-container">
                <div class="progress-stats">
                    <span>KES ${campaign.current.toLocaleString()} raised of KES ${campaign.target.toLocaleString()}</span>
                    <span>${Math.round((campaign.current/campaign.target)*100)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${(campaign.current/campaign.target)*100}%"></div>
                </div>
            </div>
            <div class="campaign-details">
                <p>Deadline: ${new Date(campaign.deadline).toLocaleDateString()}</p>
                <button class="btn-contribute" onclick="contribute(${campaign.id})">Contribute Now</button>
            </div>
        </div>
    `).join('');
}

function loadMessages() {
    const messagesContainer = document.querySelector('.messages-container');
    // Add messages loading logic here
}

function loadAchievements() {
    const achievementsGrid = document.querySelector('.achievements-grid');
    // Add achievements loading logic here
}

function initializeUI() {
    // Show/hide elements based on authentication
    const token = localStorage.getItem('token');
    document.querySelectorAll('.auth-required').forEach(el => {
        el.style.display = token ? 'block' : 'none';
    });
}

function addEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await API.login(email, password);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert('Login failed. Please try again.');
            }
        });
    }

    // Team creation
    const createTeamForm = document.getElementById('createTeamForm');
    if (createTeamForm) {
        createTeamForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const teamData = {
                name: document.getElementById('teamName').value,
                description: document.getElementById('teamDescription').value,
                category: document.getElementById('teamCategory').value
            };
            
            try {
                await API.createTeam(teamData);
                location.reload();
            } catch (error) {
                alert('Failed to create team. Please try again.');
            }
        });
    }

    // Contribution buttons
    document.querySelectorAll('.btn-contribute').forEach(button => {
        button.addEventListener('click', async (e) => {
            const campaignId = e.target.dataset.campaignId;
            const amount = prompt('Enter contribution amount:');
            if (amount) {
                try {
                    await API.contribute(campaignId, parseFloat(amount));
                    alert('Thank you for your contribution!');
                } catch (error) {
                    alert('Contribution failed. Please try again.');
                }
            }
        });
    });

    // Message sending
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageData = {
                content: document.getElementById('messageContent').value,
                recipient: document.getElementById('messageRecipient').value
            };
            
            try {
                await API.sendMessage(messageData);
                messageForm.reset();
                alert('Message sent successfully!');
            } catch (error) {
                alert('Failed to send message. Please try again.');
            }
        });
    }
}

async function loadInitialData() {
    if (!localStorage.getItem('token')) return;

    try {
        // Load fundraising campaigns
        const campaigns = await API.getFundraisingCampaigns();
        displayCampaigns(campaigns);

        // Load messages
        const messages = await API.getMessages();
        displayMessages(messages);
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

function displayCampaigns(campaigns) {
    const campaignsContainer = document.querySelector('.active-campaigns');
    if (!campaignsContainer) return;

    campaignsContainer.innerHTML = campaigns.map(campaign => `
        <div class="campaign-card" id="campaign-${campaign._id}">
            <h3>${campaign.title}</h3>
            <div class="progress-container">
                <div class="progress-stats">
                    KES ${campaign.current} raised of KES ${campaign.target} goal
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${(campaign.current/campaign.target)*100}%"></div>
                </div>
            </div>
            <button class="btn-contribute" data-campaign-id="${campaign._id}">
                Contribute Now
            </button>
        </div>
    `).join('');
}

function displayMessages(messages) {
    const messagesList = document.querySelector('.messages-list');
    if (!messagesList) return;

    messagesList.innerHTML = messages.map(message => `
        <div class="message-item" data-id="${message._id}">
            <h4>${message.subject}</h4>
            <p>${message.sender}</p>
            <span>${new Date(message.timestamp).toLocaleString()}</span>
        </div>
    `).join('');
}

// Action functions
function joinTeam(teamId) {
    const currentTeam = localStorage.getItem('currentTeam');
    if (currentTeam) {
        if (currentTeam === teamId.toString()) {
            if (confirm('Do you want to leave this team?')) {
                localStorage.removeItem('currentTeam');
                alert('You have left the team');
                loadTeams(); // Reload teams to update UI
            }
        } else {
            alert('You are already a member of another team. Please leave your current team first.');
        }
    } else {
        if (confirm('Do you want to join this team?')) {
            localStorage.setItem('currentTeam', teamId);
            alert('You have joined the team!');
            loadTeams(); // Reload teams to update UI
        }
    }
}

function viewTeamMembers(teamId) {
    const team = mockData.teams.find(t => t.id === teamId);
    if (!team) return;

    alert(`Viewing members of ${team.name}\nThis feature will show a modal with team members list.`);
}

function attendEvent(eventId) {
    const event = mockData.events.find(e => e.id === eventId);
    if (!event) return;

    alert(`You are registered for: ${event.name}`);
}

function contribute(campaignId) {
    const campaign = mockData.fundraising.find(c => c.id === campaignId);
    if (!campaign) return;

    const amount = prompt(`Enter amount to contribute to ${campaign.title}:`);
    if (amount && !isNaN(amount)) {
        alert(`Thank you for contributing KES ${amount} to ${campaign.title}`);
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function initializePage(page) {
    switch(page) {
        case 'teams':
            initializeTeamsPage();
            break;
        case 'events':
            initializeEventsPage();
            break;
        case 'fundraising':
            initializeFundraisingPage();
            break;
        case 'messages':
            initializeMessagesPage();
            break;
        default:
            // Dashboard or other pages
            break;
    }
}

/* Add these styles to your main.css */
.stats-card {
    background: var(--white);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none; /* Remove underline from links */
    color: inherit; /* Keep text color */
}

.stats-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    background-color: #f8f9fa;
}

.stats-icon {
    width: 50px;
    height: 50px;
    background: var(--kca-blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stats-icon i {
    font-size: 24px;
    color: var(--white);
}

.stats-info h3 {
    margin: 0;
    color: var(--kca-blue);
}

.stats-info p {
    margin: 5px 0 0;
    color: #666;
}

function checkAuth() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login.html';
} 
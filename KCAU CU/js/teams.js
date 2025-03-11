document.addEventListener('DOMContentLoaded', function() {
    // Debug line to verify script is loading
    console.log('Teams script loaded');

    // Get DOM elements
    const joinButtons = document.querySelectorAll('.btn-join');
    const viewMembersButtons = document.querySelectorAll('.btn-view-members');
    const modal = document.getElementById('membersModal');
    const closeModal = document.querySelector('.close-modal');
    const modalTeamName = document.getElementById('modalTeamName');
    const membersList = document.getElementById('membersList');
    const currentTeamSpan = document.getElementById('currentTeam');

    // Debug line to verify elements are found
    console.log('Join buttons found:', joinButtons.length);
    console.log('View members buttons found:', viewMembersButtons.length);

    // Simulated team data
    const teams = {
        praise: {
            name: 'Praise & Worship',
            members: [
                { name: 'John Doe', role: 'Leader' },
                { name: 'Mary Jane', role: 'Member' },
                { name: 'Peter Smith', role: 'Member' }
            ]
        }
        // Add other teams here
    };

    let currentUserTeam = null;

    // Add click events to join buttons
    joinButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Join button clicked'); // Debug line
            const teamName = this.getAttribute('data-team');
            
            if (currentUserTeam) {
                if (currentUserTeam === teamName) {
                    // Leave team
                    currentUserTeam = null;
                    currentTeamSpan.textContent = 'None';
                    this.textContent = 'Join Team';
                    this.classList.remove('leave');
                } else {
                    alert('You can only be in one team at a time. Please leave your current team first.');
                }
            } else {
                // Join team
                currentUserTeam = teamName;
                currentTeamSpan.textContent = teams[teamName].name;
                this.textContent = 'Leave Team';
                this.classList.add('leave');
            }
        });
    });

    // Add click events to view members buttons
    viewMembersButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('View members button clicked'); // Debug line
            const teamName = this.getAttribute('data-team');
            showMembers(teamName);
        });
    });

    // Close modal when clicking X
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function showMembers(teamName) {
        if (!teams[teamName]) return;

        modalTeamName.textContent = `${teams[teamName].name} Team Members`;
        membersList.innerHTML = '';

        teams[teamName].members.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'member-item';
            memberDiv.innerHTML = `
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <p>${member.role}</p>
                </div>
            `;
            membersList.appendChild(memberDiv);
        });

        modal.style.display = 'block';
    }
}); 
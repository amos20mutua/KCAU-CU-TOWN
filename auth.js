// Basic session management
const auth = {
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    login() {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    },

    logout() {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    },

    checkAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
}; 

// Add to index.html, teams.html, events.html, etc.
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '../login.html';
        return;
    }
}); 
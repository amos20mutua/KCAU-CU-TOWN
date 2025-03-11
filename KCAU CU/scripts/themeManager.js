class ThemeColors {
    constructor() {
        this.colors = {
            blue: {
                main: '#2563eb',
                light: '#60a5fa',
                dark: '#1d4ed8',
                rgb: '37, 99, 235'
            },
            purple: {
                main: '#7c3aed',
                light: '#a78bfa',
                dark: '#6d28d9',
                rgb: '124, 58, 237'
            },
            green: {
                main: '#16a34a',
                light: '#4ade80',
                dark: '#15803d',
                rgb: '22, 163, 74'
            },
            orange: {
                main: '#ea580c',
                light: '#fb923c',
                dark: '#c2410c',
                rgb: '234, 88, 12'
            },
            red: {
                main: '#dc2626',
                light: '#f87171',
                dark: '#b91c1c',
                rgb: '220, 38, 38'
            }
        };

        this.init();
    }

    init() {
        // Create and append the color picker
        this.createColorPicker();
        
        // Load saved color
        const savedColor = localStorage.getItem('themeColor') || 'blue';
        this.setColor(savedColor);

        // Set up event listeners
        this.setupListeners();
    }

    createColorPicker() {
        const picker = document.createElement('div');
        picker.className = 'theme-color-picker';
        picker.innerHTML = `
            <div class="color-picker-button">
                <i class="fas fa-palette"></i>
            </div>
            <div class="color-picker-dropdown">
                <div class="color-picker-header">Choose Theme Color</div>
                <div class="color-options">
                    ${Object.entries(this.colors).map(([name, color]) => `
                        <button class="color-option ${name}" 
                                data-color="${name}"
                                style="background-color: ${color.main}">
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(picker);
    }

    setColor(colorName) {
        const color = this.colors[colorName];
        if (!color) return;

        const root = document.documentElement;
        root.style.setProperty('--primary-color', color.main);
        root.style.setProperty('--primary-light', color.light);
        root.style.setProperty('--primary-dark', color.dark);
        root.style.setProperty('--primary-rgb', color.rgb);

        localStorage.setItem('themeColor', colorName);

        // Update active state in picker
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.color === colorName);
        });
    }

    setupListeners() {
        // Toggle color picker
        const button = document.querySelector('.color-picker-button');
        const dropdown = document.querySelector('.color-picker-dropdown');

        button.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        // Color selection
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                const color = option.dataset.color;
                this.setColor(color);
                dropdown.classList.remove('show');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-color-picker')) {
                dropdown.classList.remove('show');
            }
        });
    }
}

// Add this to your console
getComputedStyle(document.documentElement).getPropertyValue('--primary-color');

class AuthManager {
    constructor() {
        this.supabase = supabase;
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.checkSession();
        this.setupAuthListeners();
    }

    async checkSession() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            
            if (error) throw error;
            
            if (!user) {
                // No active session, redirect to login
                this.redirectToLogin();
                return;
            }

            this.currentUser = user;
            this.updateUIWithUserInfo(user);

        } catch (error) {
            console.error('Session check error:', error);
            this.redirectToLogin();
        }
    }

    setupAuthListeners() {
        // Listen for auth state changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                this.handleSignOut();
            } else if (event === 'SIGNED_IN') {
                this.handleSignIn(session.user);
            }
        });

        // Setup logout button listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogout() {
        try {
            // Show confirmation dialog
            const confirmed = await this.showConfirmationDialog(
                'Logout Confirmation',
                'Are you sure you want to log out?'
            );

            if (!confirmed) return;

            // Show loading state
            this.showLoadingState();

            // Clear all stored data
            this.clearLocalStorage();
            
            // Sign out from Supabase
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            // Show success message
            NotificationManager.show('Successfully logged out', 'success');

            // Redirect to login page
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1000);

        } catch (error) {
            console.error('Logout error:', error);
            NotificationManager.show('Error logging out', 'error');
            this.hideLoadingState();
        }
    }

    showConfirmationDialog(title, message) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'confirmation-dialog';
            dialog.innerHTML = `
                <div class="confirmation-content">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="confirmation-actions">
                        <button class="btn-secondary" data-action="cancel">Cancel</button>
                        <button class="btn-primary" data-action="confirm">Logout</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            // Add event listeners
            dialog.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                dialog.remove();
                resolve(false);
            });

            dialog.querySelector('[data-action="confirm"]').addEventListener('click', () => {
                dialog.remove();
                resolve(true);
            });
        });
    }

    showLoadingState() {
        const loader = document.createElement('div');
        loader.className = 'fullscreen-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>Logging out...</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoadingState() {
        const loader = document.querySelector('.fullscreen-loader');
        if (loader) {
            loader.remove();
        }
    }

    clearLocalStorage() {
        // Clear all auth-related items from localStorage
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('themeColor');
        localStorage.removeItem('user-settings');
        // Add any other items that need to be cleared
    }

    redirectToLogin() {
        const currentPath = window.location.pathname;
        const loginPath = '/login.html';
        
        if (currentPath !== loginPath) {
            // Store the current path to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', currentPath);
            window.location.href = loginPath;
        }
    }

    handleSignIn(user) {
        this.currentUser = user;
        this.updateUIWithUserInfo(user);
    }

    handleSignOut() {
        this.currentUser = null;
        this.redirectToLogin();
    }

    updateUIWithUserInfo(user) {
        // Update user info in the UI
        const userNameElements = document.querySelectorAll('.user-name');
        const userEmailElements = document.querySelectorAll('.user-email');
        const userAvatarElements = document.querySelectorAll('.user-avatar');

        userNameElements.forEach(el => {
            el.textContent = user.user_metadata.full_name || 'User';
        });

        userEmailElements.forEach(el => {
            el.textContent = user.email;
        });

        userAvatarElements.forEach(el => {
            el.src = user.user_metadata.avatar_url || '/images/default-avatar.png';
        });
    }
} 
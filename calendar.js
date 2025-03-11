let currentDate = new Date();
let events = [];

document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    checkAdminStatus();
});

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    document.getElementById('currentMonth').textContent = 
        new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
    
    const calendarDates = document.getElementById('calendarDates');
    calendarDates.innerHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarDates.appendChild(createDateCell());
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const cell = createDateCell(day);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if there's an event on this date
        const event = events.find(e => e.date === dateStr);
        if (event) {
            cell.classList.add('has-event');
            if (event.poster) {
                cell.classList.add('has-poster');
                cell.style.backgroundImage = `url(${event.poster})`;
            }
            cell.addEventListener('click', () => showEventDetails(event));
        }
        
        calendarDates.appendChild(cell);
    }
}

function createDateCell(day = '') {
    const cell = document.createElement('div');
    cell.className = 'calendar-date';
    cell.textContent = day;
    return cell;
}

async function handleAddEvent(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const posterFile = document.getElementById('eventPoster').files[0];
    
    if (posterFile) {
        // Handle poster upload
        // You'll need to implement file upload functionality
    }
    
    // Add event to calendar
    events.push({
        title: formData.get('eventTitle'),
        date: formData.get('eventDate'),
        time: formData.get('eventTime'),
        description: formData.get('eventDescription'),
        poster: posterFile ? URL.createObjectURL(posterFile) : null
    });
    
    renderCalendar();
    document.getElementById('addEventModal').style.display = 'none';
}

function checkAdminStatus() {
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
} 
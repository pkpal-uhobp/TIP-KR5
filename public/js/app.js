/**
 * Frontend JavaScript for Countdown Timer Application
 */

// API Base URL
const API_URL = '/api/timers';

// Active timer intervals
const timerIntervals = {};

/**
 * Format time from seconds to HH:MM:SS
 */
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format date to readable format
 */
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU');
}

/**
 * Load and display all timers
 */
async function loadTimers(queryParams = '') {
    try {
        const url = queryParams ? `${API_URL}?${queryParams}` : API_URL;
        const response = await fetch(url);
        const result = await response.json();
        
        const timersList = document.getElementById('timersList');
        
        if (!result.success || result.count === 0) {
            timersList.innerHTML = '<p class="no-timers">Нет таймеров для отображения.</p>';
            return;
        }
        
        timersList.innerHTML = '';
        result.data.forEach(timer => {
            displayTimer(timer);
        });
        
    } catch (error) {
        console.error('Error loading timers:', error);
        alert('Ошибка при загрузке таймеров');
    }
}

/**
 * Display a single timer
 */
function displayTimer(timer) {
    const timersList = document.getElementById('timersList');
    
    const now = Date.now();
    const remaining = Math.max(0, timer.endTime - now);
    const isActive = remaining > 0;
    
    const timerCard = document.createElement('div');
    timerCard.className = `timer-card ${isActive ? 'active' : 'completed'}`;
    timerCard.id = `timer-${timer.id}`;
    
    timerCard.innerHTML = `
        <div class="timer-header">
            <h3 class="timer-name">${timer.name}</h3>
            <span class="timer-status ${isActive ? 'status-active' : 'status-completed'}">
                ${isActive ? 'Активен' : 'Завершён'}
            </span>
        </div>
        <div class="timer-display" id="display-${timer.id}">
            ${formatTime(remaining / 1000)}
        </div>
        <div class="timer-info">
            <div><strong>Длительность:</strong> ${timer.duration} сек</div>
            <div><strong>Создан:</strong> ${formatDate(timer.createdAt)}</div>
        </div>
        <div class="timer-actions">
            <button class="btn btn-danger btn-sm" onclick="deleteTimer(${timer.id})">Удалить</button>
        </div>
    `;
    
    timersList.appendChild(timerCard);
    
    // Start countdown if timer is active
    if (isActive) {
        startCountdown(timer.id, timer.endTime);
    }
}

/**
 * Start countdown for a timer
 */
function startCountdown(timerId, endTime) {
    // Clear any existing interval for this timer
    if (timerIntervals[timerId]) {
        clearInterval(timerIntervals[timerId]);
    }
    
    timerIntervals[timerId] = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        
        const displayElement = document.getElementById(`display-${timerId}`);
        if (displayElement) {
            displayElement.textContent = formatTime(remaining / 1000);
            
            // If timer finished, update the UI
            if (remaining === 0) {
                clearInterval(timerIntervals[timerId]);
                delete timerIntervals[timerId];
                
                const timerCard = document.getElementById(`timer-${timerId}`);
                if (timerCard) {
                    timerCard.classList.remove('active');
                    timerCard.classList.add('completed');
                    
                    const statusElement = timerCard.querySelector('.timer-status');
                    if (statusElement) {
                        statusElement.className = 'timer-status status-completed';
                        statusElement.textContent = 'Завершён';
                    }
                }
                
                // Play sound or show notification (optional)
                console.log(`Timer ${timerId} completed!`);
            }
        } else {
            // Timer element removed, clear interval
            clearInterval(timerIntervals[timerId]);
            delete timerIntervals[timerId];
        }
    }, 100); // Update every 100ms for smooth countdown
}

/**
 * Create a new timer
 */
async function createTimer(event) {
    event.preventDefault();
    
    const name = document.getElementById('timerName').value;
    const duration = parseInt(document.getElementById('timerDuration').value);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, duration })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear form
            document.getElementById('createTimerForm').reset();
            
            // Reload timers
            loadTimers();
        } else {
            alert('Ошибка: ' + result.error);
        }
    } catch (error) {
        console.error('Error creating timer:', error);
        alert('Ошибка при создании таймера');
    }
}

/**
 * Delete a timer
 */
async function deleteTimer(id) {
    if (!confirm('Вы уверены, что хотите удалить этот таймер?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear interval if exists
            if (timerIntervals[id]) {
                clearInterval(timerIntervals[id]);
                delete timerIntervals[id];
            }
            
            // Reload timers
            loadTimers();
        } else {
            alert('Ошибка: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting timer:', error);
        alert('Ошибка при удалении таймера');
    }
}

/**
 * Delete all timers
 */
async function deleteAllTimers() {
    if (!confirm('Вы уверены, что хотите удалить ВСЕ таймеры?')) {
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear all intervals
            Object.keys(timerIntervals).forEach(id => {
                clearInterval(timerIntervals[id]);
            });
            
            // Reload timers
            loadTimers();
        } else {
            alert('Ошибка: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting all timers:', error);
        alert('Ошибка при удалении таймеров');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load timers on page load
    loadTimers();
    
    // Setup form submission
    document.getElementById('createTimerForm').addEventListener('submit', createTimer);
});

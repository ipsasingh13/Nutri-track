// Initialize meals array
let meals = JSON.parse(localStorage.getItem('meals')) || [];
let currentUser = localStorage.getItem('currentUser') || null;

// API endpoint
const API_URL = 'http://localhost:5000/api';

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Register function
async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const msgEl = document.getElementById('regMsg');

    if (!name || !email || !password) {
        showMessage(msgEl, 'Please fill all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            showMessage(msgEl, 'Registration successful! Please login.', 'success');
            document.getElementById('regName').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
        } else {
            showMessage(msgEl, 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        showMessage(msgEl, 'Error: Make sure backend is running on localhost:5000', 'error');
    }
}

// Login function
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const msgEl = document.getElementById('loginMsg');

    if (!email || !password) {
        showMessage(msgEl, 'Please fill all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = email;
            localStorage.setItem('currentUser', email);
            localStorage.setItem('token', data.token);
            showMessage(msgEl, 'Login successful!', 'success');
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        } else {
            showMessage(msgEl, 'Invalid email or password', 'error');
        }
    } catch (error) {
        showMessage(msgEl, 'Error: Make sure backend is running on localhost:5000', 'error');
    }
}

// Add meal function
async function addMeal() {
    const name = document.getElementById('mealName').value;
    const calories = parseFloat(document.getElementById('calories').value);
    const protein = parseFloat(document.getElementById('protein').value);
    const carbs = parseFloat(document.getElementById('carbs').value);
    const fats = parseFloat(document.getElementById('fats').value);
    const msgEl = document.getElementById('mealMsg');

    if (!name || !calories) {
        showMessage(msgEl, 'Please fill meal name and calories', 'error');
        return;
    }

    const meal = {
        id: Date.now(),
        name,
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fats: fats || 0,
        date: new Date().toLocaleDateString(),
        user: currentUser || 'Guest'
    };

    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));

    showMessage(msgEl, 'Meal added successfully!', 'success');
    document.getElementById('mealName').value = '';
    document.getElementById('calories').value = '';
    document.getElementById('protein').value = '';
    document.getElementById('carbs').value = '';
    document.getElementById('fats').value = '';

    displayMeals();

    // Try to save to backend if available
    if (currentUser) {
        try {
            await fetch(`${API_URL}/meals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId: currentUser, ...meal })
            });
        } catch (error) {
            console.log('Backend not available, using local storage');
        }
    }
}

// Display meals
function displayMeals() {
    const mealsList = document.getElementById('mealsList');
    const todayMeals = meals.filter(m => m.date === new Date().toLocaleDateString());

    if (todayMeals.length === 0) {
        mealsList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No meals added yet</p>';
    } else {
        mealsList.innerHTML = todayMeals.map(meal => `
            <div class="meal-card">
                <h4>${meal.name}</h4>
                <p>📊 Calories: ${meal.calories} kcal</p>
                <p>🥩 Protein: ${meal.protein}g</p>
                <p>🍞 Carbs: ${meal.carbs}g</p>
                <p>🧈 Fats: ${meal.fats}g</p>
                <button onclick="deleteMeal(${meal.id})" style="margin-top: 0.5rem; padding: 5px 10px; background: #ef4444; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
            </div>
        `).join('');
    }

    displayTotalStats(todayMeals);
}

// Display total statistics
function displayTotalStats(todayMeals) {
    const totalStats = document.getElementById('totalStats');
    const totals = {
        calories: todayMeals.reduce((sum, m) => sum + m.calories, 0),
        protein: todayMeals.reduce((sum, m) => sum + m.protein, 0),
        carbs: todayMeals.reduce((sum, m) => sum + m.carbs, 0),
        fats: todayMeals.reduce((sum, m) => sum + m.fats, 0)
    };

    totalStats.innerHTML = `
        <div class="stat-item">
            <h5>${totals.calories.toFixed(1)}</h5>
            <p>Total Calories</p>
        </div>
        <div class="stat-item">
            <h5>${totals.protein.toFixed(1)}g</h5>
            <p>Total Protein</p>
        </div>
        <div class="stat-item">
            <h5>${totals.carbs.toFixed(1)}g</h5>
            <p>Total Carbs</p>
        </div>
        <div class="stat-item">
            <h5>${totals.fats.toFixed(1)}g</h5>
            <p>Total Fats</p>
        </div>
    `;
}

// Delete meal
function deleteMeal(id) {
    meals = meals.filter(m => m.id !== id);
    localStorage.setItem('meals', JSON.stringify(meals));
    displayMeals();
}

// Show message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
        element.className = 'message';
    }, 3000);
}

// Scroll to app
function scrollToApp() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    displayMeals();
    
    // Update user info if logged in
    if (currentUser) {
        console.log('Logged in as:', currentUser);
    }
});
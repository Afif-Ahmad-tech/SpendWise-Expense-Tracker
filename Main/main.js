document.addEventListener("DOMContentLoaded", function () {
    // Retrieve stored expenses and incomes from local storage (or use empty arrays if none exist)
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];

    // Function to update the charts and recent expenses section
    function updateChartsAndExpenses() {
        // Update Income/Expense Chart (Pie)
        const incomeExpenseChart = document.getElementById("incomeExpenseChart").getContext("2d");
        const incomeExpenseData = [
            incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0),
            expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
        ];

        // Destroy existing chart to avoid error of reusing the canvas
        if (window.incomeExpenseChartInstance) {
            window.incomeExpenseChartInstance.destroy();
        }

        window.incomeExpenseChartInstance = new Chart(incomeExpenseChart, {
            type: "pie",
            data: {
                labels: ["Income", "Expense"],
                datasets: [{
                    data: incomeExpenseData,
                    backgroundColor: ["#4caf50", "#f44336"],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" }
                }
            }
        });

        // Update Team Spending Trend (Line Chart)
        const teamSpendingTrendChart = document.getElementById("teamSpendingTrend").getContext("2d");
        const spendingData = expenses.map(expense => parseFloat(expense.amount));

        // Destroy existing chart to avoid error of reusing the canvas
        if (window.teamSpendingTrendChartInstance) {
            window.teamSpendingTrendChartInstance.destroy();
        }

        window.teamSpendingTrendChartInstance = new Chart(teamSpendingTrendChart, {
            type: "line",
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"], // Modify as needed
                datasets: [{
                    label: "Team Spending Trend",
                    data: spendingData,
                    fill: false,
                    borderColor: "#6200ea",
                    tension: 0.1
                }]
            },
            options: { responsive: true }
        });

        // Update Day-to-Day Expenses (Bar Chart)
        const dayToDayExpensesChart = document.getElementById("dayToDayExpenses").getContext("2d");
        const dayToDayData = [50, 75, 100, 60, 90]; // Modify as needed

        // Destroy existing chart to avoid error of reusing the canvas
        if (window.dayToDayExpensesChartInstance) {
            window.dayToDayExpensesChartInstance.destroy();
        }

        window.dayToDayExpensesChartInstance = new Chart(dayToDayExpensesChart, {
            type: "bar",
            data: {
                labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                datasets: [{
                    label: "Expenses",
                    data: dayToDayData,
                    backgroundColor: "#3700b3",
                    borderRadius: 5
                }]
            },
            options: { responsive: true }
        });

        // Update Recent Expenses List (display from bottom)
        const recentExpensesList = document.getElementById("recent-expenses-list");
        recentExpensesList.innerHTML = ''; // Clear the current list

        // Reverse the arrays to show the most recent first
        const allEntries = [...expenses, ...incomes].reverse(); // Merge and reverse

        allEntries.forEach(entry => {
            const li = document.createElement('li');
            if (entry.name) { // Expense
                li.textContent = `${entry.name} - ₹${entry.amount} (${entry.category}, ${entry.date})`;
                li.style.backgroundColor = "#f44336"; // Red background for expenses
            } else { // Income
                li.textContent = `${entry.source} - ₹${entry.amount} (${entry.date})`;
                li.style.backgroundColor = "#4caf50"; // Green background for incomes
            }
            if (window.matchMedia("(max-width: 1600px)").matches) {
                li.style.width = "100%";
            }
            li.style.width = "100%";
            if (window.matchMedia("(max-width: 415px)").matches) {
                li.style.width = "90%";
            }
            if (window.matchMedia("(max-width: 400px)").matches) {
                li.style.width = "85%";
            }
            recentExpensesList.appendChild(li);
        });

        // Update Net Balance
        const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
        const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const netBalance = totalIncome - totalExpense;
        document.getElementById('net-balance-amount').textContent = `₹${netBalance}`;
    }

    // Handle expense modal
    const expenseModal = document.getElementById("expense-modal");
    const openExpenseModalBtn = document.getElementById("new-expense-btn");
    const closeExpenseModalBtn = document.getElementById("close-modal-btn");
    const expenseForm = document.getElementById("expense-form");

    openExpenseModalBtn.addEventListener("click", function () {
        expenseModal.style.display = "flex"; // Show modal
    });

    closeExpenseModalBtn.addEventListener("click", function () {
        expenseModal.style.display = "none"; // Hide modal
    });

    expenseForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const expenseName = document.getElementById("expense-name").value;
        const expenseAmount = document.getElementById("expense-amount").value;
        const expenseCategory = document.getElementById("expense-category").value;
        const expenseDate = document.getElementById("expense-date").value;

        // Save the expense to LocalStorage
        expenses.push({
            name: expenseName,
            amount: expenseAmount,
            category: expenseCategory,
            date: expenseDate
        });
        localStorage.setItem('expenses', JSON.stringify(expenses));

        expenseModal.style.display = "none"; // Close modal
        expenseForm.reset(); // Clear form fields

        updateChartsAndExpenses(); // Update charts and expense list
    });

    // Handle income modal
    const incomeModal = document.getElementById("income-modal");
    const openIncomeModalBtn = document.getElementById("new-income-btn");
    const closeIncomeModalBtn = document.getElementById("close-income-modal-btn");
    const incomeForm = document.getElementById("income-form");

    openIncomeModalBtn.addEventListener("click", function () {
        incomeModal.style.display = "flex"; // Show modal
    });

    closeIncomeModalBtn.addEventListener("click", function () {
        incomeModal.style.display = "none"; // Hide modal
    });

    incomeForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const incomeSource = document.getElementById("income-source").value;
        const incomeAmount = document.getElementById("income-amount").value;
        const incomeDate = document.getElementById("income-date").value;

        // Save the income to LocalStorage
        incomes.push({
            source: incomeSource,
            amount: incomeAmount,
            date: incomeDate
        });
        localStorage.setItem('incomes', JSON.stringify(incomes));

        incomeModal.style.display = "none"; // Close modal
        incomeForm.reset(); // Clear form fields

        updateChartsAndExpenses(); // Update charts and income data
    });

    // Initialize the charts and expenses on page load
    updateChartsAndExpenses();
});


//login

document.addEventListener("DOMContentLoaded", function () {
    const userNameElement = document.getElementById("userName");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        userNameElement.textContent = `Hi, ${loggedInUser}`; // Show username
    } else {
        alert("You are not logged in! Redirecting to login page...");
        window.location.href = "../Login/login.html"; // Redirect if not logged in
    }
});


//logout 

document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.querySelector("#logout"); // Select Logout button

    logoutBtn.addEventListener("click", function () {
        const confirmLogout = confirm("Are you sure you want to log out?");

        if (confirmLogout) {
            localStorage.removeItem("loggedInUser"); // Clear user data
            alert("Logged out successfully!"); // Show alert
            window.location.href = "../Login/login.html"; // Redirect to login
        }
    });
});



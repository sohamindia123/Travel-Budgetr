class TravelBudgetr {
    constructor() {
        this.expenses = [];
        this.members = new Set();
        this.selectedCurrency = 'INR';
        this.currencySymbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'INR': '₹',
            'CAD': 'C$',
            'AUD': 'A$'
        };
        
        this.setupCompleted = false;
        
        this.loadFromLocalStorage();
        
        if (this.setupCompleted) {
            this.initializeMainEventListeners();
            this.populateMembersDropdown();
            this.updateCurrencySymbol();
            this.updateUI();
            

            document.getElementById('initial-setup').style.display = 'none';
        } else {
            this.initializeSetupEventListeners();
            

            const currencySelector = document.getElementById('currency-selector');
            if (currencySelector) {
                currencySelector.value = 'INR';
            }
        }
    }
    

    saveToLocalStorage() {
        const appData = {
            expenses: this.expenses,
            members: Array.from(this.members),
            selectedCurrency: this.selectedCurrency,
            setupCompleted: this.setupCompleted
        };
        
        localStorage.setItem('travelBudgetrData', JSON.stringify(appData));
    }
    

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('travelBudgetrData');
        
        if (savedData) {
            try {
                const appData = JSON.parse(savedData);
                
                if (appData && appData.setupCompleted) {
                    this.expenses = appData.expenses || [];
                    this.members = new Set(appData.members || []);
                    this.selectedCurrency = appData.selectedCurrency || 'USD';
                    this.setupCompleted = appData.setupCompleted || false;
                    

                    const currencySelector = document.getElementById('currency-selector');
                    if (currencySelector) {
                        currencySelector.value = this.selectedCurrency;
                    }
                    
                    return true;
                }
            } catch (error) {
                console.error('Error loading saved data:', error);

                localStorage.removeItem('travelBudgetrData');
                return false;
            }
        }
        

        this.members.clear();
        return false;
    }

    initializeSetupEventListeners() {
                const addMemberBtn = document.getElementById('add-member-btn');
        addMemberBtn.addEventListener('click', () => this.addMemberInput());
        

        const startBudgetingBtn = document.getElementById('start-budgeting');
        startBudgetingBtn.addEventListener('click', () => this.completeSetup());
        

        document.querySelectorAll('.remove-member').forEach(button => {
            button.addEventListener('click', (e) => this.removeMemberInput(e.target.closest('.member-input-row')));
        });
        

        const currencySelector = document.getElementById('currency-selector');
        currencySelector.addEventListener('change', (e) => {
            this.selectedCurrency = e.target.value;
            this.updateCurrencySymbol();
        });
    }
    
    updateCurrencySymbol() {
        const currencySymbolElement = document.getElementById('currency-symbol');
        if (currencySymbolElement) {
            currencySymbolElement.textContent = this.currencySymbols[this.selectedCurrency];
        }
    }
    
    addMemberInput() {
        const memberInputsList = document.getElementById('member-inputs-list');
        const newMemberRow = document.createElement('div');
        newMemberRow.className = 'member-input-row';
        
        newMemberRow.innerHTML = `
            <input type="text" class="member-name" placeholder="Member name">
            <button class="remove-member" type="button"><i class="fas fa-times"></i></button>
        `;
        
        memberInputsList.appendChild(newMemberRow);
        

        const removeButton = newMemberRow.querySelector('.remove-member');
        removeButton.addEventListener('click', () => this.removeMemberInput(newMemberRow));
        

        const newInput = newMemberRow.querySelector('input');
        newInput.focus();
        

        const scrollableContainer = document.querySelector('.members-scrollable-container');
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
    
    removeMemberInput(memberRow) {
   
        const memberRows = document.querySelectorAll('.member-input-row');
        if (memberRows.length > 1) {
            memberRow.remove();
        } else {
    
            memberRow.querySelector('input').value = '';
            memberRow.querySelector('input').focus();
        }
    }
    
    completeSetup() {
 
        this.members.clear();
        

        const memberInputs = document.querySelectorAll('.member-name');
        let validMembers = false;
        
        memberInputs.forEach(input => {
            const memberName = input.value.trim();
            if (memberName) {
                this.members.add(memberName);
                validMembers = true;
            }
        });
        
        if (!validMembers) {
            alert('Please add at least one group member to continue.');
            return;
        }
        

        document.getElementById('initial-setup').style.display = 'none';
        
       
        this.setupCompleted = true;
        this.initializeMainEventListeners();
        this.populateMembersDropdown();
        this.updateCurrencySymbol();
        
  
        this.switchTab('add-expense');
        
   
        this.saveToLocalStorage();
        
        // Show welcome message
        this.showToast('Welcome to TravelBudgetr! Start adding your expenses.');
    }
    
    initializeMainEventListeners() {
        // Expense form
        const form = document.getElementById('expense-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });
        
        // Tab navigation
        const addExpenseTab = document.getElementById('add-expense-tab');
        const summaryTab = document.getElementById('summary-tab');
        const backToSetupBtn = document.getElementById('back-to-setup');
        
        addExpenseTab.addEventListener('click', () => this.switchTab('add-expense'));
        summaryTab.addEventListener('click', () => this.switchTab('summary'));
        backToSetupBtn.addEventListener('click', () => this.resetAll());
    }
    
    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (tabName === 'add-expense') {
            document.getElementById('add-expense-tab').classList.add('active');
            document.getElementById('add-expense-section').classList.remove('hidden');
            document.getElementById('summary-section').classList.add('hidden');
        } else if (tabName === 'summary') {
            document.getElementById('summary-tab').classList.add('active');
            document.getElementById('add-expense-section').classList.add('hidden');
            document.getElementById('summary-section').classList.remove('hidden');
        }
    }
    
    resetAll() {
        if (confirm('This will reset all data and clear all expenses. Continue?')) {
            // Clear all data
            this.expenses = [];
            this.members.clear();
            this.selectedCurrency = 'INR';
            this.setupCompleted = false;
            
            // Clear localStorage
            localStorage.removeItem('travelBudgetrData');
            
            // Show setup overlay
            document.getElementById('initial-setup').style.display = 'flex';
            
            // Reset currency selector
            const currencySelector = document.getElementById('currency-selector');
            if (currencySelector) {
                currencySelector.value = 'INR';
            }
            
            // Clear member inputs except the first one
            const memberInputsList = document.getElementById('member-inputs-list');
            memberInputsList.innerHTML = `
                <div class="member-input-row">
                    <input type="text" class="member-name" placeholder="Member name">
                    <button class="remove-member" type="button"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            // Re-attach event listeners to the remove button
            document.querySelectorAll('.remove-member').forEach(button => {
                button.addEventListener('click', (e) => this.removeMemberInput(e.target.closest('.member-input-row')));
            });
            
            // Clear all expense displays
            document.getElementById('total-amount').textContent = this.formatCurrency(0);
            document.getElementById('per-person').textContent = this.formatCurrency(0);
            document.getElementById('member-balances').innerHTML = '';
            document.getElementById('settlement-plan').innerHTML = '<p>No settlements needed</p>';
            document.getElementById('expenses-table').innerHTML = '<p>No expenses added yet</p>';
            
            // Clear dropdown
            const paidBySelect = document.getElementById('paid-by');
            while (paidBySelect.options.length > 1) {
                paidBySelect.remove(1);
            }
            
            // Re-initialize setup event listeners
            this.initializeSetupEventListeners();
            
            // Show a message
            this.showToast('All data has been reset successfully');
        }
    }
    
    populateMembersDropdown() {
        const paidBySelect = document.getElementById('paid-by');
        
        // Clear existing options except the first one
        while (paidBySelect.options.length > 1) {
            paidBySelect.remove(1);
        }
        
        // Add member options
        this.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            paidBySelect.appendChild(option);
        });
    }

    addExpense() {
        const description = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const paidBySelect = document.getElementById('paid-by');
        const paidBy = paidBySelect.options[paidBySelect.selectedIndex].value;

        if (description && amount && paidBy) {
            const expense = {
                description,
                amount,
                paidBy,
                date: new Date()
            };

            this.expenses.push(expense);
            this.updateUI();
            this.resetForm();
            
            // Save to localStorage after adding expense
            this.saveToLocalStorage();
            
            // Show a success message
            this.showToast(`Expense of ${this.formatCurrency(amount)} added successfully!`);
            
            // Switch to summary tab to show the update
            this.switchTab('summary');
        }
    }
    
    showToast(message) {
        // Check if a toast container exists, if not create one
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add styles for the toast
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                .toast {
                    background-color: #2ecc71;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 4px;
                    margin-top: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    animation: slideIn 0.3s, fadeOut 0.5s 2.5s forwards;
                    max-width: 300px;
                }
                .toast i {
                    margin-right: 10px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeOut {
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create and show the toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        toastContainer.appendChild(toast);
        
        // Remove the toast after animation completes
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    calculateTotalExpenses() {
        return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    calculatePerPersonShare() {
        const total = this.calculateTotalExpenses();
        return this.members.size ? total / this.members.size : 0;
    }

    calculateBalances() {
        const perPersonShare = this.calculatePerPersonShare();
        const balances = {};

        // Initialize balances for all members
        for (const member of this.members) {
            balances[member] = 0;
        }

        // Calculate what each person has paid
        this.expenses.forEach(expense => {
            balances[expense.paidBy] += expense.amount;
        });

        // Adjust balances based on per person share
        for (const member in balances) {
            balances[member] -= perPersonShare;
        }

        return balances;
    }

    calculateSettlements() {
        const balances = this.calculateBalances();
        const settlements = [];
        
        // Convert balances to array and sort by amount (descending)
        const sortedMembers = Object.entries(balances).sort((a, b) => b[1] - a[1]);
        
        let i = 0;  // index for positive balances (creditors)
        let j = sortedMembers.length - 1;  // index for negative balances (debtors)
        
        while (i < j) {
            const [creditor, creditAmount] = sortedMembers[i];
            const [debtor, debitAmount] = sortedMembers[j];
            
            if (creditAmount <= 0) {
                i++;
                continue;
            }
            
            if (debitAmount >= 0) {
                j--;
                continue;
            }
            
            const amount = Math.min(creditAmount, -debitAmount);
            
            if (amount > 0.01) {  // Only add settlements for non-zero amounts
                settlements.push({
                    from: debtor,
                    to: creditor,
                    amount: amount
                });
            }
            
            // Update balances
            sortedMembers[i][1] -= amount;
            sortedMembers[j][1] += amount;
            
            // Move indices if balances are settled
            if (Math.abs(sortedMembers[i][1]) < 0.01) i++;
            if (Math.abs(sortedMembers[j][1]) < 0.01) j--;
        }
        
        return settlements;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.selectedCurrency
        }).format(amount);
    }

    updateUI() {
        this.updateSummary();
        this.updateBalances();
        this.updateSettlements();
        this.updateExpensesList();
    }

    updateSummary() {
        const totalAmount = document.getElementById('total-amount');
        const perPerson = document.getElementById('per-person');

        totalAmount.textContent = this.formatCurrency(this.calculateTotalExpenses());
        perPerson.textContent = this.formatCurrency(this.calculatePerPersonShare());
    }

    updateBalances() {
        const balancesContainer = document.getElementById('member-balances');
        const balances = this.calculateBalances();
        
        balancesContainer.innerHTML = '';
        
        for (const [member, balance] of Object.entries(balances)) {
            const balanceElement = document.createElement('div');
            balanceElement.className = `balance-item ${balance >= 0 ? 'positive' : 'negative'}`;
            
            balanceElement.innerHTML = `
                <span>${member}</span>
                <span>${this.formatCurrency(balance)}</span>
            `;
            
            balancesContainer.appendChild(balanceElement);
        }
    }

    updateSettlements() {
        const settlementContainer = document.getElementById('settlement-plan');
        const settlements = this.calculateSettlements();
        
        settlementContainer.innerHTML = settlements.length ? '' : '<p>No settlements needed</p>';
        
        settlements.forEach(settlement => {
            const settlementElement = document.createElement('div');
            settlementElement.className = 'settlement-item';
            
            settlementElement.innerHTML = `
                <span><i class="fas fa-exchange-alt"></i> ${settlement.from} should pay ${settlement.to}</span>
                <span class="amount">${this.formatCurrency(settlement.amount)}</span>
            `;
            
            settlementContainer.appendChild(settlementElement);
        });
    }

    updateExpensesList() {
        const expensesTable = document.getElementById('expenses-table');
        
        expensesTable.innerHTML = this.expenses.length ? '' : '<p>No expenses added yet</p>';
        
        this.expenses.slice().reverse().forEach(expense => {
            const expenseElement = document.createElement('div');
            expenseElement.className = 'expense-item';
            
            expenseElement.innerHTML = `
                <div class="expense-description">
                    <i class="fas fa-receipt expense-icon"></i>
                    <span>${expense.description}</span>
                </div>
                <div class="expense-details">
                    <div class="expense-amount">
                        <i class="fas fa-money-bill-wave expense-icon"></i>
                        <span>${this.formatCurrency(expense.amount)}</span>
                    </div>
                    <div class="expense-payer">
                        <i class="fas fa-user expense-icon"></i>
                        <span>Paid by ${expense.paidBy}</span>
                    </div>
                </div>
            `;
            
            expensesTable.appendChild(expenseElement);
        });
    }

    resetForm() {
        document.getElementById('expense-form').reset();
        document.getElementById('expense-name').focus();
    }
}

// Initialize the app

const app = new TravelBudgetr(); 

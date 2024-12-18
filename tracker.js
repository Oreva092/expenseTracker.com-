// collect and storing ids
const currencyHolder = document.getElementById('currency');
const balanceHolder = document.getElementById('balance');
const transactionHolder = document.getElementById('name');
const amountHolder = document.getElementById('amount');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const saveBtn = document.getElementById('save');
const displayList = document.getElementById('listOfTransactions');
const cancelBtn = document.getElementById("cancel");

// variable decleration
let symbol = "$";
let listOfTransactions = [];
let currentBalance = 0;

let editIndex = -1;

function edit(i){
    cancelBtn.style.display = "block";
    editIndex = i;
    transactionHolder.value = listOfTransactions[i].name;
    amountHolder.value = listOfTransactions[i].amount;
    if(listOfTransactions[i].type == "income"){
        income.checked = true;
    } else{
        expense.checked = true;
    }
}

function del(i){
    listOfTransactions = listOfTransactions.filter((e, index) => i !== index);
    render();
}

// saving function
function saveData(){
    localStorage.setItem("symbol", symbol);
    localStorage.setItem("balance", currentBalance);
    localStorage.setItem("list", JSON.stringify(listOfTransactions));
}

// loads data 
function loadData(){
    symbol = localStorage.getItem("symbol");
    listOfTransactions = JSON.parse(localStorage.getItem("list"));
    currentBalance = Number(localStorage.getItem("balance"));
}

// calcualtion
function render(){
    currentBalance = listOfTransactions.reduce((total, value) => {
        return value.type == "expense" ? total - value.amount : total + value.amount
    }, 0);

    displayList.innerHTML = "";
    if(listOfTransactions.length == 0){
        displayList.innerHTML += "No transaction found";
    } else{
        listOfTransactions.forEach((e, i) => {
            displayList.innerHTML += `
            <li class="transaction ${e.type}">
                <p>${e.name}</p>
                <div class="rightSide">
                    <p>${symbol} ${e.amount}</p>
                    <button onclick="edit(${i})"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="del(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </li>
            `;
        })
    }

    currencyHolder.innerHTML = symbol;
    balanceHolder.innerHTML = currentBalance;
    saveData();
}

cancelBtn.addEventListener("click", () => {
    editIndex = -1;
    transactionHolder.value = "";
    amountHolder.value = "";
    cancelBtn.style.display = "none";
});

saveBtn.addEventListener("click", () => {
    if(transactionHolder.value == "" || Number
    (amountHolder.value) <= 0){
        alert("cant do that!");
        return;
    }
    let transaction = {
        name: transactionHolder.value,
        amount: Number(amountHolder.value),
        type: income.checked? "income" : "expense"
    };

    if(editIndex == -1) {
        listOfTransactions.push(transaction);
    }else{
        listOfTransactions[editIndex] = transaction;
    }

    editIndex = -1;
    transactionHolder.value = "";
    amountHolder.value = "";
    render();
    cancelBtn.style.display = "none";
});
    

loadData();
render();
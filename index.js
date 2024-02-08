import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-b6132-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
});

onValue(shoppingListInDB, function(snapshot) {
    let itemArray = Object.entries(snapshot.val());

    console.log(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemArray.length; i++) {
        
        let currentItem = itemArray[i]
        
        appendItemToShoppingListEl(itemArray[i]);
    }
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(itemValue) {
    const listItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.id = `checkbox-${itemValue}`;

    const label = document.createElement("label");
    label.textContent = itemValue;
    label.setAttribute("for", `checkbox-${itemValue}`);

    listItem.appendChild(checkbox);
    listItem.appendChild(label);

    shoppingListEl.appendChild(listItem);
}

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Firebase configuration
const appSettings = {
    databaseURL: "https://realtime-database-b6132-default-rtdb.europe-west1.firebasedatabase.app/"
}

// Initialize Firebase app with the configuration
const app = initializeApp(appSettings);

// Get a reference to the Firebase database
const database = getDatabase(app);

// Reference to the 'shoppingList' node in the database
const shoppingListInDB = ref(database, "shoppingList");

// DOM elements
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// Event listener for the 'Add' button
addButtonEl.addEventListener("click", function() {
    // Get the value from the input field
    let inputValue = inputFieldEl.value;

    // Push the value to the 'shoppingList' node in the database
    push(shoppingListInDB, inputValue);

    // Clear the input field
    clearInputFieldEl();

    // Add the pulse class for a button click animation
    addButtonEl.classList.add("pulse");

    // Remove the pulse class after the animation completes
    setTimeout(() => {
        addButtonEl.classList.remove("pulse");
    }, 1000);
});

// Event listener for changes in the 'shoppingList' node in the database
onValue(shoppingListInDB, function(snapshot) {
    // Check if there are items in the database
    if (snapshot.exists()) {
        // Convert the snapshot into an array of items
        let itemsArray = Object.entries(snapshot.val());

        // Clear the shopping list in the DOM
        clearShoppingListEl();

        // Iterate through the items and append them to the shopping list in the DOM
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];

            appendItemToShoppingListEl(currentItemID, currentItemValue);
        }
    } else {
        // Display a message if there are no items in the database
        shoppingListEl.innerHTML = "Waiting to be filled...";
    }
});

// Function to clear the shopping list in the DOM
function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

// Function to clear the input field in the DOM
function clearInputFieldEl() {
    inputFieldEl.value = "";
}

// Function to append an item to the shopping list in the DOM
function appendItemToShoppingListEl(itemID, itemValue) {
    // Create a new list item
    const listItem = document.createElement("li");

    // Create a label for the item value
    const label = document.createElement("label");
    label.textContent = itemValue;
    label.setAttribute("for", `checkbox-${itemID}`);

    // Append the label to the list item
    listItem.appendChild(label);

    // Add a click event listener to the list item for removal from the database
    listItem.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });

    // Append the list item to the shopping list in the DOM
    shoppingListEl.appendChild(listItem);
}

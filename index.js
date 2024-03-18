// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-7b31c-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const endorsementListEL = document.getElementById("endorsement-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(endorsementListInDB, inputValue)
    
    clearInputFieldEL()
} )

onValue(endorsementListInDB, function(snapshot){
    if(snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        
        clearEndorsementListEL()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemtoEndorsementListEL(currentItem)
        } 
    } else {
        endorsementListEL.innerHTML = "No items here... yet"
    }
})

function clearInputFieldEL() {
    inputFieldEl.value = ""   
}

function clearEndorsementListEL() {
    endorsementListEL.innerHTML = ""
}

function appendItemtoEndorsementListEL(item) {
    let itemId = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    
    newEl.addEventListener("dblclick", function() {
        let locationOfItemInDb = ref(database, `endorsementList/${itemId}`)
        
        remove(locationOfItemInDb)
    })
    
    endorsementListEL.append(newEl)
}
// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-7b31c-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const endorsementListEL = document.getElementById("endorsement-list")
const fromInputFieldEl = document.getElementById("from-input-field")
const toInputFieldEl = document.getElementById("to-input-field")

addButtonEl.addEventListener("click", function() {
    if (inputFieldEl.value === "" || fromInputFieldEl.value === "" || toInputFieldEl.value === "") {
        alert("Please complete all fields")
    } else {
    let inputValue = {
        to: toInputFieldEl.value,
        endorsement: inputFieldEl.value, 
        from: fromInputFieldEl.value,
        likes: 0}
           
    push(endorsementListInDB, inputValue)
    
    clearInputFields()   
    }
} )

onValue(endorsementListInDB, function(snapshot){
    if(snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearEndorsementListEL()
        
        for (let i = itemsArray.length - 1; i >= 0; i--) {
            let currentItem = itemsArray[i]
            
            appendItemtoEndorsementListEL(currentItem)
        } 
    } else {
        endorsementListEL.innerHTML = "No items here... yet"
    }
})

function clearInputFields() {
    inputFieldEl.value = ""
    fromInputFieldEl.value = ""
    toInputFieldEl.value = ""  
}

function clearEndorsementListEL() {
    endorsementListEL.innerHTML = ""
}

function appendItemtoEndorsementListEL(item) {
    let itemId = item[0]
    let itemValue = `
        <p>To ${item[1].to}</p>
        ${item[1].endorsement}
        <div id="likes-container">
            <p>From ${item[1].from}</p>
            <p>🖤${item[1].likes}</p>
        </div>`
    
    let newEl = document.createElement("li")
    newEl.innerHTML = itemValue
    
    newEl.addEventListener("click", function() {
        let locationOfItemInDb = ref(database, `endorsementList/${itemId}`)
        
        let likesCount = item[1].likes + 1
        
        set(locationOfItemInDb, {
            to: item[1].to,
            endorsement: item[1].endorsement, 
            from: [item[1].from],
            likes: likesCount}
            )
    })
    
    endorsementListEL.append(newEl)
}
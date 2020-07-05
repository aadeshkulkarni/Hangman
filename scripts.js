const wordEl=document.getElementById("word");
const txtUserInput=document.getElementById("txtUserInput");
const wrongLettersEl=document.getElementById("wrong-letters");
const playAgainBtn=document.getElementById("play-button");
const popup=document.getElementById("popup-container");
const notification=document.getElementById("notification-container");
const finalMessage=document.getElementById("final-message");

const figureParts=document.querySelectorAll(".figure-part");
let selectedWord;
var words=[];
function defineWords(){
    fetch("https://restcountries.eu/rest/v2/all")
    .then(response=>response.json())
    .then(data=>words=data)
    .then(() => {words=words.map(function(item){
            return item.name.toLowerCase();   
        });
        selectedWord=words[Math.floor(Math.random()*words.length)];
        console.log(selectedWord);
        displayWord();
    });
}
const correctLetters=['r','w','i','a'];
const wrongLetters=[];

// Update the wrong letters
function updateWrongLettersEl(){
    // Display wrong letters
    wrongLettersEl.innerHTML=`
        ${wrongLetters.length>0?'<p>Wrong</p>':''}
        ${wrongLetters.map(letter=>`<span>${letter}</span>`)};
    `;


    //Display Parts
    figureParts.forEach((part,index)=>{
        const error=wrongLetters.length;

        if(index<error){
            part.style.display="block";
        }
        else{
            part.style.display="none";
        }
    });
    //Check if lost
    if(wrongLetters.length===figureParts.length){
        finalMessage.innerText="Unfortunately, You lost.";
        popup.style.display="flex";
    }

}

//Show notificaiton
function showNotification(){
    notification.classList.add('show');

    setTimeout(()=>{
        notification.classList.remove('show');
    },2000);
}
txtUserInput.addEventListener("change",e=>{
    
        const letter=txtUserInput.value;
        console.log(letter);
        if(selectedWord.includes(letter)){
            if(!correctLetters.includes(letter)){
                correctLetters.push(letter);
                displayWord();
            }
            else{
                showNotification();
            }
        }
        else{
            if(!wrongLetters.includes(letter)){
                wrongLetters.push(letter);

                updateWrongLettersEl();
            }
            else{
                showNotification();
            }
        }
        txtUserInput.value="";
});

window.addEventListener('keyup',e=>{
    if(window.innerWidth>600){
    if(e.keyCode>=65 && e.keyCode<=90){
        const letter=e.key;
        if(selectedWord.includes(letter)){
            if(!correctLetters.includes(letter)){
                correctLetters.push(letter);
                displayWord();
            }
            else{
                showNotification();
            }
        }
        else{
            if(!wrongLetters.includes(letter)){
                wrongLetters.push(letter);

                updateWrongLettersEl();
            }
            else{
                showNotification();
            }
        }
    }
    }
});

//Restart game & play again

playAgainBtn.addEventListener("click",()=>{
    //Empty Array
    correctLetters.splice(0);
    wrongLetters.splice(0);

        selectedWord=words[Math.floor(Math.random()*words.length)];
        console.log(selectedWord);
    displayWord();
    updateWrongLettersEl();

    popup.style.display="none";
});

//Show hidden word
function displayWord(){
    wordEl.innerHTML=`
        ${selectedWord
            .split('')
        .map(letter=>`
            <span class="letter">
            ${correctLetters.includes(letter)?letter:''}
            </span>
        `).join('')}
    `;
    const innerWord=wordEl.innerText.replace(/\n/g,'');
    
    if(innerWord===selectedWord){
        finalMessage.innerText='Congratulations! You Won!';
        popup.style.display='flex';
    }
    console.log(innerWord);
}

defineWords();






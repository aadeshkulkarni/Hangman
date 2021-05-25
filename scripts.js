const wordEl = document.getElementById("word")
const txtUserInput = document.getElementById("txtUserInput")
const wrongLettersEl = document.getElementById("wrong-letters")
const playAgainBtn = document.getElementById("play-button")
const popup = document.getElementById("popup-container")
const notification = document.getElementById("notification-container")
const finalMessage = document.getElementById("final-message")

const figureParts = document.querySelectorAll(".figure-part")
let selectedWord, tempSelectedWord
var words = [],
  tempWords
function defineWords() {
  fetch("https://api.first.org/data/v1/countries")
    .then((response) => response.json())
    .then((data) => (tempWords = data.data))
    .then(() => {
      words = Object.keys(tempWords).map((item) => {
        if (!tempWords[item].country.includes("(the)")) {
          return tempWords[item].country.toUpperCase()
        }
      })
      selectedWord = words[Math.floor(Math.random() * words.length)]
      tempSelectedWord = selectedWord.replaceAll(" ", "")
      displayWord()
    })
}
const defaultLetters = ["A", "E", "I", "O", "U", "(", ")", ",", "-", "*"]
let correctLetters = ["A", "E", "I", "O", "U", "(", ")", ",", "-", "*"]
const wrongLetters = []

// Update the wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
        ${wrongLetters.length > 0 ? "<span>Wrong: </span>" : ""}
        ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
    `

  //Display Parts
  figureParts.forEach((part, index) => {
    const error = wrongLetters.length

    if (index < error) {
      part.style.display = "block"
    } else {
      part.style.display = "none"
    }
  })
  //Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = `Unfortunately, You lost. ${selectedWord} was the country we were looking for  `
    popup.style.display = "flex"
  }
}

//Show notificaiton
function showNotification() {
  notification.classList.add("show")

  setTimeout(() => {
    notification.classList.remove("show")
  }, 2000)
}
txtUserInput.addEventListener("keyup", (e) => {
  const letter = e.target.value.toUpperCase()
  if (selectedWord.includes(letter)) {
    if (!correctLetters.includes(letter)) {
      correctLetters.push(letter)
      displayWord()
    } else {
      showNotification()
    }
  } else {
    if (!wrongLetters.includes(letter)) {
      wrongLetters.push(letter)

      updateWrongLettersEl()
    } else {
      showNotification()
    }
  }
  txtUserInput.value = ""
})

// window.addEventListener("keyup", (e) => {
//   if (window.innerWidth > 600) {
//     if (e.keyCode >= 65 && e.keyCode <= 90) {
//       const letter = e.key
//       if (selectedWord.includes(letter)) {
//         if (!correctLetters.includes(letter)) {
//           correctLetters.push(letter)
//           displayWord()
//         } else {
//           showNotification()
//         }
//       } else {
//         if (!wrongLetters.includes(letter)) {
//           wrongLetters.push(letter)

//           updateWrongLettersEl()
//         } else {
//           showNotification()
//         }
//       }
//     }
//   }
// })

//Restart game & play again

playAgainBtn.addEventListener("click", () => {
  //Empty Array
  correctLetters.splice(0)
  wrongLetters.splice(0)
  console.log(words)
  const index = Math.floor(Math.random() * words.length)
  selectedWord = words[index].toUpperCase()
  tempSelectedWord = selectedWord.replaceAll(" ", "")
  correctLetters = [...defaultLetters]
  displayWord()
  updateWrongLettersEl()

  popup.style.display = "none"
})

//Show hidden word
function displayWord() {
  console.log(correctLetters)
  wordEl.innerHTML = `
        ${
          selectedWord &&
          selectedWord
            .split("")
            .map(
              (letter) => `<span class=${letter === " " ? "space" : "letter"}>
            ${correctLetters.includes(letter) ? letter : ""}
            </span>
        `
            )
            .join("")
        }
    `
  const innerWord = wordEl.innerText.replace(/\n/g, "")
  console.log("InnerWord: ", innerWord)
  console.log("TempSelectedWord: ", tempSelectedWord)
  console.log("SelectedWord: ", selectedWord)
  if (innerWord === tempSelectedWord) {
    finalMessage.innerText = `Congratulations! You Won! The Country name is ${selectedWord}`
    popup.style.display = "flex"
  }
  console.log(innerWord)
}

defineWords()

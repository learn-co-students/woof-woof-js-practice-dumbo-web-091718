const BASE_URL = 'http://localhost:3000/pups'

let dogBar    = ''
let container = ''
let toggleGoodOrBad = ''
let goodDogFilterBtn = ''

function init() {
  dogBar = document.getElementById('dog-bar')
  container = document.getElementById('dog-info')
  goodDogFilterBtn = document.querySelector('#good-dog-filter')
  getGoodDogs().then(populateDogBar)
}

function fetchDogs() {
  return fetch(BASE_URL).then(response => response.json())
}

function populateDogBar(dogs) {
  dogBar.innerHTML = ''
  for (const dog of dogs) {
    dogBar.innerHTML += `<span data-dog-id="${dog.id}">${dog.name}</span>`
  }
}

function getDogById(dogId) {
  return fetchDogs()
    .then(dogs => {
      return dogs.find(dog => dog.id === dogId)
    })
}

function populateContainer(dog) {
  container.innerHTML = `
    <img src="${dog.image}">
    <h2>${dog.name}</h2>
    <button data-dog="${dog.id}">${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>`
}

function updateDog(dogId, newValue) {
  fetch(`${BASE_URL}/${dogId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'isGoodDog': newValue})
  })
}

function getGoodDogs() {
  return fetchDogs()
    .then(dogs => {
      return dogs.filter(dog => dog.isGoodDog === true)
    })
}

document.addEventListener('DOMContentLoaded', (e) => {
  init()

  dogBar.addEventListener('click', e => {
    if (e.target.hasAttribute('data-dog-id')) {
      let target = Number(e.target.dataset.dogId)
      getDogById(target).then(populateContainer)
    }
  })

  container.addEventListener('click', e => {
    let target = Number(e.target.dataset.dog)
    if (e.target.tagName.match(/button/i)) {
      if (e.target.innerText === 'Bad Dog!') {
        e.target.innerText = 'Good Dog!'
        updateDog(target, true)
      } else {
        e.target.innerText = 'Bad Dog!'
        updateDog(target, false)
      }
    }
  })

  goodDogFilterBtn.addEventListener('click', e => {
    if (e.target.innerText === "Filter good dogs: OFF") {
      e.target.innerText = 'Filter good dogs: ON'
      getGoodDogs().then(populateDogBar)
    } else if (e.target.innerText === "Filter good dogs: ON") {
      e.target.innerText = 'Filter good dogs: OFF'
      fetchDogs().then(populateDogBar)
    }
  })
})
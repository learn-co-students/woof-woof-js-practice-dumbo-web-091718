document.addEventListener('DOMContentLoaded', () => {
  const dogBar = document.getElementById('dog-bar')
  const dogInfo = document.getElementById('dog-info')
  const dogFilter = document.getElementById('good-dog-filter')
  const url = 'http://localhost:3000/pups'

  function getAllDogs(){
    fetch(url).then(response => response.json())
    .then(dogs => {
      dogs.forEach(dog => {
        dogBar.innerHTML += `<span data-id=${dog.id}>${dog.name}</span>`
      })
    })
  }

  function getFilteredDogs(){
    fetch(url).then(response => response.json())
    .then(dogs => {
      dogs.filter(dog => dog.isGoodDog).forEach((dog) => {
        dogBar.innerHTML += `<span data-id=${dog.id}>${dog.name}</span>`
      })
    })
  }


  dogBar.addEventListener('click', (event) => {
    // console.log(event.target.dataset);
    const id = event.target.dataset.id

    if(event.target.tagName === 'SPAN'){
      fetch(`${url}/${id}`)
      .then(response => response.json())
      .then(dog => {
        dogInfo.innerHTML = `<img src=${dog.image}>
         <h2>${dog.name}</h2>
         <button data-id=${dog.id}>${ dog.isGoodDog ? "Good Dog!" : "Bad Dog!" }</button>`
      })
    }
  })

  dogInfo.addEventListener('click', (event) => {
    let boolean = event.target.innerText === 'Good Dog!'
    const id = event.target.dataset.id;

    if(event.target.tagName === 'BUTTON'){

      if(event.target.innerText === 'Good Dog!'){
        // boolean = false
        event.target.innerText = 'Bad Dog!'
      } else {
        // boolean = true
        event.target.innerText = 'Good Dog!'
      }

      fetch(`${url}/${event.target.dataset.id}`, {
        method: 'PATCH',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          isGoodDog: !boolean
        })
      })
    }
  })

  dogFilter.addEventListener('click', (event) => {
    const filterStatus = event.target.innerText.split(" ")[3]

    if(filterStatus === "OFF"){
      event.target.innerText = "Filter good dogs: ON"
      dogBar.innerHTML = ""
      getFilteredDogs()
    } else {
      event.target.innerText = "Filter good dogs: OFF"
      dogBar.innerHTML = ""
      getAllDogs()
    }
  })

  // function renderDog(){
  //
  // }

  getAllDogs()
  // getFilteredDogs()
})

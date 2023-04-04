// Your code here
//Global variables
const baseURL = "http://localhost:3000";
const basePath = "/films";
const homePage = "/1";


//This is the code that runs.
document.addEventListener('DOMContentLoaded', () => {
  main();
})


//Main execution function that runs when the DOM content loads.
function main(){
  renderHomePage();
  renderSideMenu();
  addEventListenerOnBuyTicket();
}


/******************************************************/
/* Functions that add event listeners to DOM elements */
/******************************************************/
function addEventListenerOnBuyTicket(){
  document.querySelector("#buy-ticket").addEventListener("click", handleBuyTicket);
}





/**************************************************/
/* Function Handlers that act on triggered events */
/**************************************************/
//He needs the movies to check which of the movies he should format
function handleBuyTicket(event, movies){
  const ticketNum = document.querySelector("#ticket-num");
  let ticketNumInteger = parseInt(ticketNum.textContent, 10);

  //if No ticket remaining, return. change button text and return
  if (ticketNumInteger === 0){
    const buyTicket = document.querySelector("#buy-ticket");
    buyTicket.textContent = "Sold Out";

    return;
  }

  ticketNumInteger -= 1;

  ticketNum.textContent = `${ticketNumInteger}`;

  const movieTitle = document.querySelector("#title");
}


function handleSideMenu(event){

  const destinationURL = baseURL + basePath;

  fetch(destinationURL, {method: "GET"}).then((response) => response.json()).then((movies) => {
    const movie = movies.find((movie) => ("film" + movie.id) === event.target.id);
    console.log(movie);

    if (movie !== -1){
      renderCard(movie);
    }
  })
}



/*************************************************************/
/* Functions that render the information by DOM manipulation */
/*************************************************************/
function renderCard(movie){
  const poster = document.querySelector("#poster");
  poster.src = movie.poster;
  poster.alt = movie.title;


  const card = document.querySelector(".card");

  card.querySelector("#title").textContent = movie.title;
  card.querySelector("#runtime").textContent = `${movie.runtime}` + " minutes";
  card.querySelector("#film-info").textContent = movie.description;
  card.querySelector("#showtime").textContent = movie.showtime;
  card.querySelector("#ticket-num").textContent = `${parseInt(movie.capacity, 10) - parseInt(movie.tickets_sold, 10)}`;
}


function renderMovieInSideMenu(movie){
  const movieTitle = document.createElement("li");
  movieTitle.classList.add("film");
  movieTitle.classList.add("item");
  const padding = "film";
  movieTitle.id = padding +`${movie.id}`;

  //Ane event listener to the li element is added here instead of adding it in the addEventListeners section.
  movieTitle.addEventListener("click", handleSideMenu);

  movieTitle.textContent = movie.title;

  document.querySelector("#films").appendChild(movieTitle);
}


/***************************************************/
/*   Functions that communicate with the server.   */
/***************************************************/
async function renderHomePage(){

  const destinationURL = baseURL + basePath + homePage;
  return fetch(destinationURL, {method: "GET"}).then((response) => response.json()).then((movie) => {
    renderCard(movie);
  })

}


function renderSideMenu(){

  const destinationURL = baseURL + basePath;
  fetch(destinationURL, {method: "GET"}).then((response) => response.json()).then((movies) => {
    movies.forEach((movie) => renderMovieInSideMenu(movie));
  })

}







// function addEventListenersToSideMenu(){
//   let movieTitles = document.querySelectorAll("li#film1.film.item");
//   console.log(movieTitles);
//   movieTitles = Array.from(movieTitles.childNodes);
//   console.log(movieTitles);
//   // movieTitles.forEach((movieTitle) => movieTitle.addEventListener("click", () => console.log("hi")));


  

//   // movieTitles.forEach((movieTitle) => movieTitle.addEventListener("click", () => console.log("hi")));
// }

// function addEventListenerOnForm(){
//   document.querySelector("#dog-form").addEventListener("submit", submitHandler);
// }






//  let configurePage = new Promise(function(myResolve, myReject){
//     myResolve(renderHomePage());
//   });

//   configurePage.then(function (value){
//     console.log("are you here?");
//     addEventListenersToSideMenu();
//   });

//   renderSideMenu();
//   addEventListenerOnBuyTicket();








// function editHandler(dog){
//   const form = document.querySelector("#dog-form");

//   form.name.value  = dog.name;   
//   form.breed.value = dog.breed; 
//   form.sex.value   = dog.sex;     
//   form.dataset.id  = dog.id;
//   console.log("Data entry id: ", form.dataset.id);
// }


// function submitHandler(event){
//    event.preventDefault();

//    console.log(event.target.dataset.id)
//     if (event.target.dataset.id){
//       let dog = {
//         id : event.target.dataset.id,
//         name: event.target.name.value,
//         breed: event.target.breed.value,
//         sex: event.target.sex.value
//       };

//       patchServer(dog);
//       const recordToUpdate = document.querySelector(`#singleRecord${dog.id}`);
//       recordToUpdate.querySelector(`#td1${dog.id}`).textContent = dog.name;
//       recordToUpdate.querySelector(`#td2${dog.id}`).textContent = dog.breed;
//       recordToUpdate.querySelector(`#td3${dog.id}`).textContent = dog.sex;
      
//     } else {
//       let dog = {
//         name: event.target.name.value,
//         breed: event.target.breed.value,
//         sex: event.target.sex.value
//       };

//       updateServer(dog);
//       renderOneDog(dog);
//     }
//   }











// function renderPage(){

//   const destinationURL = baseURL + basePath;
//   fetch(destinationURL, {method: "GET"}).then((response) => response.json()).then((dogs) => {
//     dogs.forEach((dog) => renderOneDog(dog));
//     globalDogs = dogs;
//   })

// }


// function updateServer(dog){

//   const destinationURL = baseURL + basePath;
  
//   fetch(destinationURL, {
//     method: "POST",
//     headers: {"Content-Type": "application/json",
//               "Accept": "application/json"
//              },
//     body: JSON.stringify(dog) 
//   })
//   .then((response) => response.json()).then((dog) => {
//     console.log(dog);
//   })
//   .catch((error) => console.error(error));
// }


// function patchServer(dog){
//   const destinationURL = baseURL + basePath;
  
//   fetch(destinationURL + `/${dog.id}`, {
//     method: "PATCH",
//     headers: {"Content-Type": "application/json",
//               "Accept": "application/json"
//              },
//     body: JSON.stringify(dog) 
//   })
//   .then((response) => response.json()).then((dog) => {
//     console.log(dog);
//   })
//   .catch((error) => console.error(error));
// }





























// function renderOneDog(dog){
//   let singleRecord = document.createElement("tr");

//   let editButtonTableData = document.createElement("td");
//   let editButton = document.createElement("button");
//   editButton.textContent = "Edit";
//   editButton.id = dog["id"];

//   editButton.addEventListener("click", () => editHandler(dog));

//   editButtonTableData.appendChild(editButton);

//   singleRecord.innerHTML = `
//                              <td id="td1${dog.id}">${dog["name"]}</td>
//                              <td id="td2${dog.id}">${dog["breed"]}</td>
//                              <td id="td3${dog.id}">${dog["sex"]}</td>
//                            `
//   singleRecord.id = `singleRecord${dog["id"]}`;
//   singleRecord.appendChild(editButtonTableData);


//   document.querySelector("#table-body").appendChild(singleRecord);
// }



// let editButtonTableData = document.createElement("td");
//   let editButton = document.createElement("button");
//   editButton.textContent = "Edit";
//   editButton.id = dog["id"];

//   editButton.addEventListener("click", () => editHandler(dog));

//   editButtonTableData.appendChild(editButton);

//   singleRecord.innerHTML = `
//                              <td id="td1${dog.id}">${dog["name"]}</td>
//                              <td id="td2${dog.id}">${dog["breed"]}</td>
//                              <td id="td3${dog.id}">${dog["sex"]}</td>
//                            `
//   singleRecord.id = `singleRecord${dog["id"]}`;
//   singleRecord.appendChild(editButtonTableData);


//   document.querySelector("#table-body").appendChild(singleRecord);
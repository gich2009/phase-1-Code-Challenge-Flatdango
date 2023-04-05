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
function handleBuyTicket(event, movies){
  const ticketNum = document.querySelector("#ticket-num");
  let ticketNumInteger = parseInt(ticketNum.textContent, 10);

  let movieList = document.querySelectorAll("#films li");
  const currentMovieTitle = document.querySelector("#title");

  movieList = Array.from(movieList);  

  //Find the current movie being rendered by comparing the currently rendered title with the list of movie titles in the side menu.
  const movieCurrentlyRendered = movieList.find((movie) => (movie.textContent === currentMovieTitle.textContent));

  //If no ticket remaining, change button text and return.
  if (ticketNumInteger === 0){
    const buyTicket = document.querySelector("#buy-ticket");
    buyTicket.textContent = "Sold Out";
    
    movieCurrentlyRendered.classList.add("sold-out");

    return;
  }

  ticketNumInteger -= 1;

  ticketNum.textContent = `${ticketNumInteger}`;
  movieCurrentlyRendered.dataset.tickets_sold = `${parseInt(movieCurrentlyRendered.dataset.tickets_sold, 10) + 1}`;

  serverPatch(movieCurrentlyRendered);
}


//Deletes a movie and if it is the one being currently rendered, renders the one before it
function handleDeleteMovie(event){
  let currentId = event.target.dataset.id;

  let movieList = document.querySelectorAll("ul#films > li");
  movieList = Array.from(movieList);
  console.log(movieList)

  let deleteIndex = movieList.findIndex((movie) => movie.dataset.id === currentId);
  let previousIndex = deleteIndex - 1;

  //If it the first movie is to be deleted, then the previous movie is the one after it.
  if (deleteIndex === 0){
    previousIndex = deleteIndex + 1; 
  }
  
  let movieToDelete = movieList[deleteIndex];
  
  const movieBeforeMovieToDelete = movieList[previousIndex];

  const previousMovie = constructMovie(movieBeforeMovieToDelete);

  const currentMovieTitle = document.querySelector("#title");

  if (currentMovieTitle.textContent === movieToDelete.textContent){
    renderCard(previousMovie);
  }


  movieToDelete.remove();
  event.target.remove();

  serverDelete(currentId);
}


function handleSideMenu(event){
  renderCard(constructMovie(event.target));
}




/*************************************************************/
/* Functions that render the information by DOM manipulation */
/*************************************************************/
function renderCard(movie){
  let poster = document.querySelector("#poster");
  poster.src = movie.poster;
  poster.alt = movie.title;

  const card = document.querySelector(".card");

  card.querySelector("#title").textContent      = movie.title;
  card.querySelector("#runtime").textContent    = `${movie.runtime}` + " minutes";
  card.querySelector("#film-info").textContent  = movie.description;
  card.querySelector("#showtime").textContent   = movie.showtime;
  card.querySelector("#ticket-num").textContent = `${parseInt(movie.capacity, 10) - parseInt(movie.tickets_sold, 10)}`;

  const buyTicket = document.querySelector("#buy-ticket");

  if (movie.capacity !== movie.tickets_sold){
    buyTicket.textContent = "Buy Ticket";
  } else {
    buyTicket.textContent = "Sold Out";
  }
}


function renderMovieInSideMenu(movie){
  const movieTitle = document.createElement("li");
  movieTitle.classList.add("film");
  movieTitle.classList.add("item");
  movieTitle.id = "li" + `${movie.id}`;
  
  //Cache all the data of the movie from the server database in the dataset attribute(data-*) of the new movie list element.
  //An alternative way to do this would be to create a single object to hold all the data in the dataset attribute, but for simplicity,
  //all the data properties were stored in different variables in the dataset attribute.
  movieTitle.dataset.capacity = movie.capacity;
  movieTitle.dataset.tickets_sold = movie.tickets_sold;
  movieTitle.dataset.id = movie.id;
  movieTitle.dataset.runtime = movie.runtime;
  movieTitle.dataset.showtime = movie.showtime;
  movieTitle.dataset.description = movie.description;
  movieTitle.dataset.poster = movie.poster;


  //An event listener to the li element is added here instead of adding it in the addEventListeners section.
  movieTitle.addEventListener("click", handleSideMenu);

  movieTitle.textContent = movie.title;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", handleDeleteMovie);
  deleteButton.dataset.id = movie.id;

  document.querySelector("#films").appendChild(movieTitle);
  document.querySelector("#films").appendChild(deleteButton);
}




/***************************************************/
/*   Functions that communicate with the server.   */
/***************************************************/
function renderHomePage(){
  const destinationURL = baseURL + basePath + homePage;

  fetch(destinationURL, {method: "GET"}).then((response) => response.json()).then((movie) => {
    renderCard(movie);
  })

}


function renderSideMenu(){
  const destinationURL = baseURL + basePath;

  fetch(destinationURL, {method: "GET"}).then((response) => response.json()).then((movies) => {
    movies.forEach((movie) => renderMovieInSideMenu(movie));
  })

}


function serverPatch(movieList){
  const movie = {
    tickets_sold: movieList.dataset.tickets_sold
  }

  const destinationURL = baseURL + basePath;
  
  fetch(destinationURL + `/${movieList.dataset.id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json",
              "Accept": "application/json"
             },
    body: JSON.stringify(movie) 
  })
  .then((response) => response.json()).then((movie) => {
    console.log(movie);
  })
  .catch((error) => console.error(error));
}


function serverDelete(id){
  const destinationURL = baseURL + basePath + "/" + id;

  fetch(destinationURL, {method: "DELETE"}).then((response) => response.json()).then((movie) => {
     console.log(movie);
  })
}




/*************************************************************/
/*         Functions that reduce code redundancy             */
/*************************************************************/
function constructMovie(movieInList){
  const movie = {
    id:           movieInList.dataset.id,
    title:        movieInList.textContent,
    runtime:      movieInList.dataset.runtime,
    capacity:     movieInList.dataset.capacity,
    showtime:     movieInList.dataset.showtime,
    tickets_sold: movieInList.dataset.tickets_sold,
    description:  movieInList.dataset.description,
    poster:       movieInList.dataset.poster
  }

  return movie;
}
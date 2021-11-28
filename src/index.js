const beerName = document.querySelector('div.beer-details h2');
const beerImage = document.querySelector('div.beer-details img');
const beerDescForm = document.querySelector('form.description');
const beerDescription = document.querySelector('form.description textarea');
const reviewForm = document.querySelector('form.review-form');
const reviewInput = document.querySelector('form.review-form textarea');
const reviewsList = document.querySelector('ul.reviews');
const allBeersList = document.querySelector('nav > ul');
let beerToDisplay;

const getData = async (url) => {
    const response = await fetch(url);
    const data = response.json();
    return data;
}

const renderBeerReviews = function (reviews) {
    reviewsList.innerHTML = "";
    reviews.forEach(review => {
        const reviewItem = document.createElement('li');
        const reviewButton = document.createElement('button');
        reviewButton.innerHTML = "Delete";
        reviewButton.addEventListener('click', function () {
            this.closest('li').remove();
        })//Deleting of review is not persisted.
        reviewItem.innerHTML = review;
        reviewItem.appendChild(reviewButton);
        reviewsList.appendChild(reviewItem);
    });
}
const renderBeerDetails = function (beer) {
    beerName.innerHTML = beer.name;
    beerImage.setAttribute("src", `${beer.image_url}`);
    beerDescription.innerHTML = beer.description;
    renderBeerReviews(beer.reviews);
}

const changeBeerDesciption = async function (id, text) {
    let patchObj = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          "description": text,
        })
    };
    await fetch(`http://localhost:3000/beers/${id}`, patchObj);
}

const addReview = async function (id, reviews, text) {
    const updatedReviews = [...reviews, text];
    let patchObj = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          "reviews": updatedReviews,
        })
    };
    await fetch(`http://localhost:3000/beers/${id}`, patchObj);
    renderBeerReviews(updatedReviews);
}

const renderBeerMenu = async () => {
    const allBeers = await getData('http://localhost:3000/beers');
    allBeers.forEach(function(beer) {
        const menuItem = document.createElement('li');
        menuItem.addEventListener('click', async () => {
            beerToDisplay = await getData(`http://localhost:3000/beers/${beer.id}`);
            renderBeerDetails(beerToDisplay);
        })
        menuItem.innerHTML = beer.name;
        allBeersList.appendChild(menuItem);
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    beerToDisplay = await getData('http://localhost:3000/beers/1');
    renderBeerDetails(beerToDisplay);
    allBeersList.innerHTML = "";
    renderBeerMenu();
})

beerDescForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    await changeBeerDesciption(beerToDisplay.id, beerDescription.value);
})

reviewForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    await addReview(beerToDisplay.id, beerToDisplay.reviews, reviewInput.value)
})

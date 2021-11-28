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

const renderBeerReviews = function (reviews) {
    reviewsList.innerHTML = "";
    reviews.forEach((review, buttonId) => {
        const reviewItem = document.createElement('li');
        const reviewButton = document.createElement('button');
        reviewButton.setAttribute("id", `${buttonId}`);
        reviewButton.innerHTML = "Delete";
        reviewButton.addEventListener('click', async function () {
            const updatedReviews = beerToDisplay.reviews;
            const deleteId = reviewButton.id;
            updatedReviews.splice(deleteId, 1);
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
            await fetch(`http://localhost:3000/beers/${beerToDisplay.id}`, patchObj);
            renderBeerReviews(updatedReviews);
            beerToDisplay.reviews = updatedReviews;
        });
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

document.addEventListener('DOMContentLoaded', async () => {
    beerToDisplay = await getData('http://localhost:3000/beers/1');
    renderBeerDetails(beerToDisplay);
    allBeersList.innerHTML = "";
    renderBeerMenu();
});

beerDescForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    let patchObj = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          "description": beerDescription.value,
        })
    };
    await fetch(`http://localhost:3000/beers/${beerToDisplay.id}`, patchObj);
});

reviewForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const updatedReviews = [...beerToDisplay.reviews, reviewInput.value];
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
    await fetch(`http://localhost:3000/beers/${beerToDisplay.id}`, patchObj);
    renderBeerReviews(updatedReviews);
    reviewInput.value = "";
    beerToDisplay.reviews = updatedReviews;
});
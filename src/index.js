const beerName = document.querySelector('div.beer-details h2');
const beerImage = document.querySelector('div.beer-details img');
const beerDescForm = document.querySelector('form.description');
const beerDescription = document.querySelector('form.description textarea');
const reviewForm = document.querySelector('form.review-form');
const reviewInput = document.querySelector('form.review-form textarea');
//const reviewSubmit = document.querySelector("form.review-form input[type='submit']");
const reviewsList = document.querySelector('ul.reviews');
let beerToDisplay;

const getData = async (url) => {
    const response = await fetch(url);
    const data = response.json();
    return data;
}

const renderBeerDetails = function (beer) {
    beerName.innerHTML = beer.name;
    beerImage.setAttribute("src", `${beer.image_url}`);
    beerDescription.innerHTML = beer.description;
    reviewsList.innerHTML = "";
    beer.reviews.forEach(review => {
        const reviewItem = document.createElement('li');
        reviewItem.innerHTML = review;
        reviewsList.appendChild(reviewItem);
    });
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

document.addEventListener('DOMContentLoaded', async () => {
    beerToDisplay = await getData('http://localhost:3000/beers/1');
    renderBeerDetails(beerToDisplay);
})

beerDescForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    await changeBeerDesciption(beerToDisplay.id, beerDescription.value);
})

reviewForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const reviewItem = document.createElement('li');
    reviewItem.innerHTML = reviewInput.value;
    reviewsList.appendChild(reviewItem);
    reviewInput.value = "";
})
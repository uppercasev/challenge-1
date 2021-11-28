const beerName = document.querySelector('div.beer-details h2');
const beerImage = document.querySelector('div.beer-details img');
const beerDescription = document.querySelector('form.description textarea');
const updateDescButton = document.querySelector('form.description button');
const reviewInput = document.querySelector('form.review-form textarea');
//const reviewSubmit = document.querySelector("form.review-form input[type='submit']");
const reviewsList = document.querySelector('ul.reviews');

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

document.addEventListener('DOMContentLoaded', async () => {
    const beerToDisplay = await getData('http://localhost:3000/beers/1');
    console.log(beerToDisplay);
    renderBeerDetails(beerToDisplay);
})


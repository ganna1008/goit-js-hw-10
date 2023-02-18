import Notiflix from 'notiflix';
import "notiflix/dist/notiflix-notify-aio-3.2.6.min.js";
import debounce from 'lodash.debounce';
import '../css/styles.css';
import { fetchCountries } from "./fetchCountries.js";

const DEBOUNCE_DELAY = 300;

const formEl = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


formEl.addEventListener('input', debounce(inputCountryName, DEBOUNCE_DELAY));


function inputCountryName(event) {
    let countryNameInput = event.target.value.trim();
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    if (!countryNameInput) {
        return;
    }

    fetchCountries(countryNameInput).then(date => {
        if (date.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.Oops, there is no country with that name')
            return '';
        }

        if (date.length >= 2 && date.length <= 10) {
            return {
                type: "countries",
                markUP: date.reduce((markup, date) => createMarkupFlagName(date) + markup, ""),
            }

        }
        if (date.length === 1) {
            return {
                type: "country",
                markUP: createMarkupCountryInfo(date[0]),
            }
        }
    }).then(markup => {
        return renderMarkup(markup)
    }).catch(err =>
        Notiflix.Notify.failure('Oops, there is no country with that name')
    );

}

function renderMarkup(markup) {
    if (markup.type === 'countries') {
        countryList.insertAdjacentHTML('beforeend', markup.markUP)
        return;
    }
    if (markup.type === 'country') {
        countryInfo.insertAdjacentHTML('beforeend', markup.markUP)
        return;
    }
};

function createMarkupFlagName({ name, flags }) {
    return ` <li class="country-card">
    <img class="country-flag" src="${flags.svg}" alt="Flag of ${name.official}">
      <p class="countries-name">${name.official}</p>
  </li>`
};


function createMarkupCountryInfo({ name, flags, capital, population, languages }) {

    return `<h2 class="country-info-name"><img class="country-flag" src="${flags.svg}" alt="Flag of ${name.official}">
      <p class="country-name">${name.official}</p></h2>
      <ul class="cuntry-poperty-list">
        <li class="country-list-name">Capital: <p class="country-list-info">${capital}</p> </li>
        <li class="country-list-name">Population: <p class="country-list-info">${population}</p></li>
        <li class="country-list-name">Languages: <p class="country-list-info">${Object.values(languages).join(", ")
        }</p ></liclass =>
      </ul > `
};
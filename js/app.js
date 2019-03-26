"use strict";

async function getPromise() {
	const endpoint =
		'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';	
	const response = await fetch(endpoint);
	const data = await response.json();
	return data;
}

function findMatches(data, subset) {
	return data.filter((item) => {
		const cityName = item.city.toLowerCase();
		const stateName = item.state.toLowerCase();
		return cityName.includes(subset) || stateName.includes(subset);
	});
}

function removeAllChildrens(element) {
	[ ...element.childNodes ].forEach((item) => item.remove());
}

function displayResults(filteredData, element) {
	const list = document.querySelector('.suggestions');
	const hitsArr = [];
	if (!element.value) {
		removeAllChildrens(element);
	} else {
		filteredData.forEach(function(item) {
			const regEx = new RegExp(element.value, 'gi');
			const cityState = `${item.city}, ${item.state}`;
			const highlight = cityState.replace(regEx, '<span class="highlight">' + element.value + '</span>');
			const row = `<li class="suggestion"><span>${highlight}</span><span>${item.population}</span></li>`;
			hitsArr.push(row);
		});
	}
	list.innerHTML = hitsArr.join('');
}

function formatNumber(number) {
	const formatter = new Intl.NumberFormat();
	return formatter.format(number);
}

function formatObjectNumber(data) {
	data.forEach( function(item) {item.population = formatNumber(+item.population)});
	return data;
}

const citiesArr = [];
getPromise().then( (data) => citiesArr.push(...formatObjectNumber(data)) );
const searchInput = document.querySelector('#city-search');

searchInput.addEventListener('change', function() {
	const filteredData = findMatches(citiesArr, this.value.toLowerCase());
	displayResults(filteredData, this);
});

searchInput.addEventListener('keyup', function() {
	const filteredData = findMatches(citiesArr, this.value.toLowerCase());
	displayResults(filteredData, this);
});

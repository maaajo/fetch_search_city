'use strict';

function getData() {
	const arrCities = [];
	const endpoint =
		'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
	fetch(endpoint).then((resp) => resp.json()).then((data) => arrCities.push(...data));
	return arrCities;
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
			const numberFormatted = formatNumberToCurrency(+item.population);
			const row = `<li class="suggestion"><span>${item.city}, ${item.state}</span><span>${numberFormatted}</span></li>`;
			hitsArr.push(row);
		});
	}
	list.innerHTML = hitsArr.join('');
}

function formatNumberToCurrency(number) {
	const formatter = new Intl.NumberFormat();
	return formatter.format(number);
}

const data = getData();
const searchInput = document.querySelector('#city-search');

searchInput.addEventListener('change', function() {
	const filteredData = findMatches(data, this.value.toLowerCase());
	displayResults(filteredData, this);
});

searchInput.addEventListener('keyup', function() {
	const filteredData = findMatches(data, this.value.toLowerCase());
	displayResults(filteredData, this);
});

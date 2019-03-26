'use strict';

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

function removeAllChildren(element) {
	[ ...element.childNodes ].forEach((item) => item.remove());
}

function createHighlightOfSubstring(substring, fullText) {
	const regEx = new RegExp(substring, 'gi');
	return fullText.replace(regEx, (str) => '<span class="highlight">' + str + '</span>');
}

function displayResults(filteredData, element) {
	const list = document.querySelector('.suggestions');
	const hitsArr = [];
	if (!element.value) {
		removeAllChildren(element);
	} else {
		filteredData.forEach(function(item) {
			const cityState = `${item.city}, ${item.state}`;
			const highlightedText = createHighlightOfSubstring(element.value, cityState);
			const row = `<li class="suggestion"><span>${highlightedText}</span><span>${item.population}</span></li>`;
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
	data.forEach(function(item) {
		item.population = formatNumber(+item.population);
	});
	return data;
}

const citiesArr = [];
getPromise().then((data) => citiesArr.push(...formatObjectNumber(data)));
const searchInput = document.querySelector('#city-search');

searchInput.addEventListener('change', function() {
	const filteredData = findMatches(citiesArr, this.value.toLowerCase());
	displayResults(filteredData, this);
});

searchInput.addEventListener('keyup', function() {
	const filteredData = findMatches(citiesArr, this.value.toLowerCase());
	displayResults(filteredData, this);
});

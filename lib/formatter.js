function formatText(value) {
	return value.replace(/\n/g, '');
}

function formatNumber(value) {
	return value.replace(/\s|%|-/g, '').replace(/,/g, '.').replace(/R\$/g, '');
}

module.exports = { formatText, formatNumber };
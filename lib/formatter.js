const EMPTY = "";

function formatText(value) {
	return value ? value.replace(/\n/g, '') : EMPTY;
}

function formatNumber(value) {
	return value ? value.replace(/\s|%|-/g, '').replace(/,/g, '.').replace(/R\$/g, '') : EMPTY;
}

module.exports = { formatText, formatNumber };
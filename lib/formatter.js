const EMPTY = "";

function formatText(value) {
	return value ? value.replace(/\n/g, '').trim() : EMPTY;
}

function formatNumber(value) {
	return value ? value.replace(/[^\d,]/g, '').replace(/,/g, '.').trim() : EMPTY;
}

module.exports = { formatText, formatNumber };

const EMPTY = "";

function formatText(value) {
	return value ? value.replace(/\n/g, '') : EMPTY;
}

function formatNumber(value) {
	return value ? value.replace(/[^\d,]/g, '').replace(/,/g, '.') : EMPTY;
}

module.exports = { formatText, formatNumber };
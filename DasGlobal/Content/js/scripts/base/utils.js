class Utils {
    constructor() {
    }

    formatDate(value, incluirHora = false, withEmptyValue = false) {
        if (!value) {
            return withEmptyValue ? this.emptyValue() : '';
        }
        const formato = incluirHora ? 'DD/MM/YYYY HH:mm A' : 'DD/MM/YYYY';

        return moment(value).format(formato);
    }

    wrapText(text) {
        return `<span class="text-wrap" style="width: 50rem">${text || ''}</span>`;
    }

    /**
     * Devuelve un valor en caso de no existir uno
     * @param value
     * @returns {string}
     */
    emptyValue(value = undefined) {
        return value ? value : '-----';
    }

    /**
     * strip string
     */
    stripHtml(value) {
        if (!value) {
            return '';
        }
        value = value + '';
        return value.replace(/(<([^>]+)>)/ig, "").trim();
    }

    phoneToLink(value, emptyValue = false) {
        return value ? `<a href="tel:${value}" target="_top">${value}</a>` : emptyValue ? this.emptyValue(null) : '';
    }
}
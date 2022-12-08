class TablesManagerDataConvert extends BaseContext {
    /**
     *
     * @param {TablesManager} context
     */
    constructor(context) {
        super(context);
        /**
         *
         * @type {TablesManager}
         */
        this.context = context;
    }

    getCleanedData(headers = [], data = []) {
        let items = [];

        data.forEach(item => {
            let currentItem = {};
            for (let j = 0; j < headers.length; j++) {
                let value;
                switch (headers[j].type) {
                    case 'M':
                        value = item[headers[j].index];
                        break;
                    case 'M.4':
                        value = item[headers[j].index];
                        break;
                    case 'S':
                        value = this.util.stripHtml(item[headers[j].index]);
                        break;
                    case 'D':
                        value = this.util.formatDate(item[headers[j].index]);
                        break;
                    case 'DT':
                        value = this.util.formatDate(item[headers[j].index], true);
                        break;
                    case 'P':
                        value = item[headers[j].index];
                        break;
                    case '@':
                        value = item[headers[j].index] || '';
                        break;
                    case 'TEL':
                        value = item[headers[j].index] || '';
                        break;
                    case 'NOT':
                        value = '';
                        break;
                    default:
                        value = item[headers[j].index];
                        break;
                }

                currentItem[headers[j].value] = value;
            }

            items.push(currentItem);
        });

        return items;
    }


    convertData(data = [], all = false) {
        let items = [];
        let row = '';
        let headers = this.context.options.headers;
        data.forEach(item => {
            let current = [];
            for (let i = 0; i < item.length; i++) {
                if (all || headers[i].state) {
                    let itemHeader = headers[i].type.replace('BD', '');
                    switch (itemHeader) {
                        case 'S':
                            row = this.context.options.wrapText ? this.util.wrapText(item[i]) : item[i];
                            break;
                        case 'S.W':
                            row = this.util.wrapText(item[i]);
                            break
                        case 'D':
                            row = this.util.formatDate(item[i]);
                            break;
                        case 'DT':
                            row = this.util.formatDate(item[i], true);
                            break;
                        case 'TEL':
                            row = this.util.phoneToLink(item[i]);
                            break;
                        case 'N':
                            row = item[i] !== null ? item[i] : '';
                            break;
                        default:
                            row = item[i] || '';
                            break;
                    }

                    switch (headers[i].style) {
                        case 'B':
                            row = `<span class="font-weight-bold">${row}</span>`;
                            break;
                        case 'B-GREEN':
                            row = `<span class="font-weight-bold text-success">${row}</span>`;
                            break;
                        case 'GREEN':
                            row = `<span class="text-success">${row}</span>`;
                            break;
                        case 'B-RED':
                            row = `<span class="font-weight-bold text-danger">${row}</span>`;
                            break;
                        case 'RED':
                            row = `<span class="text-danger">${row}</span>`;
                            break;
                        case 'I':
                            row = `<span class="font-italic">${row}</span>`;
                            break;
                        case 'BI':
                            row = `<span class="font-weight-bold font-italic">${row}</span>`;
                            break;
                        default:
                            break;
                    }

                    if (headers[i].type.includes("BD")) {
                        current.push(`<strong>${row}</strong>`);
                    } else {
                        current.push(row);
                    }
                }
            }
            items.push(current);
        });
        return items;
    }

    getCleanedHeaders(headers) {
        let items = [];

        for (let i = 0; i < headers.length; i++) {
            items.push({
                value: headers[i]['value'],
                type: headers[i]['type'] || 'S',
                index: i,
                class: headers[i]['class'],
                style: headers[i]['style'],
                state: true
            });
        }
        return items;
    }

}
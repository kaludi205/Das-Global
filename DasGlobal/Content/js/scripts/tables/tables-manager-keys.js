class TablesManagerKeys extends BaseContext {
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
        this.disableKeys = false;
    }


    /**
     * Generar eventos de la navegación en las tablas
     * @param table
     */
    generarEventosDeKeys(table) {
        const id = `#${this.context.options.tableId}`;
        const self = this;
        /**
         * Cuando la fila toma el focus
         */
        $(id)
            .on('key-focus.dt', function (e, datatable, cell) {
                table.row(cell.index().row).select();

            })
            .on('click', 'tbody td.child,tbody tr.child,tbody li', function (e) {
                e.stopImmediatePropagation();
            })
            .on('click', 'tbody td', function (e) {
                e.stopPropagation();
                if (!$(this).parent('tr').hasClass('dtrg-group')) {
                    const rowIdx = table.cell(this).index().row;
                    table.row(rowIdx).select();
                    self.disableKeys = false;
                }
            })
            .on('dblclick', 'tbody td', function () {
                if (!$(this).parent('tr').hasClass('dtrg-group')) {
                    self.launchModal(table);
                }
            })
            .on('key.dt', function (e, datatable, key, cell, originalEvent) {

                if (!self.disableKeys) {
                    if (key === 13) {
                        $(`${id} tr.table-info button.tableEnter`).trigger('click');
                    } else if (key === 121) {
                        originalEvent.preventDefault();
                        $(`${id} tr.table-info button.tableEnter`).trigger('click');
                        $(`${id} tr.table-info a.tableEnter`).trigger('click');
                    }
                    self.disableKeys = true;
                }
            });

    }

    /**
     * Método que lanza la modal al presionar enter o hacer double click
     * @param table
     */
    launchModal(table) {
        const self = this;
        let html = '<dl class="row label-sm">';
        let count = 0;
        let id = `#${this.context.options.tableId}`;

        let headers = this.context.getHeaders(table);

        // Obtiene la data de la fila seleccionada y la itera formando dts y dds
        table.row($(`${id} tr.table-info`)).data().forEach(item => {
            let header = headers[count];
            if (header !== '' && header.toLowerCase() !== 'opciones') {
                html += `
                            <dt class="col-sm-4">${header}</dt>
                            <dd class="col-sm-8">${self.util.emptyValue(item)}</dd>
                        `;
            }

            count++;
        });
        html += '</dl>';
        $('#ModalDetalleFilaDesdeDatatableContainer').html(html);
        $('#ModalDetalleFilaDesdeDatatable').modal('show');
        this.context.options.isActiveTable = true;
    }

}
class TablesManager extends Base {
    /**
     * @typedef {{
     *      value: string,
     *      style: '' | 'B' | 'BI' | 'I',
     *      type: '' | 'M' |  'U' | 'DE' | 'N' | 'B.A' | 'B.S' | 'B.C' | 'B.A.N' | 'B.S.N' | 'B.C.N' | 'B.I.S' | 'B.I.A' | 'B.I.C' | 'B.I.S.N' | 'B.I.A.N' | 'B.I.C.N' | 'S' | 'D' | 'DT' | 'D.U' | 'DT.U' | 'T' | 'NOT',
     *      class: '' | 'all' | 'none'
     * }} tableManagerHeader
     */
  
    /**
     * @param {string} tableId
     * @param {Array.<tableManagerHeader>} headers
     * @param rows
     * @param {'Btirf' | 't' | 'tf' | 'ti' | 'Bt' | 'Btf'} dom
     * @param {boolean} enableOrdering
     * @param {Array.<{value: string, class: 'center' | 'right' | 'left', count: Number}>} groupingHeaders
     */
    constructor(tableId, headers, rows = [], dom = 'Btirf', enableOrdering = true, groupingHeaders = []) {
        super();

        this.tableId = tableId;
        this.dataConvert = new TablesManagerDataConvert(this);
        this.keysManager = new TablesManagerKeys(this);

        this.renderOptions = {
            Normal: 0
        };

        this.options = {
            selector: '#' + tableId,
            firstCall: true,
            isActiveTable: false,
            tablaHtml: '',
            currentRows: [],
            currentData: [],
            currentFilterData: [],
            tableId: tableId,
            enableOrdering: enableOrdering,
            headers: this.dataConvert.getCleanedHeaders(headers),
            groupingHeaders: groupingHeaders,
            dom: (dom.trim() === '' ? 'Btiprlf' : dom)
                .replace('p', '')
                .replace('l', ''),
            currentConfigOrdering: {},
            currentColumnGroup: -1,
            currentExtraConfig: {},
            currentKeyEvents: true,
            responsive: true,
            headersVisible: [],
            currentSearch: '',
            columnTypes: [],
            /**
             * 0 - Tabla normal
             * 1 - PivotTable
             */
            currentRenderOption: 0,
            enableLine: true,
            countForPaging: 50,
            domButtons: 'ba',
            currentSearchClean: false,
            wrapText: true,
            fixedColumns: 0,
            timePreloader: 25
        };

        this.headerCount = [];

        $(`#${tableId}Container`).removeClass('table-responsive').addClass('mb-3').hide();

        this.firsCall = true;

        this.reInit([]);
    }

    init() {

        const tableId = this.options.tableId;
        let headersHtml = '';

        /**
         * Generamos los encabezados para la tabla y agrupador de columnas
         * @type {number}
         */
        let count = 0;
        this.options.headersVisible = [];
        this.options.headers.forEach(header => {
            headersHtml += `<th class="${header.class}">${header.value}</th>`;
            this.headerCount.push(count);


            if (!header.state) {
                this.options.headersVisible.push(count);
            }
            count++;
        });

        let columnGrouping = '';

        if (this.options.groupingHeaders.length > 0) {
            columnGrouping = '<tr>';
            this.options.groupingHeaders.forEach(item => {
                columnGrouping += `<th colspan="${item.count}" class="border-right text-${item.class}">${item.value}</th>`;
            });
            columnGrouping += '</tr>';
        }


        /**
         * Construimos la tabla una sola vez
         * @type {string}
         */

        let lineaSeparadora = this.options.enableLine
            ? `<hr class="card-border border border-primary"/>`
            : '';
        this.tabla = `                                
                ${lineaSeparadora}
                <div class="row" id="accordionTablesManager${this.tableId}">      
                                    
                    <div class="col-md-12 mt-2" id="normal${this.tableId}Container" style="display: none">
                        <table  class="table ${this.options.domButtons.includes('b') ? 'table-bordered' : ''} table nowrap display table-sm" style="width:100%;" id="${tableId}">
                            <thead class=" table-header bg-primary text-white">
                                ${columnGrouping}
                                <tr>
                                    ${headersHtml}
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>                                
        `;


    }

    reInit(rows = [], keysEvent = true, extraConfig = {}, disablePaging = false, tableSize = {ScrollY: '500px', ScrollX: true}) {
        if (typeof rows === 'string' || rows instanceof String) rows = [];


        if (this.options.domButtons.includes('m')) {

            if (!this.firsCall && rows.length > 50 && this.options.timePreloader > 0) {
                this.swal2.showLoading('Procesando tabla...', true)
            }

            setTimeout(() => {
                this.firsCall = false;
            }, 500);

            if (rows.length < 50) {
                return this.reInitSecond(rows, keysEvent, extraConfig, disablePaging, tableSize);
            } else if (this.options.timePreloader > 0) {
                setTimeout(() => {
                    return this.reInitSecond(rows, keysEvent, extraConfig, disablePaging, tableSize);
                }, this.options.timePreloader);
            } else {
                return this.reInitSecond(rows, keysEvent, extraConfig, disablePaging, tableSize);
            }
        } else {
            return this.reInitSecond(rows, keysEvent, extraConfig, disablePaging, tableSize);
        }

    }

    reInitSecond(rows = [], keysEvent = true, extraConfig = {}, disablePaging = false, tableSize = {ScrollY: '500px', ScrollX: true}) {

        this.options.currentData = rows;

        switch (this.options.currentRenderOption) {
            default:
                break;
        }
        let searchValue = $(`#searchTable${this.tableId}`).val();
        if (this.options.currentSearchClean) {
            searchValue = '';
        }
        this.options.currentSearch = searchValue ? searchValue.trim() : searchValue;
        
        if (!disablePaging && rows.length > this.options.countForPaging) {

            const self = this;

            $(`#${this.tableId}Container`)
                .html(`<div id="${this.tableId}Container2"></div><div class="mt-1" id="MyPagination${this.tableId}"></div>`)
                .show();


            $('#MyPagination' + this.tableId).pagination({
                dataSource: rows,
                pageSize: this.options.countForPaging,
                showGoInput: true,
                className: 'paginationjs-theme-skin paginationjs-small',
                showGoButton: true,
                callback: function (data, pagination) {
                    self.options.currentRows = data;
                    self.reInitTable(data, keysEvent, extraConfig, tableSize);
                    $(`#MyPagination${self.tableId} input.J-paginationjs-go-pagenumber`).addClass('not-affect');
                }
            });


        } else {
            $(`#${this.tableId}Container`)
                .html(`<div id="${this.tableId}Container2"></div>`)
                .show();

            this.options.currentRows = rows;
            return this.reInitTable(rows, keysEvent, extraConfig, tableSize);
        }


    }

    reInitTable(items = [], keysEvent = true, extraConfig = {}, tableSize = {ScrollY: '500px', ScrollX: true}) {

        this.init();

        const self = this;
        const tableId = this.options.tableId;
        const id = `#${tableId}`;
        const dom = this.options.dom;

        const rows = this.dataConvert.convertData(items, true);

        if (!this.options.currentStateColumnGroup) {
            this.options.currentExtraConfig = extraConfig;
        }
        this.options.currentKeyEvents = keysEvent;


        // LLenamos el contenedor con la tabla destruyendo la instancia actual y llenamos con las filas enviadas
        if (this.options.dom.includes('i')) {
            $(`${id}Container2`).html(`${this.tabla}<label id="informationSummary${this.tableId}" class="mt-2 table-body text-black">Mostrando <strong>${rows.length}</strong> de <strong>${this.options.currentData.length}</strong></label>`).show();
        } else {
            $(`${id}Container2`).html(this.tabla).show();
        }
        $(`#normal${this.tableId}Container`).show();
        /**
         * Creamos la instancia de las DataTables con la configuración del dom, extraConfig y el ordering
         */
        this.options.columnTypes = [];
        this.options.headers.forEach(item => {

            let currentHeaderConfig = {
                "visible": item['state']
            };
            switch (item.type) {
                case 'D':
                case 'D.U':
                    currentHeaderConfig['sType'] = 'date-gt';
                    break;
                case 'M':
                    currentHeaderConfig['sType'] = 'money';
                    break;
            }
            this.options.columnTypes.push(currentHeaderConfig);
        });

        let config = Object.assign(
            {
                buttons: {
                    buttons: [],
                },
                scrollX: tableSize.ScrollX,
                scrollY: tableSize.ScrollY,
                responsive: this.options.responsive,
                processing: false,
                paginate: false,
                colReorder: this.options.groupingHeaders.length === 0,
                scrollCollapse: true,
                tabIndex: false,
                destroy: true,
                deferRender: true,
                pagination: false,
                paging: false,
                fixedColumns: this.options.fixedColumns > 0 ?
                    {
                        leftColumns: this.options.fixedColumns
                    } : false,
                dom: dom,
                //order: [],
                aoColumns: this.options.columnTypes,
                initComplete: function (settings, json) {
                    setTimeout(() => {

                        $(id).DataTable().columns.adjust().draw();
                        $(id + ' button[data-toggle="dropdown"]').dropdown();

                    });

                    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                        setTimeout(() => {
                            $(id).DataTable().columns.adjust().draw();
                        }, 200);
                    });
                },
                data: rows
            },
            extraConfig,
            this.options.currentConfigOrdering,
            this.options.currentColumnGroup === -1
                ? {}
                : {
                    rowGroup: {
                        dataSrc: this.options.currentColumnGroup
                    }
                }
        );

        const table = $(`${id}`).dataTable(config).DataTable();


        $(id + '_info').hide();
        /**
         * Movemos el dropdown de colvis a el lugar especifico en el encabezado del contenedor
         */
        

        /**
         * LLamamos al manejador de eventos de las keys
         */
        if (keysEvent && rows.length > 0) {
            this.keysManager.generarEventosDeKeys(table);
            this.clickFirstRow();
        }

        if (this.options.dom.includes('f')) {
            this.searchManager(table);
        }

        if (this.options.firstCall) {
            this.eventosDeFirstCall();
        }


        $('.dataTables_scrollBody').addClass('scrollbar-skin');
        this.swal2.hideLoading();

        return table;
    }


    /**
     * Obtener los encabezados en el orden actual
     * @param table
     * @returns {*}
     */
    getHeaders(table) {
        return table.columns().header().toArray().map(x => x.innerText);
    }


    /**
     * Eventos de una sola llamada
     */
    eventosDeFirstCall() {
        const self = this;
        // Evento de cierre de la modal
        $('#ModalDetalleFilaDesdeDatatable').on('hidden.bs.modal',
            function () {
                if (self.options.isActiveTable) {
                    $(`#${self.options.tableId} tbody tr.table-info td:last-child`).trigger('click').focus();
                }
                self.options.isActiveTable = false;
            });
        this.options.firstCall = false;
    }


    groupingManager() {
        const self = this;
        for (let i = 0; i < this.options.headers.length; i++) {
            $(`#buttonColumnGroup${this.options.tableId + i}`).on('click',
                function () {
                    if (self.options.currentColumnGroup === i) {
                        return;
                    }

                    self.options.currentColumnGroup = i;
                    self.options.currentStateColumnGroup = true;

                    self.reInitTable(
                        self.options.currentRows,
                        self.options.currentKeyEvents,
                        self.options.currentExtraConfig);
                });
        }

        $(`#buttonColumnGroup${this.options.tableId}-1`).on('click',
            function () {
                if (self.options.currentColumnGroup === -1) {
                    return;
                }
                self.options.currentColumnGroup = -1;
                self.reInitTable(
                    self.options.currentRows,
                    self.options.currentKeyEvents,
                    self.options.currentExtraConfig);
            });

        $(`#buttonColumnGroup${this.options.tableId + this.options.currentColumnGroup}`).addClass('active text-white');
    }

    searchManager(table) {
        const self = this;
        const tableId = this.options.tableId;

        const searchValue = this.options.currentSearch;

        $(`#${tableId}_filter`).hide();

        $(`#searchTable${tableId}`).keypress(event => {
            if (event.keyCode === 13) {
                event.preventDefault();
                $(`#btnSearch${tableId}`).trigger('click');
            }
        });

        $(`#btnSearch${tableId}`).on('click', function () {
            table.search($(`#searchTable${tableId}`).val()).draw();
            table.columns.adjust().draw();

        });


        if (searchValue !== '') {
            $(`#searchTable${tableId}`).val(searchValue);
            $(`#btnSearch${tableId}`).trigger('click');
        }

        setTimeout(() => {
            $(tableId + ' button[data-toggle="dropdown"]').dropdown();
        });
    }

    adjust() {
        setTimeout(() => {
            let table = $('#' + this.tableId).DataTable();
            table.columns.adjust().draw();
        }, 500)
    }

    clickFirstRow() {
        const table = $('#' + this.tableId).DataTable();
        const pageInfo = table.page.info() ||
            {
                end: 0,
                length: 25,
                page: 0,
                pages: 0,
                recordsDisplay: 0,
                recordsTotal: 0,
                serverSide: false,
                start: 0
            };


        if (pageInfo.recordsDisplay > 0) {
            $(`#${this.tableId} tbody tr:first-child td:last-child`).trigger('click').focus();
        }

        if (this.options.currentColumnGroup >= 0) {
            $(`#${this.tableId} tbody tr:nth-child(2) td:last-child`).trigger('click').focus();
        }
    }

    disableKeys() {
        if (this.options.currentKeyEvents) {
            setTimeout(() => {
                this.keysManager.disableKeys = true;
            }, 1000);
        }
    }
    
}
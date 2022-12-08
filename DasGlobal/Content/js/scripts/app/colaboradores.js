class Colaboradores extends Base {
    /**
     * @typedef {{
     *     Id: Number,
     *     FechaRegistro: Date,
     *     SucursalId: Number,
     *     Nombre: String,
     *     Cui: String
     * }}  colaborador
     */

    /**
     *
     * @param data
     */
    constructor(data) {
        super();
        /**
         *
         * @type {Array.<colaborador>}
         */
        this.modelItems = data.model || [];
        /**
         *
         * @type {Array.<empresa>}
         */
        this.empresas = data.empresas || [];
        /**
         *
         * @type {Array.<sucursal>}
         */
        this.sucursales = data.sucursales || [];

        this.rules = {
            Nombre: {
                'required': true,
                'maxlength': 100
            },
            Cui: {
                'required': true,
                'digits': true,
                'maxlength': 13
            },
            SucursalId: {
                'required': true
            }
        };

        this.formCreate = new FormsManager({
            action: 'Colaboradores Create',
            form: 'formCreate',
            method: 'post',
            rules: this.rules
        });

        this.formEdit = new FormsManager({
            action: 'Colaboradores Edit',
            form: 'formEdit',
            method: 'post',
            rules: this.rules
        });

        this.formDelete = new FormsManager({
            action: 'Colaboradores Delete',
            method: 'post'
        });

        this.table = new TablesManager('table', [
            {value: 'País', class: 'all', type: 'S'},
            {value: 'Empresa', class: '', type: 'S'},
            {value: 'Sucursal', class: '', type: 'S'},
            {value: 'Nombre', class: '', type: 'S'},
            {value: 'Cui', class: '', type: 'S'},
            {value: 'Fecha de registro', class: '', type: 'DT'},
            {value: 'Opciones', class: 'all', type: 'NOT'}
        ]);

        /**
         *
         * @type {colaborador}
         */
        this.currentItem = undefined;

        this.initComponents();
    }

    initComponents() {
        this.initEvents();

        let html = '';
        this.empresas.forEach(item => {
            html += `<option value="${item.Id}">${item.Pais.Codigo} - ${item.Pais.Nombre} / ${item.Nombre}</option>`;
        });

        $('#EmpresaId,#EmpresaIdEdit').html(html).trigger('change');

        this.generateTable();
    }

    initEvents() {
        const self = this;
        $(this.formCreate.formulario).submit(event => {
            event.preventDefault();
            if (self.formCreate.isValid) {
                self.create();
            }
        });

        $(this.formEdit.formulario).submit(event => {
            event.preventDefault();
            if (self.formEdit.isValid) {
                self.edit();
            }
        });

        $('#EmpresaId,#EmpresaIdEdit').on('change', function () {
            let val = $(this).val();
            
            if (val) {
                let sucursales = self.sucursales.filter(x => x.EmpresaId === parseInt(val));
                
                let html = '';
                sucursales.forEach(item => {
                    html += `<option value="${item.Id}">${item.Nombre}</option>`;
                });

                if (self.currentItem && sucursales.find(x => x.Id === self.currentItem.SucursalId)) {
                    $('#SucursalId,#SucursalIdEdit').html(html).val(self.currentItem.SucursalId).trigger('change');
                } else {
                    $('#SucursalId,#SucursalIdEdit').html(html).trigger('change');
                }


            } else {
                $('#SucursalId,#SucursalIdEdit').html('').trigger('change');
            }
        })
    }

    changeView(view = 'index') {
        $('#cardIndex,#cardEdit,#cardCreate').hide();
        
        switch (view) {
            case 'create':
                this.currentItem = undefined;
                this.formCreate.clear();
                $('#cardCreate').show();
                break;
            case 'edit':
                $('#cardEdit').show();
                break;
            default :
                this.formEdit.clear();
                $('#cardIndex').show();
        }
    }

    generateTable() {
        let rows = [];
        this.modelItems.forEach(item => {
            rows.push(this.getRow(item));
        });
        this.table.reInit(rows);
    }

    /**
     *
     * @param {colaborador} model
     */
    getRow(model) {
        
        let sucursal = this.sucursales.find(x => x.Id === model.SucursalId);
        let empresa = this.empresas.find(x => x.Id === sucursal.EmpresaId);

        return [
            `${empresa.Pais.Codigo} - ${empresa.Pais.Nombre}`,
            empresa.Nombre,
            sucursal.Nombre,
            model.Nombre,
            model.Cui,
            model.FechaRegistro,
            `<button onclick="instance.showEdit(${model.Id})" class="btn button-table-edit bg-warning btn-circle my-0 py-0 btn-sm mx-0 px-0 text-white" 
                type="button" data-title="Editar" data-title-pos="left">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button onclick="instance.deleteModel(${model.Id})" class="btn button-table-delete bg-danger btn-circle my-0 py-0 btn-sm mx-0 px-0 text-white"
                data-title="Eliminar" data-title-pos="left">
                <i class="fas fa-trash"></i>
            </button>`
        ];
    }

    create() {
        const self = this;
        this.swal2.question('create').then(result => {
            if (result.value) {
                self.formCreate.ajax().then(response => {
                    self.modelItems.push(response.data);
                    self.changeView();
                    self.generateTable();
                    self.swal2.successCreate();
                });
            }
        })
    }

    showEdit(id) {
        this.currentItem = this.modelItems.find(x => x.Id === id);
        let sucursal = this.sucursales.find(x => x.Id === this.currentItem.SucursalId);
        
        $('#NombreEdit').val(this.currentItem.Nombre).trigger('change');
        $('#CuiEdit').val(this.currentItem.Cui).trigger('change');
        $('#EmpresaIdEdit').val(sucursal.EmpresaId).trigger('change');
        $(`${this.formEdit.formulario} input[name="Id"]`).val(id);
        this.changeView('edit');
    }

    edit() {
        const self = this;
        this.swal2.question('edit').then(result => {
            if (result.value) {
                self.formEdit.ajax().then(response => {
                    let idx = self.modelItems.findIndex(x => x.Id === response.data.Id);
                    self.modelItems[idx] = response.data;
                    self.changeView();
                    self.generateTable();
                    self.swal2.successEdit();
                });
            }
        });
    }

    deleteModel(id) {
        const self = this;
        this.swal2.question('delete').then(result => {
            if (result.value) {
                self.formDelete.ajax({
                    id: id,
                    __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
                }).then(() => {
                    const idx = self.modelItems.findIndex(x => x.Id === id);
                    self.modelItems.splice(idx, 1);
                    self.generateTable();
                    self.swal2.successDelete();
                });
            }
        });
    }

}
class Sucursales extends Base {
    /**
     * @typedef {{
     *     Id: Number,
     *     FechaRegistro: Date,
     *     EmpresaId: Number,
     *     Nombre: String,
     *     Direccion: String,
     *     Telefono: String,
     *     Empresa: empresa,
     * }}  sucursal
     */

    /**
     *
     * @param data
     */
    constructor(data) {
        super();
        /**
         *
         * @type {Array.<sucursal>}
         */
        this.modelItems = data.model || [];
        /**
         *
         * @type {Array.<empresa>}
         */
        this.empresas = data.empresas || [];

        this.rules = {
            Nombre: {
                'required': true,
                'maxlength': 100
            },
            Direccion: {
                'required': true,
                'maxlength': 200
            },
            Telefono: {
                'required': true,
                'maxlength': '25'
            },
            EmpresaId: {
                'required': true
            }
        };

        this.formCreate = new FormsManager({
            action: 'Sucursales Create',
            form: 'formCreate',
            method: 'post',
            rules: this.rules
        });

        this.formEdit = new FormsManager({
            action: 'Sucursales Edit',
            form: 'formEdit',
            method: 'post',
            rules: this.rules
        });

        this.formDelete = new FormsManager({
            action: 'Sucursales Delete',
            method: 'post'
        });

        this.table = new TablesManager('table', [
            {value: 'País', class: 'all', type: 'S'},
            {value: 'Empresa', class: '', type: 'S'},
            {value: 'Nombre', class: '', type: 'S'},
            {value: 'Teléfono', class: '', type: 'phone'},
            {value: 'Dirección', class: '', type: 'S'},
            {value: 'Fecha de registro', class: '', type: 'DT'},
            {value: 'Opciones', class: 'all', type: 'NOT'}
        ]);

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
        })
    }

    changeView(view = 'index') {
        $('#cardIndex,#cardEdit,#cardCreate').hide();
        switch (view) {
            case 'create':
                $('#cardCreate').show();
                break;
            case 'edit':
                $('#cardEdit').show();
                break;
            default :
                this.formEdit.clear();
                this.formCreate.clear();
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
     * @param {sucursal} model
     */
    getRow(model) {
        let empresa = this.empresas.find(x => x.Id === model.EmpresaId);
        
        return [
            `${empresa.Pais.Codigo} - ${empresa.Pais.Nombre}`,
            empresa.Nombre,
            model.Nombre,
            model.Telefono,
            model.Direccion,
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
        let model = this.modelItems.find(x => x.Id === id);
        $('#NombreEdit').val(model.Nombre).trigger('change');
        $('#EmpresaIdEdit').val(model.EmpresaId).trigger('change');
        $('#TelefonoEdit').val(model.Telefono).trigger('change');
        $('#DireccionEdit').val(model.Direccion).trigger('change');
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
class Empresas extends Base {
    /**
     * @typedef {{
     *     Id: Number,
     *     FechaRegistro: Date,
     *     PaisId: Number,
     *     Nombre: String,
     *     Pais: pais,
     * }}  empresa
     */

    /**
     *
     * @param data
     */
    constructor(data) {
        super();
        /**
         *
         * @type {Array.<empresa>}
         */
        this.modelItems = data.model || [];
        /**
         *
         * @type {Array.<pais>}
         */
        this.paises = data.paises || [];

        this.rules = {
            Nombre: {
                "required": true,
                "maxlength": 100
            },
            PaisId: {
                "required": true
            }
        };

        this.formCreate = new FormsManager({
            action: 'Empresas Create',
            form: 'formCreate',
            method: 'post',
            rules: this.rules
        });

        this.formUpload = new FormsManager({
            action: 'Empresas UploadFile',
            form: 'formUpload',
            method: 'post',
            rules: {
                file: {
                    required: true
                }
            }
        });

        this.formEdit = new FormsManager({
            action: 'Empresas Edit',
            form: 'formEdit',
            method: 'post',
            rules: this.rules
        });

        this.formDelete = new FormsManager({
            action: 'Empresas Delete',
            method: 'post'
        });

        this.table = new TablesManager('table', [
            {value: 'País', class: '', type: ''},
            {value: 'Nombre', class: 'all', type: 'S'},
            {value: 'Fecha de registro', class: '', type: 'DT'},
            {value: 'Opciones', class: 'all', type: 'NOT'}
        ]);

        this.initComponents();
    }

    initComponents() {
        this.initEvents();

        let html = '';
        this.paises.forEach(item => {
            html += `<option value="${item.Id}">${item.Codigo} - ${item.Nombre}</option>`;
        });

        $('#PaisId,#PaisIdEdit').html(html).trigger('change');

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
        
        $(this.formUpload.formulario).submit(event => {
            event.preventDefault();
            if (self.formUpload.isValid) {
                self.upload();
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
        $('#cardIndex,#cardEdit,#cardCreate,#cardUpload').hide();
        switch (view) {
            case 'create':
                $('#cardCreate').show();
                break;
            case 'upload':
                $('#cardUpload').show();
                break;
            case 'edit':
                $('#cardEdit').show();
                break;
            default :
                this.formEdit.clear();
                this.formUpload.clear();
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
     * @param {empresa} model
     */
    getRow(model) {
        let pais = this.paises.find(x => x.Id === model.PaisId);

        return [
            `${pais.Codigo} - ${pais.Nombre}`,
            model.Nombre,
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
        $('#PaisIdEdit').val(model.PaisId).trigger('change');
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

    upload() {
        const self = this;
        this.swal2.question('create').then(result => {
            if (result.value) {
                self.formUpload.ajax(undefined, true).then(response => {
                    /**
                     * @type {empresa}
                     */
                    let empresa = response.data;
                    
                    let pais = this.paises.find(x => x.Id === empresa.PaisId);
                    if (!pais){
                        this.paises.push(empresa.Pais);
                    } 
                    
                    self.modelItems.push(response.data);
                    self.changeView();
                    self.generateTable();
                    self.swal2.successCreate();
                });
            }
        })
    }

}
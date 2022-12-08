class CustomSweetAlert {

    constructor() {
        this.swal2 = swal;
        
        this.swalWithBootstrapButtons = this.swal2.mixin({
            customClass: {
                confirmButton: 'btn ml-1 button-confirm bg-primary btn-rounded btn-sm text-white',
                cancelButton: 'btn mr-1 button-cancel bg-danger btn-rounded btn-sm text-white',
            },
            buttonsStyling: false,
            allowOutsideClick: false
        });
    }

    /**
     *
     * @param {'create' |'edit' | 'delete' | 'question' }  type
     * @param {string} text
     * @param html
     * @returns {Promise<{value: boolean}>}
     */
    question(type = '', text = '', html = '') {
        switch (type) {
            case 'create':
                text = text = text === '' ? 'Se creará el registro' : text;
                break;
            case 'edit':
                text = text = text === '' ? 'Se modificará el registro' : text;
                break;
            case 'delete':
                text = text = text === '' ? 'Se eliminará el registro' : text;
                break;
        }

        return this.swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: text.toUpperCase(),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-times-circle"></i> Cancelar`,
            cancelButtonText: `<i class="fas fa-check-circle"></i> Confirmar`,
            reverseButtons: true,
            html: html
        });
    }

    speedyQuestion(html = '') {
        return this.swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: '',
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-times-circle"></i> Cancelar`,
            cancelButtonText: `<i class="fas fa-check-circle"></i> Confirmar`,
            reverseButtons: true,
            html: html,
            imageUrl: '/Images/danger.png',
            imageWidth: 250,
            imageHeight: 250,
            imageAlt: 'Danger image'
        });
    }

    successCreate(message = 'Se ha creado un nuevo registro') {
        this.hideLoading();
        toastr.success(message, 'Correcto!');
    }

    cancel(message = 'Se ha cancelo la operación') {
        this.hideLoading();
        toastr.success(message, 'Correcto!');
    }

    successAnular(message = 'Se ha anulado el registro') {
        this.hideLoading();
        toastr.success(message, 'Correcto!');
    }

    successDelete(message = 'Se ha eliminado el registro') {
        this.hideLoading();
        toastr.success(message, 'Correcto!');
    }

    successEdit(message = 'Se ha modificado el registro') {
        this.hideLoading();
        toastr.success(message, 'Correcto!');
    }

    errorEdit(message = 'No se pudo modificar el registro') {
        this.hideLoading();
        toastr.error(message, 'Error!');
    }

    errorCreate(message = 'No se pudo crear el registro') {
        this.hideLoading();
        toastr.error(message, 'Error!');
    }

    errorAnular(message = 'No se pudo anular el registro') {
        this.hideLoading();
        toastr.error(message, 'Error!');
    }

    errorDelete(message = 'No se pudo eliminar el registro') {
        this.hideLoading();
        toastr.error(message, 'Error!');
    }

    errorMessage(message='', title = 'Error!') {
        this.hideLoading();
        toastr.error(message.toUpperCase(), title);
    }

    warningMessage(message, title = 'Advertencia!') {
        this.hideLoading();
        toastr.warning(message, title);
    }


    successMessage(message, title = 'Correcto!') {
        this.hideLoading();
        toastr.success(message, title);
    }

    showLoading(message = 'Por favor, espere...', allowOutsideClick = false) {
        
        swal.fire({
            title: message,
            allowOutsideClick: allowOutsideClick,
            onOpen: () => {
                swal.showLoading();
            }
        });
        
    }


    errorStock(message = 'El Stock Minimo no puede ser mayor al Stock Máximo') {
        this.errorMessage(message);
    }

    error(message = 'Faltan datos') {
        this.errorMessage(message);
    }

    advertencia(message = 'Faltan datos') {
        this.warningMessage(message);
    }

    errorPrecio(message = 'El Precio no puede ser Menor al Costo') {
        this.errorMessage(message);
    }

    errorSerie(message = 'Tiene un error en las series de Factura') {
        this.errorMessage(message);
    }


    hideLoading() {
        swal.close();
    }


    successAnulado(message = 'Se ha anulado un registro con éxito') {
        this.successMessage(message);
    }


    errorValidate(message = 'No Existe') {
        this.warningMessage(message);
    }
    
    successCreateDialog(text='confirmado',title='Confirmado'){
    
        return this.swalWithBootstrapButtons.fire({
                                                      title: title.toUpperCase(),
                                                      text: text.toUpperCase(),
                                                      icon: 'success',
                                                      showCancelButton: false,
                                                      confirmButtonText: `<i class="${this.icon.ButtonConfirm}"></i>  ${this.texto.ButtonConfirm}`,
                                                      reverseButtons: true,
        
                                                      allowOutsideClick: true,
                                                      html: ''
                                                  });
    }
    
    alert(html = '', title = '', imageUrl = '/Images/danger.png') {
        return swal.fire({
                             title: title,
                             text: '',
                             confirmButtonText: `<i class="${this.icon.ButtonConfirm}"></i>  ${this.texto.ButtonConfirm}`,
                             reverseButtons: true,
                             html: html,
                             width: '80%',
                             imageUrl: imageUrl,
                             imageWidth: 250,
                             imageHeight: 250,
                             imageAlt: 'Danger image',
                             allowOutsideClick: true
                         });
    }
}
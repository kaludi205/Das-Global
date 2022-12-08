class FormsManager extends Base {
    /**
     *
     * @param action
     * @param rules
     * @param messages
     * @param {String} form
     * @param {'get' | 'post'} method
     * @param {Boolean} silentCall
     */
    constructor({
                    action,
                    rules   = {},
                    messages = {},
                    form = '',
                    method= 'get',
                    silentCall= false
                }) {
        super();

        this.formulario = `#${form}`;
        this.formularioDefault = form;
        this.action = action;
        this.rules = rules || {};
        this.messages = messages || {};
        this.method = method || 'get';
        this.silentCall = silentCall || false;

        this.urlExterno = '';
        this.url = '';
        this.isValid = false;
        this.currentId = this.randomString();
        this.timeOfCall = setTimeout(() => {
        }, 100);

        this.initComponents();
    }

    initComponents() {
        const self = this;
        if (this.formulario !== '#') {
            $(this.formulario).attr('autocomplete', 'off');

            $(this.formulario).validate({
                rules: this.rules,
                messages: this.messages,
                submitHandler: (form) => {
                    self.isValid = true;
                }
            });

            let rules = this.rules || {};

            Object.keys(rules).forEach(key => {
                let item = rules[key];
                let input = $(`${this.formulario} input[name="${key}"]`);

                if (input.length === 0) {
                    input = $(`${this.formulario} select[name="${key}"]`);
                    if (input.length === 0) {
                        input = $(`${this.formulario} textarea[name="${key}"]`);
                    }
                }

                if (input.length > 0) {
                    if (item['required']) {
                        let label = $(`${this.formulario} label[for="${input.attr('id')}"]`);
                        label.text(label.text() + ' *');
                    }

                    if (item['maxlength'] !== undefined) {
                        input.attr('length', item['maxlength']);
                    }
                }
            });
        }


        // Se crea la Url
        let tempModulo = this.action;
        while (tempModulo.includes(' ')) {
            tempModulo = tempModulo.replace(' ', '/');
        }
        this.url = '/' + tempModulo;
    }

    randomString(length = 10) {
        let text = '';
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++) {
            text += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }

        return text;
    }

    open(data = undefined, target = '_blank') {
        if (data === undefined) {
            data = this.formulario === '#' ? '' : $(this.formulario).serialize();
        }
        window.open(`${this.url}?${data}`, target);
    }

    /**
     *
     * @param data
     * @param includeFile
     * @returns {{getAllResponseHeaders: function(): *|null, abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): null|*, overrideMimeType: function(*): this, statusCode: function(*=): this}|*|jQuery}
     */
    ajax(data = undefined, includeFile = false) {

        if (data === undefined) {
            data = this.formulario === '#' ? {} : $(this.formulario).serialize();
        }


        const self = this;
        if (!this.silentCall && this.method === 'post') {
            this.swal2.showLoading();
        }
        if (includeFile === true) {
            const formElement = document.getElementById(this.formularioDefault);
            data = new FormData(formElement);

            return $.ajax({
                method: self.method,
                url: self.urlExterno + self.url,
                dataType: 'json',
                data: data,
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            return $.ajax({
                method: self.method,
                url: self.urlExterno + self.url,
                dataType: 'json',
                data: data,
                beforeSend: function () {
                    clearTimeout(self.timeOfCall);
                    self.timeOfCall = setTimeout(() => {
                        Pace.start();
                        $('#' + self.currentId).remove();
                        self.currentId = self.randomString();
                        $('#ContainerLayoutBase').prepend(`<div class="progress-line w-100" id="${self.currentId}"></div>`);
                    }, 2000);
                },
                complete: function () {
                    Pace.stop();
                    $('#' + self.currentId).remove();
                    clearTimeout(self.timeOfCall);
                }
            });
        }
    }


    partial(data = undefined) {

        if (data === undefined) {
            data = this.formulario === '#' ? {} : $(this.formulario).serialize();
        }

        const self = this;
        if (this.method === 'post') {
            this.swal2.showLoading();
        }
        return $.ajax({
            url: self.url,
            data: data,
            datatype: "json",
            type: self.method,
            contenttype: 'application/json; charset=utf-8',
            async: true
        });
    }

    clear() {
        this.isValid = false;
        $(this.formulario)[0].reset();
        this.clearValidations();
        $('.dropify-clear').click();
    }

    clearValidations() {
        const self = this;
        $(`${this.formulario} input, textarea`).each(function () {
            let element = $(this);
            element.removeClass('is-valid is-invalid text-danger text-success')
                .removeData('previousValue');

            $(`${self.formulario} #${element.prop('id') + '-error'}`).remove();
        });

        $(`${this.formulario} select`).each(function () {
            let element = $(this);
            element.removeClass('is-valid is-invalid text-danger text-success')
                .removeData('previousValue');

            $(`${self.formulario} #${element.prop('id') + '-error'}`).remove();

            $(this).trigger('change');
        });

    }

    trigger(event = 'submit') {
        $(`${this.formulario}`).trigger(event);
    }


}

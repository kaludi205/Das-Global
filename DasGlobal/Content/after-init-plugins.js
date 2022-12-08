
$('.modal-fluid').each(function () {
    $(this).addClass('modal-dialog-scrollable');
});


$('.modal').on('shown.bs.modal', function () {
    if (!$(this).hasClass('not-affect')) {
        setTimeout(() => {
            if ($('input:visible:enabled:first', this).length > 0) {
                $('input:visible:enabled:first', this).focus();
            } else if ($('textarea:visible:enabled:first', this).length) {
                $('textarea:visible:enabled:first', this).focus();
            } else if ($('select:visible:enabled:first', this).length) {
                $('select:visible:enabled:first', this).focus();
            }
        }, 200);
    }
});

$('select').each(function () {
    let element = $(this);
    if (!element.hasClass('not-affect')) {

        element.select2()
            .on('select2:close', function () {
                try {
                    element.valid();
                } catch (e) {

                }
            });

    }
});

$(document).on("keyup", ".select2-search__field", function (e) {
    var eventObj = window.event ? event : e;
    if (eventObj.keyCode === 65 && eventObj.ctrlKey)
        selectAllSelect2($(this));
});

$(document).on('select2:open', (e) => {
    const selectId = e.target.id
    
    $(".select2-search__field[aria-controls='select2-" + selectId + "-results']").each(function (
        key,
        value,
    ) {
        value.focus()
    })
})

function selectAllSelect2(that) {
    var selectAll = true;
    var existUnselected = false;
    var id = that.parents("span[class*='select2-container']").siblings('select[multiple]').attr('id');
    var item = $("#" + id);

    item.find("option").each(function (k, v) {
        if (!$(v).prop('selected')) {
            existUnselected = true;
            return false;
        }
    });

    selectAll = existUnselected ? selectAll : !selectAll;

    item.find("option").prop('selected', selectAll).trigger('change');
}


$("input[type='text']," +
    "input[type='number']," +
    "input[type='email']," +
    "input[type='search']," +
    "input[type='password']," +
    "textarea"
).each(function () {

    if (!$(this).hasClass('timepicker') && !$(this).hasClass('datepicker')) {
        $(this)
            .on("focusout", function () {
                $(this).val($(this).val().trim());
            });
    }
});
//#endregion


$('form').each(function () {
    $(this).attr('autocomplete', 'off');
});


$("input[type='file']").each(function () {
    $(this).dropify(
        {
            defaultFile: '',
            maxFileSize: 0,
            minWidth: 0,
            maxWidth: 0,
            minHeight: 0,
            maxHeight: 0,
            showRemove: true,
            showLoader: true,
            showErrors: true,
            errorTimeout: 3000,
            errorsPosition: 'overlay',
            imgFileExtensions: ['png', 'jpg', 'jpeg'],
            maxFileSizePreview: "4M",
            allowedFormats: ['portrait', 'square', 'landscape'],
            allowedFileExtensions: ['*'],
            messages: {
                'default': 'Arrastrar y soltar un archivo o haga clic aquí',
                'replace': 'Arrastrar y soltar o haga clic en reemplazar',
                'remove': 'Quitar',
                'error': 'Vaya, sucedió algo malo.'
            },
            error: {
                'fileSize': 'El tamaño del archivo es demasiado grande ({{ value }} máximo).',
                'minWidth': 'El ancho de la imagen es demasiado pequeño ({{ value }}}px mínimo).',
                'maxWidth': 'El ancho de la imagen es demasiado grande ({{ value }}}px máximo).',
                'minHeight': 'La altura de la imagen es demasiado pequeña ({{ value }}}px mínimo).',
                'maxHeight': 'La altura de la imagen es demasiado grande ({{ value }}px máximo).',
                'imageFormat': 'El formato de imagen no está permitido ({{ value }} solamente).',
                'fileExtension': 'El archivo no esta permitido ({{ value }} solamente).'
            },
            tpl: {
                wrap: '<div  style="max-height: 110px;" class="dropify-wrapper"></div>',
                loader: '<div class="dropify-loader"></div>',
                message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                preview:
                    '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                filename: '<p class="dropify-filename"><span class="dropify-filename-inner"></span></p>',
                clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                errorLine: '<p class="dropify-error">{{ error }}</p>',
                errorsContainer: '<div class="dropify-errors-container"><ul></ul></div>'
            }
        }
    );
});
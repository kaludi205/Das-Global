////////////////////////// Configuraciones globales //////////////////////////

//#region DataTables

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "date-gt-pre": function (a) {
        let ukDatea = a.split('/');
        let val = (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
        return isNaN(val) ? 0 : val;
    },

    "date-gt-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-gt-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    },

    "money-pre": function (a) {
        let valueM = a.replace('Q', '');
        while (valueM.includes(',')) {
            valueM = valueM.replace(',', '');
        }

        let val = valueM * 1;
        return isNaN(val) ? 0 : val;
    },

    "money-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "money-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});


$.extend(true,
    $.fn.dataTable.defaults,
    {
        classes: {
            sPaging: ' pagination float-right  ',
            sPageButton: ' page-item btn-sm p-0 btn-pagination-font '
        },
        select: {
            style: 'single',
            className: 'table-info',
            blurable: true
        },
        keys: {
            keys: [13 /* ENTER */, 38 /* UP */, 40 /* DOWN */, 121, /* F10 */, 17],
            className: 'table-info',
            blurable: true
        },

        "language":
            {
                "lengthMenu":
                    '<span class=\'d-none d-md-inline\'>Mostrar </span> <select class=" form-control form-control-sm ">' +
                    '<option value="500">500</option>' +
                    '<option value="1000">1000</option>' +
                    '<option value="5000">5000</option>' +
                    '<option value="10000">10000</option>' +
                    '<option value="100000">100000</option>' +
                    '<option value="-1">Todos</option>' +
                    '</select> <span class=\'d-none d-md-inline\'> registros</span>',
                "sProcessing": "Procesando...",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando <strong>_TOTAL_</strong> registros",
                "sInfoEmpty": "Mostrando 0 registros",
                "sInfoFiltered": "(filtrado de un total de <strong>_MAX_</strong>)",
                "sInfoPostFix": "",
                "searchPlaceholder": "Buscar",
                "sSearch": "",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "<<<<",
                    "sLast": ">>>>",
                    "sNext": ">>",
                    "sPrevious": "<<"
                },
                "select": {
                    "rows": ''
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
    });
//#endregion

//#region jQuery Validate
$.validator.setDefaults({
    ignore: ":hidden:not(.pickerHiddenItem)",
    errorClass: 'is-invalid text-danger label-sm',
    validClass: 'is-valid text-success',
    errorsWrapper: '<div class="invalid-feedback label-sm"></div>',
    errorTemplate: '<div></div>',
    errorElement: 'span',
    errorPlacement: function (error, element) {
        if (element.prop('type') === 'select-one') {
            if (element.parent('div').hasClass('input-group-append')) {
                error.appendTo(element.parent('div').parent('div'));
            } else {
                error.appendTo(element.parent());
            }
        } else {
            if (element.parent('div').hasClass('input-group')) {
                error.appendTo(element.parent('div').parent('div'));
            } else if (element.hasClass('pickerHiddenItem')) {
                error.insertAfter(element.parent('div').children('input.pickerCurrentItem:first'));
            } else {
                error.insertAfter(element);
            }
        }
    }
});

$.validator.addMethod("adulto", function (value, element, params) {
    return this.optional(element) || moment().diff(new Date(value), 'years') >= 18;
}, $.validator.format("La persona debe ser mayor de edad"));

//#endregion

$.fn.select2.defaults.set('width', '100%');
$.fn.select2.defaults.set('allowClear', false);
$.fn.select2.defaults.set('dropdownCssClass', 'label-sm p-1');

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2500",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "swing",
    "showMethod": "slideDown",
    "hideMethod": "slideUp"
};


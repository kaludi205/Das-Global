
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


$(document).ready(function() {
        var DOMToChoose = null;
        $('body').on('click', 'table#match > tbody > tr > td > a.add',
            function(){
                var cloned = $(this).parent().parent().clone().appendTo('table#match > tbody');
                cloned.find('input').val('');
                cloned.find('span.ref_product_info').html('');
            }
        );
        $('body').on('click', 'table#match > tbody > tr > td > a.remove',
            function(){
                if($('table#match > tbody > tr').length > 1)
                    $(this).parent().parent().remove();
            }
        );
        $('body').on('click', 'table#match > tbody > tr > td > a.choose',
            function(){
                DOMToChoose = $(this).parent();
                $("#product_list").modal({
                        minHeight: 200,
                        resizable: false,
                        draggable: false,
                        resizeOnLoad: true,
                        onOpen: function() { $('input.maininput').focus(); },
                        onClose: function() { },
                        buttons: {'پایان': function(modal) { modal.closeModal(); }}
                });
            }
        );
        $("body").on("click", "table.product a", function(e) {

                e.preventDefault();

                var token = $(this).attr("href");
                
                if($('input.ref_product[value=' + token + ']').length != 0)
                {
                    notify('انتخاب', 'این محصول پیشتر انتخاب شده است.');
                    return false;
                }
                
                DOMToChoose.find('input').val(token);
                DOMToChoose.find('span.ref_product_info').html(token);
                $.modal.current.closeModal();
                notify('انتخاب', 'محصول انتخاب شد !');

        });
        $("#product_list, #person_list").ajaxComplete(function() {
                $(this).centerModal();
        });
});
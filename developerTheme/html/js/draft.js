$(document).ready(function() {
        $('body').on('click', 'table#cash > tbody > tr > td > a.add_cash',
            function(){
                $(this).parent().parent().clone().appendTo('table#cash > tbody').find('input').val('');
            }
        );
        $('body').on('click', 'table#cash > tbody > tr > td > a.remove_cash',
            function(){
                if($('table#cash > tbody > tr').length > 1)
                    $(this).parent().parent().remove();
            }
        );
});
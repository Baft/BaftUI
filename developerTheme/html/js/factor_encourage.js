$(document).ready(function()
    {
        function fix_prices()
        {

            var total = 0;
            $("table#products tbody tr.active input.quantity").change();

            $("table#products tbody tr.active td:nth-child(5)").each(function(){ total += Number($(this).html()); });
            $("table#products tfoot td#total_price").html(total);
            setTimeout(fix_prices, 1500);

        }
        fix_prices();

        $("body").on("change keyup", "table#products tbody tr.active input.quantity", function(){
                
                var quantity = $(this).val();
                var price = $(this).parent().parent().parent().find('td:nth-child(4)').html();
                $(this).parent().parent().parent().find('td:nth-child(5)').html(quantity * price);
                $(this).parent().parent().parent().find('td:nth-child(5)').html(quantity * price);
        });


});


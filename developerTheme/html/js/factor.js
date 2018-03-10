function add_product()
{
    $("#product_list").modal({
            minHeight: 200,
            resizable: false,
            draggable: false,
            resizeOnLoad: true,
            onOpen: function() { modals["#product_list"] = 1; $('input.maininput').focus(); },
            onClose: function() { modals["#product_list"] = 0; },
            buttons: {'پایان': function(modal) { modal.closeModal(); }}
    });
}


function relation(pid)
{
    $.ajax({
            url: url_relation,
            type: 'GET',
            data: {'pid': pid},
            cache: false,
            success: function(data){
                if(data != 0) {
                    var main_row = $('tr[pid=' + pid + ']');
                    main_row.find('td:nth-child(2)').prepend('<button type="button" class="show_relation button tiny icon-folder orange-bg"></button> ');
                    $('<tr></tr>').addClass('row-drop').css('display', 'none').attr('pid', pid).html(data).insertAfter(main_row);
                }
            }
    });
}
$(document).ready(function(){

        var modals = new Array();
        var selected_products = new Array();
        var product_details = new Array();
        var removed_cost = 0;
        var total_earned = 0;
        var quantities = [];
        var eqi_quantities = [];
        /*        
        function report()
        {
        console.log(selected_products);
        console.log(product_details);
        setTimeout(report, 10000);
        }
        report();
        */



        $('ul#shortcuts > li').removeClass('current').parent().find('li:nth-child(2)').addClass('current');

        $("#product_list, #person_list").ajaxComplete(function() {
                $(this).centerModal();
        });

        $("a.add_product").click(add_product);

        $("body").on("click", ".product_remover", function(){
                var tr = $(this).parent().parent();
                remove_product(tr);
        });

        $("body").on("click", ".show_relation", function(){
                var tr = $(this).parent().parent();
                var pid = tr.attr('pid');
                $('tr.row-drop[pid='+pid+']').fadeToggle();
        });

        function remove_product(tr)
        {

            var my_token = tr.find('td:first-child').html();
            var my_id = tr.attr('pid');
            tr.parent().find('tr[pid=' + my_id + ']').remove();
            var index = array_search(my_token, selected_products);

            product_details.splice(index, 1);
            delete selected_products[index];

            tr.fadeOut(500, function(){
                
                    var total_rows = $("table#products > tbody > tr.active").length;

                    if(total_rows == 0)
                        $("table#products tbody tr#placeholder").fadeIn(500);
                    $(this).remove();
            });
        }

        /**
        * Choose Product
        */
        $("body").on("click", "table.product a", function(e) {
                e.preventDefault();

                $("#products tbody tr#placeholder").hide();
                var token = $(this).attr("href")

                $("#products tbody").find("tr#copy").clone().appendTo("#products tbody").removeAttr("id").addClass("deactive").find("input").removeAttr("disabled");

                $("table#products tbody tr:last-child input.token").val($(this).attr("href")).change();

        });

        /**
        * Fills The Table
        */
        $("body").on("change keyup trigger blur", "input.token", function(){
                var obj = $(this);
                var val = obj.val();
                var tr = obj.parent().parent();
                $("#products tbody tr#placeholder").hide();

                if(in_array(val, selected_products))
                    {

                    notify('خطا', 'این محصول قبلاً به سبد اضافه شده است.', {
                            vPos: 'bottom',
                            hPos: 'left',
                            groupSimilar: false,
                            closeDelay: 2000
                    });
                    remove_product(tr);
                    return false;
                }

                $.ajax({
                        url: url_product_info,
                        type: 'GET',
                        data: (( factor_type == 'order' || factor_type == 'normal' ) ? ('depot=' + $('#donor_id').val() + '&') : '' )+ 'pid='+val,
                        cache: false,
                        dataType: "json",
                        success: function(data){
                            var c=0;

                            if(data){
                                if((factor_type == 'order' || factor_type == 'normal') && data.quantity != 0)
                                    {
                                    product_details.push(data);
                                    selected_products.push(val);
                                }
                                else if((factor_type == 'order' || factor_type == 'normal')  && data.quantity == 0)
                                    {
                                    $.ajax({ url: url_alarm, type: 'GET', data: 'pid='+val + '&depot='+ $('#donor_id').val()});

                                    notify('موجودی', 'محصول مورد نظر در انبار موجود نیست !');
                                    tr.remove();

                                    return false;
                                }
                                tr.attr("class", "active").attr('pid', data.id).find("td").each(function(){

                                        switch(c)
                                        {
                                            case 0:
                                                $(this).html(data.token);
                                                break;
                                            case 1:
                                                $(this).html(data.name);
                                                notify('عملیات موفق', '«' + data.name + '» به سبد اضافه شد !', {
                                                        vPos: 'bottom',
                                                        hPos: 'left',
                                                        groupSimilar: false,
                                                        closeDelay: 2000,
                                                        icon: theme_url + 'img/basket.png'
                                                });
                                                break;
                                            case 2:
                                                var quantity_input = $(this).find("input");
                                                var data_number = quantity_input.attr("name", "products["+data.id+"][quantity]").attr('product', data.id).attr('data-number-options');
                                                data_number = '{"min": 1, "max": ' + data.quantity + '}';
                                                $(this).find("input").attr("data-number-options", data_number);
                                                break;
                                            case 3:
                                                if(factor_type == 'purchase')
                                                    $(this).find("input").attr("name", "products["+data.id+"][buy_cost]");
                                                else
                                                    $(this).html(data.sale_cost);

                                                break;
                                            case 4:
                                                if(factor_type == 'purchase')
                                                    $(this).find("input").attr("name", "products["+data.id+"][sale_cost]");
                                                break;
                                            case 5:
                                                if(factor_type == 'order')
                                                    $(this).find("input").attr("name", "products["+data.id+"][encouraged]");
                                                else if(factor_type == 'purchase')
                                                    $(this).find("input").attr("name", "products["+data.id+"][expire_date]");
                                                break;
                                            default:
                                                //s
                                                break;
                                        }
                                        c++;
                                });
                                relation(data.id);
                            }
                            else
                                {
                                obj.parent().parent().attr("class", "active").find("td").each(function(){

                                        if(c!=2)
                                            $(this).html('');

                                        c++;
                                });
                            }
                        }

                });

        });

        function find_diff()
        {
            $('#encourage_table_remove tbody tr').each(function(){

                    var i = $(this).attr('data-i');

                    var diff = product_details[i].sale_cost - product_details[i].buy_cost;

                    var diff_quan = Math.ceil((removed_cost-total_earned)/diff);

                    if(diff_quan >= 0)
                        $(this).find('.progress_slider').addClass('with-tooltip').attr('title', diff_quan);

            });


            var title = Number($(".progress_slider:hover").attr('title'));
            $("#tooltips .message").html(title);
        }

        function sort_prices() 
        {

            $('#encourage_table_remove tbody tr').sortElements(function(a, b){
                    return (Number($(a).attr('data-price')) > Number($(b).attr('data-price'))) ? 1 : -1;
            });

        }

        $('body').on('click', '#encourage_table_remove tbody label', function(){

                var i = $(this).parent().parent().attr('data-i');

                start_encourage();

                var ref = $("#encourage_table_remove tbody tr[data-i='" + i + "'] label")
                ref.addClass('active');

                if(ref.hasClass('active')) {
                    ref.parent().parent().find('.progress_slider span').changeProgressBarColor('red-gradient', true);
                }
                else {
                    ref.parent().parent().find('.progress_slider span').changeProgressBarColor('green-gradient', true);
                }

                var jj = $("#encourage_table_remove tbody label.active").parent().parent().attr('data-i');
                var total_price = Number($("table#products tfoot td#total_price").html());
                removed_cost = product_details[jj].sale_cost * quantities[jj] * (1 + (1 - Math.pow(2.71, (-1 * total_price/40000))));
                console.log(removed_cost);

                $("#remove_status").html('<p class="button red-gradient"></p>')
                $('.message').fadeIn();

                find_diff();

        });

        /**
        * حذف تشویقی
        * Encourage
        */
        $(".wizard fieldset#encourage").bind("wizardenter", start_encourage);

        $(".wizard fieldset#person").bind("wizardleave", function(){
                if(factor_type != 'create' && $("#reciever_id").val() == '')
                    {
                    notify('شخص', 'مشتری باید تعیین شود.');
                    $(this).wizardenter();
                }
        });

        function start_encourage()
        {

            console.log(product_details);

            total_earned = 0;
            var max = 0;

            $("#remove_status").html('');

            $.each(product_details, function(i, item) {

                    var quantity = $("input[name='products["+item.id+"][quantity]']").val();
                    if(item.sale_cost * quantity > max)
                        max = item.sale_cost * quantity;

            });

            $("#encourage_table_remove tbody tr").each(function(){ $(this).remove()});
            quantities = [];
            eqi_quantities = [];
            var options = {max: 6*max/5, size:'100%', classes: 'large', barClasses : 'green-gradient glossy'};
            $.each(product_details, function(i, item){

                    quantities[i] = $("input[name='products["+item.id+"][quantity]']").val();
                    eqi_quantities[i] = quantities[i];

                    var price = quantities[i] * item.sale_cost;

                    var obj = $("<tr data-i=\"" + i + "\" data-price=\"" + price + "\"><td class='quantity'>" + quantities[i] + "</td><td class='progress_slider'></td><td class='product_name'></td></tr>").appendTo('#encourage_table_remove tbody');

                    obj.find('.progress_slider').html('<span></span>').find('span').progress(item.sale_cost*quantities[i], options);
                    obj.find('.product_name').html('<label style="width:90%" for="radio-' + item.id + '" class="button tiny red-active"><input type="radio" name="removed_product" id="radio-' + item.id + '" value="' + item.id + '">' + item.name + '</label>');


                    obj.on('mousewheel', '.progress_slider', function(event, delta, deltaX, deltaY)
                        {
                            if($("#encourage_table_remove tbody label.active").length < 1)
                                return false;
                            else if($(this).parent().find('.product_name label').hasClass('active'))
                                return false;

                            var j =$(this).parent().attr('data-i');

                            if(deltaY < eqi_quantities[j] - Number(quantities[j]))
                                return false;
                            else if(deltaY > product_details[j].quantity - Number(quantities[j]))
                                return false;

                            var change_price =  Number(deltaY) * (item.sale_cost-item.buy_cost);
                            total_earned = Number(total_earned) + Number(change_price);

                            if(total_earned >= removed_cost)
                                {
                                notify('حذف تشویقی موفق !', 'حذف تشویقی انجام شد !');
                                $("#remove_status").html('<p class="button green-gradient"></p><button class="button green-gradient tiny" id="submit_encourage">ثبت حذف تشویقی</button>');
                            }
                            else
                                {
                                $("#remove_status").html('<p class="button red-gradient"></p>');
                            }

                            quantities[j] = Number(quantities[j]) + Number(deltaY);
                            $(this).parent().find('.quantity').html(quantities[j]);

                            var now_price = item.sale_cost * quantities[j];

                            if(max < now_price)
                                {
                                max = now_price;
                                var options = {max: 6*max/5, size:'100%', classes: 'large', barClasses : ''};

                                $('.progress_slider > span').each(
                                    function()
                                    {
                                        var parent = $(this).parent();

                                        var is_active = parent.parent().find('.product_name label').hasClass('active');
                                        var this_value = Number($(this).find('.progress-text').html());

                                        parent.find('span').remove();

                                        if(is_active)
                                            options.barClasses = 'red-gradient glossy';
                                        else
                                            options.barClasses = 'green-gradient glossy';

                                        parent.html('<span></span>').find('span').progress(this_value, options);

                                });

                            }

                            find_diff();

                            $(this).find('span').setProgressValue(now_price);



                            event.preventDefault();
                    });
            });

            sort_prices();

        }

        $('body').on('click', '#submit_encourage', function(e){
                e.preventDefault();

                var ref = $("#encourage_table_remove tbody tr");
                $('input.encouraged').val('0');
                var jj = $("#encourage_table_remove tbody label.active").parent().parent().attr('data-i');
                $("table#products tbody .encouraged[name='products[" + product_details[jj].id + "][encouraged]']").val('1');

                ref.each(function(){

                        var i = $(this).attr('data-i');
                        var id = product_details[i].id;
                        var this_quantity = Number($(this).find('.quantity').html());
                        $("table#products tbody input[name='products["+ id +"][quantity]']").val(this_quantity).change();

                });

                notify('حذف تشویقی', 'حذف تشویقی ثبت شد !');
        });

        $(".wizard fieldset#final_factor").bind("wizardenter", function() {

                var factor_table = $("table#final_product_factor tbody");
                factor_table.find('tr').each(function(){ $(this).remove(); });
                var total_price = 0;
                $(product_details).each(function(i, item){
                        var is_encouraged = Number($('input[name="products[' + item.id +'][encouraged]"]').val());
                        var this_quantity = Number($('input[name="products[' + item.id +'][quantity]"]').val());
                        var price = (item.sale_cost * this_quantity);
                        if(is_encouraged)
                            var encourage_title = " <span class='icon-star'></span>";
                        else
                            {
                            var encourage_title = '';
                            total_price = total_price + price;
                        }

                        $('<tr><td>' + item.token +'</td><td>' + item.name + encourage_title +'</td><td>' + this_quantity +'</td><td>' + item.sale_cost +'</td><td>' + price +'</td></tr>').appendTo(factor_table);

                });

                $("table#final_product_factor tfoot .total_price").html(total_price);

        });

        $("form#depot_draft_form").submit(function(e){

                if(factor_type != 'create' && $("#reciever_id").val() == '')
                    {
                    e.preventDefault();
                    notify('شخص', 'مشتری باید تعیین شود.');
                }
                else if($("#reciever_id").val() == '' || $("#donor_id").val() == '')
                    {
                    e.preventDefault();
                    notify('شخص', 'شخص گیرنده و شخص تحویل دهنده باید مشخص شود.');
                }

                if(factor_type == 'order' && product_details.length == 0)
                    {
                    e.preventDefault();
                    notify('سبد کالا', 'سبد کالا نمیتواند خالی باشد.');
                }
        });

        $("input").keyup(function(event)
            { 
                var c= String.fromCharCode(event.keyCode);
                var isWordcharacter = c.match(/\w/);
        });
        $('html').on('keyup', function(e){
                if(event.keyCode == 113)
                    add_product();
        }); 

        $('#donor_id').change(function(){
                var depot = $(this).val();
                var rec = $('#reciever_id').val();
                $.ajax({
                        url: url_distance,
                        type: 'GET',
                        data: {from: rec, to: depot},
                        cache: false,
                        dataType: "json",
                        success: function(data){
                            $('#distance').html(data);
                        }
                });
        });
});
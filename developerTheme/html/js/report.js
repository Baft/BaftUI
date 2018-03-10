$(document).ready(function(){
        var depots = [];
        var operator = [];
        var time = [];

        function makeReady()
        {
            depots = [];
            operator = [];
            time = [];
            $('.depot_check:checked').each(function(){
                    depots.push($(this).val());
            });
            $('.operator_check:checked').each(function(){
                    operator.push($(this).val());
            });

            time = [$('#start_time').val(), $('#end_time').val()];
        }
        $('form#report').submit(function(e){
                e.preventDefault();
                var url_calc = $(this).attr('action');

                $.ajax({
                        url: url_calc,
                        data: $(this).serialize(),
                        type: 'POST',
                        beforeSend:function(){
                            $('span#money').html($('<span></span>').addClass('loader'));
                        },
                        success: function(response){
                            $('span#money').html(response);
                        }
                });
        });

        $('#savepure').click(function(){
                var money = Number($('#money').html());
                $("#pure").val(money);
        });

        $('#saveplan').click(function(){
                var money = Number($('#money').html());
                $("#plan").val(money);
        });

        $('#calculate_work').click(function(){

                var plan = Number($("#plan").val());
                var pure = Number($("#pure").val());
                if(plan != 0)
                    $('#percent').html(Math.round(100*pure/plan));
                else
                    $.modal.alert('برنامه فروش نمی‌تواند 0 باشد.');

        });

});
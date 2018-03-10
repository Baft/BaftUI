$(document).ready(function(){
        var tid = 0;
        var internal = 0;
        var inexternal = 0;
        $('div.wizard-controls > button').prop('disabled','true');
        $("#person_list").ajaxComplete(function(){
            $(this).centerModal();
        });
        
        function check_token(person_token, person_type, modal)
        {

            $.ajax({
                    type: 'GET',
                    data: "find_depot=1&token=" + person_token,
                    url : url_check_token,
                    dataType: 'json',
                    success: function(resp, toReturn){
                        if(resp.exist == 1)
                            {
                            $('#' + person_type + '_info').html(person_token);
                            $('#' + person_type + '_id').val(resp.id).change();

                            if(typeof factor_type != 'undefined' && factor_type == 'order') {
                                $('#donor_id').val(resp.depot).change();
                                $('#internal').removeAttr('checked');

                                inexternal = resp.depot;
                                if(resp.internal)
                                    internal = resp.internal;
                                else
                                    internal = resp.depot;

                                $.ajax({
                                        type: 'GET',
                                        data: "id=" + resp.id,
                                        url : url_pattern,
                                        success: function(response)
                                        {
                                            $('#customer_pattern').html(response);
                                        }
                                });

                            }

                            $('div.wizard-controls > button').removeProp('disabled');

                            if(modal)
                                modal.closeModal();

                        }
                        else
                            {
                            notify('شخص', 'شخص انتخاب شده وجود ندارد.');
                            $('div.wizard-controls > button').prop('disabled','true');
                        }
                    }
            });
        }

        $("a.get_person").click(function(){
                var person_type = this.id;

                $("#person_list").modal({
                        width: 600,
                        maxHeight: 600,
                        resizable: false,
                        draggable: false,
                        onOpen: function()  { modals["#person_list"] = 1; $('input#token').focus(); },
                        onClose: function() { modals["#person_list"] = 0; },
                        buttons: {'تایید': function(modal) {
                                var person_token = modal.find("#token").val();
                                check_token(person_token, person_type, modal);
                        }}
                });

        });

        $("body").on('change', '#structure_person', function()
            {
                tid=$(this).val();

                $.ajax({ 
                        type: 'GET',
                        data: "type_id=" + tid,
                        url : url_make_input_elements,
                        dataType: 'json',
                        success: function(resp){
                            var items = [];
                            $.each(resp, function(i, item) {
                                    items.push('<div class="field-block button-height"><label class="label">' + item.name + '</label><input type="text" class="person_prop input" name="person_prop[' + item.id + ']" />' + '</div>')
                            });

                            $('#details').html(items.join(''));
                        }
                });
        });

        $("form#check_person").submit(function(e) {
            
                e.preventDefault();
                var items = [];

                $.ajax({ 
                        type: 'POST',
                        data: $(this).serialize(),
                        url : $(this).attr('action'),
                        dataType: 'json',
                        beforeSend: function()
                        {
                            $("#found_persons_fieldset").slideDown();
                            $("#found_persons").html('<span class="loader"></span> در حال دریافت اطلاعات');
                        },
                        success: function(resp){

                            $.each(resp, function(i, item) {
                                    var properties = [];
                                    $.each(item.items, function(j, property){

                                            properties.push('<b>' + property.name + '</b>: ' + property.value);

                                    });

                                    if(edit_person != '') {
                                        var edit_link = edit_person + '&url_send=1&update=' + item.token;
                                        edit_link = '<a class="button tiny icon-pencil" href="'+ edit_link +'"></a>'
                                    }

                                    items.push('<li><div class="button-group absolute-left compact"><a class="button tiny icon-user choosePerson" href="'+ item.token +'">انتخاب</a>' + edit_link + '</div>' + properties.join("<br />") + '</li>');

                            });


                            $("#found_persons").html('<ul class="list spaced">' + items.join('') + '</ul>');
                            setTimeout(function(){
                                $("#person_list").centerModal();
                            }, 1000);
                            
                            
                        },
                        error: function() {
                            $("#found_persons_fieldset").slideDown();
                            $("#found_persons").html('<span class="red">شخصی یافت نشد.</span>');
                        }
                });

        });

        $("body").on("click", "a.choosePerson", function(e) {
                e.preventDefault();
                notify('انتخاب شخص', 'شخص انتخاب شد !');
                $("#person_list").centerModal();
                $('#token').val($(this).attr('href'));
        });

        if($('#reciever_info').length != 0 && $('#reciever_info').html() != '')
        {
            check_token($('#reciever_info').html(), 'reciever', false);
        }
            

        $('#internal').change(function(e){
                var is_selected = $(this).prop('checked');

                if($('table#products > tbody').find('tr').length > 2) {
                    $(this).attr('checked', ! is_selected);
                    return false;
                }

                if(is_selected)
                    $('#donor_id').val(internal).change();
                else
                    $('#donor_id').val(inexternal).change();

        })
});
$(document).ready(function(){
        var featurecollection = [];

        $('body').on('click', 'a.check_history', function(e){

                e.preventDefault();
                var draft = $(this).attr('href');
                $.modal({
                        url: ajax_url + '&draft=' + draft
                });

        });

        function getLonLat(bundle, whatdo)
        {

            $.ajax({
                    url: dest_url,
                    data: 'bundle=' + bundle,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data)
                    {
                        var featureCol = featureMaker(data);

                        json_layer.addFeatures(geojson_format.read(featureCol));

                    }
            });

        }

        $("input[type='checkbox']").change(function()
            {

                var input_selected = $(this).attr('checked');
                if(input_selected)
                    {
                    $(this).parent().parent().parent().find('ul').slideDown();
                    var bundleId = $(this).val();
                    getLonLat(bundleId);
                }
                else
                    {
                    $(this).parent().parent().parent().find('ul').slideUp();
                    json_layer.removeAllFeatures();

                    $("input[type='checkbox']:checked").each(function(){
                            var bundleId = $(this).val();
                            getLonLat(bundleId);
                    })

                }

        });
});

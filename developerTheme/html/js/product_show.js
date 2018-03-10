function show_structure(structure)
{
    if(structure != '')
        $.ajax({
            url: product_+ "&url_send_token=" + url_send + "&Structure="+structure,
            cache: false,
            beforeSend: function()
            {
                $("#product-show").html('<span class="loader big"></span> در حال دریافت اطلاعات');
            },
            success: function(data) {
                $("#product-show").html(data);
            }
    });
}

$(document).ready(function(){
        $("#structure").fcbkcomplete({
                json_url: json_,
                addontab: false,                   
                maxitems: 1,
                input_min_size: 0,
                height: 10,
                cache: true,
                newel: false,
                select_all_text: "",
        });

        $("#structure").change(function(){
                var structure = $(this).find('option:first-child').val();
                show_structure(structure);
        });

        function show_all()
        {
            $('.show td, .show th').fadeIn(1000);
        }

        function hide_all()
        {
            $('.show td, .show th').hide();
        }

        /**
         * group properties of structure into 3 LEVEL and add LEVEL Number to class of table>tr.title (in HTML) which have same level
         */
        function groupStructureProperties(){
        	
        	var properties=new Object();
    		properties.L1=new Array();
    		properties.L2=new Array();
    		properties.L3=new Array();
    		
        	$('div#product-show tr.title:first').addClass("L1").children("th").each(function(){ 
        		var className=$(this).attr("class");
        		properties.L1.push(className);
        		$('div#product-show tr.content td.'+className+' tr.title:first').addClass("L2").children("th").each(function(){        			
        			var className=$(this).attr("class");
        			
        			if($.inArray(className,properties.L2)<0)
        				properties.L2.push(className);
        			
        			$('div#product-show tr.content td.'+className).each(function(){ 
        				
        				$("tr.title:first",this).addClass("L3").children("th").each(function(){
        					var className=$(this).attr("class");
            				
            				if($.inArray(className,properties.L3)<0)
            					properties.L3.push(className);
        				}); 
        			});
        			
        		});
        	});
        	
        	return properties;
        }
        
        $('body').on('change', '.detail-filter',
            function() {
        	
        		show_all();
        		
        		var haystack=new Object();
        		haystack.L1=new Array();
        		haystack.L2=new Array();
        		haystack.L3=new Array();

        		var properties=groupStructureProperties();

        		var checked=$('.detail-filter:checked');
        		
                if(checked.length != 0){ // levelize checked checkBox properties via  Leveled Properties in groupStructureProperties()
                	
                	$(checked).map( function(){
                		var value=$(this).val();

                		if(!($.inArray(value,properties.L1)<0))
                			haystack.L1.push(value);
                		
                		if(!($.inArray(value,properties.L2)<0))
                			haystack.L2.push(value);
                		
                		if(!($.inArray(value,properties.L3)<0))
                			haystack.L3.push(value);
                		
                	} );

                	// search in each level (in html) and hide those that not match with correspond haystack Leveles
                		$('.show tr.L1 , .show tr.L2 , .show tr.L3').each(function(){
                			
                			var level;
                			var levelCheckedProperties;
                			$.each($(this).attr("class").split(/\s/),function(index,item){if(item.match(/L\d{1}/))level=item;});
                			
                			levelCheckedProperties=(typeof haystack[level]!="undefined")?haystack[level]:new Array();
                			
                			if(levelCheckedProperties.length>0){
                				
                				$("th",this).each(function(){
                            		if($.inArray($(this).attr("class"),levelCheckedProperties)<0){
                            			$(this).hide();
    	                        	}
                            	});
                            	
                    			var LNContent=$(this).siblings("tr.content");
                    			$("> td",LNContent).each(function(){
                    				if($.inArray($(this).attr("class"),levelCheckedProperties)<0){
                            			$(this).hide();
    	                        	}
                    			});
                			}
	
                        });

                		
                }
                	
        });
});


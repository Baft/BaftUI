$(document).ready(function() {
	$('.getproduct').click(
	
		function()
		{
			var groupid = $(this).attr("nodeid");
			
			$.ajax({
				url: "?R0=Front&R1=Portlet&R2=Product&R3=ProductSearch&R4=list_product&groupid=" + groupid,
				cache: false,
				dataType: "json",
				beforeSend: function()
				{
				$("ul#product-contents").html('')
				},
				success: function(data)
				{
					$("ul#product-contents").html('');
					
					$.each(data.items, function(i,item)
					{
						if (item)
						{
							name = item.name;
							id = item.id;
							token = item.token;
							
							$("ul#product-contents").append('<li><a href="' + url_send_token + token + '" class="file-link"><span class="icon folder-docs"></span>' + name + '</a></li>');
							
						}
					});
				},
				fail: function()
				{
					$("ul#product-contents").html('');
				}
			});
		}
	);
});
$(function() {
	var dovzhyna	= 5,
		arr			= [],
		total_pages	= 9999999;

	loading_page(1);
	pagination( 1 );

	function loading_page(page) {
		$.ajax({
			type: "GET",
			url: "https://api.unsplash.com/photos?&page="+page+"&per_page=6&order_by=latest&client_id=dea1cd3c33bf3bcc7de11fe03ab263a7db72c0133a8c97b6d02049e33377a902",
			success: function( data ) {
				var pic1;
				$('.result .item').remove();
				
				for (var i = 0; i < data.length; i++){
					pic1 = data[i].urls.thumb;
					$('.result').append('<div class="item" style="background-image: url('+pic1+');"></div>');
				}

				pagination( page );
			}
		});
	}

	function f_search(search, page) {
		$.ajax({
			type: "GET",
			url: "https://api.unsplash.com/search/photos?&page="+page+"&per_page=6&client_id=dea1cd3c33bf3bcc7de11fe03ab263a7db72c0133a8c97b6d02049e33377a902&query="+search,
			
			success: function( data ) {
				var pic;
				$('.result .item').remove();
								
				if ( data.results.length > 0 ) {
					$('.pagination').show();
					for (var i = 0; i < data.results.length; i++){
						pic = data.results[i].urls.thumb;						
						$('.result').append('<div class="item" style="background-image: url('+pic+');"></div>');
					}
					total_pages	= data.total_pages;

					pagination( page );
				}
				else {
					total_pages	= 9999999;
					$('.result').append('<div class="item"><span>Ничего не найдено</span></div>');
					$('.pagination').hide();
				}
			}
		});
		return false;
	}

	function pagination(page) {
		$('li').remove(); // 
		
		var interval				= Math.floor(dovzhyna / 2), //(інтервал від початкового до середнього значення)
			pochatkova_velychyna	= page - interval;  //(Значення, з якого буде починатися новий масив)

		if ( page > Math.round(dovzhyna/2) ) {
			arr[0] = pochatkova_velychyna;
		}
		else {
			arr[0] = 1;
		}

		for (var i = 0; i < dovzhyna; i++) {
			if ( i != 0 )
				arr[i]		= i + arr[0];

			if ( page == arr[i] )
				$('ul').append('<li class="active">' + arr[i] + '</li>');
			else
				$('ul').append('<li>' + arr[i] + '</li>');

			if ( arr[i] >= total_pages )
				break;
		}
	}


	$('form').submit(function() {
		var search	= $('form input[name="search"]').val();
				
		if ( search != '') {
			f_search(search, 1);
		}
		else {
			pagination( 1 );
			loading_page( 1 )
		}
		return false;
	});

	
	$('body').on('click', 'li', function() {
		var page		= $(this).text(),
			search		= $('form input[name="search"]').val();			
			
	 	if ( search != '')
			f_search(search, page);
		else
			loading_page(page);
	});

	
	$('.prev,.next').click(function() {	
		var	search		= $('form input[name="search"]').val(),
			page		= $('li.active').text();

		if ( $(this).hasClass('prev') ) { // В случае если клик был по кнопке .prev
			if ( page - 1 > 0 )
				page--;
		}
		else { // Клик по кнопке .next
			if ( page < total_pages )
				page++;
		}
				
		if ( search != '' )
			f_search(search, page);
		else
			loading_page(page);
	});

});

	


$(function () {

	var products = [], filters = {};

	// An event handler with calls the render function on every hashchange.
	// The render function will show the appropriate content of out page.
	$(window).on('hashchange', function(){
		render(window.location.hash);
	});

	$.getJSON( "test.json", function( data ) {

		products = data;

		// Call a function to create HTML for all the products.
		generateAllProductsHTML(products);

		// Manually trigger a hashchange to start the app.
		$(window).trigger('hashchange');

	});

	// Get the filters object, turn it into a string and write it into the hash.
	function createQueryHash(filters){

		// Here we check if filters isn't empty.
		if(!$.isEmptyObject(filters)){
			window.location.hash = '#filter/' + JSON.stringify(filters); // Stringify the object via JSON.stringify and write it after the '#filter' keyword.
		}
		else{
			window.location.hash = '#'; // If it's empty change the hash to '#' (the homepage).
		}

	}

	// It fills up the products list via a handlebars template.
	function generateAllProductsHTML(data){

		var list = $('.all-products .products-list');

		var theTemplateScript = $("#products-template").html();
		
		var theTemplate = Handlebars.compile (theTemplateScript);

		list.append(theTemplate(data));

	}

	var checkboxes = $('.all-products input[type=checkbox]');

	checkboxes.click(function () {

		var that = $(this),
			specName = that.attr('name');

		// When a checkbox is checked we need to write that in the filters object;
		if(that.is(":checked")) {

			// If the filter for this specification isn't created yet - do it.
			if(!(filters[specName] && filters[specName].length)){
				filters[specName] = [];
			}

			filters[specName].push(that.val());

			createQueryHash(filters);

		}

		// When a checkbox is unchecked we need to remove its value from the filters object.
		if(!that.is(":checked")) {

			if(filters[specName] && filters[specName].length && (filters[specName].indexOf(that.val()) != -1)){

				// Find the checkbox value in the corresponding array inside the filters object.
				var index = filters[specName].indexOf(that.val());

				// Remove it.
				filters[specName].splice(index, 1);

				// If it was the last remaining value for this specification,
				// delete the whole array.
				if(!filters[specName].length){
					delete filters[specName];
				}

			}

			createQueryHash(filters);
		}

	});

	function render(url) {

		var temp = url.split('/')[0];

		console.log(' temp :: ', temp)

		var	map = { 

			// The "Homepage".
			'': function() {

				filters = {};

				renderProductsPage(products);
			},

			// Page with filtered products
			'#filter': function() {

				// Grab the string after the '#filter/' keyword. Call the filtering function.
				url = url.split('#filter/')[1].trim();

				filters = JSON.parse(url);
				
				renderFilterResults(filters, products);

			}
		};

		if(map[temp]){
			map[temp]();
		}
	}

	// Find and render the filtered data results. Arguments are:
	// filters - our global variable - the object with arrays about what we are searching for.
	// products - an object with the full products list (from product.json).
	function renderFilterResults(filters, products){

		// This array contains all the possible filter criteria.
		var criteria = ['manufacturer','storage','os','camera'],
			results = [],
			isFiltered = false;

		criteria.forEach(function (c) {

			if(filters[c] && filters[c].length){

				filters[c].forEach(function (filter) {

					// console.log('filter :: ', filter);

					products.forEach(function (item){

						// console.log( 'item :: ', item);

						if(typeof item.specs[c] == 'string'){
							if(item.specs[c].toLowerCase().indexOf(filter) != -1){
								results.push(item);
								isFiltered = true;
							}
						}

					});

				});

			}
		});

		renderProductsPage(results);

	}

	function renderProductsPage(results){

		var page = $('.all-products'),
			allProducts = $('.all-products .products-list > li');

		allProducts.addClass('hidden');

		allProducts.each(function () {

			var that = $(this);

			results.forEach(function (item) {

				if(that.data('index') == item.id){
					
					that.removeClass('hidden');

				} 

			});

		});

	}

});
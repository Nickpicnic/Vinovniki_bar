let filter_categories = { colors: 'color', sugars: 'sugar', countries: 'country' };

function ItemsPage(options) {
	console.log(options);
	this.options = options;
}
ItemsPage.prototype.open = function () {
	var t = this;
	t.category = undefined;
	lnrr.category = undefined;
	lnrr.items = undefined;
	lnrr.order = { active: 0, by: "Year", to: "ASC" };
	t.current_filters(t);
	return {
		html: lnrr.View('bar/ItemsPage/index')
	};
};
ItemsPage.prototype.on_page_added = function () {
	var t = this;
	console.log("ITEMS ON PAGE ADDED FILTERS: ", t.options.filters);

	// Top Buttons OnClick
	t.top_buttons_click();
	// Add class "opened" on click
	$(".hamburger-menu-item.arrowed p,img", pager.get_html(this.page_index)).click(function () { $(this).parent().toggleClass('opened'); });
	// Run "on filter changed" on filters
	$(".hamburger-menu-item.arrowed .item-filter div", pager.get_html(this.page_index)).click(function () { t.inputs_filters_check($(this)); });
	// Run when SEARCH input is changing
	$(".hamburger-search input", pager.get_html(this.page_index)).on('input', function () { t.on_search_input() });
	// Run when dropdown button is clicked
	$(".hamburger-menu-main-input", pager.get_html(this.page_index)).click(function () { t.main_input_click() });

	// ORDERING
	// change category
	$(".hamburger-menu-item.hamburger-sorting-filters .sorting-category-select").click(function () { t.ORDER_change_category() });
	// sorting up
	$(".sorting-narrow.sorting-up").click(function () { t.ORDER_sorting_up() });
	// sorting down
	$(".sorting-narrow.sorting-down").click(function () { t.ORDER_sorting_down() });

	// JQuery Sliders Logic
	$(".prices .slider-range", pager.get_html(this.page_index)).slider({
		min: lnrr.min_price,
		max: lnrr.max_price,
		animate: "fast",
		range: true,
		values: [lnrr.min_price, lnrr.max_price],
		slide: function (event, ui) {
			$(".prices .slider-range-input-left").val(ui.values[0]);
			$(".prices .slider-range-input-right").val(ui.values[1]);
		},
		stop: function (event, ui) {
			lnrr.min_price_selected = ui.values[0];
			lnrr.max_price_selected = ui.values[1];
			t.on_filters_changed();
		}
	});
	$(".prices .slider-range-input-left").val($(".prices .slider-range").slider("values", 0));
	$(".prices .slider-range-input-right").val($(".prices .slider-range").slider("values", 1));


	$(document).focusout(function () {
		var input_left_prices = $(".prices .slider-range-input-left").val().replace(/[^0-9]/g, ''),
			opt_left_prices = $(".prices .slider-range").slider("option", "min"),
			where_right_prices = $(".prices .slider-range").slider("values", 1),
			input_right_prices = $(".prices .slider-range-input-right").val().replace(/[^0-9]/g, ''),
			opt_right_prices = $(".prices .slider-range").slider("option", "max"),
			where_left_prices = $(".prices .slider-range").slider("values", 0);
		if (input_left_prices > where_right_prices) {
			input_left_prices = where_right_prices;
		}
		if (input_left_prices < opt_left_prices) {
			input_left_prices = opt_left_prices;
		}
		if (input_left_prices == "") {
			input_left_prices = 0;
		}
		if (input_right_prices < where_left_prices) {
			input_right_prices = where_left_prices;
		}
		if (input_right_prices > opt_right_prices) {
			input_right_prices = opt_right_prices;
		}
		if (input_right_prices == "") {
			input_right_prices = 0;
		}
		$(".prices .slider-range-input-left").val(input_left_prices);
		$(".prices .slider-range-input-right").val(input_right_prices);
		$(".prices .slider-range").slider("values", [input_left_prices, input_right_prices]);
	});

	$(".years .slider-range", pager.get_html(this.page_index)).slider({
		min: lnrr.min_year,
		max: lnrr.max_year,
		animate: "fast",
		range: true,
		values: [lnrr.min_year, lnrr.max_year],
		slide: function (event, ui) {
			$(".years .slider-range-input-left").val(ui.values[0]);
			$(".years .slider-range-input-right").val(ui.values[1]);
		},
		stop: function (event, ui) {
			lnrr.min_year_selected = ui.values[0];
			lnrr.max_year_selected = ui.values[1];
			t.on_filters_changed();
		}
	});
	$(".years .slider-range-input-left").val($(".years .slider-range").slider("values", 0));
	$(".years .slider-range-input-right").val($(".years .slider-range").slider("values", 1));


	$(document).focusout(function () {
		var input_left_years = $(".years .slider-range-input-left").val().replace(/[^0-9]/g, ''),
			opt_left_years = $(".years .slider-range").slider("option", "min"),
			where_right_years = $(".years .slider-range").slider("values", 1),
			input_right_years = $(".years .slider-range-input-right").val().replace(/[^0-9]/g, ''),
			opt_right_years = $(".years .slider-range").slider("option", "max"),
			where_left_years = $(".years .slider-range").slider("values", 0);
		if (input_left_years > where_right_years) {
			input_left_years = where_right_years;
		}
		if (input_left_years < opt_left_years) {
			input_left_years = opt_left_years;
		}
		if (input_left_years == "") {
			input_left_years = 0;
		}
		if (input_right_years < where_left_years) {
			input_right_years = where_left_years;
		}
		if (input_right_years > opt_right_years) {
			input_right_years = opt_right_years;
		}
		if (input_right_years == "") {
			input_right_years = 0;
		}
		$(".years .slider-range-input-left").val(input_left_years);
		$(".years .slider-range-input-right").val(input_right_years);
		$(".years .slider-range").slider("values", [input_left_years, input_right_years]);
	});

	// Текущая категория
	t.current_category(t.options.filters.category_id);
};
ItemsPage.prototype.on_filters_changed = function () {
	let t = this;
	t.filters_init();
	t.options.filters.filter_query = 'select * from Tbar_menu_items where Tbar_menu_items.category_id=?';

	for (let filter_cat in filter_categories) {
		t.filters_iterate(filter_cat);
	}
	// Загружаем товары
	t.primary_items_select(t);
	// Генерируем запрос на основе выбранных фильтров
	if (!lnrr.items_query_from_map) {
		console.log("ITEMS WAS OPENED FROM CATEGORIES");
		t.generate_query_from_filters();
	} else {
		console.log("ITEMS WAS OPENED FROM MAP");
		console.log("MAP'S QUERY: ", lnrr.items_query_from_map);
		t.options.filters.filter_query = lnrr.items_query_from_map;
		t.gqff_select_items_from_query(t);
		lnrr.items_query_from_map = "";
	}
	// Перерисовываем экран
	t.filter_items_refresh(t);
};
ItemsPage.prototype.filters_iterate = function (filter_category) {
	var t = this;
	if (t.options.filters[filter_category].length) t.options.filters[filter_category] = [];

	$('.' + filter_category + ' .checkbox').get().forEach((inp) => {
		if (inp.checked) {
			t.options.filters[filter_category].push({
				id: parseInt(inp.value),
				name_en: inp.name,
				checked: inp.checked
			});
		}
	});
};
// Generate Query From Filters Methods:
ItemsPage.prototype.generate_query_from_filters = function () {
	// all inside methods go with prefix 'gqff'
	console.log("ФУНКЦИЯ GENERATE QUERY ВЫЗВАЛАСЬ");
	let t = this,
		filter_checker = 1,
		whereRequestPart = ' where Tbar_menu_items.category_id=?',
		selectRequestPart = "select " +
			"Tbar_menu_items.id as id, " +
			"Tbar_menu_items.category_id as category_id, " +
			"Tbar_menu_items.enabled as enabled, " +
			"Tbar_menu_items.price as price, " +
			"Tbar_menu_items.image_id as image_id, " +
			"Tbar_menu_items.wine_color_id as wine_color_id, " +
			"Tbar_menu_items.volume as volume, " +
			"Tbar_menu_items.year as year, " +
			"Tbar_menu_items.region as region, " +
			"Tbar_menu_items.sugar as sugar, " +
			"Tbar_menu_items.grapes as grapes, " +
			"Tbar_menu_items.color as colors, " +
			"Tbar_menu_items.strength as strength, " +
			"Tbar_menu_items.image_url as image_url, " +
			"Tbar_menu_items.description as description, " +
			"Tbar_menu_items.name_ru as name_ru, " +
			"Tbar_menu_items.name_en as name_en " +
			"from Tbar_menu_items";

	t.gqff_add_grapes_or_flavors(whereRequestPart, selectRequestPart);
	// check if all are empty first
	if (t.gqff_check_total_empty(t, t.gqff_check_empty_filters(filter_checker))) {
		t.options.filters.filter_query += whereRequestPart;
		return;
	}
	// iterate over input checkboxes
	whereRequestPart += t.gqff_checkbox_inputs(t);
	// PRICE AND YEAR
	if (lnrr.min_price_selected) whereRequestPart += t.gqff_price();
	if (lnrr.min_year_selected) whereRequestPart += t.gqff_year();
	// SEARCH INPUT
	if (lnrr.search_value) whereRequestPart += t.gqff_search();
	// ADD ORDER PART
	t.options.filters.filter_query += whereRequestPart + " order by " + lnrr.order.by + " " + lnrr.order.to;
	console.log('FINAL REQUEST: ', t.options.filters.filter_query);
	// SELECT ITEMS FROM NEW REQUEST
	t.gqff_select_items_from_query(t);
};
ItemsPage.prototype.gqff_add_grapes_or_flavors = function (where, select) {
	let t = this;
	if (t.options.filters.grapes[0]) {
		where += " and Tbar_menu_item_grapes.grape_id = " + t.options.filters.grapes[0];
		select += " join Tbar_menu_item_grapes on Tbar_menu_items.id = Tbar_menu_item_grapes.menu_item_id";
	} else if (t.options.filters.flavors[0]) {
		where += " and Tbar_menu_item_flavors.flavor_id = " + t.options.filters.flavors[0];
		select += " join Tbar_menu_item_flavors on Tbar_menu_items.id = Tbar_menu_item_flavors.product_id";
	}
	t.options.filters.filter_query = select;
};
ItemsPage.prototype.gqff_check_empty_filters = function (checker) {
	let t = this;
	for (let f in filter_categories) {
		console.log("OPTIONS FILTERS F LENGTH: ", t.options.filters[f].length, " ", "checker: ", checker);
		if (checker && t.options.filters[f].length) {
			checker = 0;
		}
	}
	return checker
};
ItemsPage.prototype.gqff_check_total_empty = function (t, fc) {
	return (
		fc &&
		!(lnrr.min_year_selected || lnrr.min_price_selected) &&
		!lnrr.search_value && !lnrr.order.active &&
		!t.options.filters.grapes[0] &&
		!t.options.filters.flavors[0]
	);
};
ItemsPage.prototype.gqff_make_prefix_postfix = function (fc, pre = '', post = '') {
	switch (fc) {
		case 'countries':
			pre = ' Tbar_regions';
			post = 'region';
			break;
		case 'colors':
			pre = ' Tbar_wine_colors';
			post = 'color';
			break;
		case 'sugars':
			pre = ' Tbar_sugars';
			post = 'sugar';
			break;
	}
	return [pre, post]
};
ItemsPage.prototype.gqff_checkbox_inputs = function (t) {
	let where = "";
	for (let fc in filter_categories) {
		if (!t.options.filters[fc].length) continue;

		// генерирует префикс и постфикс текущей части запроса
		[t.catPrefix, t.catPostfix] = t.gqff_make_prefix_postfix(fc);
		// добавляется новая категория - следовательно джойним таблицу этой категории
		t.options.filters.filter_query += ' left join' + t.catPrefix + ' on' + t.catPrefix + '.id = Tbar_menu_items.' + t.catPostfix;

		// если эта категория - страны 
		switch (fc) {
			case "countries":
				where +=
					" and (" +
					"(Tbar_regions.name_en = '" + t.options.filters[fc][0].name_en + "') " +
					"or (Tbar_regions.parent_id in " +
					"(select Tbar_regions.id from Tbar_regions where Tbar_regions.name_en = '" + t.options.filters[fc][0].name_en + "'";
				if (t.options.filters[fc][1]) {
					// если стран много
					for (let i = 1; i < t.options.filters[fc].length; i++) {
						where += " or Tbar_regions.name_en = '" + t.options.filters[fc][i].name_en + "'";
					}
				}
				where += ")))";
				break;
			default:
				// если это любая другая категория
				where += " and (" + t.catPrefix + ".name_en = '" + t.options.filters[fc][0].name_en + "'";
				// если фильтров этой категории много
				if (t.options.filters[fc][1]) {
					for (let i = 1; i < t.options.filters[fc].length; i++) {
						where += " or " + t.catPrefix + ".name_en = '" + t.options.filters[fc][i].name_en + "'";
					}
				}
				where += ")";
				break;
		}
	}
	return where
};
ItemsPage.prototype.gqff_price = function () {
	where = "";
	where += " and (Tbar_menu_items.price >= " + lnrr.min_price_selected + " and Tbar_menu_items.price <= " + lnrr.max_price_selected + ")";
	return where;
};
ItemsPage.prototype.gqff_year = function () {
	where = "";
	where += " and (Tbar_menu_items.year >= " + lnrr.min_year_selected + " and Tbar_menu_items.year <= " + lnrr.max_year_selected + ")";
	return where;
}
ItemsPage.prototype.gqff_search = function () {
	let where = "";
	where += " and (Tbar_menu_items.name_ru like '%" + lnrr.search_value + "%' or Tbar_menu_items.name_en like '%" + lnrr.search_value + "%')";
	return where;
};
ItemsPage.prototype.gqff_select_items_from_query = function (t) {
	MyDB.add_query(
		t.options.filters.filter_query,
		lnrr.items_query_from_map ? [] : t.options.filters.countries ? [lnrr.last_category] : [parseInt(t.options.filters.category_id)],
		function (ret) {
			t.items = ret;
			console.log("T ITEMS: ", ret);
			lnrr.items = t.items;
		});
};

ItemsPage.prototype.item_clicked = function (id) {
	pager.add_object(new ProductPage({ parent_id: id }));
};
ItemsPage.prototype.current_filters = function (t) {
	switch (parseInt(lnrr.last_category)) {
		// вино
		case 3:
			break;
		// игристые вина
		case 4:
			break;
		// безалкогольные напитки
		case 7:
		case 8:
		case 9:
		case 25:
		case 26:
		// еда
		case 17:
		case 18:
			lnrr.filters_allowed.map = 0;
			lnrr.filters_allowed.grapes = 0;
			lnrr.filters_allowed.flavors = 0;
			lnrr.filters_allowed.year = 0;
			lnrr.filters_allowed.color = 0;
			lnrr.filters_allowed.country = 0;
			lnrr.filters_allowed.sugar = 0;
			lnrr.filters_allowed.order = 0;
			break;
	}
};
ItemsPage.prototype.filter_items_refresh = function (t) {
	MyDB.add_query(null, null, function () {
		lnrr.category = t.category;
		lnrr.items = t.items;

		$('.categories', pager.get_html(t.page_index)).html(lnrr.View('bar/ItemsPage/items'));

		setTimeout(function () { $(".category-preview-name", pager.get_html(t.page_index)).addClass("shown"); }, 50);

		let productsNumber = $(".product-number").length;
		for (let i = 0; i < productsNumber; i++) {
			let prdcId = $(".product-number")[i].id;
			//			console.log("ID: ",prdcId);
			// console.log("count of product: ", prdcId, lnrr.basket[prdcId] || 0);
			$(".product-number#" + prdcId).text((lnrr.basket[prdcId] || 0));

			$("#item-plus-" + prdcId, pager.get_html(this.page_index)).click(function () {
				//				console.log("CLICKED");
				lnrr.basket[prdcId] ? lnrr.basket[prdcId]++ : lnrr.basket[prdcId] = 1;
				$(".product-number#" + prdcId).text(lnrr.basket[prdcId]);
				// console.log("product-number: ", lnrr.basket[prdcId]);
			});
			$("#item-minus-" + prdcId, pager.get_html(this.page_index)).click(function () {
				console.log("CLICKED");
				if (lnrr.basket[prdcId]) {
					lnrr.basket[prdcId]--;
					$(".product-number#" + prdcId).text(lnrr.basket[prdcId]);
					// console.log("product-number: ", lnrr.basket[prdcId]);
				}
			});
		}

		if ($(".hamburger-menu-item").hasClass("narrow")) {
			$(".add-item-items").css("display", "none");
		} else {
			$(".add-item-items").css("display", "");
		}
	});
};
ItemsPage.prototype.page_refresh = function () {
	var t = this;
	//	console.log('LNRR ITEMS REFRESH: ', t);
	// Перерисовываем экран
	MyDB.add_query(null, null, function () {
		//			lnrr.items=t.items;
		pager.set_html(t.page_index, lnrr.View('bar/ItemsPage/index'));
	});
};
ItemsPage.prototype.current_category = function (id) {
	let t = this;
	if (id) {
		MyDB.add_query('select * from Tbar_categories where id = ?',
			[id],
			function (ret) {
				//		console.log(ret);
				t.category = ret[0] || {};
				if (t.category) cat_name = t.category.function_name;
				t.on_filters_changed();
			}
		);
	} else {
		t.on_filters_changed();
		console.log("region from map: ", t.options.filters.countries);
	}
};
ItemsPage.prototype.filters_init = function () {
	let t = this;
	t.options.filters.colors = [];
	t.options.filters.sugars = [];
	t.options.filters.countries ? console.log("t options filters countries already exists") : t.options.filters.countries = [];
	t.options.filters.grapes ? console.log("t options filters grapes already exists") : t.options.filters.grapes = [];
	t.options.filters.flavors ? console.log("t options filters flavors already exists") : t.options.filters.flavors = [];
}
ItemsPage.prototype.inputs_filters_check = function (element) {
	if (element[0]["children"][0]["checked"]) {
		element[0]["children"][0]["checked"] = false;
		element.css("background", "");
	} else {
		element[0]["children"][0]["checked"] = true;
		element.css("background", "rgba(255,255,255,0.2)");
	}
	pager.fire("on_filters_changed");
}
ItemsPage.prototype.top_buttons_click = function () {
	$(".hamburger-menu-item.regions", pager.get_html(this.page_index)).click(function () { console.log($(this)); pager.add_object(new MapPage()); });
	$(".hamburger-menu-item.grapes", pager.get_html(this.page_index)).click(function () { console.log($(this)); pager.add_object(new GrapesPage()); });
	$(".hamburger-menu-item.flavors", pager.get_html(this.page_index)).click(function () { console.log($(this)); pager.add_object(new FlavorsPage()); });
};
ItemsPage.prototype.on_search_input = function () {
	let t = this;
	lnrr.search_value = $(this).val();
	console.log("SEARCH VALUE: ", lnrr.search_value);
	t.on_filters_changed();
};
ItemsPage.prototype.main_input_click = function () {
	$(".hamburger-menu-item").toggleClass("narrow");
	$(".add-item-items").toggle();
};
ItemsPage.prototype.primary_items_select = function (t) {
	let tmp = 'select * from Tbar_menu_items where Tbar_menu_items.category_id=?';
	// t.options.filters.countries[0] ? tmp += ' and Tbar_menu_items.region_name_en = \'' + t.options.filters.countries[0] + '\'' : tmp += '';
	MyDB.add_query(
		tmp,
		[t.options.filters.category_id],
		function (ret) {
			t.items = ret;
		}
	);
};

// ORDERING METHODS
ItemsPage.prototype.ORDER_change_category = function () {
	let t = this;
	let sortingCategory = $(".hamburger-menu-item.hamburger-sorting-filters .sorting-category-select");
	lnrr.order.active = 1;
	if (lnrr.order.by == "Year") {
		lnrr.order.by = "Price";
		sortingCategory.text("Цена");
	} else {
		lnrr.order.by = "Year";
		sortingCategory.text("Год");
	}
	t.on_filters_changed();
};
ItemsPage.prototype.ORDER_sorting_up = function () {
	let t = this;
	if (lnrr.order.to == "DESC") return;
	lnrr.order.active = 1;
	lnrr.order.to = "DESC";
	$(".hamburger-menu-item.hamburger-sorting-filters .sorting-category-select").removeClass("to-top").addClass("to-bottom");
	t.on_filters_changed();
	console.log("order was changed: ", lnrr.order.to);
};
ItemsPage.prototype.ORDER_sorting_down = function () {
	let t = this;
	if (lnrr.order.to == "ASC") return;
	lnrr.order.active = 1;
	lnrr.order.to = "ASC";
	$(".hamburger-menu-item.hamburger-sorting-filters .sorting-category-select").removeClass("to-bottom").addClass("to-top");
	t.on_filters_changed();
	console.log("order was changed: ", lnrr.order.to);
};
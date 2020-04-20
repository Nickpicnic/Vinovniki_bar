// map page
function MapPage(options) {
	this.options = options;
}
MapPage.prototype.open = function () {
	let t = this;
	return {
		html: lnrr.View('bar/MapPage/index')
	};
};
MapPage.prototype.on_page_added = function () {
	var t = this;

	$(".go-back-button img", pager.get_html(this.page_index)).click(function () { pager.back() });

	t.draw_regions();
};
MapPage.prototype.draw_regions = function () {
	let t = this;
	t.some_description_shown = 0; // по дефолту все закрыты
	t.drop_board_shown = 0;
	// make region-image object
	t.region_iteration();
	t.coordinate_iteration($(".container.map-container", pager.get_html(this.page_index)));
};
// триггер всех кликов
MapPage.prototype.all_clicks = function (crd) {
	let t = this;
	$("#" + lnrr.coordinates[crd].name_en + "_point", pager.get_html(this.page_index)).click(function () { t.show_description_logic(crd); });
	// клик по табличке
	$(".drop-board img").unbind().click(function () { t.board_click(); });
	// клик по фону
	$(".map", pager.get_html(this.page_index)).unbind().click(function () { t.background_click(crd) });
	// клик по описанию
	$("#" + lnrr.coordinates[crd].name_en + "_description", pager.get_html(this.page_index)).click(function () { t.description_click(crd) });
};
// метод клик по табличке
MapPage.prototype.board_click = function () {
	console.log("DROP BOARD WAS CLICKED");
	let t = this;
	$(".drop-board img").parent().toggleClass("shown");
	t.drop_board_shown ? t.drop_board_shown = 0 : t.drop_board_shown = 1;
};
// метод клик по описанию
MapPage.prototype.description_click = function (coordinate) {
	let t = this;
	console.log("DESCRIPTION WAS CLICKED");
	let SQL_Request = t.description_click_gen_request(coordinate);
	MyDB.add_query(
		SQL_Request,
		[],
		function (ret) {
			lnrr.items_query_from_map = SQL_Request;
			pager.add_object(new ItemsPage({ filters: { countries: [ret[0].region_name_en] } }));
			// console.log("map ret: ", ret);
			// console.log("CLICKED REGION ID: ", lnrr.coordinates[coordinate].name_en);
			// console.log("NEW ITEMS REQUEST: ", SQL_Request);
		});
};
MapPage.prototype.description_click_gen_request = function (coordinate) {
	return "select " +
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
		"Tbar_menu_items.name_en as name_en, " +
		"Tbar_regions.name_ru as region_name_ru, " +
		"Tbar_regions.name_en as region_name_en " +
		"from Tbar_menu_items " +
		"left join Tbar_regions on Tbar_menu_items.region = Tbar_regions.id where Tbar_regions.name_en = '" +
		lnrr.coordinates[coordinate].name_en + "'";
};
// метод клик по описанию впервые
MapPage.prototype.first_description_click = function (crd) {
	let t = this;
	t.some_description_shown = 1;
	setTimeout(function () {
		$(".drop-board").addClass("shown");
		t.drop_board_shown = 1;
		console.log("FIRST PREVIEW SHOWN: ", t.drop_board_shown);

		$(".drop-board .region-info img", pager.get_html(this.page_index)).attr("src", t.regionImage[crd] ? t.regionImage[crd] : "/src/red_wine.png");
		$(".drop-board .region-info p", pager.get_html(this.page_index)).text(t.regionDescription[crd] ? t.regionDescription[crd] : "Скоро здесь появится описание региона");
	}, 750);
};
// метод клик по другому описанию
MapPage.prototype.another_description_click = function (crd) {
	let t = this;
	console.log("another description was clicked");
	$(".reg-description.shown").toggle(function () {
		$(this).animate(
			{
				"top": lnrr.coordinates[crd].Y + 43,
				"color": "rgba(0,0,0,0)",
				"border": "none",
				"padding": 0,
				"width": 0
			}, 250, "swing");
	});
	$(".reg-description.shown", pager.get_html(this.page_index)).removeClass("shown");

	$(".drop-board .region-info img", pager.get_html(this.page_index)).attr("src", t.regionImage[crd] ? t.regionImage[crd] : "/src/red_wine.png");
	$(".drop-board .region-info p", pager.get_html(this.page_index)).text(t.regionDescription[crd] ? t.regionDescription[crd] : "Скоро здесь появится описание региона");
};
MapPage.prototype.same_description_click = function (crd) {
	let t = this;
	t.some_description_shown = 0;
	if (t.drop_board_shown) {
		t.drop_board_shown = 0;
		$(".drop-board.shown").toggleClass("shown");
		$(".drop-board .region-info img").attr("src", "");

		$(".drop-board .region-info p").text("");
	}
};
MapPage.prototype.show_description_logic = function (crd) {
	let t = this;
	if (t.some_description_shown) {
		// если до этого уже было открыто другое описание
		if ($("#" + lnrr.coordinates[crd].name_en + "_description", pager.get_html(this.page_index)).hasClass("shown")) {
			// клик по тому же описанию
			t.same_description_click(crd);
		} else {
			// клик по другому описанию
			t.another_description_click(crd);
		}
	} else {
		// иначе клик срабатывает впервые
		t.first_description_click(crd);
	}
	t.description_click_animation(crd);
};
// метод клик по фону
MapPage.prototype.background_click = function (crd) {
	console.log("BACKGROUND WAS CLICKED");
	let t = this;
	let regDescriptionShown = $(".reg-description.shown", pager.get_html(this.page_index));
	t.some_description_shown = 0;

	regDescriptionShown.toggle(function () { t.show_description_animation(regDescriptionShown, crd) })

};
// итерация по всем координатам
MapPage.prototype.coordinate_iteration = function (map_container) {
	let t = this;
	for (let crd in lnrr.coordinates) {
		if (lnrr.coordinates[crd].category_ID != lnrr.last_category) continue;
		map_container.append("<p class='reg reg-description' id='" + lnrr.coordinates[crd].name_en + "_description' style='display:none; left: " + (lnrr.coordinates[crd].X - 8) + "px;top: " + (lnrr.coordinates[crd].Y + 28) + "px;'>" + lnrr.coordinates[crd].name_ru + "</p>");
		map_container.append("<div class='reg reg-point' id='" + lnrr.coordinates[crd].name_en + "_point' style='left: " + (lnrr.coordinates[crd].X + 17) + "px;top: " + (lnrr.coordinates[crd].Y + 90) + "px;'></div>");
		t.all_clicks(crd);
	}
};
// итерация по регионам
MapPage.prototype.region_iteration = function () {
	let t = this;
	t.regionImage = {};
	t.regionDescription = {};
	for (let rgn of lnrr.regions) {
		if (rgn.image_url) {
			t.regionImage[rgn.name_en] = rgn.image_url;
		}
		if (rgn.description) {
			t.regionDescription[rgn.name_en] = rgn.description;
		}
	}
};
MapPage.prototype.show_description_animation = function (description, crd) {
	description.animate(
		{
			"top": lnrr.coordinates[crd].Y + 43,
			"color": "rgba(0,0,0,0)",
			"border": "none",
			"padding": 0,
			"width": 0
		}, 250, "swing");
	$(".shown", pager.get_html(this.page_index)).removeClass("shown");
};
MapPage.prototype.description_click_animation = function (crd) {
	$("#" + lnrr.coordinates[crd].name_en + "_description", pager.get_html(this.page_index)).toggleClass("shown");
	$("#" + lnrr.coordinates[crd].name_en + "_description", pager.get_html(this.page_index)).toggle(function () {
		$(this).animate(
			{
				"top": lnrr.coordinates[crd].Y + 18,
				"padding": "3px 6px 7px 6px",
				"width": 'initial'
			}, 250, "swing");
		$(this).css(
			{
				"width": "initial",
				"border": "3px solid rgb(108,0,0)",
				"color": "rgb(108,0,0)"
			});
	});
}

// grapes page
function GrapesPage(options) {
	this.options = options;
}

GrapesPage.prototype.open = function () {
	var t = this;
	return {
		html: lnrr.View('bar/GrapesPage/index')
	};
};

GrapesPage.prototype.on_page_added = function () {
	var t = this;
	// Сорта 
	MyDB.add_query(
		"select " +
		"Tbar_grapes.id as id, " +
		"Tbar_grapes.name_ru as name_ru, " +
		"Tbar_grapes.name_en as name_en, " +
		"Tbar_grapes.image_url as image_url " +
		"from Tbar_grapes " +
		"join Tbar_menu_item_grapes on Tbar_grapes.id = Tbar_menu_item_grapes.grape_id " +
		"group by name_en " +
		"order by name_ru",
		[],
		function (ret) {
			t.grapes = ret;
			// console.log("GRAPES RETURN: ", t.grapes);
		}
	);
	// Перерисовываем экран
	MyDB.add_query(
		null,
		null,
		function () {
			lnrr.grapes = t.grapes;
			pager.set_html(t.page_index, lnrr.View('bar/GrapesPage/index'));
			$('.grapes-categories', pager.get_html(t.page_index)).html(lnrr.View('bar/GrapesPage/items'));
			setTimeout(function () { $(".category-preview-name", pager.get_html(t.page_index)).addClass("shown"); }, 50);

			$(".go-back-button img", pager.get_html(t.page_index)).click(function () { pager.back() });
		}
	);
};

GrapesPage.prototype.item_clicked = function (id) {
	console.log("ID: ", id);
	MyDB.add_query(
		"select " +
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
		"Tbar_grapes.id as grape_id " +
		"from Tbar_menu_items " +
		"join Tbar_menu_item_grapes on Tbar_menu_items.id = Tbar_menu_item_grapes.menu_item_id " +
		"join Tbar_grapes on Tbar_menu_item_grapes.grape_id = Tbar_grapes.id " +
		"where Tbar_grapes.id = ?",
		[id],
		function (ret) {
			console.log("GRAPE CLICKED RETURN: ", ret);
			console.log("GIVE GRAPE ID TO ITEMS PAGE: ", ret[0].grape_id);
			pager.add_object(new ItemsPage({ filters: { grapes: [ret[0].grape_id] } }));
		}
	);
};
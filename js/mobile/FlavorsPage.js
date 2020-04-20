// flavors page
function FlavorsPage(options) {
	this.options = options;
}

FlavorsPage.prototype.open = function () {
	var t = this;
	return {
		html: lnrr.View('bar/FlavorsPage/index')
	};
};

FlavorsPage.prototype.on_page_added = function () {
	var t = this;
	// Ароматы
	MyDB.add_query(
		"select Tbar_flavors.id as id, " +
		"Tbar_flavors.name_ru as name_ru, " +
		"Tbar_flavors.name_en as name_en, " +
		"Tbar_flavors.image_url as image_url " +
		"from Tbar_flavors " +
		"join Tbar_menu_item_flavors on Tbar_flavors.id = Tbar_menu_item_flavors.flavor_id " +
		"group by name_en " +
		"order by name_ru",
		[],
		function (ret) {
			t.flavors = ret;
			// console.log("FLAVORS RETURN: ", t.flavors);
		}
	);
	// Перерисовываем экран
	MyDB.add_query(
		null,
		null,
		function () {
			lnrr.flavors = t.flavors;
			pager.set_html(t.page_index, lnrr.View('bar/FlavorsPage/index'));
			$('.flavors-categories', pager.get_html(t.page_index)).html(lnrr.View('bar/FlavorsPage/items'));
			setTimeout(function () { $(".category-preview-name", pager.get_html(t.page_index)).addClass("shown"); }, 50);

			$(".go-back-button img", pager.get_html(t.page_index)).click(function () { pager.back() });
		}
	);
}

FlavorsPage.prototype.item_clicked = function (id) {
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
		"Tbar_flavors.id as flavor_id " +
		"from Tbar_menu_items " +
		"join Tbar_menu_item_flavors on Tbar_menu_items.id = Tbar_menu_item_flavors.product_id " +
		"join Tbar_flavors on Tbar_menu_item_flavors.flavor_id = Tbar_flavors.id " +
		"where Tbar_flavors.id = ?",
		[id],
		function (ret) {
			console.log("FLAVOR CLICKED RETURN: ", ret);
			console.log("GIVE FLAVOR ID TO ITEMS PAGE: ", ret[0].flavor_id);
			pager.add_object(new ItemsPage({ filters: { flavors: [ret[0].flavor_id] } }));
		}
	);
};
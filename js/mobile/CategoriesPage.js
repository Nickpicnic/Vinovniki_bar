function CategoriesPage(options) {
	this.options = options;
}
CategoriesPage.prototype.open = function () {
	let t = this;
	t.open_lnrr_define();
	return {
		html: lnrr.View("bar/CategoriesPage/index"),
	};
};
CategoriesPage.prototype.open_lnrr_define = function () {
	lnrr.category = undefined;
	lnrr.subcategories = undefined;
	lnrr.countries = undefined;
	lnrr.categories = undefined;
	lnrr.coordinates = undefined;
	lnrr.colors = undefined;
	lnrr.sugars = undefined;
	lnrr.items = undefined;
	lnrr.filters = undefined;
	lnrr.flavors = undefined;
	lnrr.grapes = undefined;
	lnrr.min_price = undefined;
	lnrr.max_price = undefined;
	lnrr.min_year = undefined;
	lnrr.max_year = undefined;
	lnrr.min_price_selected = undefined;
	lnrr.max_price_selected = undefined;
	lnrr.min_year_selected = undefined;
	lnrr.max_year_selected = undefined;
	lnrr.search_value = undefined;
	lnrr.last_category = undefined;
}

CategoriesPage.prototype.on_page_added = function () {
	let t = this;
	// Запускаем загрузку данных
	t.opa_loading_data(t);
	// Перерисовываем экран
	t.opa_refresh(t);
};
// ON PAGE ADDED functions
CategoriesPage.prototype.opa_loading_data = function (t) {
	// ЗАГРУЖАЕМ:
	// Текущая категория
	t.opa_current_category(t);
	// Подкатегории
	t.opa_subcategories(t);
	// Страны
	t.opa_countries(t);
	// Регионы
	t.opa_regions(t);
	// Координаты
	t.opa_coordinates(t);
	//Цвета
	t.opa_colors(t);
	//Сахар
	t.opa_sugars(t);
	// Товары
	t.opa_items(t);
	// Минимальные и максимальные цены 
	t.opa_min_max_price(t);
	// Минимальный и максимальный год
	t.opa_min_max_year(t);
	// Фильтры
	t.opa_filters(t);
};
CategoriesPage.prototype.opa_current_category = function (t) {
	MyDB.add_query(
		"select * from Tbar_categories where id = ?",
		[t.options.parent_id],
		function (ret) {
			t.category = ret[0] || {};
			if (t.category) cat_name = t.category.function_name;
		}
	);
};
CategoriesPage.prototype.opa_subcategories = function (t) {
	MyDB.add_query(
		t.options.parent_id ? "select * from Tbar_categories where parent_id = ?" : "select * from Tbar_categories where parent_id is null order by Tbar_categories.id",
		t.options.parent_id ? [t.options.parent_id] : [],
		function (ret) {
			t.subcategories = ret;
		}
	);
};
CategoriesPage.prototype.opa_countries = function (t) {
	MyDB.add_query(
		"select Tbar_regions.id as id, Tbar_regions.name_ru as name_ru,Tbar_regions.name_en as name_en from Tbar_regions where parent_id is null and id in (select Tbar_regions.parent_id from Tbar_regions join Tbar_menu_items on Tbar_menu_items.region = Tbar_regions.id)",
		[],
		function (ret) {
			t.countries = ret;
		}
	);
};
CategoriesPage.prototype.opa_regions = function (t) {
	MyDB.add_query(
		"select id, name_ru, name_en, image_url, description from Tbar_regions where parent_id is not null",
		[],
		function (ret) {
			t.regions = ret;
		}
	);
};
CategoriesPage.prototype.opa_coordinates = function (t) {
	MyDB.add_query(
		"select Tbar_regions.id as ID, Tbar_regions.name_ru as name_ru, Tbar_regions.name_en as name_en, Tbar_regions_coordinates.x as X, Tbar_regions_coordinates.y as Y, Tbar_menu_items.category_id as Category_ID from Tbar_regions join Tbar_regions_coordinates on Tbar_regions.id = Tbar_regions_coordinates.region_id join Tbar_menu_items on Tbar_menu_items.region = Tbar_regions.id",
		[],
		function (ret) {
			t.coordinates = {};
			for (r of ret) {
				t.coordinates[r.name_en] = {};
				t.coordinates[r.name_en].name_en = r.name_en;
				t.coordinates[r.name_en].name_ru = r.name_ru;
				t.coordinates[r.name_en].X = r.X;
				t.coordinates[r.name_en].Y = r.Y;
				t.coordinates[r.name_en].category_ID = r.Category_ID;
			}
		}
	);
};
CategoriesPage.prototype.opa_colors = function (t) {
	MyDB.add_query(
		"select Tbar_wine_colors.id as id, Tbar_wine_colors.name_ru as name_ru, Tbar_wine_colors.name_en as name_en from Tbar_wine_colors where id in (select Tbar_menu_items.color from Tbar_menu_items)",
		[],
		function (ret) {
			t.colors = ret;
		}
	);
};
CategoriesPage.prototype.opa_sugars = function (t) {
	MyDB.add_query(
		"select Tbar_sugars.id as id, Tbar_sugars.name_ru as name_ru, Tbar_sugars.name_en as name_en from Tbar_sugars where id in (select TBar_menu_items.sugar from Tbar_menu_items)",
		[],
		function (ret) {
			t.sugars = ret;
		}
	);
};
CategoriesPage.prototype.opa_items = function (t) {
	MyDB.add_query(
		"select * from Tbar_menu_items order by Tbar_menu_items.id",
		[],
		function (ret) {
			t.items = ret;
		}
	);
};
CategoriesPage.prototype.opa_min_max_price = function (t) {
	MyDB.add_query(
		"select Tbar_menu_items.price as price from Tbar_menu_items order by price",
		[],
		function (ret) {
			t.min_price = 0;
			t.max_price = ret[ret.length - 1]["price"];
		}
	);
};
CategoriesPage.prototype.opa_min_max_year = function (t) {
	MyDB.add_query(
		"select Tbar_menu_items.year as year from Tbar_menu_items where year is not null order by year",
		[],
		function (ret) {
			t.min_year = ret[0]["year"];
			t.max_year = ret[ret.length - 1]["year"];
		}
	);
};
CategoriesPage.prototype.opa_filters = function (t) {
	MyDB.add_query(
		"select Tbar_categories.name_ru as Category, Tbar_filters.name_ru as Filters, Tbar_filters.data_type as FilterType from Tbar_categories_filters left join Tbar_categories on Tbar_categories.id = Tbar_categories_filters.category_id left join Tbar_filters on Tbar_filters.id = Tbar_categories_filters.filter_id",
		[],
		function (ret) {
			t.filters = {};
			ret.forEach(filter => {
				if (t.filters[filter.Category]) {
					t.filters[filter.Category].push({ "Filter": filter.Filters, "Type": filter.FilterType });
				} else {
					t.filters[filter.Category] = [];
					t.filters[filter.Category].push({ "Filter": filter.Filters, "Type": filter.FilterType });
				}
			});
		}
	);
};
CategoriesPage.prototype.opa_refresh = function (t) {
	MyDB.add_query(
		null,
		null,
		function () {
			lnrr.category = t.category;
			lnrr.subcategories = t.subcategories;
			lnrr.countries = t.countries;
			lnrr.regions = t.regions;
			lnrr.coordinates = t.coordinates;
			lnrr.colors = t.colors;
			lnrr.sugars = t.sugars;
			lnrr.items = t.items;
			lnrr.filters = t.filters;
			lnrr.min_price = t.min_price;
			lnrr.max_price = t.max_price;
			lnrr.min_year = t.min_year;
			lnrr.max_year = t.max_year;
			lnrr.filters_allowed = {
				order: 1,
				search: 1,
				price: 1,
				map: 1,
				grapes: 1,
				flavors: 1,
				year: 1,
				color: 1,
				country: 1,
				sugar: 1
			}
			pager.set_html(t.page_index, lnrr.View("bar/CategoriesPage/index"));
			$(".go-back-button img", pager.get_html(this.page_index)).click(function () { pager.back() });
			setTimeout(function () { $(".category-preview-name").addClass("shown"); }, 50);
			setTimeout(function () { $(".container .background-image img").css("opacity", "0.3"); }, 400);

		}
	);
};

CategoriesPage.prototype.categories_clicked = function (id) {
	var cat;
	var t = this;
	for (var i = 0; i < t.subcategories.length; i++) if (t.subcategories[i].id == id) cat = t.subcategories[i];
	switch (cat.function_name) {
		case "items_page":
			lnrr.last_category = id;
			pager.add_object(new ItemsPage({ filters: { category_id: id } }));
			break;
		case "text_page":
			pager.add_object(new DescriptionPage({ id: id }));
			break;
		default:
			pager.add_object(new CategoriesPage({ parent_id: id }));
	}
};

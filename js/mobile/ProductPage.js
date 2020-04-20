function ProductPage(options) {
	this.options = options;
}

ProductPage.prototype.open = function () {
	var t = this;

	this.category = undefined;
	this.product = undefined;
	this.sugar = undefined;
	this.region = undefined;
	this.grapes = undefined;
	this.flavors = undefined;
	this.colors = undefined;
	this.country = undefined;

	return {
		//	html:lnrr.View("bar/ProductPage/index"),
	};
}

ProductPage.prototype.on_page_added = function () {
	var t = this;
	//	console.log("ProductPage t.options: ", t.options);
	// Текущий товар
	MyDB.add_query(
		"select * from Tbar_menu_items where id = ?",
		[t.options.parent_id],
		function (ret) {
			//			console.log("ID and RETURN: ",t.options.parent_id, ret);

			t.product = ret[0] || {};
			//			if (t.category) cat_name=t.category.function_name; 
		}
	);

	// Регион товара
	MyDB.add_query(
		"select Tbar_regions.name_ru,Tbar_regions.name_en,Tbar_regions.parent_id from Tbar_menu_items left join Tbar_regions on Tbar_menu_items.region=Tbar_regions.id where Tbar_menu_items.id=?",
		[t.options.parent_id],
		function (ret) {
			//			console.log("Tbar_regions: ", ret);
			t.region = ret[0] || {};
			if (ret[0]) t.country = ret[0].parent_id;
			//			console.log("country_id: ",t.country);
		}
	);

	// Страна товара
	MyDB.add_query(
		"select Tbar_regions.name_ru, Tbar_regions.name_en from Tbar_regions where id=(select Tbar_regions.parent_id from Tbar_menu_items left join Tbar_regions on Tbar_menu_items.region=Tbar_regions.id where Tbar_menu_items.id=?);",
		[t.options.parent_id],
		function (ret) {
			t.country = ret[0] || {};
			//			console.log("Tbar_country: ", t.country);
		}
	);


	// Сахар товара
	MyDB.add_query(
		"select Tbar_sugars.name_ru,Tbar_sugars.name_en from Tbar_menu_items left join Tbar_sugars on Tbar_menu_items.sugar=Tbar_sugars.id where Tbar_menu_items.id=?",
		[t.options.parent_id],
		function (ret) {
			//			console.log("Tbar_sugars: ",ret);
			t.sugar = ret[0] || {};
		}
	);
	// Сорта винограда в товаре и процентное соотношение 
	MyDB.add_query(
		"select Tbar_grapes.id, Tbar_grapes.name_ru, Tbar_grapes.name_en, Tbar_menu_item_grapes.percent from Tbar_menu_items left join Tbar_menu_item_grapes on Tbar_menu_item_grapes.menu_item_id = Tbar_menu_items.id left join Tbar_grapes on Tbar_menu_item_grapes.grape_id = Tbar_grapes.id where Tbar_menu_items.id=?;",
		[t.options.parent_id],
		function (ret) {
			//			console.log("Tbar_grapes", ret);
			t.grapes = ret || {};
		}
	);

	// Цвет товара
	MyDB.add_query(
		"select Tbar_wine_colors.name_ru from Tbar_menu_items left join Tbar_wine_colors on Tbar_menu_items.color=Tbar_wine_colors.id where Tbar_menu_items.id=?",
		[t.options.parent_id],
		function (ret) {
			//			console.log("Tbar_wine_colors: ", ret);
			t.colors = ret[0] || {};
		}
	);

	// Ароматы товара
	MyDB.add_query(
		"select Tbar_flavors.id, Tbar_menu_items.id as Product_ID, Tbar_flavors.image_id, Tbar_flavors.name_ru, Tbar_flavors.name_en from Tbar_menu_items left join Tbar_menu_item_flavors on Tbar_menu_item_flavors.product_id = Tbar_menu_items.id join Tbar_flavors on Tbar_menu_item_flavors.flavor_id = Tbar_flavors.id where Tbar_menu_items.id=?;",
		[t.options.parent_id],
		function (ret) {
			//			console.log("RET FLAVORS: ", ret);
			t.flavors = ret || {};
		}
	);

	// Перерисовываем экран
	MyDB.add_query(
		null,
		null,
		function () {
			lnrr.product = t.product;
			lnrr.sugar = t.sugar;
			lnrr.region = t.region;
			lnrr.grapes = t.grapes;
			lnrr.colors = t.colors;
			lnrr.country = t.country;
			lnrr.flavors = t.flavors;
			/*
						console.log("GIVEN COUNTRY: ", lnrr.country);
						console.log("lnrr.product: ", lnrr.product);
						console.log("SUGAR: ", lnrr.sugar);
						console.log("GIVEN FLAVORS: ", lnrr.flavors);
						console.log("GIVEN REGION: ", lnrr.region);
						console.log("GIVEN GRAPES: ", lnrr.grapes);
			*/
			pager.set_html(t.page_index, lnrr.View("bar/ProductPage/index"));
			lnrr.basket[lnrr.product.id]
				? $(".add-item img").attr("src", "/src/minus.png")
				: $(".add-item img").attr("src", "/src/plus_0.png");

			$(".add-item").click(function () {
				$(this).toggleClass("rotate");

				if (!lnrr.basket[lnrr.product.id]) {
					$(".basket .bottle-in-basket", pager.get_html(this.page_index)).css({ "background": "url(" + lnrr.product.image_url + ")", "background-size": "contain", "background-repeat": "no-repeat" }).addClass("active");
					setTimeout(function () {
						$(".basket .bottle-in-basket.active").css(
							{
								"top": "-80px",
								"left": "50px",
								"height": "35px"
							})
					}, 250);
					setTimeout(function () {
						$(".basket .bottle-in-basket.active").css(
							{
								"display": "none"
							})
					}, 750);
				}

				if (lnrr.basket[lnrr.product.id]) {
					lnrr.basket[lnrr.product.id] = 0;
					$(".add-item img").attr("src", "/src/plus_0.png");
				} else {
					lnrr.basket[lnrr.product.id] = 1;
					$(".add-item img").attr("src", "/src/minus.png");
				}
				$(".product-number#" + lnrr.product.id).html(lnrr.basket[lnrr.product.id]);
			});
		}
	);
}


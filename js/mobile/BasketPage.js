function BasketPage(options) {
	this.options = options;
}

BasketPage.prototype.open = function () {
	let t = this;
	return {
		html: lnrr.View('bar/BasketPage/index')
	};
};

BasketPage.prototype.on_page_added = function () {
	let t = this;
	t.products = [];

	for (let product_id in lnrr.basket) {
		if (lnrr.basket[product_id]) {
			console.log("My Basket. Product ID: ", product_id);
			MyDB.add_query(
				"select * from Tbar_menu_items where Tbar_menu_items.id = ?",
				[product_id],
				function (ret) {
					console.log("Basket Page Return 0: ", ret[0]);
					t.products.push(ret[0]);
				}
			);
		}
	}
	setTimeout(function () { console.log("T PRODUCTS: ", t.products); }, 2000);


	// Перерисовываем экран
	MyDB.add_query(
		null,
		null,
		function () {
			lnrr.products = t.products;
			pager.set_html(t.page_index, lnrr.View('bar/BasketPage/index'));
			$('.basket-categories', pager.get_html(t.page_index)).html(lnrr.View('bar/BasketPage/items'));
			setTimeout(function () { $(".category-preview-name", pager.get_html(t.page_index)).addClass("shown"); }, 50);

			$(".go-back-button img", pager.get_html(t.page_index)).click(function () { pager.back() });

			t.warningHidden = 1;
			$(".basket-clear img", pager.get_html(t.page_index)).click(function () {
				if (t.warningHidden) {
					$(this).toggle();
					t.warningHidden = 0;
					console.log("warningHidden1: ", t.warningHidden);

					$(".category-preview-name", pager.get_html(this.page_index)).toggle();
					$(this).parent().parent().append("<div class='basket-clear-warning'> Очистить список? <div class='basket-clear-warning buttons'><div class='button accept'>Да</div><div class='button cancel'>Нет</div></div></div>");
					$(".basket-clear-warning.buttons .button.accept").click(function () {
						$(".basket-clear").toggle();
						for (let product in lnrr.basket) {
							lnrr.basket[product] = 0;
							lnrr.products.pop();

							$(".add-item-items .product-number#" + product).text(0);

							$(".basket-clear-warning").remove();
							t.warningHidden = 1;
							$(".category-preview-name", pager.get_html(this.page_index)).toggle();
							$('.basket-categories', pager.get_html(t.page_index)).html(lnrr.View('bar/BasketPage/items'));
						}
					});
					$(".basket-clear-warning.buttons .button.cancel, .container", pager.get_html(this.page_index)).click(function () {
						console.log("warningHidden2: ", t.warningHidden);
						if (!t.warningHidden) {
							console.log(t.warningHidden);
							$(".basket-clear img").toggle();
							$(".basket-clear-warning").remove();
							$(".category-preview-name", pager.get_html(this.page_index)).toggle();
							t.warningHidden = 1;
						}
					});
				}
			});
			if (!lnrr.products.length) $(".basket-clear").toggle();
			for (let basket_item in lnrr.basket) {
				if (lnrr.basket[basket_item]) {
					$(".add-item-items .product-number#basket-item-" + basket_item).text(lnrr.basket[basket_item]);

					$(".add-item-items #item-plus-" + basket_item, pager.get_html(this.page_index)).click(function () {
						lnrr.basket[basket_item]++;
						$(".add-item-items .product-number#basket-item-" + basket_item + ", .product-number#" + basket_item).text(lnrr.basket[basket_item]);
					});
					$(".add-item-items #item-minus-" + basket_item, pager.get_html(this.page_index)).click(function () {
						lnrr.basket[basket_item]--;
						if (lnrr.basket[basket_item] > 0) {
							$(".add-item-items .product-number#basket-item-" + basket_item + ", .product-number#" + basket_item).text(lnrr.basket[basket_item]);
						} else {
							$(".product-number#" + basket_item).text(lnrr.basket[basket_item]);
							$(this).parent().parent().toggle("swing", function () {
								$(this).remove();
							});
						}
					});
				}
			}
		}
	);
}

BasketPage.prototype.item_clicked = function (id) {
	pager.add_object(new ProductPage({ parent_id: id }));
};

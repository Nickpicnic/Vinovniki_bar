/* global $, lnrr, LNMPager, IndexPage, pager */

function IndexPage() {
	lnrr.basket = {};
	lnrr.products = undefined;
}

IndexPage.prototype.open = function () {
	return {
		page_index: 0,
		html: lnrr.View("bar/IndexPage/index"),
	};
};

IndexPage.prototype.categories_clicked = function () {
	pager.add_object(new CategoriesPage({ parent_id: null }));
};



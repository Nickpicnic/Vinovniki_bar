function DescriptionPage(options) {
	this.options = options;
}

DescriptionPage.prototype.open = function () {
	var t = this;

	this.category = undefined;

	return {
		/*top:{
			title: "Description",
			buttons:[
				{pos:0, cssclass:"text", name:"Назад",click: function() { pager.back(); }},
			]
		},*/
		html: lnrr.View("bar/DescriptionPage/index"),
	};

}

DescriptionPage.prototype.on_page_added = function () {
	var t = this;
	// Текущая категория
	MyDB.add_query(
		"select * from Tbar_categories where id = ?",
		[this.options.id],
		function (ret) {
			//			console.log(ret);

			t.category = ret[0] || {};
			if (t.category) cat_name = t.category.function_name;
		}
	);

	// Перерисовываем экран
	MyDB.add_query(
		null,
		null,
		function () {
			lnrr.category = t.category;
			pager.set_html(t.page_index, lnrr.View("bar/DescriptionPage/index"));

		}
	);
}

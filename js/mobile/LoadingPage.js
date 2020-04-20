/* global $, lnrr, LNMPager, LoadingPage, pager */

function LoadingPage() {

}

LoadingPage.prototype.open = function () {
	return {
		page_index: 0,
		html: lnrr.View("bar/LoadingPage/index"),
	};
};

LoadingPage.prototype.on_page_added = function () {
	ajaj(
		"mobile_init",
		{},
		function (ret) {
			// Пришли новые данные, нужно положить их в webSql
			// Удаление всех таблиц
			MyDB.delete_tables_query();

			// Загрузка всех таблиц
			MyDB.create_tables_query();
			MyDB.insert_data_query(ret);
			//			console.log("Loading Page RET: ", ret);

			MyDB.add_query(null, null, function () {
				// Будет вызвана после того как будут исполнены все SQL-запросы
				pager.add_object(new IndexPage());
			});
		},
		function (ret) {
			// Данных нет - ошибка
			console.log("LoadingPage.on_page_added ERROR: ", ret);
		}
	);
};

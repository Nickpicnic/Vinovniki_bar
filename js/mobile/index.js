/* global $, lnrr, LNMPager, IndexPage, pager */

var pager;
function ajaj(method, args, success, error) {
	function err(r) {
		if (error) return error(err);
		alert(r.error || "Какая-то неизвестная ошибка");
	}
	$.post("/api/" + method + "/", args, function (ret) {
		if (typeof ret == "string" && !ret.match(/^\{/)) {
			return err({ error: ret });
		}
		if (typeof ret == "string") ret = JSON.parse(ret);
		if (!ret.ok) return err(ret);
		success(ret);
	});
}


var Bar = {

	start: function () {
		var t = this;
		pager = new LNMPager("#main", { ios_shift: 20, fast: 0 });
		lnrr.load_file("bar");
		lnrr.views.after_loaded(function () { t.start_done(); });
	},
	start_done: function () {
		pager.add_object(new LoadingPage());
	},

	init_config: function () {
		// Пока пусто
		// что-то делаем когда получили конфиг
	},

	filter_by_rules: function (array, rules) {
		return array.filter(function (el) {
			if (!rules) return 1;

			return 1;
		});
	}
};



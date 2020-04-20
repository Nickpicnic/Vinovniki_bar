/*
Tables to create:
	tbar_categories 
	tbar_flavors   
	tbar_grapes  
	tbar_menu_item_flavors
	tbar_menu_item_grapes
	tbar_menu_items
	tbar_regions 
	tbar_sugars
	tbar_wine_colors
*/

var temp_query,
	temp_query_params;
var MyDB = {
	queue: [

	],
	add_query: function (sql, params, cb) {
		//	console.log("add_query", arguments);
		this.queue.push([sql, params, cb]);
		this.run_query();

	},
	run_query: function () {
		//console.log("run query ", arguments);
		if (this.in_process) return;
		this.in_process = 1;
		var t = this;
		//console.log("queue befor shift", ""+t.queue);
		if (!this.queue.length) return;
		var trans = this.queue.shift();
		//console.log("queue after shift", ""+t.queue,"\ntrans after shift: ", trans);
		db.transaction(function (tx) {
			//console.log("trans 0:\n", trans[0]);
			//console.log("trans 1:\n", trans[1]);
			//			if (!trans) console.log("Что за фигня!");
			tx.executeSql(
				trans[0], // string with sql query
				trans[1], // array with params
				function (tx, result) {
					//console.log("executeSql.result",result);
					t.in_process = 0;
					if (trans[2]) trans[2](result);
					t.run_query();
				},
				function (tx, error) {
					console.log("executeSql.error", arguments);
					throw "stop_1";
				},
			);
		});
	}
};

var init_JSON = JSON.parse(window.localStorage.bar);
console.log("init JSON: ", init_JSON);

var db = openDatabase("BarDB", "0.1", "A DB for Bar Menu", 200000);
if (!db) { alert("DB connection failed."); }

var tables = {
	"categories": "Tbar_categories",
	"flavors": "Tbar_flavors",
	"grapes": "Tbar_grapes",
	"menu_items_flavors": "Tbar_menu_item_flavors",
	"menu_items_grapes": "Tbar_menu_item_grapes",
	"menu_items": "Tbar_menu_items",
	"regions": "Tbar_regions",
	"sugars": "Tbar_sugars",
	"wine_colors": "Tbar_wine_colors"
};

var create_tables_object = {
	"Tbar_categories": "CREATE TABLE Tbar_categories(" +
		"id bigserial primary key," +
		"parent_id bigserial references Tbar_categories," +
		"ordering integer," +
		"image_id bigserial references Tfiles," +
		"enabled integer," +
		"name_ru varchar(255)," +
		"name_en varchar(255))",

	"Tbar_flavors": "CREATE TABLE Tbar_flavors(" +
		"id bigserial primary key," +
		"enabled integer," +
		"image_id bigserial references Tfiles," +
		"name_ru varchar(255)," +
		"name_en varchar(255))",

	"Tbar_grapes": "CREATE TABLE Tbar_grapes(" +
		"id bigserial primary key," +
		"enabled integer," +
		"image_id bigserial references Tfiles," +
		"name_ru varchar(255)," +
		"name_en varchar(255))",

	"Tbar_menu_item_flavors": "CREATE TABLE Tbar_menu_item_flavors(" +
		"id bigserial primary key," +
		"product_id bigserial references Tbar_menu_items," +
		"flavor_id bigserial references Tbar_flavors)",

	"Tbar_menu_item_grapes": "CREATE TABLE Tbar_menu_item_grapes(" +
		"id bigserial primary key," +
		"menu_item_id bigserial references Tbar_menu_items," +
		"grape_id bigserial references Tbar_grapes," +
		"percent integer)",

	"Tbar_menu_items": "CREATE TABLE Tbar_menu_items(" +
		"id bigserial primary key," +
		"category_id bigserial references Tbar_categories," +
		"enabled integer," +
		"price decimal(10,2)," +
		"image_id bigserial references Tfiles," +
		"wine_color_id bigserial references Tbar_wine_colors," +
		"volume decimal(10,2)," +
		"year integer," +
		"strength decimal(10,2)," +
		"name_ru varchar(255)," +
		"name_en varchar(255))",

	"Tbar_regions": "CREATE TABLE Tbar_regions(" +
		"id bigserial primary key," +
		"parent_id bigserial references Tbar_regions," +
		"ordering integer," +
		"enabled integer," +
		"image_id bigserial references Tfiles," +
		"name_ru varchar(255)," +
		"name_en varchar(255))",

	"Tbar_sugars": "CREATE TABLE Tbar_sugars(" +
		"id bigserial primary key," +
		"enabled integer," +
		"name_ru varchar(255)," +
		"name_en varchar(255))",

	"Tbar_wine_colors": "CREATE TABLE Tbar_wine_colors(" +
		"id bigserial primary key," +
		"code varchar(255)," +
		"name_ru varchar(255)," +
		"name_en varchar(255))"
};

// drop all existing tables while starting
for (let table in create_tables_object) {
	//	console.log("Drop table " + table + " added to queue");
	MyDB.add_query("DROP TABLE IF EXISTS " + table + ";", [], null, null);
}

// create tables
for (let table in create_tables_object) {
	MyDB.add_query(create_tables_object[table], [], null, null);
}

// insert data
// generate query
for (let table in init_JSON) {
	if (table == "ok") continue;
	// making query str
	temp_query = "";
	temp_query = "INSERT INTO " + tables[table] + " (";
	temp_query_params = [];
	let temp_counter = 0;
	for (let unit in init_JSON[table][0]) {
		temp_counter++;
		temp_query += unit;
		if (temp_counter < Object.keys(init_JSON[table][0]).length) temp_query += ", ";
	}
	temp_query += ") values(";
	for (let i = 0; i < temp_counter; i++) {
		i == temp_counter - 1 ? temp_query += "?);" : temp_query += "?, ";
	}
	// making query params array
	for (let i in init_JSON[table]) {
		temp_query_params = Object.values(init_JSON[table][i]);
		//		console.log(temp_query);
		//		console.log(temp_query_params);

		// add_query
		MyDB.add_query(temp_query, temp_query_params, null, function (tx, err) { console.log(err); });
	}
}

// select all food 
console.log("DB before select query", MyDB);
MyDB.add_query(
	"SELECT Tbar_menu_items.name_ru AS RUS, " +
	"Tbar_menu_items.name_en AS ENG " +
	"FROM Tbar_menu_items " +
	"JOIN Tbar_categories " +
	"ON Tbar_menu_items.category_id=Tbar_categories.id " +
	"WHERE Tbar_categories.name_ru='Вино';",
	[],
	function (result, tx) {
		console.log("sql select result: \n", "\tresult: ", result, "\n\ttx: ", tx, "\n\targuments: ", arguments);

		for (let i = 0; i < result.rows.length; i++) {
			console.log(result.rows.item(i)['RUS']);
			//document.write('<b>' + result.rows.item(i)['RUS'] + '</b><br />');
			$('div.LNMPager-main').append("<div>" + result.rows.item(i)['RUS'] + "</div>");
		}

	},
	null
);
// throw "stop";

console.log("DOM");
//$('.LNMPager-main').append("<div>Check Manipulations</div>");

/*
	SELECT Tbar_menu_items.name_ru AS RUS, Tbar_menu_items.name_en AS ENG FROM Tbar_menu_items JOIN Tbar_categories ON Tbar_menu_items.category_id=Tbar_categories.id WHERE Tbar_categories.name_ru='Вино';
*/

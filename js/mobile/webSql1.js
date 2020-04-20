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
		if (this.in_process) return;
		this.in_process = 1;
		var t = this;
		if (!this.queue.length) return;
		var trans = this.queue.shift();
		db.transaction(function (tx) {
			if (!trans[0]) {
				t.in_process = 0;
				trans[2]();
				return;
			}
			tx.executeSql(
				trans[0], // string with sql query
				trans[1], // array with params
				function (tx, result) {
					t.in_process = 0;
					var ret = [];
					if (result && result.rows) {
						for (var i = 0; i < result.rows.length; i++) {
							ret.push(JSON.parse(JSON.stringify(result.rows[i])));
						}
					}
					if (trans[2]) trans[2](ret);
					t.run_query();
				},
				function (tx, error) {
					console.log("executeSql.error", arguments);
					throw "stop_1";
				},
			);
		});
	},

	// drop all existing tables while starting
	delete_tables_query: function () {
		for (let table in create_tables_object) {
			MyDB.add_query("DROP TABLE IF EXISTS " + table + ";", [], null, null);
		}
	},

	// create tables
	create_tables_query: function () {
		for (let table in create_tables_object) {
			MyDB.add_query(create_tables_object[table], [], null, null);
		}
	},

	// insert data
	// generate query
	insert_data_query: function (ret) {
		for (let table in ret) {
			if (table == "ok") continue;
			// making query str
			temp_query = "";
			temp_query = "INSERT INTO " + tables[table] + " (";
			temp_query_params = [];
			let temp_counter = 0;
			for (let unit in ret[table][0]) {
				temp_counter++;
				temp_query += unit;
				if (temp_counter < Object.keys(ret[table][0]).length) temp_query += ", ";
			}
			temp_query += ") values(";
			for (let i = 0; i < temp_counter; i++) {
				i == temp_counter - 1 ? temp_query += "?);" : temp_query += "?, ";
			}
			// making query params array
			for (let i in ret[table]) {
				temp_query_params = Object.values(ret[table][i]);
				// add_query
				MyDB.add_query(temp_query, temp_query_params, null, function (tx, err) { console.log(err); });
			}
		}
		console.log(ret);
	}
};

var init_JSON = JSON.parse(window.localStorage.bar);
//console.log("init JSON: ", init_JSON);
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
	"wine_colors": "Tbar_wine_colors",
	"item_to_flavors": "Tbar_item_to_flavors",
	"filters": "Tbar_filters",
	"categories_filters": "Tbar_categories_filters",
	"regions_coordinates": "Tbar_regions_coordinates"
};

var create_tables_object = {
	"Tbar_categories": "CREATE TABLE Tbar_categories(" +
		"id bigserial primary key," +
		"parent_id bigserial references Tbar_categories," +
		"ordering integer," +
		"image_id bigserial references Tfiles," +
		"enabled integer," +
		"name_ru varchar(255)," +
		"name_en varchar(255)," +
		"function_name varchar(255)," +
		"image_url varchar(255)," +
		"function_params text)",

	"Tbar_flavors": "CREATE TABLE Tbar_flavors(" +
		"id bigserial primary key," +
		"enabled integer," +
		"image_id bigserial references Tfiles," +
		"image_url varchar(255)," +
		"name_ru varchar(255)," +
		"name_en varchar(255))",


	"Tbar_grapes": "CREATE TABLE Tbar_grapes(" +
		"id bigserial primary key," +
		"enabled integer," +
		"image_id bigserial references Tfiles," +
		"image_url varchar(255)," +
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
		"region integer references Tbar_regions," +
		"sugar integer references Tbar_sugars," +
		"grapes integer references Tbar_grapes," +
		"color integer references Tbar_wine_colors," +
		"strength decimal(10,2)," +
		"image_url varchar(255)," +
		"description text," +
		"name_ru varchar(255)," +
		"name_en varchar(255))",

	"Tbar_regions": "CREATE TABLE Tbar_regions(" +
		"id bigserial primary key," +
		"parent_id bigserial references Tbar_regions," +
		"ordering integer," +
		"enabled integer," +
		"image_id bigserial references Tfiles," +
		"description text," +
		"image_url varchar(255)," +
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
		"name_en varchar(255))",
	"Tbar_menu_item_flavors": "CREATE TABLE Tbar_menu_item_flavors(" +
		"id bigserial primary key," +
		"flavor_id integer references Tbar_flavors," +
		"product_id integer references Tbar_menu_items)",

	"Tbar_filters": "CREATE TABLE Tbar_filters(" +
		"id bigserial primary key," +
		"name_ru varchar(255)," +
		"name_en varchar(255)," +
		"code varchar(255)," +
		"data_type varchar(255))",

	"Tbar_categories_filters": "CREATE TABLE Tbar_categories_filters(" +
		"id bigserial primary key," +
		"category_id bigint references Tbar_categories," +
		"filter_id bigint references Tbar_filters)",

	"Tbar_regions_coordinates": "CREATE TABLE Tbar_regions_coordinates(" +
		"id bigserial primary key," +
		"region_id bigint references Tbar_regions," +
		"x int," +
		"y int)"
};
console.log("DOM");


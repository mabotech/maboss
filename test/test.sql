
select * from mtp_make_criteria_p('{
	"domain":[ "!", [ "user_id", "=", "user.id" ] ]}');

select * from mtp_make_criteria_p('{
	"domain":[  "&", [ "c", "<>", "d" ],  "!", [ "a", "=", "b" ]  ]}');

select * from mtp_make_criteria_p('{
			"domain":[ "|",[ "project_id", "=", "public" ],"|",["a","=","b"], 
			"&",  [ "project_id", "not in", [ "portal", "followers" ] ],  
		"&", "!", [ "message_follower_ids", "in", ["A", "B" ] ], [ "user_id", "=", "user.id" ] ]}');

-- Polish notation
select * from make_filters_str2('{
			"domain":[ "|",[ "project_id", "=", "public" ],"!",["a","=","b"], 
			"&",  [ "project_id", "not in", [ "portal", "followers" ] ],  
			"|",  [ "message_follower_ids", "in", ["A", "B" ] ], [ "user_id", "=", "user.id" ] ]}');

-- array notation
select * from mtp_make_criteria_a('{
                "domain" :  [ [ [ "col1", "=", "1", "int" ],
                    [ "col2", "ilike", "a5%", "varchar" ],
                    [ "col3", "<", "100", "int" ] ]                 ,
                [ [ "col4", "=", "name", "varchar" ], [ "col4", "in", ["10","11"], "int" ] ] ] }');


-- search
select * from mtp_find_active_cf2('{
"table":"deploys",
"cols":["seq","active","createdon"],
"domain":[[["seq","<=","265"],["active","=","1"  ]]],
"limit":"3",
"context":{"user":"abc", "languageid":1033}
}');

-- search
select * from mtp_find_cf2('{
"table":"company",
"cols":["seq","active","createdon"],
"domain":[[["seq","<=","265"],["active","=","0" ]],[["active","=","1"  ]]],
"limit":"2",
"context":{"user":"abc", "languageid":1033}
}');


-- search
select * from mtp_find_cf2('{
"table":"company",
"cols":["seq","active","createdon"],
"domain":[[["seq","<=","265"],["active","in",["0","1"]  ]] ],
"limit":"2",
"context":{"user":"abc", "languageid":1033}
}');

-- search
select * from mtp_find_cf2('{
"table":"company",
"cols":["seq","active","createdon"],
"domain":[[["seq",">","265"],["active","in",["0", "1"]  ]] ],
"limit":"2",
"context":{"user":"abc", "languageid":1033}
}');


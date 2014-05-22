CREATE OR REPLACE FUNCTION set_of_records1()
  RETURNS TABLE(i integer, t character varying) AS
$BODY$
        plv8.return_next( { "i": 1, "t": "a" } );
        plv8.return_next( { "i": 2, "t": "b" } );
        plv8.return_next( { "i": 3, "t": "c" } );
$BODY$
  LANGUAGE plv8 VOLATILE
  
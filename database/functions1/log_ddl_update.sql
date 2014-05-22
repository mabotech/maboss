CREATE OR REPLACE FUNCTION log_ddl_update()
  RETURNS event_trigger AS
$BODY$
BEGIN
  RAISE WARNING '[%]command % is logged', tg_event, tg_tag;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  

BEGIN
  RAISE WARNING '[%]command % is logged', tg_event, tg_tag;
END;

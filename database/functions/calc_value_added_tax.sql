CREATE OR REPLACE FUNCTION calc_value_added_tax(amount numeric)
  RETURNS numeric AS
$BODY$
DECLARE
_vat numeric := 0.125;
BEGIN
RETURN amount * (1 + _vat);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  
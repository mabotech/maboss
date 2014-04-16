
DECLARE
_vat numeric := 0.125;
BEGIN
RETURN amount * (1 + _vat);
END;

CREATE OR REPLACE FUNCTION diff(o_pl text, n_pl text)
  RETURNS text AS
$BODY$
import difflib


ln = 0
last_code = "   "
rtn = ""

diffs = difflib.ndiff(o_pl.splitlines(1), n_pl.splitlines(1))


for line in diffs:
    code = line[:2]
    if code in ("  ", "- "):
            ln = ln + 1

            
    rtn = rtn + "%s:%s" %( ln, line )

return rtn
$BODY$
  LANGUAGE plpython3u VOLATILE
  
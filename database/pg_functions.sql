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
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION company_add_cf9(i_json json)
  RETURNS json AS
$BODY$

sql_insert = "
     insert into company
     (id, company, active, modifiedon, modifiedby, createdon, createdby)
     values(DEFAULT, $1, 1, now(), $2, now(), $2)
     returning id,modifiedon, rowversion
    "

rtn = plv8.execute(sql_insert, [i_json.company, i_json.user])


return rtn[0]

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION company_add_pg1(i_json json)
  RETURNS json AS
$BODY$
declare
  v_company varchar;
  v_user varchar; 

  v_result json;

  v_id int8; 
  v_modifiedon timestamp;
  v_rowversionstamp int8;

begin

v_company = i_json ->> 'company';
v_user = i_json ->> 'user';

 
insert into company 
	 (id, company, active, modifiedon, modifiedby,createdon, createdby)
	 values(uuid_generate_v4(), v_company, 1, now(), v_user, now(), v_user)  
	 returning id, modifiedon, rowversionstamp into v_id, v_modifiedon, v_rowversionstamp;

 
select row_to_json(row) into v_result
from(
select v_company as company, v_id as id,v_modifiedon as modifiedon, v_rowversionstamp as rowversionstamp
) row;

return v_result;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION company_add_pg2(i_json json)
  RETURNS json AS
$BODY$
declare
  v_company varchar;
  v_user varchar; 

  v_result json;

  v_id uuid; 
  v_modifiedon timestamp;
  v_rowversion int8;

begin

v_company = i_json ->> 'company';
v_user = i_json ->> 'user';

 
insert into company 
	 (company, active, modifiedon, modifiedby,createdon, createdby)
	 values(v_company, 1, now(), v_user, now(), v_user)  
	 returning id, modifiedon, rowversion into v_id, v_modifiedon, v_rowversion;

 
select row_to_json(row) into v_result
from(
select v_company as company, v_id as id,v_modifiedon as modifiedon, v_rowversion as rowversion
) row;

return v_result;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION company_del_pg1(i_json json)
  RETURNS json AS
$BODY$
declare

  v_id uuid; 
  v_user varchar; 
  v_result json;

  v_modifiedon timestamp;
  v_rowversionstamp int8;

begin
 
v_id = i_json ->> 'id';
v_user = i_json ->> 'user';

-- logic delete 
update company 
	set active = 0, modifiedon = now(), modifiedby = v_user, rowversionstamp = rowversionstamp + 1
where id = v_id	and active = 1
	returning modifiedon, rowversionstamp into v_modifiedon, v_rowversionstamp;

-- construct output json 
select row_to_json(row) into v_result
from(
	select v_id as id,v_modifiedon as modifiedon, v_rowversionstamp as rowversionstamp
) row;

return v_result;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION company_find_pg1(i_json json)
  RETURNS json AS
$BODY$
declare

  v_id uuid; 
  v_user varchar; 

  v_filter varchar;
  
  v_result json;

  v_total int8;
  v_count int4;

  v_sql text;

  v_modifiedon timestamp;
  v_rowversionstamp int8;

begin
 
v_id = i_json ->> 'id';
v_user = i_json ->> 'user';
v_filter = i_json ->>'filter';

if v_filter is null then
	v_filter = 'true';
end if;

v_sql = 'select count(1)  from company where '  ||  v_filter;

raise WARNING  'select count(1)  from company where %' , v_filter;

execute v_sql into v_total; -- using v_filter, 'n%';
 
-- IF NOT FOUND THEN
if v_total = 0 then
   select row_to_json(row) into v_result
   from(
   select  'error' as error 
   )row;
   return v_result;
else

-- construct output json
v_sql = 'select json_agg(row_to_json(row)), count(row)
from(
	select seq, company from company where '  || v_filter ||' offset 3 limit 10
) row';
 
execute v_sql into v_result, v_count ;

select row_to_json(row) into v_result
from(
	select v_total as total, v_count as count, v_result as result
)row;

return v_result;

end if;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION company_find_pg2(i_json json)
  RETURNS json AS
$BODY$
declare

  v_filter varchar;
  v_offset int4;
  v_limit int4;
  
  v_result json;

  v_total int8;
  v_count int4;

  v_sql text;

begin
 

v_filter = i_json ->>'filter';
v_offset = i_json ->>'offset';
v_limit = i_json ->>'limit';

if v_filter is null then
	v_filter = 'true';
end if;

if v_offset is null then
	v_offset = 0;
end if;

if v_limit is null then
	v_limit = 25;
end if;

v_sql = 'select count(1)  from company where '  ||  v_filter;

raise WARNING  'select count(1)  from company where %' , v_filter;

execute v_sql into v_total; -- using v_filter, 'n%';
 
-- IF NOT FOUND THEN
if v_total = 0 then
   select row_to_json(row) into v_result
   from(
   select  'error' as error 
   )row;
   return v_result;
else

-- construct output json
v_sql = 'select json_agg(row_to_json(row)), count(row)
from(
	select seq, company from company where '  || v_filter || ' offset ' || v_offset || ' limit ' || v_limit ||
') row';
 
execute v_sql into v_result, v_count ;

select row_to_json(row) into v_result
from(
	select v_total as total, v_count as count, v_result as result
)row;

return v_result;

end if;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION deploy(OUT changes text, _sql text, _md5 character)
  RETURNS text AS
$BODY$
DECLARE
_TempChanges text;
_DeployID integer;
_FunctionID oid;
_RemovedFunctionID oid;
_NewFunctionID oid;
_RemovedViewID oid;
_NewViewID oid;
_Schema text;
_FunctionName text;
_Diff text;
_ record;
_CountRemoved integer;
_CountNew integer;
_ReplacedFunctions integer[][];
BEGIN

    BEGIN

        -- Functions

        RAISE DEBUG 'Creating FunctionsBefore';
        CREATE TEMP TABLE FunctionsBefore ON COMMIT DROP AS
        SELECT * FROM View_Functions;

        RAISE DEBUG 'Creating ViewsBefore';
        CREATE TEMP TABLE ViewsBefore ON COMMIT DROP AS
        SELECT * FROM View_Views;
        
        EXECUTE _SQL;
        
        RAISE DEBUG 'Creating FunctionsAfter';
        CREATE TEMP TABLE FunctionsAfter ON COMMIT DROP AS
        SELECT * FROM View_Functions;
        
        RAISE DEBUG 'Creating AllFunctions';
        CREATE TEMP TABLE AllFunctions ON COMMIT DROP AS
        SELECT FunctionID, Schema, Name FROM FunctionsAfter
        UNION
        SELECT FunctionID, Schema, Name FROM FunctionsBefore;
        
        RAISE DEBUG 'Creating NewFunctions';
        CREATE TEMP TABLE NewFunctions ON COMMIT DROP AS
        SELECT FunctionID FROM FunctionsAfter
        EXCEPT
        SELECT FunctionID FROM FunctionsBefore;
        
        RAISE DEBUG 'Creating RemovedFunctions';
        CREATE TEMP TABLE RemovedFunctions ON COMMIT DROP AS
        SELECT FunctionID FROM FunctionsBefore
        EXCEPT
        SELECT FunctionID FROM FunctionsAfter;
        
        RAISE DEBUG 'Creating ReplacedFunctions';
        CREATE TEMP TABLE ReplacedFunctions (
        RemovedFunctionID oid,
        NewFunctionID oid
        ) ON COMMIT DROP;
        
        FOR _ IN SELECT DISTINCT FunctionsAfter.Schema, FunctionsAfter.Name
        FROM RemovedFunctions, NewFunctions, FunctionsBefore, FunctionsAfter
        WHERE FunctionsBefore.FunctionID  = RemovedFunctions.FunctionID
        AND   FunctionsAfter.FunctionID   = NewFunctions.FunctionID
        AND   FunctionsBefore.Schema      = FunctionsAfter.Schema
        AND   FunctionsBefore.Name        = FunctionsAfter.Name
        LOOP
            SELECT COUNT(*) INTO _CountRemoved FROM RemovedFunctions
            INNER JOIN FunctionsBefore USING (FunctionID)
            WHERE FunctionsBefore.Schema = _.Schema AND FunctionsBefore.Name = _.Name;
        
            SELECT COUNT(*) INTO _CountNew FROM NewFunctions
            INNER JOIN FunctionsAfter USING (FunctionID)
            WHERE FunctionsAfter.Schema = _.Schema AND FunctionsAfter.Name = _.Name;
        
            IF _CountRemoved = 1 AND _CountNew = 1 THEN
                -- Exactly one function removed with identical name as a new function
        
                SELECT RemovedFunctions.FunctionID INTO STRICT _RemovedFunctionID FROM RemovedFunctions
                INNER JOIN FunctionsBefore USING (FunctionID)
                WHERE FunctionsBefore.Schema = _.Schema AND FunctionsBefore.Name = _.Name;
        
                SELECT NewFunctions.FunctionID INTO STRICT _NewFunctionID FROM NewFunctions
                INNER JOIN FunctionsAfter USING (FunctionID)
                WHERE FunctionsAfter.Schema = _.Schema AND FunctionsAfter.Name = _.Name;
        
                INSERT INTO ReplacedFunctions (RemovedFunctionID,NewFunctionID) VALUES (_RemovedFunctionID,_NewFunctionID);
            END IF;
        END LOOP;
        
        RAISE DEBUG 'Deleting ReplacedFunctions from RemovedFunctions';
        DELETE FROM RemovedFunctions WHERE FunctionID IN (SELECT RemovedFunctionID FROM ReplacedFunctions);
        
        RAISE DEBUG 'Deleting ReplacedFunctions from NewFunctions';
        DELETE FROM NewFunctions     WHERE FunctionID IN (SELECT NewFunctionID     FROM ReplacedFunctions);
        
        RAISE DEBUG 'Creating ChangedFunctions';
        
        CREATE TEMP TABLE ChangedFunctions ON COMMIT DROP AS
        SELECT AllFunctions.FunctionID FROM AllFunctions
        INNER JOIN FunctionsBefore ON (FunctionsBefore.FunctionID = AllFunctions.FunctionID)
        INNER JOIN FunctionsAfter  ON (FunctionsAfter.FunctionID  = AllFunctions.FunctionID)
        WHERE FunctionsBefore.Schema         <> FunctionsAfter.Schema
        OR FunctionsBefore.Name              <> FunctionsAfter.Name
        OR FunctionsBefore.ResultDataType    <> FunctionsAfter.ResultDataType
        OR FunctionsBefore.ArgumentDataTypes <> FunctionsAfter.ArgumentDataTypes
        OR FunctionsBefore.Type              <> FunctionsAfter.Type
        OR FunctionsBefore.Volatility        <> FunctionsAfter.Volatility
        OR FunctionsBefore.Owner             <> FunctionsAfter.Owner
        OR FunctionsBefore.Language          <> FunctionsAfter.Language
        OR FunctionsBefore.Sourcecode        <> FunctionsAfter.Sourcecode
        ;
        
        Changes := '';

        RAISE DEBUG 'Removed functions...';

		_TempChanges := '';
        FOR _ IN
        SELECT
            RemovedFunctions.FunctionID,
            FunctionsBefore.Schema                                     AS SchemaBefore,
            FunctionsBefore.Name                                       AS NameBefore,
            FunctionsBefore.ArgumentDataTypes                          AS ArgumentDataTypesBefore,
            FunctionsBefore.ResultDataType                             AS ResultDataTypeBefore,
            FunctionsBefore.Language                                   AS LanguageBefore,
            FunctionsBefore.Type                                       AS TypeBefore,
            FunctionsBefore.Volatility                                 AS VolatilityBefore,
            FunctionsBefore.Owner                                      AS OwnerBefore,
            length(FunctionsBefore.Sourcecode)                         AS SourcecodeLength
        FROM RemovedFunctions
        INNER JOIN FunctionsBefore USING (FunctionID)
        ORDER BY 2,3,4,5,6,7,8,9,10
        LOOP
            _TempChanges := _TempChanges || 'Schema................- ' || _.SchemaBefore || E'\n';
            _TempChanges := _TempChanges || 'Name..................- ' || _.NameBefore || E'\n';
            _TempChanges := _TempChanges || 'Argument data types...- ' || _.ArgumentDataTypesBefore || E'\n';
            _TempChanges := _TempChanges || 'Result data type......- ' || _.ResultDataTypeBefore || E'\n';
            _TempChanges := _TempChanges || 'Language..............- ' || _.LanguageBefore || E'\n';
            _TempChanges := _TempChanges || 'Type..................- ' || _.TypeBefore || E'\n';
            _TempChanges := _TempChanges || 'Volatility............- ' || _.VolatilityBefore || E'\n';
            _TempChanges := _TempChanges || 'Owner.................- ' || _.OwnerBefore || E'\n';
            _TempChanges := _TempChanges || 'Source code (chars)...- ' || _.SourcecodeLength || E'\n';
        END LOOP;

		IF FOUND THEN
            Changes := Changes || '+-------------------+' || E'\n';
            Changes := Changes || '| Removed functions |' || E'\n';
            Changes := Changes || '+-------------------+' || E'\n\n';
            Changes := Changes || _TempChanges;
            Changes := Changes || E'\n\n';
        ELSE
            Changes := Changes || E'No removed functions\n\n';
        END IF;
			
        
        RAISE DEBUG 'New functions...';
        
        _TempChanges := '';
        FOR _ IN
        SELECT
            NewFunctions.FunctionID,
            FunctionsAfter.Schema                                     AS SchemaAfter,
            FunctionsAfter.Name                                       AS NameAfter,
            FunctionsAfter.ArgumentDataTypes                          AS ArgumentDataTypesAfter,
            FunctionsAfter.ResultDataType                             AS ResultDataTypeAfter,
            FunctionsAfter.Language                                   AS LanguageAfter,
            FunctionsAfter.Type                                       AS TypeAfter,
            FunctionsAfter.Volatility                                 AS VolatilityAfter,
            FunctionsAfter.Owner                                      AS OwnerAfter,
            length(FunctionsAfter.Sourcecode)                         AS SourcecodeLength
        FROM NewFunctions
        INNER JOIN FunctionsAfter USING (FunctionID)
        ORDER BY 2,3,4,5,6,7,8,9,10
        LOOP
            _TempChanges := _TempChanges || 'Schema................+ ' || _.SchemaAfter || E'\n';
            _TempChanges := _TempChanges || 'Name..................+ ' || _.NameAfter || E'\n';
            _TempChanges := _TempChanges || 'Argument data types...+ ' || _.ArgumentDataTypesAfter || E'\n';
            _TempChanges := _TempChanges || 'Result data type......+ ' || _.ResultDataTypeAfter || E'\n';
            _TempChanges := _TempChanges || 'Language..............+ ' || _.LanguageAfter || E'\n';
            _TempChanges := _TempChanges || 'Type..................+ ' || _.TypeAfter || E'\n';
            _TempChanges := _TempChanges || 'Volatility............+ ' || _.VolatilityAfter || E'\n';
            _TempChanges := _TempChanges || 'Owner.................+ ' || _.OwnerAfter || E'\n';
            _TempChanges := _TempChanges || 'Source code (chars)...+ ' || _.SourcecodeLength || E'\n';
        END LOOP;

        IF FOUND THEN
            Changes := Changes || '+---------------+' || E'\n';
            Changes := Changes || '| New functions |' || E'\n';
            Changes := Changes || '+---------------+' || E'\n\n';
            Changes := Changes || _TempChanges;
            Changes := Changes || E'\n\n';
        ELSE
            Changes := Changes || E'No new functions\n\n';
        END IF;
        

        RAISE DEBUG 'Updated or replaced functions...';
        
        _TempChanges := '';
        FOR _ IN
        SELECT
            ChangedFunctions.FunctionID,
            FunctionsBefore.Schema                                     AS SchemaBefore,
            FunctionsBefore.Name                                       AS NameBefore,
            FunctionsBefore.ArgumentDataTypes                          AS ArgumentDataTypesBefore,
            FunctionsBefore.ResultDataType                             AS ResultDataTypeBefore,
            FunctionsBefore.Language                                   AS LanguageBefore,
            FunctionsBefore.Type                                       AS TypeBefore,
            FunctionsBefore.Volatility                                 AS VolatilityBefore,
            FunctionsBefore.Owner                                      AS OwnerBefore,
            FunctionsAfter.Schema                                      AS SchemaAfter,
            FunctionsAfter.Name                                        AS NameAfter,
            FunctionsAfter.ArgumentDataTypes                           AS ArgumentDataTypesAfter,
            FunctionsAfter.ResultDataType                              AS ResultDataTypeAfter,
            FunctionsAfter.Language                                    AS LanguageAfter,
            FunctionsAfter.Type                                        AS TypeAfter,
            FunctionsAfter.Volatility                                  AS VolatilityAfter,
            FunctionsAfter.Owner                                       AS OwnerAfter,
            Diff(FunctionsBefore.Sourcecode,FunctionsAfter.Sourcecode) AS Diff
        FROM ChangedFunctions
        INNER JOIN FunctionsBefore ON (FunctionsBefore.FunctionID = ChangedFunctions.FunctionID)
        INNER JOIN FunctionsAfter  ON (FunctionsAfter.FunctionID  = ChangedFunctions.FunctionID)
        UNION ALL
        SELECT
            FunctionsAfter.FunctionID,
            FunctionsBefore.Schema                                     AS SchemaBefore,
            FunctionsBefore.Name                                       AS NameBefore,
            FunctionsBefore.ArgumentDataTypes                          AS ArgumentDataTypesBefore,
            FunctionsBefore.ResultDataType                             AS ResultDataTypeBefore,
            FunctionsBefore.Language                                   AS LanguageBefore,
            FunctionsBefore.Type                                       AS TypeBefore,
            FunctionsBefore.Volatility                                 AS VolatilityBefore,
            FunctionsBefore.Owner                                      AS OwnerBefore,
            FunctionsAfter.Schema                                      AS SchemaAfter,
            FunctionsAfter.Name                                        AS NameAfter,
            FunctionsAfter.ArgumentDataTypes                           AS ArgumentDataTypesAfter,
            FunctionsAfter.ResultDataType                              AS ResultDataTypeAfter,
            FunctionsAfter.Language                                    AS LanguageAfter,
            FunctionsAfter.Type                                        AS TypeAfter,
            FunctionsAfter.Volatility                                  AS VolatilityAfter,
            FunctionsAfter.Owner                                       AS OwnerAfter,
            Diff(FunctionsBefore.Sourcecode,FunctionsAfter.Sourcecode) AS Diff
        FROM ReplacedFunctions
        INNER JOIN FunctionsBefore ON (FunctionsBefore.FunctionID = ReplacedFunctions.RemovedFunctionID)
        INNER JOIN FunctionsAfter  ON (FunctionsAfter.FunctionID  = ReplacedFunctions.NewFunctionID)
        ORDER BY 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17
        LOOP
            IF _.SchemaBefore = _.SchemaAfter THEN
                _TempChanges := _TempChanges || 'Schema................: ' || _.SchemaAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Schema................- ' || _.SchemaBefore || E'\n';
                _TempChanges := _TempChanges || 'Schema................+ ' || _.SchemaAfter || E'\n';
            END IF;
        
            IF _.NameBefore = _.NameAfter THEN
                _TempChanges := _TempChanges || 'Name..................: ' || _.NameAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Name..................- ' || _.NameBefore || E'\n';
                _TempChanges := _TempChanges || 'Name..................+ ' || _.NameAfter || E'\n';
            END IF;
        
            IF _.ArgumentDataTypesBefore = _.ArgumentDataTypesAfter THEN
                _TempChanges := _TempChanges || 'Argument data types...: ' || _.ArgumentDataTypesAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Argument data types...- ' || _.ArgumentDataTypesBefore || E'\n';
                _TempChanges := _TempChanges || 'Argument data types...+ ' || _.ArgumentDataTypesAfter || E'\n';
            END IF;
        
            IF _.ResultDataTypeBefore = _.ResultDataTypeAfter THEN
                _TempChanges := _TempChanges || 'Result data type......: ' || _.ResultDataTypeAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Result data type......- ' || _.ResultDataTypeBefore || E'\n';
                _TempChanges := _TempChanges || 'Result data type......+ ' || _.ResultDataTypeAfter || E'\n';
            END IF;
        
            IF _.LanguageBefore = _.LanguageAfter THEN
                _TempChanges := _TempChanges || 'Language..............: ' || _.LanguageAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Language..............- ' || _.LanguageBefore || E'\n';
                _TempChanges := _TempChanges || 'Language..............+ ' || _.LanguageAfter || E'\n';
            END IF;
        
            IF _.TypeBefore = _.TypeAfter THEN
                _TempChanges := _TempChanges || 'Type..................: ' || _.TypeAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Type..................- ' || _.TypeBefore || E'\n';
                _TempChanges := _TempChanges || 'Type..................+ ' || _.TypeAfter || E'\n';
            END IF;
        
            IF _.VolatilityBefore = _.VolatilityAfter THEN
                _TempChanges := _TempChanges || 'Volatility............: ' || _.VolatilityAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Volatility............- ' || _.VolatilityBefore || E'\n';
                _TempChanges := _TempChanges || 'Volatility............+ ' || _.VolatilityAfter || E'\n';
            END IF;
        
            IF _.OwnerBefore = _.OwnerAfter THEN
                _TempChanges := _TempChanges || 'Owner.................: ' || _.OwnerAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Owner.................- ' || _.OwnerBefore || E'\n';
                _TempChanges := _TempChanges || 'Owner.................+ ' || _.OwnerAfter || E'\n';
            END IF;
        
            _TempChanges := _TempChanges || _.Diff || E'\n\n';
        END LOOP;

        
        IF FOUND THEN 
            Changes := Changes || '+-------------------------------+' || E'\n';
            Changes := Changes || '| Updated or replaced functions |' || E'\n';
            Changes := Changes || '+-------------------------------+' || E'\n\n';
            Changes := Changes || _TempChanges;
        ELSE
            Changes := Changes || E'No updated or replaced functions\n\n';
        END IF;



        -------------
        --- Views ---
        -------------



        RAISE DEBUG 'Creating ViewsAfter';
        CREATE TEMP TABLE ViewsAfter ON COMMIT DROP AS
        SELECT * FROM View_Views;

        RAISE DEBUG 'Creating AllViews';
        CREATE TEMP TABLE AllViews ON COMMIT DROP AS
        SELECT ViewID, Schema, Name FROM ViewsAfter
        UNION
        SELECT ViewID, Schema, Name FROM ViewsBefore;

        RAISE DEBUG 'Creating NewViews';
        CREATE TEMP TABLE NewViews ON COMMIT DROP AS
        SELECT ViewID FROM ViewsAfter
        EXCEPT
        SELECT ViewID FROM ViewsBefore;

        RAISE DEBUG 'Creating RemovedViews';
        CREATE TEMP TABLE RemovedViews ON COMMIT DROP AS
        SELECT ViewID FROM ViewsBefore
        EXCEPT
        SELECT ViewID FROM ViewsAfter;

        RAISE DEBUG 'Creating ReplacedViews';
        CREATE TEMP TABLE ReplacedViews (
        RemovedViewID oid,
        NewViewID oid
        ) ON COMMIT DROP;

        FOR _ IN SELECT DISTINCT ViewsAfter.Schema, ViewsAfter.Name
        FROM RemovedViews, NewViews, ViewsBefore, ViewsAfter
        WHERE ViewsBefore.ViewID  = RemovedViews.ViewID
        AND   ViewsAfter.ViewID   = NewViews.ViewID
        AND   ViewsBefore.Schema  = ViewsAfter.Schema
        AND   ViewsBefore.Name    = ViewsAfter.Name
        LOOP
            SELECT COUNT(*) INTO _CountRemoved FROM RemovedViews
            INNER JOIN ViewsBefore USING (ViewID)
            WHERE ViewsBefore.Schema = _.Schema AND ViewsBefore.Name = _.Name;

            SELECT COUNT(*) INTO _CountNew FROM NewViews
            INNER JOIN ViewsAfter USING (ViewID)
            WHERE ViewsAfter.Schema = _.Schema AND ViewsAfter.Name = _.Name;

            IF _CountRemoved = 1 AND _CountNew = 1 THEN
                -- Exactly one view removed with identical name as a new view

                SELECT RemovedViews.ViewID INTO STRICT _RemovedViewID FROM RemovedViews
                INNER JOIN ViewsBefore USING (ViewID)
                WHERE ViewsBefore.Schema = _.Schema AND ViewsBefore.Name = _.Name;

                SELECT NewViews.ViewID INTO STRICT _NewViewID FROM NewViews
                INNER JOIN ViewsAfter USING (ViewID)
                WHERE ViewsAfter.Schema = _.Schema AND ViewsAfter.Name = _.Name;

                INSERT INTO ReplacedViews (RemovedViewID,NewViewID) VALUES (_RemovedViewID,_NewViewID);
            END IF;
        END LOOP;

        RAISE DEBUG 'Deleting ReplacedViews from RemovedViews';
        DELETE FROM RemovedViews WHERE ViewID IN (SELECT RemovedViewID FROM ReplacedViews);

        RAISE DEBUG 'Deleting ReplacedViews from NewViews';
        DELETE FROM NewViews     WHERE ViewID IN (SELECT NewViewID     FROM ReplacedViews);

        RAISE DEBUG 'Creating ChangedViews';

        CREATE TEMP TABLE ChangedViews ON COMMIT DROP AS
        SELECT AllViews.ViewID FROM AllViews
        INNER JOIN ViewsBefore ON (ViewsBefore.ViewID = AllViews.ViewID)
        INNER JOIN ViewsAfter  ON (ViewsAfter.ViewID  = AllViews.ViewID)
        WHERE ViewsBefore.Schema         <> ViewsAfter.Schema
        OR ViewsBefore.Name              <> ViewsAfter.Name
        OR ViewsBefore.Sourcecode        <> ViewsAfter.Sourcecode
        OR ViewsBefore.Owner             <> ViewsAfter.Owner
        ;

        RAISE DEBUG 'Removed views...';

        _TempChanges := '';
        FOR _ IN
        SELECT
            RemovedViews.ViewID,
            ViewsBefore.Schema                                     AS SchemaBefore,
            ViewsBefore.Name                                       AS NameBefore,
            ViewsBefore.Owner                                      AS OwnerBefore,
            length(ViewsBefore.Sourcecode)                         AS SourcecodeLength
        FROM RemovedViews
        INNER JOIN ViewsBefore USING (ViewID)
        ORDER BY 2,3,4,5
        LOOP
            _TempChanges := _TempChanges || 'Schema................- ' || _.SchemaBefore || E'\n';
            _TempChanges := _TempChanges || 'Name..................- ' || _.NameBefore || E'\n';
            _TempChanges := _TempChanges || 'Owner.................- ' || _.OwnerBefore || E'\n';
            _TempChanges := _TempChanges || 'Source code (chars)...- ' || _.SourcecodeLength || E'\n';
        END LOOP;
        
        IF FOUND THEN
            Changes := Changes || '+---------------+' || E'\n';
            Changes := Changes || '| Removed views |' || E'\n';
            Changes := Changes || '+---------------+' || E'\n\n';
            Changes := _TempChanges;
            Changes := Changes || E'\n\n';
        ELSE
            Changes := Changes || E'No removed views\n\n';
        END IF;

        RAISE DEBUG 'New views...';

        _TempChanges := '';
        FOR _ IN
        SELECT
            NewViews.ViewID,
            ViewsAfter.Schema                                     AS SchemaAfter,
            ViewsAfter.Name                                       AS NameAfter,
            ViewsAfter.Owner                                      AS OwnerAfter,
            length(ViewsAfter.Sourcecode)                         AS SourcecodeLength
        FROM NewViews
        INNER JOIN ViewsAfter USING (ViewID)
        ORDER BY 2,3,4,5
        LOOP
            _TempChanges := _TempChanges || 'Schema................+ ' || _.SchemaAfter || E'\n';
            _TempChanges := _TempChanges || 'Name..................+ ' || _.NameAfter || E'\n';
            _TempChanges := _TempChanges || 'Owner.................+ ' || _.OwnerAfter || E'\n';
            _TempChanges := _TempChanges || 'Source code (chars)...+ ' || _.SourcecodeLength || E'\n';
        END LOOP;

        IF FOUND THEN
            Changes := Changes || '+-----------+' || E'\n';
            Changes := Changes || '| New views |' || E'\n';
            Changes := Changes || '+-----------+' || E'\n\n';
            Changes := Changes || _TempChanges;
            Changes := Changes || E'\n\n';
        ELSE
            Changes := Changes || E'No new views\n\n';
        END IF;

        RAISE DEBUG 'Updated or replaced views...';

        _TempChanges := '';
        FOR _ IN
        SELECT
            ChangedViews.ViewID,
            ViewsBefore.Schema                                     AS SchemaBefore,
            ViewsBefore.Name                                       AS NameBefore,
            ViewsBefore.Owner                                      AS OwnerBefore,
            ViewsAfter.Schema                                      AS SchemaAfter,
            ViewsAfter.Name                                        AS NameAfter,
            ViewsAfter.Owner                                       AS OwnerAfter,
            Diff(ViewsBefore.Sourcecode,ViewsAfter.Sourcecode) AS Diff
        FROM ChangedViews
        INNER JOIN ViewsBefore ON (ViewsBefore.ViewID = ChangedViews.ViewID)
        INNER JOIN ViewsAfter  ON (ViewsAfter.ViewID  = ChangedViews.ViewID)
        UNION ALL
        SELECT
            ViewsAfter.ViewID,
            ViewsBefore.Schema                                     AS SchemaBefore,
            ViewsBefore.Name                                       AS NameBefore,
            ViewsBefore.Owner                                      AS OwnerBefore,
            ViewsAfter.Schema                                      AS SchemaAfter,
            ViewsAfter.Name                                        AS NameAfter,
            ViewsAfter.Owner                                       AS OwnerAfter,
            Diff(ViewsBefore.Sourcecode,ViewsAfter.Sourcecode) AS Diff
        FROM ReplacedViews
        INNER JOIN ViewsBefore ON (ViewsBefore.ViewID = ReplacedViews.RemovedViewID)
        INNER JOIN ViewsAfter  ON (ViewsAfter.ViewID  = ReplacedViews.NewViewID)
        ORDER BY 2,3,4,5,6,7,8
        LOOP
            IF _.SchemaBefore = _.SchemaAfter THEN
                _TempChanges := _TempChanges || 'Schema................: ' || _.SchemaAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Schema................- ' || _.SchemaBefore || E'\n';
                _TempChanges := _TempChanges || 'Schema................+ ' || _.SchemaAfter || E'\n';
            END IF;

            IF _.NameBefore = _.NameAfter THEN
                _TempChanges := _TempChanges || 'Name..................: ' || _.NameAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Name..................- ' || _.NameBefore || E'\n';
                _TempChanges := _TempChanges || 'Name..................+ ' || _.NameAfter || E'\n';
            END IF;

            IF _.OwnerBefore = _.OwnerAfter THEN
                _TempChanges := _TempChanges || 'Owner.................: ' || _.OwnerAfter || E'\n';
            ELSE
                _TempChanges := _TempChanges || 'Owner.................- ' || _.OwnerBefore || E'\n';
                _TempChanges := _TempChanges || 'Owner.................+ ' || _.OwnerAfter || E'\n';
            END IF;

            _TempChanges := _TempChanges || _.Diff || E'\n\n';
        END LOOP;

        IF FOUND THEN
            Changes := Changes || '+---------------------------+' || E'\n';
            Changes := Changes || '| Updated or replaced views |' || E'\n';
            Changes := Changes || '+---------------------------+' || E'\n\n';
            Changes := Changes || _TempChanges;
        ELSE
            Changes := Changes || E'No updated or replaced views\n\n';
        END IF;



        
        IF _MD5 IS NULL THEN
            -- We are testing, raise exception to rollback changes
            RAISE EXCEPTION 'OK';
        ELSIF md5(Changes) = _MD5 THEN
            -- Hash matches, proceed, keep changes
        ELSE
            RAISE EXCEPTION 'ERROR_INVALID_MD5 Invalid MD5, % <> %', md5(Changes), _MD5;
        END IF;

    EXCEPTION WHEN raise_exception THEN
        IF SQLERRM <> 'OK' THEN
            RAISE EXCEPTION '%', SQLERRM;
        END IF;
    END;

    IF _MD5 IS NOT NULL THEN
        INSERT INTO Deploys (SQL,MD5,Diff) VALUES (_SQL,_MD5,Changes) RETURNING DeployID INTO STRICT _DeployID;
    END IF;

    Changes := Changes || 'MD5 of changes: ' || md5(Changes);

RETURN;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
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
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION get_data(i_json json, rtn json)
  RETURNS json AS
$BODY$

keys = Object.keys(rtn[0])

# array of row data
if i_json.type ==1

    data = []
    for item in rtn
        row =  (item[key] for key in keys)
        data.push(row)

    return {"keys":keys, "data":data}

# array of column data
else if i_json.type == 2

    cols = {}
    for item in keys
        cols[item] = []

    for item in keys
        for i in [0..rtn.length-1]
            cols[item].push(rtn[i][item])

    return {"keys":keys, "data":cols}
else
    return {"keys":keys, "data":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION get_data2(i_type integer, rawdata json)
  RETURNS json AS
$BODY$

keys = Object.keys(rawdata[0])

# array of row data
if i_type ==1

    data = []
    for item in rawdata
        row =  (item[key] for key in keys)
        data.push(row)

    return {"keys":keys, "data":data}

# array of column data
else if i_type == 2

    cols = {}
    for item in keys
        cols[item] = []

    for item in keys
        for i in [0..rawdata.length-1]
            cols[item].push(rawdata[i][item])

    return {"keys":keys, "data":cols}
else
    return {"keys":keys, "data":rawdata}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION get_schema(i_json json)
  RETURNS json AS
$BODY$
sql_select = "select column_name, udt_name,
    character_maximum_length ,
    is_nullable,
    column_default,
    data_type
    from information_schema.columns
    where table_catalog = $1 and table_schema = $2 and table_name = $3
    and column_name not in ('id', 'active', 'createdon', 'createdby', 'lastupdatedby', 'lastupdateon', 'rowversionstamp')
    order by ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
    return {"data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION get_schema2(i_json json)
  RETURNS json AS
$BODY$
sql_select = "select column_name, udt_name,
    character_maximum_length ,
    is_nullable,
    column_default,
    data_type
    from information_schema.columns
    where table_catalog = $1 and table_schema = $2 and table_name = $3
    and column_name not in ('id','seq', 'active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
    order by ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
    return {"data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION get_schema3(i_json json)
  RETURNS json AS
$BODY$
sql_select = "select column_name, udt_name,
    character_maximum_length ,
    is_nullable,
    column_default,
    data_type
    from information_schema.columns
    where table_catalog = $1 and table_schema = $2 and table_name = $3
    and column_name not in ('id','seq', 'active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
    order by ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
    return {"_table":i_json.table_name, "data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION log_ddl_update()
  RETURNS event_trigger AS
$BODY$
BEGIN
  RAISE WARNING '[%]command % is logged', tg_event, tg_tag;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION make_filters_str2(i_json json)
  RETURNS text AS
$BODY$

v_domain = i_json.domain

n = v_domain.length

st = []

y = {"|":" OR ","&":" AND ", "!" : " NOT "}

while n>0

    n = n - 1

    if v_domain[n] not in ["|","&", "!"]

        # in / not in
        if typeof (v_domain[n][2]) == 'object'

            vlist = []

            arr = v_domain[n][2]

            #add single quote for value
            for i in [0 ..arr.length-1]
                vlist.push("'#{arr[i]}'")

            arr_str = vlist.join(", ")
            arr_str = "(#{arr_str})"
            in_ = [ v_domain[n][0], v_domain[n][1], arr_str ].join(' ')
            st.push(in_)

        else
            #console.log("not obj")
            v_domain[n][2] = "'#{v_domain[n][2]}'"
            st.push(v_domain[n].join(' '))
    else

        conditions = st.join(" #{y[ v_domain[n] ]} ")
        st.pop()
        st.pop()
        st.push("(#{conditions})")

#result
return st.pop()


$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION make_filters_str2t(i_json json)
  RETURNS text AS
$BODY$

v_domain = i_json.domain

n = v_domain.length

st = []

y = {"|":" OR ","&":" AND ", "!" : " NOT "}

while n>0

    n = n - 1

    if v_domain[n] not in ["|","&", "!"]

        # in / not in
        if typeof (v_domain[n][2]) == 'object'

            vlist = []

            arr = v_domain[n][2]

            #add single quote for value
            for i in [0 ..arr.length-1]
                vlist.push("'#{arr[i]}'")

            arr_str = vlist.join(", ")
            arr_str = "(#{arr_str})"
            in_ = [ v_domain[n][0], v_domain[n][1], arr_str ].join(' ')
            st.push(in_)

        else
            #console.log("not obj")
            v_domain[n][2] = "'#{v_domain[n][2]}'"
            st.push(v_domain[n].join(' '))
    else

        conditions = st.join(" #{y[ v_domain[n] ]} ")
        st.pop()
        st.pop()
        st.push("(#{conditions})")

#result
return st.pop()


$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION make_filters_str3(i_json json)
  RETURNS text AS
$BODY$

v_domain = i_json.domain

n = v_domain.length

st = []

y = {"|":" OR ","&":" AND ", "!" : " NOT "}

while n>0

    n = n - 1

    if v_domain[n] not in ["|","&", "!"]

        # in / not in
        if typeof (v_domain[n][2]) == 'object'

            vlist = []

            arr = v_domain[n][2]

            #add single quote for value
            for i in [0 ..arr.length-1]
                vlist.push("'#{arr[i]}'")

            arr_str = vlist.join(", ")
            arr_str = "(#{arr_str})"
            in_ = [ v_domain[n][0], v_domain[n][1], arr_str ].join(' ')
            st.push(in_)

        else
            #console.log("not obj")
            v_domain[n][2] = "'#{v_domain[n][2]}'"
            st.push(v_domain[n].join(' '))
    else
        if v_domain[n] == "!"
            # NOT
            #conditions = st.join("")
            conditions = st.pop()
            st.push(" NOT (#{conditions})" )
        else
            # AND / OR
            conditions = st.join(" #{y[ v_domain[n] ]} ")
            st.pop()
            st.pop()
            st.push("(#{conditions})")

#result
return st.pop()


$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_create_cf1(i_json json)
  RETURNS json AS
$BODY$

#init

#input
v_table = i_json.table

v_id = i_json.id

v_user = i_json.user

v_sql = "insert into #{v_table}
    (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
    values(#{v_values}, now(), '#{v_user}', now(), '#{v_user}') returning id, createdon"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"

return {"id":v_id, "result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_delete_cf1(i_json json)
  RETURNS json AS
$BODY$

#init

#input
v_table = i_json.table

v_id = i_json.id

v_user = i_json.user

v_sql = "update #{v_table}
    set active=0, modifiedon=now(), modifiedby='#{v_user}', rowversion = rowversion + 1
    where id = '#{v_id}'"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"

return {"id":v_id, "result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_delete_cf2(i_json json)
  RETURNS json AS
$BODY$

#init

#input
v_table = i_json.table

v_ids = i_json.ids.map((id)->"'#{id}'")

v_ids_str = v_ids.join(",")

v_user = i_json.user

v_sql = "update #{v_table}
    set active=0, modifiedon=now(), modifiedby='#{v_user}', rowversion = rowversion + 1
    where id in (#{v_ids_str}) returning id, modifiedon"

try
    rtn = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"

return {"returning":rtn, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_fetch_one_cf1(i_json json)
  RETURNS json AS
$BODY$

#S_COMMON = ['id', 'seq', 'modifiedon', 'modifiedby', 'createdon','createdby','rowversion']

v_table = i_json.table
v_id = i_json.id
v_languageid = i_json.languageid

if not v_languageid
    return {"error":"please provide languageid"}

v_texths = "texths -> '#{v_languageid}\' as texths"

v_cols_str = '*'

if  i_json.cols and i_json.cols.length != 0

    v_cols_str = i_json.cols.join(', ')
    v_cols_str = v_cols_str.replace('texths',v_texths)



if not v_languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

v_sql = "select #{v_cols_str}
    from #{v_table}
    where id='#{v_id}' and active = 1
    "

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}


return {"returning":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_find_active_cf1(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.filter

v_orderby = i_json.orderby

v_offset = i_json.offset

v_limit = i_json.limit

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

if i_json.cols

    for i in [0 .. i_json.cols.length-1]
        if i_json.cols[i] == "texths"
            i_json.cols[i] = "#{i_json.cols[i]}->'#{v_languageid}' as texths"
    v_cols = i_json.cols.join(",")

if not v_filter
    v_filter = "true"

if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter} and active = 1"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

if total== 0

    return {"error":"no data"}

v_sql = "select #{v_cols}
    from #{v_table}
    where #{v_filter} and active = 1
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}



count = rtn.length

return {"total":total, "count":count,  "result":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_find_active_cf2(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.domain

v_orderby = i_json.orderby

v_offset = i_json.offset

v_limit = i_json.limit

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    v_languageid = 1033
    #return {"error":"please provide languageid"}

if i_json.cols

    for i in [0 .. i_json.cols.length-1]
        if i_json.cols[i] == "texths"
            i_json.cols[i] = "#{i_json.cols[i]}->'#{v_languageid}' as texths"
    v_cols = i_json.cols.join(",")

if not v_filter or v_filter.length == 0
    v_filter = "true"
else
    make_filters_str = plv8.find_function("make_filters_str");

    v_filter= make_filters_str({"domain":v_filter})

if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter} and active = 1"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

if total== 0

    return {"error":"no data"}

v_sql = "select #{v_cols}
    from #{v_table}
    where #{v_filter} and active = 1
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

count = rtn.length

return {"total":total, "count":count,  "result":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_find_cf1(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.filter

v_orderby = i_json.orderby

v_offset = i_json.offset

v_limit = i_json.limit

if i_json.cols
    v_cols = i_json.cols.join(",")

if not v_filter
    v_filter = "true"

if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter}"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql":v_sql}

if total== 0

    return {"error":"no data", "sql":v_sql}

v_sql = "select #{v_cols}
    from #{v_table}
    where #{v_filter}
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"

if msg != ""
    return {"error":msg, "sql":v_sql}

count = rtn.length

return {"total":total, "count":count,  "result":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_cf1(i_json json)
  RETURNS json AS
$BODY$

v_table = i_json.table

v_id = i_json.id

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

v_sql = "select *
    from #{v_table}
    where id='#{v_id}' and active = 1
    "

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}


return {"result":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_cf2(i_json json)
  RETURNS json AS
$BODY$

v_table = i_json.table

v_id = i_json.id

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

v_sql = "select *
    from #{v_table}
    where id='#{v_id}' and active = 1
    "

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}


return {"returning":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_cs3(i_json json)
  RETURNS json AS
$BODY$

#S_COMMON = ['id', 'seq', 'modifiedon', 'modifiedby', 'createdon','createdby','rowversion']

v_table = i_json.table
v_pkey = i_json.pkey

v_id = i_json.id
v_languageid = i_json.languageid

if not v_languageid
    return {"error":"please provide languageid"}

v_texths = "texths -> '#{v_languageid}\' as texths"

v_cols_str = '*'

if  i_json.cols and i_json.cols.length != 0

    v_cols_str = i_json.cols.join(', ')
    v_cols_str = v_cols_str.replace('texths',v_texths)



if not v_languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

v_sql = "select #{v_cols_str}
    from #{v_table}
    where #{v_pkey}='#{v_id}' and active = 1
    "

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}


return {"returning":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_ctable_pg1(i_json json)
  RETURNS json AS
$BODY$

declare

v_result json;


begin

select  json_agg(row_to_json(row)) into v_result
from(

SELECT n.nspname AS namespace, p1.relname AS ctable, p2.relname as ptable, pg_get_constraintdef(c.oid) as ppkey
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2
	
--	pg_attribute a1, 
--	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	--AND c.conrelid = a1.attrelid
	--AND a1.attnum = ANY (c.conkey)
	--AND c.confrelid = a2.attrelid
	--AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p2.relname = i_json ->>'table_name'
order by 3
)row;


return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_ptable_pg1(i_json json)
  RETURNS json AS
$BODY$

declare

v_result json;


begin

select  json_agg(row_to_json(row)) into v_result
from(

SELECT n.nspname AS namespace, p1.relname AS table,a1.attname AS column,  p2.relname,  a2.attname
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2,
	pg_attribute a1, 
	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	AND c.conrelid = a1.attrelid
	AND a1.attnum = ANY (c.conkey)
	AND c.confrelid = a2.attrelid
	AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p1.relname = i_json ->>'table_name'

)row;


return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_ptable_pg2(i_json json)
  RETURNS json AS
$BODY$

declare

v_result json;


begin

select  json_agg(row_to_json(row)) into v_result
from(

SELECT n.nspname AS namespace, p1.relname AS ctable, p2.relname as ptable, pg_get_constraintdef(c.oid) as ppkey
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2
	
--	pg_attribute a1, 
--	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	--AND c.conrelid = a1.attrelid
	--AND a1.attnum = ANY (c.conkey)
	--AND c.confrelid = a2.attrelid
	--AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p1.relname = i_json ->>'table_name'
order by 3
)row;


return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_reltab_pg1(i_json json)
  RETURNS json AS
$BODY$

declare

v_result json;

v_type varchar;


begin

v_type = i_json ->>'type';

if v_type = 'c' then
-- children table
select  json_agg(row_to_json(row)) into v_result
from(

SELECT  p1.relname AS table,a1.attname AS column,  p2.relname,  a2.attname
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2,
	pg_attribute a1, 
	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	AND c.conrelid = a1.attrelid
	AND a1.attnum = ANY (c.conkey)
	AND c.confrelid = a2.attrelid
	AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p2.relname = i_json ->>'table_name'

)row;

else 
-- foreign table
select  json_agg(row_to_json(row)) into v_result
from(
SELECT   p1.relname AS table,a1.attname AS column,  p2.relname,  a2.attname
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2,
	pg_attribute a1, 
	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	AND c.conrelid = a1.attrelid
	AND a1.attnum = ANY (c.conkey)
	AND c.confrelid = a2.attrelid
	AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p1.relname = i_json ->>'table_name'

)row;


end if;

return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_reltab_pg2(i_json json)
  RETURNS json AS
$BODY$

declare

v_table_p json;
v_table_c json;

v_result json;

 

begin

 
-- children table
select  json_agg(row_to_json(row)) into v_table_c
from(

SELECT  p1.relname AS table,a1.attname AS column,  p2.relname,  a2.attname
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2,
	pg_attribute a1, 
	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	AND c.conrelid = a1.attrelid
	AND a1.attnum = ANY (c.conkey)
	AND c.confrelid = a2.attrelid
	AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p2.relname = i_json ->>'table_name'

)row;

 
-- foreign table
select  json_agg(row_to_json(row)) into v_table_p
from(
SELECT   p1.relname AS table,a1.attname AS column,  p2.relname,  a2.attname
FROM pg_constraint c, 
	pg_namespace n,
	pg_class p1, 
	pg_class p2,
	pg_attribute a1, 
	pg_attribute a2
WHERE c.contype = 'f'
	AND c.confrelid > 0
	AND c.connamespace = n.oid
	AND c.conrelid = p1.oid
	AND c.confrelid = p2.oid
	AND c.conrelid = a1.attrelid
	AND a1.attnum = ANY (c.conkey)
	AND c.confrelid = a2.attrelid
	AND a2.attnum = ANY (c.confkey)
	AND n.nspname = i_json ->>'schema'
	AND p1.relname = i_json ->>'table_name'

)row;

 

select  row_to_json(row) into v_result
from(
  select v_table_c as c_tab, v_table_p as p_tab
)row;

return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema(i_json json)
  RETURNS json AS
$BODY$
sql_select = "select column_name, udt_name,
    character_maximum_length ,
    is_nullable,
    column_default,
    data_type
    from information_schema.columns
    where table_catalog = $1 and table_schema = $2 and table_name = $3
    and column_name not in ('id','seq', 'active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
    order by ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
    return {"data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_cs2(i_json json)
  RETURNS json AS
$BODY$
sql_select = "select column_name, udt_name,
    character_maximum_length ,
    is_nullable,
    column_default,
    data_type
    from information_schema.columns
    where table_catalog = $1 and table_schema = $2 and table_name = $3
    and column_name not in ('active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
    order by ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
    return {"data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_cs3(i_json json)
  RETURNS json AS
$BODY$
sql_select = "select c.column_name, c.ordinal_position, c.udt_name,
    c.character_maximum_length ,
    c.is_nullable,
    c.column_default,
    c.data_type,
    fk.foreign_table_name,
    fk.foreign_column_name
    from information_schema.columns c
    LEFT JOIN ( SELECT
        tc.constraint_name, tc.table_name, kcu.column_name as column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
    WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name=$3) as fk

    on c.column_name = fk.column_name

    where c.table_catalog = $1 and c.table_schema = $2 and c.table_name = $3
    and c.column_name not in ('active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
    order by c.ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
    return {"data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_cs4(i_json json)
  RETURNS json AS
$BODY$
sql_select = "select c.column_name, c.ordinal_position, c.udt_name,
    c.character_maximum_length ,
    c.is_nullable,
    c.column_default,
    c.data_type,
    co.constraint_type,
    co.co_table_name,
    co.co_column_name
    from information_schema.columns c
    LEFT JOIN ( SELECT
        substr(tc.constraint_type,1,1) as constraint_type,
        tc.constraint_name, tc.table_name, kcu.column_name as column_name,
        ccu.table_name AS co_table_name,
        ccu.column_name AS co_column_name
    FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type in ('PRIMARY KEY', 'FOREIGN KEY') AND tc.table_name=$3) as co

    on c.column_name = co.column_name

    where c.table_catalog = $1 and c.table_schema = $2 and c.table_name = $3
    and c.column_name not in ('active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
    order by c.ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
    return {"data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_cs5(i_json json)
  RETURNS json AS
$BODY$

sql_select = "select c.column_name, c.ordinal_position, c.udt_name,
    c.character_maximum_length ,
    c.is_nullable,
    c.column_default,
    c.data_type,
    co.constraint_type,
    co.co_table_name,
    co.co_column_name
    from information_schema.columns c
    LEFT JOIN ( SELECT
        substr(tc.constraint_type,1,1) as constraint_type,
        tc.constraint_name, tc.table_name, kcu.column_name as column_name,
        ccu.table_name AS co_table_name,
        ccu.column_name AS co_column_name
    FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type in ('PRIMARY KEY', 'FOREIGN KEY') AND tc.table_name='#{i_json.table_name}') as co

    on c.column_name = co.column_name

    where c.table_catalog = '#{i_json.catalog}' and c.table_schema = '#{i_json.schema}' and c.table_name = '#{i_json.table_name}'
    and c.column_name not in ('active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
    order by c.ordinal_position
"

rtn = plv8.execute(sql_select)

if rtn.length>0
    return {"data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_cs7(i_json json)
  RETURNS json AS
$BODY$

sql_select = "
select a.attname as column_name,
a.attnum as ordinal_position,
t.typname as data_type,
(a.atttypmod-4) as character_maximum_length,
a.attnotnull as is_nullable,
'' as column_default,
fk.constraint_type as constraint_type,
fk.parent_table_name as co_table_name,
fk.parent_col as co_column_name
from pg_catalog.pg_attribute a
inner join pg_catalog.pg_class cls on cls.oid = a.attrelid
    and  cls.relname ='#{i_json.table_name}' and a.attstattarget <> 0
inner join pg_type t on a.atttypid = t.oid
left join (
select 'f' as constraint_type, cls.relname as table_name, 'id' as parent_col,
cls2.relname as parent_table_name , c.conkey[1] as original_position
from pg_catalog.pg_constraint c
inner join pg_catalog.pg_class cls on cls.oid = c.conrelid
inner join pg_catalog.pg_class cls2 on cls2.oid = c.confrelid
inner join pg_catalog.pg_class cls3 on cls3.oid = c.conindid
) fk on fk.table_name = cls.relname and fk.original_position = a.attnum
where a.attname not in (
'referenceid',
'active',
'modifiedon',
'modifiedby',
'createdon',
'createdby',
'rowversion'
)
order by ordinal_position
"

rtn = plv8.execute(sql_select)

if rtn.length>0
    return {"data":rtn}
else
    return {}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_pg1(i_json json)
  RETURNS json AS
$BODY$

declare



v_table_name varchar;
v_catalog varchar;
v_schema varchar;

 v_result json;
 v_column_name varchar;

begin

v_table_name = i_json ->>'table_name';
v_catalog = i_json ->>'catalog';
v_schema = i_json ->>'schema';

select c.column_name into v_column_name
/*, c.ordinal_position, c.udt_name, 
	c.character_maximum_length , 
	c.is_nullable, 
	c.column_default, 
	c.data_type,
	co.constraint_type,
	co.co_table_name,
	co.co_column_name */
	from information_schema.columns c
	/*
	LEFT JOIN ( SELECT
	    substr(tc.constraint_type,1,1) as constraint_type,
	    tc.constraint_name, tc.table_name, kcu.column_name as column_name, 
	    ccu.table_name AS co_table_name,
	    ccu.column_name AS co_column_name 
	FROM 
	    information_schema.table_constraints AS tc 
	    JOIN information_schema.key_column_usage AS kcu
	      ON tc.constraint_name = kcu.constraint_name
	    JOIN information_schema.constraint_column_usage AS ccu
	      ON ccu.constraint_name = tc.constraint_name
	WHERE tc.constraint_type in ('PRIMARY KEY', 'FOREIGN KEY') AND tc.table_name=v_table_name ) as co

	on c.column_name = co.column_name
	*/
	where c.table_catalog = v_catalog and c.table_schema = v_schema and c.table_name = v_table_name
	and c.column_name not in ('active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
	order by c.ordinal_position;


select row_to_json(row) into v_result
from(
	select v_column_name as result
)row;

return v_result;

end;

$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_pg2(i_json json)
  RETURNS json AS
$BODY$

declare

v_result json;
v_return json;

begin

select  json_agg(row_to_json(row)) into v_result
from(
select a.attname as column_name,
a.attnum as ordinal_position, 
t.typname as data_type, 
(a.atttypmod-4) as character_maximum_length, 
a.attnotnull as is_nullable, 
'' as column_default,
fk.constraint_type as constraint_type,
fk.parent_table_name as co_table_name, 	
fk.parent_col as co_column_name
from pg_catalog.pg_attribute a
inner join pg_catalog.pg_class cls on cls.oid = a.attrelid 
    and  cls.relname =i_json->>'table_name' and a.attstattarget <> 0
inner join pg_type t on a.atttypid = t.oid
left join (
select 'F' as constraint_type, cls.relname as table_name, 'id' as parent_col, 
cls2.relname as parent_table_name , c.conkey[1] as original_position 
from pg_catalog.pg_constraint c 
inner join pg_catalog.pg_class cls on cls.oid = c.conrelid
inner join pg_catalog.pg_class cls2 on cls2.oid = c.confrelid
inner join pg_catalog.pg_class cls3 on cls3.oid = c.conindid
) fk on fk.table_name = cls.relname and fk.original_position = a.attnum
where a.attname not in (
'referenceid',
'active',
'modifiedon',
'modifiedby',
'createdon',
'createdby',
'rowversion'
)
order by ordinal_position

)row;


return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_pg3(i_json json)
  RETURNS json AS
$BODY$

declare

v_result json;


begin

select  json_agg(row_to_json(row)) into v_result
from(

select a.attname as column_name,
a.attnum as ordinal_position, 
t.typname as data_type, 
(a.atttypmod-4) as character_maximum_length, 
a.attnotnull as not_null,
array_length(c.conkey, 1) as not_composite,
c.contype as constraint_type,
c.conname as constraint_type,
-- p1.relname, 
p2.relname as rel_table_name,
a2.attname as rel_column_name
from pg_catalog.pg_attribute a
inner join pg_catalog.pg_class cls on cls.oid = a.attrelid 
    and a.attstattarget <> 0
inner join pg_namespace n on (cls.relnamespace = n.oid )
inner join pg_catalog.pg_type t on a.atttypid = t.oid
left join pg_catalog.pg_constraint c on ( c.conrelid = a.attrelid and  a.attnum = any(c.conkey) )
left join pg_catalog.pg_class p1 on ( c.conrelid = p1.oid)
left join pg_catalog.pg_class p2 
     on ((case when c.confrelid =0 then c.conrelid else c.confrelid end)  = p2.oid)
left join pg_catalog.pg_attribute a2 on ( c.confrelid = a2.attrelid and  a2.attnum = any(c.confkey) )
where 
  cls.relname = i_json ->>'table_name' 
  and n.nspname = i_json ->>'schema' 
and
a.attname not in (
'referenceid',
'active',
'lastupdateon',
'lastupdatedby',
'modifiedon',
'modifiedby',
'createdon',
'createdby',
'rowversion',
'rowversionstamp'
)
order by ordinal_position

)row;


return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_get_schema_pg4(i_json json)
  RETURNS json AS
$BODY$

declare

v_result json;


begin

select  json_agg(row_to_json(row)) into v_result
from(

select a.attname as column_name,
a.attnum as ordinal_position, 
t.typname as data_type, 
(a.atttypmod-4) as character_maximum_length, 
a.attnotnull as not_null,
def.adsrc as column_default,
array_length(c.conkey, 1) as not_composite,
c.contype as constraint_type,
c.conname as constraint_name,
-- p1.relname, 
 p2.relname as rel_table_name,
 a2.attname as rel_column_name
from pg_catalog.pg_attribute a
inner join pg_catalog.pg_class cls on cls.oid = a.attrelid 
    and a.attstattarget <> 0
inner join pg_namespace n on (cls.relnamespace = n.oid )
inner join pg_catalog.pg_type t on a.atttypid = t.oid
left join pg_catalog.pg_attrdef def on (def.adrelid = a.attrelid and def.adnum = a.attnum )
left join pg_catalog.pg_constraint c on ( c.conrelid = a.attrelid and  a.attnum = any(c.conkey) )
left join pg_catalog.pg_class p1 on ( c.conrelid = p1.oid)
left join pg_catalog.pg_class p2 
     on ((case when c.confrelid =0 then c.conrelid else c.confrelid end)  = p2.oid)
left join pg_catalog.pg_attribute a2 on ( c.confrelid = a2.attrelid and  a2.attnum = any(c.confkey) )
where 
  cls.relname =i_json->>'table_name' 
  and n.nspname = i_json->>'schema' 
and
a.attname not in (
'referenceid',
'active',
'lastupdateon',
'lastupdatedby',
'modifiedon',
'modifiedby',
'createdon',
'createdby',
'rowversion',
'rowversionstamp'
)
order by ordinal_position 

)row;


return v_result;

end;


$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_make_criteria_a(i_json json)
  RETURNS text AS
$BODY$

v_domain = i_json.domain

conditons = []

# OR
for filter_arr in v_domain

    filter_str = []

    ztmp = []

    # AND
    for con in filter_arr

        tmp = []
        tmp.push(con[0])
        tmp.push(con[1])

        if typeof(con[2]) == 'object'

            vlist = []

            arr = con[2]

            #add single quote for value
            for i in [0 ..arr.length-1]
                vlist.push("'#{arr[i]}'")

            arr_str = vlist.join(", ")
            arr_str = "(#{arr_str})"
            #in_ = [ con[0], con[1], arr_str ].join(' ')
            tmp.push(arr_str)


        if con[3] in ["char","varchar","timestamp"] or con.length == 3
            tmp.push("'#{con[2]}'")
        else:
            tmp.push(con[2])

        ztmp.push(tmp)

    for con in ztmp

        v = con[0..2].join(' ')
        filter_str.push(v)

    and_conditions = filter_str.join(" AND ")

    conditons.push("(#{and_conditions})")


filters = conditons.join(' OR ')

return filters


$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_make_criteria_a2(i_json json)
  RETURNS text AS
$BODY$

v_domain = i_json.domain

v_languageid = i_json.languageid

conditons = []

# OR
for filter_arr in v_domain

    filter_str = []

    ztmp = []

    # AND
    for con in filter_arr

        tmp = []

        if con[0] == "texths"
             v = "texths -> '#{v_languageid}'"
             tmp.push(v)
        else
             tmp.push(con[0])
        tmp.push(con[1])

        if typeof(con[2]) == 'object'

            vlist = []

            arr = con[2]

            #add single quote for value
            for i in [0 ..arr.length-1]
                vlist.push("'#{arr[i]}'")

            arr_str = vlist.join(", ")
            arr_str = "(#{arr_str})"
            #in_ = [ con[0], con[1], arr_str ].join(' ')
            tmp.push(arr_str)


        if con[3] in ["char","varchar","timestamp"] or con.length == 3
            tmp.push("'#{con[2]}'")
        else:
            tmp.push(con[2])

        ztmp.push(tmp)

    for con in ztmp

        v = con[0..2].join(' ')
        filter_str.push(v)

    and_conditions = filter_str.join(" AND ")

    conditons.push("(#{and_conditions})")


filters = conditons.join(' OR ')

return filters


$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_make_criteria_p(i_json json)
  RETURNS text AS
$BODY$

v_domain = i_json.domain

n = v_domain.length

st = []

y = {"|":" OR ","&":" AND ", "!" : " NOT "}


while n>0

    # from Right to Left
    n = n - 1

    # Operator
    if v_domain[n] in ["|","&", "!"]

        if v_domain[n] == "!"
            # NOT
            #conditions = st.join("")
            conditions = st.pop()
            st.push(" NOT (#{conditions})" )
        else
            # AND / OR
            conditions = st.join(" #{y[ v_domain[n] ]} ")
            st.pop()
            st.pop()
            st.push("(#{conditions})")
    # Expression
    else
        # in / not in
        if typeof (v_domain[n][2]) == 'object'

            vlist = []

            arr = v_domain[n][2]

            #add single quote for value
            for i in [0 ..arr.length-1]
                vlist.push("'#{arr[i]}'")

            arr_str = vlist.join(", ")
            arr_str = "(#{arr_str})"
            in_ = [ v_domain[n][0], v_domain[n][1], arr_str ].join(' ')
            st.push(in_)

        else
            #console.log("not obj")
            v_domain[n][2] = "'#{v_domain[n][2]}'"
            st.push(v_domain[n].join(' '))
#result
return st.pop()


$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_search_cf2(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.domain

v_orderby = i_json.orderby

v_offset = i_json.offset

v_limit = i_json.limit

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    v_languageid = 1033
    #return {"error":"please provide languageid"}

if i_json.cols

    for i in [0 .. i_json.cols.length-1]
        if i_json.cols[i] == "texths"
            i_json.cols[i] = "#{i_json.cols[i]}->'#{v_languageid}' as texths"
    v_cols = i_json.cols.join(",")

if not v_filter or v_filter.length == 0
    v_filter = "true"
else
    make_criteria = plv8.find_function("mtp_make_criteria_a");

    v_filter= make_criteria({"domain":v_filter})

if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter}"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

if total== 0

    return {"error":"no data"}

v_sql = "select #{v_cols}
    from #{v_table}
    where #{v_filter}
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rtn = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}



count = rtn.length

return {"total":total, "count":count,  "result":rtn}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_search_cf3(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.domain

v_orderby = i_json.orderby

v_offset = i_json.offset

v_limit = i_json.limit

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    v_languageid = 1033
    #return {"error":"please provide languageid"}

if i_json.cols

    for i in [0 .. i_json.cols.length-1]
        if i_json.cols[i] == "texths"
            i_json.cols[i] = "#{i_json.cols[i]}->'#{v_languageid}' as texths"
    v_cols = i_json.cols.join(",")

if not v_filter or v_filter.length == 0
    v_filter = "true"
else
    make_criteria = plv8.find_function("mtp_make_criteria_a");

    v_filter= make_criteria({"domain":v_filter})

if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter}"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

if total== 0

    return {"error":"no data"}

v_sql = "select #{v_cols}
    from #{v_table}
    where #{v_filter}
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rows = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}



count = rows.length

return {"total":total, "count":count,  "rows":rows}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_search_cf4(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.domain

v_orderby = i_json.orderby

v_offset = i_json.offset

v_limit = i_json.limit

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    v_languageid = 1033
    #return {"error":"please provide languageid"}

if i_json.cols

    for i in [0 .. i_json.cols.length-1]
        if i_json.cols[i] == "texths"
            i_json.cols[i] = "#{i_json.cols[i]}->'#{v_languageid}' as texths"
    v_cols = i_json.cols.join(",")

if not v_filter or v_filter.length == 0
    v_filter = "true"
else
    make_criteria = plv8.find_function("mtp_make_criteria_a2");

    v_filter= make_criteria({"domain":v_filter, "languageid":v_languageid})

if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter}"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

if total== 0

    return {"error":"no data"}

v_sql = "select #{v_cols}
    from #{v_table}
    where #{v_filter}
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rows = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}



count = rows.length

return {"total":total, "count":count,  "rows":rows}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_search_cs5(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""
v_cols = "*"

#input
v_table = i_json.table

v_filter = i_json.domain

v_orderby = i_json.orderby

v_offset = i_json.offset

v_limit = i_json.limit

v_languageid = i_json.languageid

if not v_languageid
    #throw("please provide languageid")
    v_languageid = 1033
    #return {"error":"please provide languageid"}

if i_json.cols

    for i in [0 .. i_json.cols.length-1]
        if i_json.cols[i] == "texths"
            i_json.cols[i] = "#{i_json.cols[i]}->'#{v_languageid}' as texths"
    v_cols = i_json.cols.join(",")

if not v_filter or v_filter.length == 0
    v_filter = "true"
else
    make_criteria = plv8.find_function("mtp_make_criteria_a2");

    v_filter= make_criteria({"domain":v_filter, "languageid":v_languageid})

if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter}"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

if total== 0

    return {"error":"no data"}

v_sql = "select #{v_cols}
    from #{v_table}
    where #{v_filter}
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rows = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}



count = rows.length

return {"total":total, "count":count,  "data":rows}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_select_cf1(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""

#input
v_table = i_json.table

# key-value
v_key = i_json.key
v_value = i_json.value
v_value_t = v_value

v_languageid = i_json.languageid

v_filter = i_json.filter

# pagination
v_offset = i_json.offset
v_limit = i_json.limit
v_orderby = i_json.orderby

if not v_languageid
    #throw("please provide languageid")
    v_languageid = 1033
    #return {"error":"please provide languageid"}

if v_value == "texths"
    v_value = "texths->'#{v_languageid}' as texths"
    v_value_t = "texths->'#{v_languageid}'"

if not v_filter or v_filter.length == 0
    v_filter = "true"
else
    v_filter = "#{v_value_t} ilike '#{v_filter}%'"
if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter}"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

if total== 0

    return {"error":"no data"}

v_sql = "select #{v_key}, #{v_value}
    from #{v_table}
    where #{v_filter}
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rows = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

count = rows.length

return {"total":total, "count":count,  "rows":rows}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_select_cf2(i_json json)
  RETURNS json AS
$BODY$

#init
msg = ""

#input
v_table = i_json.table

# key-value
v_key = i_json.key
v_value = i_json.value


v_languageid = i_json.languageid

v_filter = i_json.filter

# pagination
v_offset = i_json.offset
v_limit = i_json.limit
v_orderby = i_json.orderby

if not v_languageid
    #throw("please provide languageid")
    v_languageid = 1033
    #return {"error":"please provide languageid"}

if v_value == "texths"
    v_value = "texths->'#{v_languageid}'"

if not v_filter or v_filter.length == 0
    v_filter = "true"
else
    v_filter = "#{v_value} ilike '#{v_filter}%'"
if not v_orderby
    v_orderby = "1"

if not v_offset
    v_offset = 0

if not v_limit
    v_limit = 25

v_sql = "select count(1) as total from #{v_table} where #{v_filter}"

try
    total = plv8.execute( v_sql )[0]["total"]
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

if total== 0

    return {"error":"no data"}

v_sql = "select #{v_key} as id, #{v_value}  as text
    from #{v_table}
    where #{v_filter}
    order by #{v_orderby}
    offset #{v_offset} limit #{v_limit}"

try
    rows = plv8.execute(v_sql)
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"error":msg, "sql": v_sql}

count = rows.length

return {"total":total, "count":count,  "rows":rows}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_update_cf1(i_json json)
  RETURNS json AS
$BODY$

#init

#input
v_table = i_json.table

v_id = i_json.id

v_user = i_json.user

v_sql = "update #{v_table}
    set active=0, modifiedon=now(), modifiedby='#{v_user}', rowversion = rowversion + 1
    where id = '#{v_id}'"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"

return {"id":v_id, "result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cf1(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.kv.id

languageid = i_json.languageid

v_user = i_json.user
v_rowversion = i_json.kv.rowversion

if not v_rowversion
    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.kv)

    if key == 'id'
        if i_json.kv['id'] != ''
            #update  = true
            v_id = i_json.kv['id']
        else
            continue

    cols.push(key)

    if key != 'texths'
        x = i_json.kv[key]

        if typeof(x) == 'string'

            y = x.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                v = "'#{x}'"
                vals.push(v)
        else
            vals.push(v)
    else
        val = i_json.kv[key]
        v = "hstore('#{languageid}', '#{val}')"
        vals.push(v)

if v_id != undefined and v_id != ""
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if col in ["id","modifiedon","modifiedby","rowversion"]
            continue

        if col != "texths"
            fields.push("#{col} = #{val}")
        else
            fields.push("#{col} = #{col}||#{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where id='#{v_id}' and rowversion = #{v_rowversion} returning id, seq, modifiedon, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        if cols[i] in ["id", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(cols[i])
            t_vals.push(vals[i])

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id, seq, createdon, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"sql":v_sql,"error":msg}

return {"result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cf2(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.kv.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.kv.rowversion

if not v_rowversion
    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.kv)

    if key == 'id'
        if i_json.kv['id'] != ''
            #update  = true
            v_id = i_json.kv['id']
        else
            continue

    cols.push(key)

    if key != 'texths'
        x = i_json.kv[key]

        if typeof(x) == 'string'

            y = x.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                v = "'#{x}'"
                vals.push(v)
        else
            vals.push(v)
    else
        val = i_json.kv[key]
        v = "hstore('#{languageid}', '#{val}')"
        vals.push(v)

if v_id != undefined and v_id != ""
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if col in ["id","modifiedon","modifiedby","rowversion"]
            continue

        if col != "texths"
            fields.push("#{col} = #{val}")
        else
            fields.push("#{col} = #{col}||#{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where id='#{v_id}' and rowversion = #{v_rowversion} returning id, seq, modifiedon, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        if cols[i] in ["id", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(cols[i])
            t_vals.push(vals[i])

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id, seq, createdon, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err}"
    return {"sql":v_sql,"error":msg}

return {"result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cf3(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.kv.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.kv.rowversion

if not v_rowversion
    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.kv)

    if key == 'id'
        if i_json.kv['id'] != ''
            #update  = true
            v_id = i_json.kv['id']
        else
            continue

    cols.push(key)

    if key != 'texths'
        x = i_json.kv[key]

        if typeof(x) == 'string'

            y = x.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                v = "'#{x}'"
                vals.push(v)
        else
            vals.push(x)
    else
        val = i_json.kv[key]
        v = "hstore('#{languageid}', '#{val}')"
        vals.push(v)

if v_id != undefined and v_id != ""
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if col in ["id","modifiedon","modifiedby","rowversion"]
            continue

        if col != "texths"
            fields.push("#{col} = #{val}")
        else
            fields.push("#{col} = #{col}||#{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where id='#{v_id}' and rowversion = #{v_rowversion} returning id, seq, modifiedon, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        if cols[i] in ["id", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(cols[i])
            t_vals.push(vals[i])

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id, seq, createdon, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err},#{v_sql}"
    #return {"sql":v_sql,"error":msg}
    throw(msg)

return {"result":result}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cf4(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.columns.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.columns.rowversion

if not v_rowversion
    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.columns)

    if key == 'id'
        if i_json.columns['id'] != ''
            #update  = true
            v_id = i_json.columns['id']
        else
            continue

    cols.push(key)

    if key != 'texths'
        x = i_json.columns[key]

        if typeof(x) == 'string'

            y = x.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                x = x.replace("'","''")  # escape single quote
                v = "'#{x}'"
                vals.push(v)
        else
            vals.push(x)
    else
        val = i_json.columns[key]
        val = val.replace("'","''") # escape single quote
        v = "hstore('#{languageid}', '#{val}')"
        vals.push(v)

if v_id != undefined and v_id != ""
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if col in ["id","modifiedon","modifiedby","rowversion"]
            continue

        if col == "texths"
            fields.push("#{col} = #{col}||#{val}")
        else

            fields.push("#{col} = #{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where id='#{v_id}' and rowversion = #{v_rowversion} returning id, seq, modifiedon, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        if cols[i] in ["id", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(cols[i])
            t_vals.push(vals[i])

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id, seq, createdon, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err},#{v_sql}"
    #return {"sql":v_sql,"error":msg}
    throw(msg)

return {"result":result, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cf5(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.columns.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.columns.rowversion

if not v_rowversion
    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.columns)

    if key == 'id'
        if i_json.columns['id'] != null and i_json.columns['id'] != ''
            #update  = true
            v_id = i_json.columns['id']
        else
            continue



    if key == 'texths'
        val = i_json.columns[key]

        if val != null
            #if no value for hstore then bypass
            cols.push(key)

            if typeof(val) == 'string'
                val = val.replace("'","''") # escape single quote
            v = "hstore('#{languageid}', '#{val}')"
            vals.push(v)
    else
        cols.push(key)
        val = i_json.columns[key]

        if typeof(val) == 'string'

            y = val.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                val = val.replace("'","''")  # escape single quote
                v = "'#{val}'"
                vals.push(v)
        else
            vals.push(val)

if v_id != undefined and v_id != "" and v_id != null
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if val == null
            continue

        if col in ["id","seq", "modifiedon","modifiedby","createdon","createdby","rowversion"]
            continue

        if col == "texths"
            fields.push("#{col} = #{col}||#{val}")
            #fields.push("#{col} = #{val}")
        else

            fields.push("#{col} = #{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where id='#{v_id}' and rowversion = #{v_rowversion} returning id, seq, modifiedon, modifiedby, createdon, createdby, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        col = cols[i]
        val = vals[i]
        if val == null
            continue
        if col in ["id", "seq", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(col)
            t_vals.push(val)

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id, seq, modifiedon, modifiedby, createdon, createdby, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err},#{v_sql}"
    #return {"sql":v_sql,"error":msg}
    throw(msg)

return {"returning":result, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cf6(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.columns.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.columns.rowversion

if not v_rowversion
    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.columns)

    if key == 'id'
        if i_json.columns['id'] != null and i_json.columns['id'] != ''
            #update  = true
            v_id = i_json.columns['id']
        else
            continue



    if key == 'texths'
        val = i_json.columns[key]

        if val != null
            #if no value for hstore then bypass
            cols.push(key)

            if typeof(val) == 'string'
                val = val.replace("'","''") # escape single quote
            v = "hstore('#{languageid}', '#{val}')"
            vals.push(v)
    else
        cols.push(key)
        val = i_json.columns[key]

        if typeof(val) == 'string'

            y = val.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                val = val.replace("'","''")  # escape single quote
                v = "'#{val}'"
                vals.push(v)
        else
            vals.push(val)

if v_id != undefined and v_id != "" and v_id != null
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if val == null
            continue

        if col in ["id","seq", "modifiedon","modifiedby","createdon","createdby","rowversion"]
            continue

        if col == "texths"
            fields.push("#{col} = #{col}||#{val}")
            #fields.push("#{col} = #{val}")
        else

            fields.push("#{col} = #{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where id='#{v_id}' and rowversion = #{v_rowversion} returning id, modifiedon, modifiedby, createdon, createdby, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        col = cols[i]
        val = vals[i]
        if val == null
            continue
        if col in ["id", "seq", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(col)
            t_vals.push(val)

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id, modifiedon, modifiedby, createdon, createdby, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err},#{v_sql}"
    #return {"sql":v_sql,"error":msg}
    throw(msg)

return {"returning":result, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cs7(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

v_id = i_json.columns.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.columns.rowversion

#if not v_rowversion
#    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.columns)

    if key == 'id'
        if i_json.columns['id'] != null and i_json.columns['id'] != ''
            #update  = true
            v_id = i_json.columns['id']
        else
            continue



    if key == 'texths'
        val = i_json.columns[key]

        if val != null
            #if no value for hstore then bypass
            cols.push(key)

            if typeof(val) == 'string'
                val = val.replace("'","''") # escape single quote
            v = "hstore('#{languageid}', '#{val}')"
            vals.push(v)
    else
        cols.push(key)
        val = i_json.columns[key]

        if typeof(val) == 'string'

            y = val.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                val = val.replace("'","''")  # escape single quote
                v = "'#{val}'"
                vals.push(v)
        else
            vals.push(val)

if v_rowversion
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if val == null
            continue

        if col in ["id","seq", "modifiedon","modifiedby","createdon","createdby","rowversion"]
            continue

        if col == "texths"
            fields.push("#{col} = #{col}||#{val}")
            #fields.push("#{col} = #{val}")
        else

            fields.push("#{col} = #{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where id='#{v_id}' and rowversion = #{v_rowversion} returning id, modifiedon, modifiedby, createdon, createdby, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        col = cols[i]
        val = vals[i]
        if val == null
            continue
        if col in ["seq", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(col)
            t_vals.push(val)

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning id,modifiedon, modifiedby, createdon, createdby, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err},#{v_sql}"
    #return {"sql":v_sql,"error":msg}
    throw(msg)

return {"returning":result, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cs8(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

# column name of primark key
v_pkey = i_json.pkey

#modified on 2014-05-10 20:50:19
#set default column name of primary key
if not v_pkey
    v_pkey = "id"

v_id = i_json.columns.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.columns.rowversion

#if not v_rowversion
#    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.columns)

    if key == v_pkey
        if i_json.columns[v_pkey] != null and i_json.columns[v_pkey] != ''
            #update  = true
            v_id = i_json.columns[v_pkey]
        else
            continue



    if key == 'texths'
        val = i_json.columns[key]

        if val != null
            #if no value for hstore then bypass
            cols.push(key)

            if typeof(val) == 'string'
                val = val.replace("'","''") # escape single quote
            v = "hstore('#{languageid}', '#{val}')"
            vals.push(v)
    else
        cols.push(key)
        val = i_json.columns[key]

        if typeof(val) == 'string'

            y = val.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                val = val.replace("'","''")  # escape single quote
                v = "'#{val}'"
                vals.push(v)
        else
            vals.push(val)

if v_rowversion
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if val == null
            continue

        if col in [v_pkey, "id","seq", "modifiedon","modifiedby","createdon","createdby","rowversion"]
            continue

        if col == "texths"
            fields.push("#{col} = #{col}||#{val}")
            #fields.push("#{col} = #{val}")
        else

            fields.push("#{col} = #{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where #{v_pkey} = '#{v_id}' and rowversion = #{v_rowversion} returning #{v_pkey}, modifiedon, modifiedby, createdon, createdby, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        col = cols[i]
        val = vals[i]
        if val == null
            continue
        if col in ["seq", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(col)
            t_vals.push(val)

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning #{v_pkey}, modifiedon, modifiedby, createdon, createdby, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err},#{v_sql}"
    #return {"sql":v_sql,"error":msg}
    throw(msg)

return {"returning":result, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mtp_upsert_cs9(i_json json)
  RETURNS json AS
$BODY$

#init
cols = []
vals = []
v_sql = ""

result = null

#input
v_table = i_json.table

# column name of primark key
v_pkey = i_json.pkey

#modified on 2014-05-10 20:50:19
#set default column name of primary key
if not v_pkey
    v_pkey = "id"

v_id = i_json.columns.id

languageid = i_json.context.languageid

v_user = i_json.context.user

v_rowversion = i_json.columns.rowversion

#if not v_rowversion
#    v_rowversion = 1

if not languageid
    #throw("please provide languageid")
    return {"error":"please provide languageid"}

for key in Object.keys(i_json.columns)

    if key == v_pkey
        if i_json.columns[v_pkey] != null and i_json.columns[v_pkey] != ''
            #update  = true
            v_id = i_json.columns[v_pkey]
        else
            continue



    if key == 'texths'
        val = i_json.columns[key]

        if val != null
            #if no value for hstore then bypass
            cols.push(key)

            if typeof(val) == 'string'
                val = val.replace("'","''") # escape single quote
            v = "hstore('#{languageid}', '#{val}')"
            vals.push(v)
        else
            cols.push(key)
            v = "hstore('#{languageid}', '')"
            vals.push(v)
    else
        cols.push(key)
        val = i_json.columns[key]

        if typeof(val) == 'string'

            y = val.split('::')

            if y.length == 2
                v = "'#{y[0]}'::#{y[1]}"
                vals.push(v)

            else
                val = val.replace("'","''")  # escape single quote
                v = "'#{val}'"
                vals.push(v)
        else
            vals.push(val)

if v_rowversion
    #build update sql

    #c= cols.join(",")
    #v = vals.join(",")

    fields = []

    for i in [0 ..cols.length-1]

        col = cols[i]
        val = vals[i]

        if val == null
            continue

        if col in [v_pkey, "id","seq", "modifiedon","modifiedby","createdon","createdby","rowversion"]
            continue

        if col == "texths"
            fields.push("#{col} = #{col}||#{val}")
            #fields.push("#{col} = #{val}")
        else

            fields.push("#{col} = #{val}")

    setfields = fields.join(", ")

    v_sql = "update #{v_table} set #{setfields}, modifiedon = now(), modifiedby = '#{v_user}', rowversion = rowversion + 1
        where #{v_pkey} = '#{v_id}' and rowversion = #{v_rowversion} returning #{v_pkey}, modifiedon, modifiedby, createdon, createdby, rowversion"

else
    #build insert sql

    t_cols = []
    t_vals = []

    for i in [0 .. cols.length-1 ]

        col = cols[i]
        val = vals[i]
        if val == null
            continue
        if col in ["seq", "modifiedon", "modifiedby", "createdon", "createdby", "rowversion"]
            #alert?
            continue
        else
            t_cols.push(col)
            t_vals.push(val)

    v_cols= t_cols.join(", ")

    v_vals = t_vals.join(", ")

    v_sql = "insert into #{v_table} (#{v_cols}, modifiedon, modifiedby, createdon, createdby)
            values(#{v_vals}, now(), '#{v_user}', now(), '#{v_user}') returning #{v_pkey}, modifiedon, modifiedby, createdon, createdby, rowversion"

try
    result = plv8.execute( v_sql )
catch err
    plv8.elog(DEBUG, v_sql)
    msg = "#{err},#{v_sql}"
    #return {"sql":v_sql,"error":msg}
    throw(msg)

return {"returning":result, "sql":v_sql}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_employee_c_cf1(i_json json)
  RETURNS json AS
$BODY$
sql_insert = "
     insert into mabotech.employee
     (id, name, translation, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, $1, hstore($2,$3), 1, now(), $4, now(), $4)
     returning id,lastupdateon, rowversionstamp
    "
try
    rtn = plv8.execute(sql_insert, [i_json.name, i_json.language, i_json.text,  i_json.user])
    return rtn[0];
catch error
    plv8.elog(LOG, sql_insert)
    return {"error_msg":"#{error}"}
$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_employee_selall_cf1(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data2");

sql_select = "select id, name from employee where createdon>$1 or  name ilike $2"

v1 = i_json.v1
v2 = i_json.v2

data = {}
rtn = []
v = ""
try
    plv8.subtransaction(()->
        plan = plv8.prepare(sql_select, v1)
        v = Object.keys(plan)
        rtn = plan.execute(v2)
        )

    if rtn.length == 0
        throw "no data found"

    data = get_data(i_json.type, rtn)

catch error
    plv8.elog(LOG, sql_select, JSON.stringify(i_json))
    data = {"error_msg":"#{error}", "plan":Object.keys(plan)}
finally

    if plan?
        plan.free()
    return {"data":data,  "plan":v}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_employee_selall_cf2(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data2");

sql_select = "select id, name from employee where id>$1 or  name ilike $2 order by id"

v1 = i_json.v1
v2 = i_json.v2

data = {}

try
    rtn =plv8.execute(sql_select, v2)

    if rtn.length == 0
        throw "no data found"

    data = get_data(i_json.type, rtn)

catch error
    plv8.elog(LOG, sql_select, JSON.stringify(i_json))
    data = {"error_msg":"#{error}"}

return data

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_employee_selall_cf3(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data2");

sql_select = "select id, name from employee where createdon>$1 or  name ilike $2"

v1 = i_json.v1
v2 = i_json.v2

data = {}
rtn = null
v = ""
try
    plv8.subtransaction(()->
        plan = plv8.prepare(sql_select, v1)
        #v = Object.keys(plan)
        #rtn = plan.execute(v2)
        cursor = plan.cursor()
        rtn = cursor.fetch()
        )
    return rtn
    if rtn.length == 0
        throw "no data found #{Object.keys(rtn)}"

    data = rtn #get_data(i_json.type, rtn)

catch error
    plv8.elog(LOG, sql_select, JSON.stringify(i_json))
    data = {"error_msg":"#{error}"}
finally

    if plan?
        plan.free()
    #return { "v":JSON.stringify(rtn)}
    return rtn

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_get_schema(i_json json)
  RETURNS json AS
$BODY$
sql_select = "select column_name, udt_name,
    character_maximum_length ,
    is_nullable,
    column_default,
    data_type
    from information_schema.columns
    where table_catalog = $1 and table_schema = $2 and table_name = $3
    and column_name not in ('id','seq', 'active', 'referenceid', 'lastupdateon', 'lastupdatedby', 'rowversionstamp', 'createdon', 'createdby', 'modifiedon', 'modifiedby', 'rowversion')
    order by ordinal_position
"

rtn = plv8.execute(sql_select, [i_json.catalog, i_json.schema, i_json.table_name])

if rtn.length>0
    return {"_table":i_json.table_name, "data":rtn}
else
    return {"_table":i_json.table_name}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf1(i_name character varying, i_user character varying)
  RETURNS integer AS
$BODY$



sql = "
 insert into mabotech.user
(name, active, createdon, createdby, lastupdateon, lastupdatedby)
values('#{i_name}', 1, now(), '#{i_user}', now(), '#{i_user}')
"

plv8.execute(sql);

return 1;


$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf2(i_name character varying, i_user character varying)
  RETURNS json AS
$BODY$

sql = "
 insert into mabotech.user
 (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
 values(DEFAULT, '#{i_name}', 1, now(), '#{i_user}', now(), '#{i_user}')
 returning  id,lastupdateon
"

rtn = plv8.execute(sql);

return rtn[0];

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf3(i_json json)
  RETURNS json AS
$BODY$
err = ""
try
    sql = "
     insert into mabotech.user
     (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, '#{i_json.name}', 1, now(), '#{i_json.user}', now(), '#{i_json.user}')
     returning  id,lastupdateon
    "
    plv8.elog(LOG, sql)
    plv8.subtransaction(
        (sql) ->
        rtn = plv8.execute(sql)
        #err = "in subtransaction"
        #throw("test err")


    )
    return rtn[0];
catch err
    return {"error":err}
$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf4(i_json json)
  RETURNS json AS
$BODY$

try
    sql = "select * from mabotech.mt_user_c_pg3('#{i_json.name}','#{i_json.user}'::int8)"


    rtn = plv8.execute(sql)

    return rtn[0];
catch error
    plv8.elog(ERROR, sql)
    return {"errormsg":"#{error}"}
$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf5(i_json json)
  RETURNS json AS
$BODY$

sql = "select * from mabotech.mt_user_c_pg3($1,$2)"

plan = plv8.prepare(sql, ['character varying','character varying'])

try
    rtn = plan.execute([i_json.name, i_json.user])
    return rtn[0];
catch error
    plv8.elog(ERROR, sql)
    return {"errormsg":"#{error}"}
finally
    plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf6(i_json json)
  RETURNS json AS
$BODY$

sql = "
     insert into mabotech.user
     (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, $1, 1, now(), $2, now(), $2)
     returning id,lastupdateon
    "

plan = plv8.prepare(sql, ['character varying','character varying'])

try
    rtn = plan.execute([i_json.name, i_json.user])
    return rtn[0];
catch error
    plv8.elog(LOG, sql)
    return {"error_msg":"#{error}"}
finally
    plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf7(i_json json)
  RETURNS json AS
$BODY$

sql_insert = "
     insert into mabotech.user
     (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, $1, 1, now(), $2, now(), $2)
     returning id,lastupdateon, rowversionstamp
    "

#plan = plv8.prepare(sql_insert, ['character varying','character varying'])

try
    rtn = plv8.execute(sql_insert, [i_json.name, i_json.user])
    return rtn[0];
catch error
    plv8.elog(LOG, sql_insert)
    return {"error_msg":"#{error}"}
#finally
#plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf8(i_json json)
  RETURNS json AS
$BODY$

sql_insert = "
     insert into mabotech.user
     (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, $1, 1, now(), $2, now(), $2)
     returning id,lastupdateon, rowversionstamp
    "

#plan = plv8.prepare(sql_insert, ['character varying','character varying'])

#try
rtn = plv8.execute(sql_insert, [i_json.name, i_json.user])
return rtn[0];
#catch error
#    plv8.elog(LOG, sql_insert)
#    return {"error_msg":"#{error}"}
#finally
#plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_cf9(i_json json)
  RETURNS json AS
$BODY$

rtn = null
rtn2 = null

sql_insert = "
     insert into mabotech.user
     (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
     values(DEFAULT, $1, 1, now(), $2, now(), $2)
     returning id,lastupdateon, rowversionstamp
    "
#plv8.subtransaction(()->
rtn = plv8.execute(sql_insert, [i_json.name, i_json.user])
rtn2 = plv8.execute("select now()")

rtn = plv8.execute(sql_insert, [i_json.name, i_json.user])
rtn2 = plv8.execute("select now()")

#    )

return {result:rtn[0], time:rtn2[0]['now']}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_pg1(i_name character varying, i_user character varying)
  RETURNS integer AS
$BODY$

 
begin

 insert into mabotech.user 
(name, active, createdon, createdby, lastupdateon, lastupdatedby)
values(i_name, 1, now(), i_user, now(), i_user) ;

return 1;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_pg2(i_name character varying, i_user character varying)
  RETURNS integer AS
$BODY$

declare 

v_id integer;
v_lastupdateon timestamp;

 

begin

 insert into mabotech.user 
(id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
values(DEFAULT, i_name, 1, now(), i_user, now(), i_user) returning id, lastupdateon into v_id, v_lastupdateon;
 

 return v_id;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_c_pg3(i_name character varying, i_user character varying)
  RETURNS TABLE(id integer, lastupdateon timestamp without time zone) AS
$BODY$

declare 

v_id integer;
v_lastupdateon timestamp;

 

begin

 insert into mabotech.user 
(id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
values(DEFAULT, i_name, 1, now(), i_user, now(), i_user) returning mabotech.user.id, mabotech.user.lastupdateon into v_id, v_lastupdateon;
 

 return query select v_id, v_lastupdateon;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_d_cf2(i_json json)
  RETURNS json AS
$BODY$

sql = "update mabotech.user set active = 0, lastupdatedby = $1, lastupdateon = now() where id = $2"

plan = plv8.prepare(sql, ['character varying','integer'])

try
    ct= plan.execute([i_json.user, i_json.id])

    if ct == 0
        throw "not data found"

    return {"ct":ct};
catch error
    plv8.elog(LOG, sql,';json:',JSON.stringify(i_json))
    return {"error_msg":"#{error}"}
finally
    plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_d_cf3(i_json json)
  RETURNS json AS
$BODY$

sql_update = "update mabotech.user
    set active = 0, lastupdatedby = $1, lastupdateon = now() , rowversionstamp = rowversionstamp + 1
    where id = $2"

#plan = plv8.prepare(sql, ['character varying','integer'])

try
    ct= plv8.execute(sql_update, [i_json.user, i_json.id])

    if ct == 0
        throw "not data found"

    return {"ct":ct};
catch error
    plv8.elog(LOG, sql_update,';json:',JSON.stringify(i_json))
    return {"error_msg":"#{error}"}
#finally
#    plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_d_pg1(i_id integer)
  RETURNS integer AS
$BODY$

declare 
	o_id integer;
	o_name varchar(60);
begin

update mabotech.user set active = 0 where id = i_id; -- lastdeleteon, lastdeletredby

 return 1;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_d_pg2(i_id integer)
  RETURNS json AS
$BODY$

begin

update mabotech.user set active = 0 where id = i_id; -- returning id;

 return hstore_to_json_loose('"id"=>1,"msg"=>"ok"');
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_rl_cf2(i_json json)
  RETURNS json AS
$BODY$

sql = "select * from mabotech.user where active = 1 offset 3 limit 3 "

try
    rtn = plv8.execute(sql)
    if rtn.length == 0
        throw "no data found"
    return rtn

catch error
    plv8.elog(LOG, sql, JSON.stringify(i_json))
    return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_rl_cf3(i_json json)
  RETURNS json AS
$BODY$

#----------------------------
get_data =(rtn) ->

    keys = Object.keys(rtn[0])

    # array of row data
    if i_json.type ==1

        data = []
        for item in rtn
            row =  (item[key] for key in keys)
            data.push(row)

        return {"keys":keys, "data":data}

    # array of column data
    else if i_json.type == 2

        cols = {}
        for item in keys
            cols[item] = []

        for item in keys
            for i in [0..rtn.length-1]
                cols[item].push(rtn[i][item])

        return {"keys":keys, "data":cols}
    else
        return {"keys":keys, "data":rtn}

#----------------------------

sql = "select id, name, createdon
    from mabotech.user
    where active = 1
    offset 3 limit 5 "

try
    rtn = plv8.execute(sql)

    if rtn.length == 0
        throw "no data found"

    return get_data(rtn)

catch error
    plv8.elog(LOG, sql, JSON.stringify(i_json))
    return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_rl_cf4(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data");

sql = "select id, name, createdon
    from mabotech.user
    where active = 1
    offset 3 limit 5 "

try
    rtn = plv8.execute(sql)

    if rtn.length == 0
        throw "no data found"

    return get_data(i_json, rtn)

catch error
    plv8.elog(LOG, sql, JSON.stringify(i_json))
    return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_rl_cf5(i_json json)
  RETURNS json AS
$BODY$

get_data = plv8.find_function("mabotech.get_data2");

sql_select = "select id, name, createdon
    from mabotech.user
    where active = 1 and name ilike $1
    offset $2 limit $3 "

try
    rtn = plv8.execute(sql_select, [i_json.name, i_json.offset, i_json.limit])

    if rtn.length == 0
        throw "no data found"

    return get_data(i_json.type, rtn)

catch error
    plv8.elog(LOG, sql_select, JSON.stringify(i_json))
    return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_rl_pg2(i_json json)
  RETURNS json AS
$BODY$
declare

  v_json json;
  v_limit int4;
  v_name varchar; 
	
begin

v_limit = i_json -> 'limit';
v_name = i_json -> 'name';

select json_agg( row_to_json(row) ) into v_json 
from (select id, name, createdon from mabotech.user where name ilike concat(v_name, '%%') and active = 1  limit v_limit) row;

return v_json;

end;

$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_rl_pg3(i_json json)
  RETURNS json AS
$BODY$
declare

  v_json json;
  v_limit int4;
  v_name varchar; 
	
begin

v_limit = i_json ->> 'limit';
v_name = i_json ->> 'name';

select json_agg( row_to_json(row) )into v_json 
from (
select u.id, u.name, u.createdon from mabotech.user u where u.name ilike v_name and u.active = 1 offset 0 limit v_limit
) row;

return v_json;

end;

$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_rl_pg4(i_json json)
  RETURNS json AS
$BODY$
declare

  v_json json;
  v_result json;  
  v_limit int4;
  v_name varchar;
  v_count int4; 

  v_total int4;
  
begin

v_limit = i_json ->> 'limit';
v_name = i_json ->> 'name';

-- calculate total
select count(1) into v_total from mabotech.user u where u.name ilike v_name and u.active = 1;

-- construct query json
select json_agg( row_to_json(row)), count(row) into v_json , v_count
from (
select u.id, u.name, u.createdon from mabotech.user u where u.name ilike v_name and u.active = 1 
	offset 0 limit v_limit
) row;

-- construct result json
select row_to_json(row) into v_result
from
(select v_count as rowcount, v_total as total, v_json as result ) row;

-- log to server log
if v_count > 2 then
    raise WARNING 'waring in pgsql';
end if;

return v_result;

end;

$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_ro_cf2(i_json json)
  RETURNS json AS
$BODY$

sql = "select * from mabotech.user where id = #{i_json.id}"

try
    rtn = plv8.execute(sql)
    if rtn.length == 0
        throw "no data found"
    return rtn[0]

catch error
    plv8.elog(LOG, sql, JSON.stringify(i_json))
    return {"error_msg":"#{error}"}

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_r_pg1(i_id integer)
  RETURNS json AS
$BODY$

declare 
	o_id integer;
	o_name varchar(60);
	o_json json;
begin

select --id, name into o_id, o_name 
row_to_json(row(id, name)) into o_json
from mabotech.user 
where id = 1 and active = 0;

 return o_json; --row_to_json(row(o_id, o_name, 3, 4, 'do'));
--return to_json('{"abc":123}'::text);
--return hstore_to_json(hstore(ARRAY[['id',o_id],['name',o_name]]));
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_u_cf2(i_json json)
  RETURNS json AS
$BODY$

sql = "update mabotech.user
    set name = $1,
    lastupdatedby = $2, lastupdateon = now()
    where id = $3 returning id, lastupdateon"

plan = plv8.prepare(sql, ['character varying','character varying','integer'])

try
    ct= plan.execute([i_json.name, i_json.user, i_json.id])

    if ct.length == 0
        throw "not data found"

    return ct[0]

catch error
    plv8.elog(LOG, sql)
    return {"error_msg":"#{error}"}
finally
    plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_u_cf3(i_json json)
  RETURNS json AS
$BODY$

sql_update = "update mabotech.user
    set name = $1,
    lastupdatedby = $2, lastupdateon = now() , rowversionstamp = rowversionstamp + 1
    where id = $3 and rowversionstamp = $4 returning id, lastupdateon, rowversionstamp"

#plan = plv8.prepare(sql, ['character varying','character varying','integer'])

try
    ct= plv8.execute(sql_update, [i_json.name, i_json.user, i_json.id, i_json.rowversionstamp])

    if ct.length == 0
        throw "not data found or rowversionstamp conflict"

    return ct[0]

catch error
    plv8.elog(LOG, sql_update)
    return {"error_msg":"#{error}"}
#finally
#    plan.free()

$BODY$
  LANGUAGE plcoffee VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION mt_user_u_pg1(i_id integer, i_name character varying, i_user character varying)
  RETURNS integer AS
$BODY$

begin

update mabotech.user 
set name = i_name, 
lastupdateon = now(), lastupdatedby = i_user 
where id = i_id;

return 1;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION set_of_records1()
  RETURNS TABLE(i integer, t character varying) AS
$BODY$
        plv8.return_next( { "i": 1, "t": "a" } );
        plv8.return_next( { "i": 2, "t": "b" } );
        plv8.return_next( { "i": 3, "t": "c" } );
$BODY$
  LANGUAGE plv8 VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION user_add_pg1(i_json json)
  RETURNS json AS
$BODY$
declare
  v_name varchar;
  v_user varchar; 

  v_result json;

  v_id int8; 
  v_lastupdateon timestamp;
  v_rowversionstamp int8;

begin

v_name = i_json ->> 'name';
v_user = i_json ->> 'user';

insert into mabotech.user 
	 (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
	 values(DEFAULT, v_name, 1, now(), v_user, now(), v_user)  
	 returning id,lastupdateon, rowversionstamp into v_id, v_lastupdateon, v_rowversionstamp;

select row_to_json(row) into v_result
from(
select v_name as name, v_id as id,v_lastupdateon as lastupdateon, v_rowversionstamp as rowversionstamp
) row;

return v_result;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION user_add_pg2(i_json json)
  RETURNS json AS
$BODY$
declare
  v_name varchar;
  v_user varchar; 

  v_result json;

  v_id int8; 
  v_lastupdateon timestamp;
  v_rowversionstamp int8;

begin

v_name = i_json ->> 'name';
v_user = i_json ->> 'user';

 
insert into mabotech.user 
	 (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
	 values(DEFAULT, v_name, 1, now(), v_user, now(), v_user)  
	 returning id,lastupdateon, rowversionstamp into v_id, v_lastupdateon, v_rowversionstamp;

 
select row_to_json(row) into v_result
from(
select v_name as name, v_id as id,v_lastupdateon as lastupdateon, v_rowversionstamp as rowversionstamp
) row;

return v_result;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/
CREATE OR REPLACE FUNCTION user_insert_pg1(i_json json)
  RETURNS json AS
$BODY$
declare
  v_name varchar;
  v_user varchar; 

  v_result json;

  v_id int8; 
  v_lastupdateon timestamp;
  v_rowversionstamp int8;

begin

v_name = i_json ->> 'name';
v_user = i_json ->> 'user';

insert into mabotech.user 
	 (id, name, active, createdon, createdby, lastupdateon, lastupdatedby)
	 values(DEFAULT, v_name, 1, now(), v_user, now(), v_user)  
	 returning id,lastupdateon, rowversionstamp into v_id, v_lastupdateon, v_rowversionstamp;

select row_to_json(row) into v_result
from(
select v_name as name, v_id as id,v_lastupdateon as lastupdateon, v_rowversionstamp as rowversionstamp
) row;

return v_result;

end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  ;
/*============================================*/

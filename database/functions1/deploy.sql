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
  
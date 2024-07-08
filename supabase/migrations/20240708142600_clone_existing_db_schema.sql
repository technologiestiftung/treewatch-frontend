-- -------------------------------------------------------------
-- TablePlus 5.3.0(486)
--
-- https://tableplus.com/
--
-- Database: qtrees
-- Generation Time: 2024-07-08 16:29:32.7680
-- -------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "tablefunc" WITH SCHEMA "extensions";
CREATE SCHEMA IF NOT EXISTS private;

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "private"."trees_private" (
    "tree_id" text NOT NULL,
    "vitality_index" float4,
    "baumscheibe_m2" float4,
    "baumscheibe_surface" text,
    PRIMARY KEY ("tree_id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "private"."watering_gdk" (
    "tree_id" text NOT NULL,
    "amount_liters" float4,
    "date" date NOT NULL,
    PRIMARY KEY ("tree_id","date")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "private"."watering_sga" (
    "tree_id" text NOT NULL,
    "amount_liters" float4,
    "date" date NOT NULL,
    PRIMARY KEY ("tree_id","date")
);

CREATE TABLE "public"."trees" (
    "id" text NOT NULL UNIQUE,
    "standortnr" text,
    "kennzeich" text,
    "namenr" text,
    "art_dtsch" text,
    "art_bot" text,
    "gattung_deutsch" text,
    "gattung" text,
    "strname" text,
    "hausnr" text,
    "pflanzjahr" float4,
    "standalter" float4,
    "stammumfg" float4,
    "baumhoehe" float4,
    "bezirk" text,
    "eigentuemer" text,
    "zusatz" text,
    "kronedurch" float4,
    "geometry" geometry(Point,4326),
    "lat" float8,
    "lng" float8,
    "created_at" timestamptz,
    "updated_at" timestamptz,
    "street_tree" bool
);

ALTER TABLE "private"."watering_gdk" ADD FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id");

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS forecast_id_seq;

-- Table Definition
CREATE TABLE "public"."forecast" (
    "id" int4 NOT NULL DEFAULT nextval('forecast_id_seq'::regclass),
    "tree_id" text,
    "type_id" int4,
    "timestamp" timestamptz,
    "value" float4,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "model_id" text
);


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS issue_types_id_seq;

-- Table Definition
CREATE TABLE "public"."issue_types" (
    "id" int4 NOT NULL DEFAULT nextval('issue_types_id_seq'::regclass) UNIQUE,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "image_url" text
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS issues_id_seq;

-- Table Definition
CREATE TABLE "public"."issues" (
    "id" int4 NOT NULL DEFAULT nextval('issues_id_seq'::regclass),
    "issue_type_id" int4 NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "tree_id" text NOT NULL
);





-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS nowcast_id_seq;

-- Table Definition
CREATE TABLE "public"."nowcast" (
    "id" int4 NOT NULL DEFAULT nextval('nowcast_id_seq'::regclass),
    "tree_id" text,
    "type_id" int4,
    "timestamp" timestamptz,
    "value" float4,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "model_id" text
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."radolan" (
    "tile_id" int8 NOT NULL,
    "date" date NOT NULL,
    "rainfall_mm" float4,
    "rainfall_max_mm" float4
);



-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."radolan_tiles" (
    "id" int8 NOT NULL UNIQUE,
    "geometry" geometry(Polygon,4326)
);



-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sensor_types_id_seq;

-- Table Definition
CREATE TABLE "public"."sensor_types" (
    "id" int4 NOT NULL DEFAULT nextval('sensor_types_id_seq'::regclass) UNIQUE,
    "name" text NOT NULL
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."shading" (
    "tree_id" text NOT NULL,
    "spring" float4,
    "summer" float4,
    "fall" float4,
    "winter" float4
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."shading_monthly" (
    "tree_id" text NOT NULL,
    "january" float4,
    "february" float4,
    "march" float4,
    "april" float4,
    "may" float4,
    "june" float4,
    "july" float4,
    "august" float4,
    "september" float4,
    "october" float4,
    "november" float4,
    "december" float4
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."soil" (
    "id" text NOT NULL,
    "schl5" int8,
    "nutz" float4,
    "nutz_bez" text,
    "vgradstufe" float4,
    "vgradstufe_bez" text,
    "boges_neu5" float4,
    "btyp" text,
    "bg_alt" text,
    "nutzgenese" text,
    "ausgangsm" text,
    "geomeinh" float4,
    "geomeinh_bez" text,
    "aus_bg" float4,
    "aus_bg_bez" text,
    "antro_bg" float4,
    "antro_bg_bez" text,
    "torf_bg" float4,
    "torf_bg_bez" text,
    "torf_klas" float4,
    "flur" float4,
    "flurstufe" float4,
    "flurstufe_bez" text,
    "flurklasse" float4,
    "flurklasse_bez" text,
    "bnbg_ob_h" text,
    "bnbg_ob_h_bez" text,
    "bnbg_ub_h" text,
    "bnbg_ub_h_bez" text,
    "bnbg_ob" text,
    "bngb_ob_bez" text,
    "bnbg_ub" text,
    "bnbg_ub_bez" text,
    "bart_gr" float4,
    "sg_ob" text,
    "sg_ob_bez" text,
    "sg_ub" text,
    "sg_ub_bez" text,
    "sg_klas" float4,
    "sg_klas_bez" text,
    "btyp_ka3" text,
    "btyp_ka3_bez" text,
    "btyp_ka4" text,
    "btyp_ka4_bez" text,
    "bform_ka5" text,
    "bform_ka5_bez" text,
    "torf_ob" text,
    "torf_ob_bez" text,
    "torf_klas_bez" text,
    "torf_ub" text,
    "torf_ub_bez" text,
    "geometry" geometry(MultiPolygon,4326),
    "created_at" timestamptz,
    "updated_at" timestamptz
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."spatial_ref_sys" (
    "srid" int4 NOT NULL,
    "auth_name" varchar(256),
    "auth_srid" int4,
    "srtext" varchar(2048),
    "proj4text" varchar(2048)
);



-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition





-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."weather" (
    "stations_id" int8 NOT NULL,
    "date" date NOT NULL,
    "qn_3" int8,
    "wind_max_ms" float4,
    "wind_avg_ms" float4,
    "qn_4" int8,
    "rainfall_mm" float4,
    "rskf" int8,
    "sdk" float4,
    "shk_tag" int8,
    "nm" int8,
    "vpm" float4,
    "pm" float4,
    "temp_avg_c" float4,
    "upm" float4,
    "temp_max_c" float4,
    "tnk" float4,
    "tgk" float4
);



-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."weather_stations" (
    "id" int8 NOT NULL UNIQUE,
    "von_datum" date,
    "bis_datum" date,
    "stationshoehe" int8,
    "lat" float8,
    "lon" float8,
    "stationsname" text,
    "bundesland" text,
    "geometry" geometry(Point,4326)
);

ALTER TABLE "public"."forecast" ADD FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id");
ALTER TABLE "public"."forecast" ADD FOREIGN KEY ("type_id") REFERENCES "public"."sensor_types"("id");

CREATE VIEW "public"."geography_columns" AS  SELECT current_database() AS f_table_catalog,
    n.nspname AS f_table_schema,
    c.relname AS f_table_name,
    a.attname AS f_geography_column,
    postgis_typmod_dims(a.atttypmod) AS coord_dimension,
    postgis_typmod_srid(a.atttypmod) AS srid,
    postgis_typmod_type(a.atttypmod) AS type
   FROM pg_class c,
    pg_attribute a,
    pg_type t,
    pg_namespace n
  WHERE t.typname = 'geography'::name AND a.attisdropped = false AND a.atttypid = t.oid AND a.attrelid = c.oid AND c.relnamespace = n.oid AND (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text);

CREATE VIEW "public"."geometry_columns" AS  SELECT current_database()::character varying(256) AS f_table_catalog,
    n.nspname AS f_table_schema,
    c.relname AS f_table_name,
    a.attname AS f_geometry_column,
    COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension,
    COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid,
    replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type
   FROM pg_class c
     JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped
     JOIN pg_namespace n ON c.relnamespace = n.oid
     JOIN pg_type t ON a.atttypid = t.oid
     LEFT JOIN ( SELECT s.connamespace,
            s.conrelid,
            s.conkey,
            replace(split_part(s.consrc, ''''::text, 2), ')'::text, ''::text) AS type
           FROM ( SELECT pg_constraint.connamespace,
                    pg_constraint.conrelid,
                    pg_constraint.conkey,
                    pg_get_constraintdef(pg_constraint.oid) AS consrc
                   FROM pg_constraint) s
          WHERE s.consrc ~~* '%geometrytype(% = %'::text) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY (st.conkey))
     LEFT JOIN ( SELECT s.connamespace,
            s.conrelid,
            s.conkey,
            replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text)::integer AS ndims
           FROM ( SELECT pg_constraint.connamespace,
                    pg_constraint.conrelid,
                    pg_constraint.conkey,
                    pg_get_constraintdef(pg_constraint.oid) AS consrc
                   FROM pg_constraint) s
          WHERE s.consrc ~~* '%ndims(% = %'::text) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY (sn.conkey))
     LEFT JOIN ( SELECT s.connamespace,
            s.conrelid,
            s.conkey,
            replace(replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text), '('::text, ''::text)::integer AS srid
           FROM ( SELECT pg_constraint.connamespace,
                    pg_constraint.conrelid,
                    pg_constraint.conkey,
                    pg_get_constraintdef(pg_constraint.oid) AS consrc
                   FROM pg_constraint) s
          WHERE s.consrc ~~* '%srid(% = %'::text) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY (sr.conkey))
  WHERE (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT c.relname = 'raster_columns'::name AND t.typname = 'geometry'::name AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text);
 
ALTER TABLE "public"."issues" ADD FOREIGN KEY ("issue_type_id") REFERENCES "public"."issue_types"("id");
ALTER TABLE "public"."issues" ADD FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id");

CREATE VIEW "public"."latest_forecast" AS  SELECT DISTINCT ON (nowcast.tree_id, nowcast.type_id) nowcast.id,
    nowcast.tree_id,
    nowcast.type_id,
    nowcast."timestamp",
    nowcast.value,
    nowcast.created_at,
    nowcast.model_id
   FROM nowcast
  ORDER BY nowcast.tree_id, nowcast.type_id, nowcast."timestamp" DESC;

CREATE VIEW "public"."latest_nowcast" AS  SELECT ct.tree_id,
    ct.type_id,
    ct.day1_timestamp,
    ct.day1,
    ct.day2,
    ct.day3,
    ct.day4,
    ct.day5,
    ct.day6,
    ct.day7,
    ct.day8,
    ct.day9,
    ct.day10,
    ct.day11,
    ct.day12,
    ct.day13,
    ct.day14
   FROM crosstab('
    SELECT
        tree_id,
        type_id,
        row_number() OVER (PARTITION BY tree_id, type_id ORDER BY timestamp) AS day,
        value
    FROM public.nowcast
    ORDER BY 1, 2, 3
    '::text, '
    SELECT generate_series(1, 14)
    '::text) ct(tree_id text, type_id integer, day1_timestamp timestamp with time zone, day1 real, day2 real, day3 real, day4 real, day5 real, day6 real, day7 real, day8 real, day9 real, day10 real, day11 real, day12 real, day13 real, day14 real);

ALTER TABLE "public"."nowcast" ADD FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id");
ALTER TABLE "public"."nowcast" ADD FOREIGN KEY ("type_id") REFERENCES "public"."sensor_types"("id");
ALTER TABLE "public"."radolan" ADD FOREIGN KEY ("tile_id") REFERENCES "public"."radolan_tiles"("id");

CREATE MATERIALIZED VIEW "public"."radolan_14d_agg" AS  SELECT radolan.date,
    radolan.tile_id,
    sum(radolan.rainfall_mm) OVER (PARTITION BY radolan.tile_id ORDER BY radolan.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW) AS rainfall_mm_14d_sum
   FROM radolan;

CREATE MATERIALIZED VIEW "public"."tree_radolan_tile" AS  SELECT trees.id AS tree_id,
    tiles.id AS tile_id
   FROM trees trees
     JOIN radolan_tiles tiles ON st_contains(tiles.geometry, trees.geometry);

CREATE MATERIALIZED VIEW "public"."rainfall" AS  SELECT tree_radolan_tile.tree_id,
    tile_rainfall.rainfall_mm_14d_sum AS rainfall_in_mm
   FROM tree_radolan_tile
     JOIN ( SELECT DISTINCT ON (radolan_14d_agg.tile_id) radolan_14d_agg.tile_id,
            radolan_14d_agg.rainfall_mm_14d_sum
           FROM radolan_14d_agg
          ORDER BY radolan_14d_agg.tile_id, radolan_14d_agg.date DESC) tile_rainfall ON tree_radolan_tile.tile_id = tile_rainfall.tile_id;


ALTER TABLE "public"."shading" ADD FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id");
ALTER TABLE "public"."shading_monthly" ADD FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id");

CREATE MATERIALIZED VIEW "public"."vector_tiles" AS  SELECT trees.id AS trees_id,
    trees.standortnr AS trees_standortnr,
    trees.kennzeich AS trees_kennzeich,
    trees.namenr AS trees_namenr,
    trees.art_dtsch AS trees_art_dtsch,
    trees.art_bot AS trees_art_bot,
    trees.gattung_deutsch AS trees_gattung_deutsch,
    trees.gattung AS trees_gattung,
    trees.strname AS trees_strname,
    trees.hausnr AS trees_hausnr,
    trees.pflanzjahr AS trees_pflanzjahr,
    trees.standalter AS trees_standalter,
    trees.stammumfg AS trees_stammumfg,
    trees.baumhoehe AS trees_baumhoehe,
    trees.bezirk AS trees_bezirk,
    trees.eigentuemer AS trees_eigentuemer,
    trees.zusatz AS trees_zusatz,
    trees.kronedurch AS trees_kronedurch,
    trees.geometry AS trees_geometry,
    trees.lat AS trees_lat,
    trees.lng AS trees_lng,
    trees.created_at AS trees_created_at,
    trees.updated_at AS trees_updated_at,
    trees.street_tree AS trees_street_tree,
    trees_private.baumscheibe_m2 AS trees_baumscheibe,
    _nowcast.tree_id AS nowcast_tree_id,
    _nowcast.nowcast_type_30cm,
    _nowcast.nowcast_type_60cm,
    _nowcast.nowcast_type_90cm,
    _nowcast.nowcast_type_stamm,
    _nowcast.nowcast_timestamp_30cm,
    _nowcast.nowcast_timestamp_60cm,
    _nowcast.nowcast_timestamp_90cm,
    _nowcast.nowcast_timestamp_stamm,
    _nowcast.nowcast_values_30cm,
    _nowcast.nowcast_values_60cm,
    _nowcast.nowcast_values_90cm,
    _nowcast.nowcast_values_stamm,
    _nowcast.nowcast_created_at_30cm,
    _nowcast.nowcast_created_at_60cm,
    _nowcast.nowcast_created_at_90cm,
    _nowcast.nowcast_created_at_stamm,
    _nowcast.nowcast_model_id_30cm,
    _nowcast.nowcast_model_id_60cm,
    _nowcast.nowcast_model_id_90cm,
    _nowcast.nowcast_model_id_stamm AS nowcast_model_id_4
   FROM trees
     LEFT JOIN ( SELECT distinct_nowcast.nowcast_tree_id AS tree_id,
            array_agg(DISTINCT distinct_nowcast.forcast_type ORDER BY distinct_nowcast.forcast_type) AS nowcast_types_array,
            (array_agg(distinct_nowcast.sensor_types_id))[1] AS nowcast_type_30cm,
            (array_agg(distinct_nowcast.sensor_types_id))[2] AS nowcast_type_60cm,
            (array_agg(distinct_nowcast.sensor_types_id))[3] AS nowcast_type_90cm,
            (array_agg(distinct_nowcast.sensor_types_id))[4] AS nowcast_type_stamm,
            (array_agg(distinct_nowcast.nowcast_value))[1] AS nowcast_values_30cm,
            (array_agg(distinct_nowcast.nowcast_value))[2] AS nowcast_values_60cm,
            (array_agg(distinct_nowcast.nowcast_value))[3] AS nowcast_values_90cm,
            (array_agg(distinct_nowcast.nowcast_value))[4] AS nowcast_values_stamm,
            (array_agg(distinct_nowcast.nowcast_model_id))[1] AS nowcast_model_id_30cm,
            (array_agg(distinct_nowcast.nowcast_model_id))[2] AS nowcast_model_id_60cm,
            (array_agg(distinct_nowcast.nowcast_model_id))[3] AS nowcast_model_id_90cm,
            (array_agg(distinct_nowcast.nowcast_model_id))[4] AS nowcast_model_id_stamm,
            (array_agg(distinct_nowcast.nowcast_created_at))[1] AS nowcast_created_at_30cm,
            (array_agg(distinct_nowcast.nowcast_created_at))[2] AS nowcast_created_at_60cm,
            (array_agg(distinct_nowcast.nowcast_created_at))[3] AS nowcast_created_at_90cm,
            (array_agg(distinct_nowcast.nowcast_created_at))[4] AS nowcast_created_at_stamm,
            (array_agg(distinct_nowcast.nowcast_timestamp))[1] AS nowcast_timestamp_30cm,
            (array_agg(distinct_nowcast.nowcast_timestamp))[2] AS nowcast_timestamp_60cm,
            (array_agg(distinct_nowcast.nowcast_timestamp))[3] AS nowcast_timestamp_90cm,
            (array_agg(distinct_nowcast.nowcast_timestamp))[4] AS nowcast_timestamp_stamm
           FROM ( SELECT DISTINCT ON (n.tree_id, f.name) n.id AS nowcast_id,
                    n."timestamp" AS nowcast_timestamp,
                    n.tree_id AS nowcast_tree_id,
                    n.value AS nowcast_value,
                    n.created_at AS nowcast_created_at,
                    n.model_id AS nowcast_model_id,
                    f.name AS forcast_type,
                    f.id AS sensor_types_id
                   FROM nowcast n
                     JOIN sensor_types f ON n.type_id = f.id
                  ORDER BY n.tree_id, f.name, n."timestamp" DESC) distinct_nowcast
          GROUP BY distinct_nowcast.nowcast_tree_id) _nowcast ON trees.id = _nowcast.tree_id
     LEFT JOIN private.trees_private trees_private ON trees.id = trees_private.tree_id;

CREATE MATERIALIZED VIEW "public"."watering" AS  SELECT w.tree_id,
    sum(w.amount_liters) AS sum,
    w.date
   FROM ( SELECT watering_gdk.tree_id,
            watering_gdk.amount_liters,
            watering_gdk.date
           FROM private.watering_gdk
        UNION ALL
         SELECT watering_sga.tree_id,
            watering_sga.amount_liters,
            watering_sga.date
           FROM private.watering_sga) w
  WHERE w.date >= (now()::date - '2 mons'::interval)
  GROUP BY w.tree_id, w.date;

ALTER TABLE "public"."weather" ADD FOREIGN KEY ("stations_id") REFERENCES "public"."weather_stations"("id");

CREATE MATERIALIZED VIEW "public"."weather_14d_agg" AS  SELECT weather.date,
    sum(weather.rainfall_mm) OVER (ORDER BY weather.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW) AS rainfall_mm_14d_sum,
    avg(weather.temp_avg_c) OVER (ORDER BY weather.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW) AS temp_avg_c_14d_avg,
    avg(weather.wind_avg_ms) OVER (ORDER BY weather.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW) AS wind_avg_ms_14d_avg,
    avg(weather.temp_max_c) OVER (ORDER BY weather.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW) AS temp_max_c_14d_avg,
    avg(weather.wind_max_ms) OVER (ORDER BY weather.date ROWS BETWEEN 13 PRECEDING AND CURRENT ROW) AS wind_max_ms_14d_avg
   FROM weather
  WHERE weather.stations_id = 433;

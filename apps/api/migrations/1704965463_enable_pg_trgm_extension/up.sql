CREATE EXTENSION pg_trgm;

CREATE INDEX trgm_idx ON activity USING gin (title gin_trgm_ops);

ALTER TABLE activity ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;

CREATE INDEX ts_idx ON activity USING GIN (ts);

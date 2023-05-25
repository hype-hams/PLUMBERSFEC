-- make the keyspace --
CREATE KEYSPACE products WITH replication =
  {'class': 'SDC_Strategy', 'replication_factor' : 3};

-- create the tables --
CREATE TABLE products.product (
  id VARINT PRIMARY KEY,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price VARINT
);

CREATE TABLE products.feature (
  id VARINT PRIMARY KEY,
  product_id VARINT,
  feature TEXT,
  value TEXT
);

CREATE TABLE products.related (
  id VARINT PRIMARY KEY,
  product_id VARINT,
  related_id VARINT
);

CREATE TABLE products.style (
  id VARINT PRIMARY KEY,
  product_id VARINT,
  name TEXT,
  sale_price VARINT,
  original_price VARINT,
  default_style BOOLEAN,
);

CREATE TABLE products.skus (
  id VARINT PRIMARY KEY,
  style_id VARINT,
  size TEXT,
  quantity VARINT
);

CREATE TABLE products.photo (
  id UUID PRIMARY KEY,
  style_id VARINT,
  url TEXT,
  thumbnail_url TEXT
);

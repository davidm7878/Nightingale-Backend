DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS dislikes CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  email text NOT NULL,
  bio text,
  resume text,
  profile_picture text
);

CREATE TABLE hospitals (
  id serial PRIMARY KEY,
  name text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  State text NOT NULL
);

CREATE TABLE posts (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL
);

CREATE TABLE reviews (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hospital_id integer NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  body text NOT NULL
);

CREATE TABLE ratings (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hospital_id integer NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  rating_value integer NOT NULL
);

CREATE TABLE likes (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE dislikes (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);



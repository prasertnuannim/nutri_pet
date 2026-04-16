SELECT 'CREATE DATABASE authdb'
WHERE NOT EXISTS (
  SELECT
  FROM pg_database
  WHERE datname = 'authdb'
)\gexec

SELECT 'CREATE DATABASE "petDb"'
WHERE NOT EXISTS (
  SELECT
  FROM pg_database
  WHERE datname = 'petDb'
)\gexec

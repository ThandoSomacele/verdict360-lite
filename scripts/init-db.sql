-- Initialize database with required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create database user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'verdict360_user') THEN

      CREATE ROLE verdict360_user LOGIN PASSWORD 'verdict360_password';
   END IF;
END
$do$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE verdict360_dev TO verdict360_user;
GRANT ALL ON SCHEMA public TO verdict360_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO verdict360_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO verdict360_user;
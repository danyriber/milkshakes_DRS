module.exports = ({ env }) => {
  // Usar PostgreSQL en producción, SQLite en desarrollo
  const client = env('DATABASE_CLIENT', 'sqlite');
  
  if (client === 'postgres') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false),
        },
        debug: false,
      },
    };
  }

  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env.path('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};

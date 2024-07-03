// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // URL local para desarrollo
};

// environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'http://grumpi-store-server.es/', // URL de producción en Heroku
};

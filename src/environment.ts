// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // URL local para desarrollo
};

// environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://grumpi-store-server-0d0ef9d7a378.herokuapp.com', // URL de producción en Heroku
};

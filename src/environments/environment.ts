// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // URL local para desarrollo
};

// environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://grumpi-app-server-6bfd34c5eb89.herokuapp.com/', // URL de producción en Heroku
};

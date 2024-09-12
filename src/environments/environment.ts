// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001', // URL local para desarrollo
};

// environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://grumpistoreserver.onrender.com/', // URL de producción en Heroku
};

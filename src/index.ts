import express from 'express';
import fs from 'fs';
import path from 'path';
import { CustomRoute } from './types';

const app = express();

// Define the folder containing your route files
const routesFolder = path.join(__dirname, 'routes');

// Read all files in the routes folder
fs.readdirSync(routesFolder).forEach((file) => {
  const filePath = path.join(routesFolder, file);

  // Import the default export from each file
  const routeModule : CustomRoute = require(filePath).default;
  const { path: routePath, router } = routeModule;
  console.log(`Loaded router for ${routePath}`);

  // Set up the route using app.use
  app.use(routePath, router);
});

// Start your Express.js server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at  http://localhost:${port}`);
});

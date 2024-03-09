const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

import { CustomRoute } from './types';

require('dotenv').config()

var app = express()

app.use(cors({
  origin: 'null',
  methods: ['OPTIONS'],
}));

// Define the folder containing your route files
const routesFolder = path.join(__dirname, 'routes');

// Read all files in the routes folder
fs.readdirSync(routesFolder).forEach((file: any) => {
  const filePath = path.join(routesFolder, file);

  // Import the default export from each file
  const routeModule : CustomRoute = require(filePath).default;
  const { path: routePath, router } = routeModule;
  console.log(`Loaded router for ${routePath}`);

  // Set up the route using app.use
  app.use(routePath, router);
});

app.use(express.json());

// Start your Express.js server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at  http://localhost:${port}`);
});

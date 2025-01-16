import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
// Import the ApolloServer class
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';
import {authenticateToken} from './services/auth.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const app = express();
const PORT = process.env.PORT || 3001;

const startApolloServer = async () => {
  await server.start();
    
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

 
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  )); 

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));


    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
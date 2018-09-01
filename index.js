import { ApolloServer, gql } from 'apollo-server';
import resolvers from './resolvers.js'
import { importSchema } from 'graphql-import';
import jwt from 'jsonwebtoken';
import * as Mutation from './resolver/mutations.js';
import * as Query from './resolver/queries.js';

const typeDefs = importSchema('schema.graphql');
const resolvers = { Query, Mutation };
const context = async ({ req, res, connection }) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return null;
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers, context });
server.listen().then(({ url }) => {
  console.log(`🚀  Taking off at ${url} 😱😍`);
});
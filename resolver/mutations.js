import { ApolloError, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import * as userDAO from './daos/user_dao.js';

const SALT_FACTOR = 10;
/**
 * {firstName, lastName, email, username, password} args
 * 
 * @returns type Token {user: type User, token: String}
 */
export const signup = async (parent, args) => {
  const { firstName, lastName, email, username, password } = args;
  const hashedPassword = bcrypt.hashSync(password, SALT_FACTOR);
  const user = await userDAO.signup(firstName, lastName, email, username, hashedPassword);
  if (user) {
    return { user, token: jwt.sign({ user }, process.env.JWT_SECRET) };
  } else {
    throw new ApolloError('Failed to signup', 'SignupFail');
  }
}

export const deactivateUser = async (parent, { id }) => {
  return await userDAO.deactivate(id);
}
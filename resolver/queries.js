import { ApolloError, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

import * as userDAO from './daos/user_dao.js';

/**
 * {username} args
 * 
 * @returns type User
 */
export const user = async (parent, { username }) => {
  const user = await userDAO.getByUsername(username, false);
  return user ? user : new ApolloError(`${username} not found`, 'User_Not_Found')
}

/**
 * {username, password} args
 * 
 * @returns type Token {user: type User, token: String}
 */
export const login = async (parent, { username, password }) => {
  const user = await userDAO.getByUsername(username, true);
  if (user && bcrypt.compareSync(password, user.password)) {
    delete user.password;
    return { user, token: jwt.sign({ user }, process.env.JWT_SECRET) };
  } else {
    throw new UserInputError('Form Arguments invalid', {
      invalidArgs: Object.keys({ username, password }),
    })
  }
}

/**
 * {username, password} args
 * 
 * @returns type Boolean!
 */
export const userExists = async (parent, { username, email }) => {
  try {
    return userDAO.userExists(username, email);
  } catch (e) {
    throw new ApolloError(`Search failed`, 'Search_Failed');
  }
}
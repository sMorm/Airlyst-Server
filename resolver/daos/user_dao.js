import db from './db.js';

export const getByUsername = (username, getPassword = false) => {
  const sql = `
    SELECT id,
           first_name AS "firstName",
           last_name AS "lastName",
           email,
           username,
           created_at AS "createdAt"
           ${getPassword ? ',password' : ''}
    FROM users
    WHERE username = $1
  `;
  return db.query(sql, [username])
    .then(res => res.rows.find(f => f))
    .catch(e => false);
}

export const signup = (firstName, lastName, email, username, password) => {
  const sql = `
    INSERT INTO users(first_name, last_name, email, username, password)
    VALUES      ($1, $2, $3, $4, $5)
    RETURNING   id,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                username,
                created_at AS "createdAt"
  `;
  const bindValues = [firstName, lastName, email, username, password];
  return db.query(sql, bindValues)
    .then(res => res.rows.find(f => f))
    .catch(e => false);
}

export const deactivate = async id => {
  const sql = `DELETE FROM users WHERE id = $1`;
  return db.query(sql, [id])
    .then(() => true)
    .catch(() => false);
}

export const userExists = (username = null, email = null) => {
  const sql = `
    SELECT 1
    FROM   users
    WHERE  ${username ? 'username' : 'email'} = $1
  `;
  const queryString = username ? username : email;
  return db.query(sql, [queryString])
    .then(({ rowCount }) => rowCount > 0)
    .catch(e => e);
}


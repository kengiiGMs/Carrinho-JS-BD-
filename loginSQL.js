const connection = require('./connection');
const util = require('util');
const queryAsync = util.promisify(connection.query).bind(connection);


async function get(emailUsuario, senhaUsuario) {
  const query = 'SELECT idUsuario FROM usuario WHERE emailUsuario = ? AND senhaUsuario = ?';
  dados = [emailUsuario, senhaUsuario];

  try {
    const results = await queryAsync(query, dados);
    return results;
  } catch (error) {
    console.error('Erro ao obter usuario: ', error);
    throw error;
  }
}

function add(name, email, password, callback) {
  const sql = 'INSERT INTO usuario(nomeUsuario, emailUsuario, senhaUsuario) VALUES (?, ?,?)';
  connection.query(sql, [name, email, password], (error, results, fields) => {
    if (error) {
      console.error('303 - Erro ao cadastrar usuario', error);
      callback(error, null);
      return;
    }
    console.log('usuario cadastrado');
    callback(null, results);
  });
}

module.exports = {
  get, add
};
const connection = require('./connection');
const util = require('util');
const queryAsync = util.promisify(connection.query).bind(connection);


async function get(emailUsuario, senhaUsuario) {
  const query = 'SELECT * FROM usuario WHERE emailUsuario = ? AND senhaUsuario = ?';
  dados = [emailUsuario, senhaUsuario];

  try {
    const results = await queryAsync(query, dados);
    return results;
  } catch (error) {
    console.error('Erro ao obter usuario: ', error);
    throw error;
  }
}

function add(quantity, mangaId, userId, callback) {
  const sql = 'INSERT INTO carrinho(idManga, idUsuario, quantidadeCarrinho) VALUES (?, ?,?)';
  connection.query(sql, [mangaId, userId, quantity], (error, results, fields) => {
    if (error) {
      console.error('303 - Erro ao Adicionar Mangá ao Carrinho', error);
      callback(error, null);
      return;
    }
    console.log('Manga cadastrado com sucesso');
    callback(null, results);
  });
}

module.exports = {
  get, add
};
const connection = require('./connection');

function cadastrarUsuario(usuario) {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO usuario (nomeUsuario, emailUsuario, senhaUsuario) VALUES (?, ?, ?)";
      connection.query(sql, usuario, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  
  function buscarUsuarioPorEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM usuario WHERE emailUsuario = ?';
      connection.query(sql, [email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });
  }
  
  module.exports = {
    cadastrarUsuario,
    buscarUsuarioPorEmail
  };
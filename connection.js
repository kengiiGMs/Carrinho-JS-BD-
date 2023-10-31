const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "carrinho"
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ', err);
        return;
    }
    console.log('Conexão ao banco de dados estabelecida.');
});

module.exports = connection;

/* Erro 301 - Erro na Pagina Web
   Erro 302 - Erro no Express
   Erro 303 - Erro no Banco de Dados
*/
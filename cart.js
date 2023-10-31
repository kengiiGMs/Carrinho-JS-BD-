const connection = require('./connection');

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

function get(userId, callback) {
    const query = 'SELECT c.idCarrinho, m.nomeManga, m.valorManga, c.quantidadeCarrinho FROM carrinho c INNER JOIN Manga m ON m.idManga = c.idManga WHERE c.idUsuario = ?';

    connection.query(query, userId, (error, results, fields) => {
        if (error) {
            console.error('Erro ao obter a lista de mangas: ', error);
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

function del(cartId, callback) {
    const sql = 'DELETE FROM carrinho WHERE idCarrinho = ?';
    connection.query(sql, cartId, (error, results, fields) => {
        if (error) {
            console.error('303 - Erro ao Remover Mangá ao Carrinho', error);
            callback(error, null);
            return;
        }
        console.log('Manga Removido com sucesso');
        callback(null, results);
    });
}


module.exports = {
    add, get, del
};

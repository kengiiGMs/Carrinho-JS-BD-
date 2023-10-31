const connection = require('./connection');

function add(quantity, mangaId, userId, callback) {
    const sql = 'INSERT INTO carrinho(idManga, idUsuario, quantidadeCarrinho) VALUES (?, ?,?)';
    connection.query(sql, [mangaId, userId, quantity], (error, results, fields) => {
        if (error) {
            console.error('303 - Erro ao Adicionar Mangá ao Carrinho', error);
            callback(error, null);
            return;
        }
        console.log('Manga cadastrado com sucesso BD');
        callback(null, results);
    });
}

module.exports = {
    add
};

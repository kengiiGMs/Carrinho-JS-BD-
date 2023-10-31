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

function get(req, res) {
    const query = 'SELECT c.idCarrinho, m.nomeManga, m.valorManga, c.quantidadeCarrinho FROM carrinho c INNER JOIN Manga m ON m.idManga = c.idManga';

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('303 - Erro ao obter a lista de mangas: ', error);
            res.status(500).json({ error: '303 - Erro ao obter a lista de mangas.' });
        } else {
            res.json(results);
        }
    });
}



module.exports = {
    add, get
};

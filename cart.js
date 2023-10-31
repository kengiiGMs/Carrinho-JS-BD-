const connection = require('./connection');
const util = require('util');
const queryAsync = util.promisify(connection.query).bind(connection);


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

async function get(userId) {
    const query = 'SELECT c.idCarrinho, m.nomeManga, m.valorManga, c.quantidadeCarrinho, c.idManga FROM carrinho c INNER JOIN Manga m ON m.idManga = c.idManga WHERE c.idUsuario = ?';

    try {
        const results = await queryAsync(query, userId);
        return results;
    } catch (error) {
        console.error('Erro ao obter a lista de mangas: ', error);
        throw error;
    }
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

/* Async e Promise para conseguri manipular o resultado gerado que é o id do pedido em outras estrutura de codigo*/
async function createOrder(userId) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO pedido(idUsuario) VALUES (?)';
        connection.query(sql, userId, (error, results, fields) => {
            if (error) {
                console.error('Erro ao gerar Pedido', error);
                reject(error);
            } else {
                console.log('Pedido Gerado');
                resolve(results.insertId);
            }
        });
    });
}

async function createOrderItens(cart, orderId) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < cart.length; i++) {
            let sql = "INSERT INTO itensPedido (idPedido,idManga,quantidade) VALUES (?, ? ,?) ";

            let data = [orderId, cart[i].idManga, cart[i].quantidadeCarrinho];
            connection.query(sql, data, function (error, results, fields) {
                if (error) {
                    console.error('303 - Erro ao gerar itens do Pedido', error);
                    reject(error);
                } else {
                    console.log('Itens do Pedido Gerado');
                    resolve(results.insertId);
                }
            });
        }
    });
}

function delAll(userId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM carrinho WHERE idUsuario = ?';
        connection.query(sql, userId, (error, results, fields) => {
            if (error) {
                console.error('303 - Erro ao Remover Todos os Mangás do Carrinho', error);
                reject(error);
            } else {
                console.log('Itens do Carrinho removidos');
                resolve(results.affectedRows);
            }
        });
    });
}






module.exports = {
    add, get, del, createOrder, createOrderItens, delAll
};

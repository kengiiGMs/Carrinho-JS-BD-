const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "carrinho"
});

function abrirConexao() {
    if (!connection || connection.state === 'disconnected') {
        console.log('Abrindo conexão...');
        connection.connect();
        console.log('Conexão aberta.');
    }
}

function switchName(nomeManga) {
    if (nomeManga == 'OnePiece') {
        return 1;
    } else if (nomeManga == 'Kimetsu') {
        return 2;
    } else if (nomeManga == 'Jujutsu') {
        return 3;
    }
}

const add = function add(quantidadeCarrinho, nomeManga) {
    abrirConexao();
    let sql = "INSERT INTO carrinho (idManga,idUsuario,quantidadeCarrinho) VALUES (?, ? ,?) ";
    let idManga = switchName(nomeManga);
    let idUsuario = 1;

    let dados = [idManga, idUsuario, quantidadeCarrinho];
    connection.query(sql, dados, function (error, results, fields) {
        if (error) {
            console.error("Erro ao executar a consulta:", error);

        } else {
            console.log("Produto do Carrinho Cadastrado no Banco com Sucesso!", results.insertId);
        }
    });

}

const getCarrinho = function (callback) {
    abrirConexao();
    let sql = "SELECT c.idCarrinho, m.nomeManga, m.valorManga, c.quantidadeCarrinho FROM carrinho c INNER JOIN Manga m ON m.idManga = c.idManga WHERE idUsuario = 1";
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error("Erro ao executar a consulta:", error);
            callback(error, null); // Passar o erro para o callback
        } else {
            console.log("Consulta no Banco Realizado com Sucesso!");
            callback(null, results); // Passar os resultados para o callback
        }
    })
}


const getCarrinhoFinalValue = function (callback) {
    abrirConexao();
    let sql = "SELECT c.idUsuario, IFNULL(SUM(m.valorManga * c.quantidadeCarrinho),0) as valorTotalCarrinho FROM carrinho c JOIN manga m ON c.idManga = m.idManga WHERE c.idUsuario = 1 GROUP BY c.idUsuario"
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error("Erro ao executar a consulta:", error);
            callback(error, null); // Passar o erro para o callback
        } else {
            console.log("Consulta no Banco Realizado com Sucesso!");
            callback(null, results); // Passar os resultados para o callback
        }
    })
}



const deleteItem = function add(idCarrinho) {
    abrirConexao();
    let sql = "DELETE FROM carrinho where idCarrinho = ?";
    connection.query(sql, idCarrinho, function (error, results, fields) {
        if (error) {
            console.error("Erro ao executar a exclusão:", error);

        } else {
            console.log("Produto do Carrinho Deletetado do Banco com Sucesso!", results.insertId);
        }
    });

}


exports.add = add;
exports.getCarrinho = getCarrinho;
exports.deleteItem = deleteItem;
exports.getCarrinhoFinalValue = getCarrinhoFinalValue;
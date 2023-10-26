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
            callback(error, null);
        } else {
            console.log("Consulta no Banco Realizado com Sucesso!");
            callback(null, results);
        }
    })
}

const getCarrinhoId = function (idUsuario) {
    return new Promise((resolve, reject) => {
        abrirConexao();
        let sql = "SELECT idManga, quantidadeCarrinho FROM carrinho WHERE idUsuario = ?";
        connection.query(sql, idUsuario, function (error, results, fields) {
            if (error) {
                console.error("Erro ao executar a consulta:", error);
                reject(error);
            } else {
                console.log("Consulta no Banco Realizado com Sucesso!");
                resolve(results);
            }
        });
    });
}

const getCarrinhoFinalValue = function (callback) {
    abrirConexao();
    let sql = "SELECT c.idUsuario, IFNULL(SUM(m.valorManga * c.quantidadeCarrinho),0) as valorTotalCarrinho FROM carrinho c JOIN manga m ON c.idManga = m.idManga WHERE c.idUsuario = 1 GROUP BY c.idUsuario"
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error("Erro ao executar a consulta:", error);
            callback(error, null);
        } else {
            console.log("Consulta no Banco Realizado com Sucesso!");
            callback(null, results);
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

const createOrder = function createOrder(idUsuario) {
    return new Promise((resolve, reject) => {
        abrirConexao();
        let sql = "INSERT INTO pedido(idUsuario,status) VALUES (?,?)";
        let dados = [idUsuario, 'A'];
        connection.query(sql, dados, function (error, results, fields) {
            if (error) {
                console.error("Erro ao executar a consulta:", error);
                reject(error);
            } else {
                console.log("Pedido gerado no Banco com Sucesso!");
                resolve(results.insertId);
            }
        });
    });
}

const createItemOrder = function createOrder(carrinho, order, idUsuario) {
    abrirConexao();
    for (let i = 0; i < carrinho.length; i++) {
        let sql = "INSERT INTO itensPedido (idPedido,idManga,quantidade) VALUES (?, ? ,?) ";

        let dados = [order, carrinho[i].idManga, carrinho[i].quantidadeCarrinho];
        connection.query(sql, dados, function (error, results, fields) {
            if (error) {
                console.error("Erro ao executar o cadastro:", i, error);

            } else {
                console.log("Item do Pedido Cadastrado no Banco com Sucesso!", results.insertId);
            }
        });
    }
}

const deleteCarrinhoIdUsuario = function add(idUsuario) {
    abrirConexao();
    let sql = "DELETE FROM carrinho where idUsuario = ?";
    connection.query(sql, idUsuario, function (error, results, fields) {
        if (error) {
            console.error("Erro ao executar a exclusão:", error);

        } else {
            console.log("Produto do Carrinho Deletetado do Banco com Sucesso!", results.insertId);
        }
    });
}

const getOrderById = function (callback) {
    abrirConexao();
    let sql = "SELECT m.nomeManga, m.valorManga, i.quantidade, i.idPedido, p.dataPedido FROM itensPedido i INNER JOIN manga m  ON i.idManga = m.idManga INNER JOIN pedido p ON i.idPedido = p.idPedido WHERE p.idUsuario = 1";
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error("Erro ao executar a consulta:", error);
            callback(error, null);
        } else {
            console.log("Consulta no Banco Realizado com Sucesso!");
            callback(null, results);
        }
    })
}

exports.add = add;
exports.getCarrinho = getCarrinho;
exports.deleteItem = deleteItem;
exports.getCarrinhoFinalValue = getCarrinhoFinalValue;
exports.getCarrinhoId = getCarrinhoId;
exports.createOrder = createOrder;
exports.createItemOrder = createItemOrder;
exports.deleteCarrinhoIdUsuario = deleteCarrinhoIdUsuario;
exports.getOrderById = getOrderById;
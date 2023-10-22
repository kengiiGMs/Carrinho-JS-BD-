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
    console.log(nomeManga);
    let idManga = switchName(nomeManga);
    console.log(idManga);
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
    let sql = "SELECT c.idCarrinho, m.nomeManga, c.quantidadeCarrinho FROM carrinho c INNER JOIN Manga m ON m.idManga = c.idManga WHERE idUsuario = 1";
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



exports.add = add;
exports.getCarrinho = getCarrinho;
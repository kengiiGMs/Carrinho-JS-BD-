const express = require("express");
const path = require('path');
const app = express();
const con = require('./connection.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile('/index.html', { root: __dirname });
})

app.get("/mangas", function (req, res) {
    res.sendFile('/mangas_loja.html', { root: __dirname });
})

app.get("/manga", function (req, res) {
    res.sendFile('/manga_produto.html', { root: __dirname });
})

app.get("/pedidos", function (req, res) {
    res.sendFile('/pedidos.html', { root: __dirname });
})

app.post('/carrinho/add', (req, res) => {
    const { quantidadeCarrinho, nomeManga } = req.body;
    con.add(quantidadeCarrinho, nomeManga);
    res.redirect('/manga');
});

app.get('/carrinho/get', (req, res) => {
    con.getCarrinho((err, resultados) => {
        if (err) {
            console.error(err);
        } else {
            res.json(resultados);
        }
    });
});

app.get('/carrinho/get/finalValue', (req, res) => {
    con.getCarrinhoFinalValue((err, resultados) => {
        if (err) {
            console.error(err);
        } else {
            res.json(resultados);
        }
    });
});

app.delete('/carrinho/delete/:id', (req, res) => {
    const idCarrinho = req.params.id;
    con.deleteItem(idCarrinho);
    res.sendStatus(200);
});

app.post('/createOrder/:id', async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const order = await con.createOrder(idUsuario);
        const carrinho = await con.getCarrinhoId(idUsuario);
        const gerarItemPedido = await con.createItemOrder(carrinho, order, idUsuario);
        const deleteCarrinhoIdUsuario = await con.deleteCarrinhoIdUsuario(idUsuario);
        res.redirect('/manga');

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar pedido.');
    }
});

let server = app.listen(8081, function () {

    let host = server.address().address;
    let port = server.address().port;
    console.log("Servidor funcionando", host, port);

})
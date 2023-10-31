const express = require("express");
const path = require('path');
const app = express();
const cart = require('./cart');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile('/index.html', { root: __dirname });
})

app.get("/mangas", function (req, res) {
    res.sendFile('/mangas.html', { root: __dirname });
})

app.get("/mangas/onepiece", function (req, res) {
    res.sendFile('/mangas_onePiece.html', { root: __dirname });
})

app.get("/orders", function (req, res) {
    res.sendFile('/pedidos.html', { root: __dirname });
})

app.post('/cart/add', (req, res) => {
    const { quantity, mangaId, userId } = req.body;
    cart.add(quantity, mangaId, userId, (error, results) => {
        if (error) {
            res.status(500).send('302 - Erro ao Adicionar Mangá ao Carrinho');
            return;
        }
        res.status(200).send('Mangá cadastrada com sucesso no Carrinho');
    });
});


let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Servidor funcionando", host, port);
})

module.exports = app;
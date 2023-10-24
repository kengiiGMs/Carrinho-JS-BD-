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

app.delete('/carrinho/delete/:id', (req, res) => {
    const idCarrinho = req.params.id;
    console.log(idCarrinho);
    con.deleteItem(idCarrinho);
    res.sendStatus(200);
});


let server = app.listen(8081, function () {

    let host = server.address().address;
    let port = server.address().port;
    console.log("Servidor funcionando", host, port);

})
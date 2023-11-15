const express = require("express");
const path = require('path');
const app = express();
const cart = require('./cartSQL');
const login = require('./loginSQL');
const e = require("express");
const { error } = require("console");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile('/index.html', { root: __dirname });
})

app.get("/mangas", function (req, res) {
    res.sendFile('/pages/mangas.html', { root: __dirname });
})

app.get("/mangas/onepiece", function (req, res) {
    res.sendFile('/pages/mangas_onePiece.html', { root: __dirname });
})

app.get("/mangas/kimetsu", function (req, res) {
    res.sendFile('/pages/mangas_kimetsu.html', { root: __dirname });
})

app.get("/mangas/jujutsu", function (req, res) {
    res.sendFile('/pages/mangas_jujutsu.html', { root: __dirname });
})

app.get("/orders", function (req, res) {
    res.sendFile('/pages/pedidos.html', { root: __dirname });
})

app.get("/login", function (req, res) {
    res.sendFile('pages/login.html', { root: __dirname });
})

app.get("/login/create", function (req, res) {
    res.sendFile('pages/login_create.html', { root: __dirname });
})

app.post('/login/action/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        loginItem = await login.get(email, password);
        res.json(loginItem);

    } catch (error) {
        console.error('Erro no login: ', error);
        res.status(500).send('302 - Erro interno no servidor');
    }
});

app.post("/login/action/signup", async (req, res) => {
    const { name, email, password } = req.body;
    login.add(name, email, password, (error, results)=>{
        if(error){
        console.error('Erro no cadastro: ', error.message);
        res.status(500).send('302 - Erro interno no servidor');
        }
        res.redirect("/");
    })
});

app.post('/cart/add', (req, res) => {
    const { quantity, mangaId, userId } = req.body;
    cart.add(quantity, mangaId, userId, (error, results) => {
        if (error) {
            res.status(500).send('302 - Erro ao Adicionar Mangá ao Carrinho');
            return;
        }
        res.status(200).send('Mangá cadastrado com sucesso no Carrinho');
    });
});

app.post('/cart/get', async (req, res) => {
    const { userId } = req.body;
    let cartItens;
    try {
        cartItens = await cart.get(userId);
        res.json(cartItens);
    } catch (error) {
        console.error('Erro ao obter a lista de mangas: ', error);
        res.status(500).json({ error: 'Erro ao obter a lista de mangas.' });
    }
});

app.delete('/cart/del/:cartId', (req, res) => {
    const cartId = req.params.cartId;
    console.log(cartId);
    cart.del(cartId, (error, results) => {
        if (error) {
            res.status(500).send('302 - Erro ao Excluir Mangá ao Carrinho');
            return;
        }
        res.status(200).send('Mangá excluido com sucesso do Carrinho');
    });

});

app.post('/cart/finish', async (req, res) => {
    const { userId } = req.body;
    let orderId;
    let cartItems;

    try {
        orderId = await cart.createOrder(userId);
        cartItems = await cart.get(userId);
        await cart.createOrderItens(cartItems, orderId);
        await cart.delAll(userId);

        res.status(200).send('Pedido gerado com sucesso do carrinho.');
    } catch (error) {
        console.error('Erro ao finalizar o pedido:', error);
        res.status(500).send('302 - Erro ao finalizar o pedido.');
    }

});

app.post("/itensOrders/get", async function (req, res) {
    const userId = req.query.userId;
    let orderItens;
    try {
        orderItens = await cart.getItensOrders(userId);
        res.json(orderItens);
    } catch (error) {
        console.error('Erro ao obter a lista de itens dos Pedidos: ', error);
        res.status(500).json({ error: '302 - Erro ao obter a lista de mangas.' });
    }
})

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Servidor funcionando", host, port);
})

module.exports = app;
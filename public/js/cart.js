/* Manipulando o Carrinho */
const cart = document.getElementById('cartContainer');

/* Exibindo Mangás no Carrinho */
async function loadCart() {
    const userId = 1;

    try {
        const response = await fetch('/cart/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            const mangas = await response.json();
            cart.innerHTML = '';

            if (mangas.length == 0) {
                const message = document.createElement('div');
                message.textContent = "Você não possui nenhum Mangá no Carrinho !";
                cart.appendChild(message);
            } else {
                const fragment = document.createDocumentFragment();

                mangas.forEach(manga => {
                    const cartItem = createCartItemElement(manga);
                    fragment.appendChild(cartItem);
                });

                cart.appendChild(fragment);

                const closeOrderButton = document.createElement('button');

                closeOrderButton.textContent = 'Fechar Pedido';
                closeOrderButton.className = 'btn btn-success'
                closeOrderButton.addEventListener('click', async function (event) {
                    try {
                        const response = await fetch('/cart/finish', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userId })
                        });
                        if (response.ok) {
                            alert("Pedido Gerado, Verifique-o na sua Página de Pedidos")
                            loadCart();
                        } else {
                            console.error('301 - Erro ao gerar Pedido.');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                });

                const divCenter = document.createElement('div');
                divCenter.className = 'd-grid gap-2 mt-2';

                divCenter.appendChild(closeOrderButton);
                cart.appendChild(divCenter);
            }
        } else {
            console.error('301 - Erro ao obter a lista de mangas.');
        }
    } catch (error) {
        console.error(error);
    }
}

/* Cria uma estrutura individual para cada Mangá disponível no Banco */
function createCartItemElement(manga) {
    const container = document.createElement('div');
    container.className = 'cart-item';

    const mangaInfo = document.createElement('div');
    mangaInfo.className = 'manga-info btn btn-outline btn-purple';
    mangaInfo.textContent = `Mangá: ${manga.nomeManga}, Preço: ${manga.valorManga}, Quantidade: ${manga.quantidadeCarrinho}`;
    const deleteButton = document.createElement('button');

    deleteButton.textContent = 'Deletar';
    deleteButton.className = 'btn btn-outline-danger'
    deleteButton.classList.add('btn-delete');
    deleteButton.dataset.cartId = manga.idCarrinho;

    deleteButton.addEventListener('click', async function (event) {
        const cartId = event.target.dataset.cartId;
        try {
            const response = await fetch(`/cart/del/${cartId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadCart();
            } else {
                console.error('301 - Erro ao excluir mangá do carrinho.');
            }
        } catch (error) {
            console.error(error);
        }
    });

    const divCenter = document.createElement('div');
    divCenter.className = 'd-grid gap-2 mt-2';

    divCenter.appendChild(deleteButton);

    const divider = document.createElement('hr');
    container.appendChild(mangaInfo);
    container.appendChild(divCenter);
    container.appendChild(divider);

    return container;
}


/* Botão para Abrir Carrinho */
const openCartButton = document.getElementById('openCart');
openCartButton.addEventListener('click', loadCart);
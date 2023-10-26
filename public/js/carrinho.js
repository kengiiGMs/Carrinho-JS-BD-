// Função para criar um card de item no carrinho
function createCartItemCard(item) {
    const card = document.createElement('div');
    card.className = 'card mb-3';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const paragraph = document.createElement('p');
    paragraph.className = 'card-text';
    const totalPrice = (item.valorManga * item.quantidadeCarrinho).toFixed(2);
    paragraph.innerHTML = `<b>${item.nomeManga}</b> - ${item.quantidadeCarrinho} Unidades - ${totalPrice}`;
    cardBody.appendChild(paragraph);

    const deleteButton = createDeleteButton(item.idCarrinho);
    cardBody.appendChild(deleteButton);

    card.appendChild(cardBody);

    return card;
}

// Função para criar um botão de exclusão
function createDeleteButton(idCarrinho) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Deletar';

    deleteButton.addEventListener('click', async function () {
        try {
            const response = await fetch(`/carrinho/delete/${idCarrinho}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log(`Item com ID ${idCarrinho} excluído com sucesso.`);
                deleteButton.closest('.card').remove();
                updateTotalPrice();
            } else {
                console.error('Erro ao excluir item do carrinho.');
            }
        } catch (error) {
            console.error(error);
        }
    });

    return deleteButton;
}

// Função para atualizar o valor total do carrinho depois de uma exclusão
function updateTotalPrice() {
    fetch('/carrinho/get/finalValue')
        .then(response => response.json())
        .then(data => {
            let totalPriceElement;
            if (Array.isArray(data) && data.length > 0) {
                totalPriceElement = createTotalPriceElement(data[0].valorTotalCarrinho);
            } else {
                totalPriceElement = createTotalPriceElement(0);
                const elementToRemove = document.querySelector('.btnClosedOrder');
                elementToRemove.remove();
            }

            // Substitui o elemento existente com o novo elemento que contém o valor atualizado
            const existingTotalPriceElement = document.getElementById('totalPriceElement');
            existingTotalPriceElement.parentNode.replaceChild(totalPriceElement, existingTotalPriceElement);
        })
        .catch(error => console.error(error));
}

// Função para criar o botão "Fechar Pedido"
function createCheckoutButton(idUsuario) {
    const checkoutButton = document.createElement('button');
    checkoutButton.className = 'btn btn-outline-success mt-3 btnClosedOrder';
    checkoutButton.type = 'button';
    checkoutButton.textContent = 'Fechar Pedido';
    checkoutButton.style.margin = 'auto';
    checkoutButton.style.display = 'block';

    checkoutButton.addEventListener('click', async function () {
        try {
            const response = await fetch(`/createOrder/${idUsuario}`, {
                method: 'POST'
            });

            if (response.ok) {
                console.log(`Pedido Gerado com Sucesso`);
            } else {
                console.error('Erro ao Gerar o Pedido');
            }
        } catch (error) {
            console.error(error);
        }
    });

    return checkoutButton;
}

// Função para criar o elemento de preço total
function createTotalPriceElement(dataCarrinhoFinalValue) {
    const totalPrice = document.createElement('p');
    totalPrice.id = 'totalPriceElement';
    totalPrice.innerHTML = `Preço Final: <b>${dataCarrinhoFinalValue}</b>`;
    totalPrice.style.margin = '10px';
    totalPrice.style.textAlign = 'center';
    return totalPrice;
}

function createMessage() {
    const message = document.createElement('p');
    message.id = 'message';
    message.innerHTML = `Você não tem nenhum item no seu Carrinho`;
    message.style.margin = '10px';
    message.style.textAlign = 'center';
    return message;
}

// Função principal para carregar os itens do carrinho
async function loadCartItems() {
    try {
        const conteudoCarrinho = document.getElementById('conteudoCarrinho');
        conteudoCarrinho.innerHTML = ''; // Limpando o conteúdo antes de adicionar novos itens
        const response = await fetch('/carrinho/get');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {

            const responseCarrinhoFinalValue = await fetch('/carrinho/get/finalValue');
            const dataCarrinhoFinalValue = await responseCarrinhoFinalValue.json();

            data.forEach(item => {
                const card = createCartItemCard(item);
                conteudoCarrinho.appendChild(card);
            });

            let totalPriceElement;
            if (Array.isArray(dataCarrinhoFinalValue) && dataCarrinhoFinalValue.length > 0) {
                totalPriceElement = createTotalPriceElement(dataCarrinhoFinalValue[0].valorTotalCarrinho);
            } else {
                totalPriceElement = createTotalPriceElement(0);
            }

            const checkoutButton = createCheckoutButton(1);
            conteudoCarrinho.appendChild(checkoutButton);
            conteudoCarrinho.appendChild(totalPriceElement);
        } else {

            conteudoCarrinho.appendChild(createMessage());
        }

    } catch (error) {
        console.error(error);
    }
}

// Carregar os itens do carrinho quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', loadCartItems);
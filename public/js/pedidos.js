// Função para criar um card de item no carrinho
function createCartItemCard(item) {
    const card = document.createElement('div');
    card.className = 'card mb-3';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const paragraph = document.createElement('p');
    paragraph.className = 'card-text';
    const totalPrice = (item.valorManga * item.quantidade).toFixed(2);
    paragraph.innerHTML = `<b>${item.nomeManga}</b> - ${item.quantidade} Unidades - ${totalPrice} <br> ${item.dataPedido}`;

    cardBody.appendChild(paragraph);
    card.appendChild(cardBody);

    return card;
}

//Função para criar a mensagem quando o carrinho está va
function createMessage() {
    const message = document.createElement('p');
    message.id = 'message';
    message.innerHTML = `Você não tem nenhum Pedido`;
    message.style.margin = '10px';
    message.style.textAlign = 'center';
    return message;
}

function createDivider() {
    const divider = document.createElement('hr');
    return divider;
}

// Função principal para carregar os itens do carrinho
async function loadCardOrders() {
    try {
        const containerPedido = document.getElementById('containerPedido');
        containerPedido.innerHTML = ''; // Limpando o conteúdo antes de adicionar novos itens
        const response = await fetch('/order/get');

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {

            data.forEach((item, index) => {
                const card = createCartItemCard(item);
                containerPedido.appendChild(card);
                if (index < data.length - 1 && item.idPedido !== data[index + 1].idPedido) {
                    const hr = createDivider();
                    containerPedido.appendChild(hr);
                }
            });
            containerPedido.appendChild(finalTotal())

        } else {

            containerPedido.appendChild(createMessage());
        }

    } catch (error) {
        console.error(error);
    }
}

// Carregar os itens do carrinho quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', loadCardOrders);
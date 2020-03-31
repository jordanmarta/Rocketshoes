import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete
} from "react-icons/md";

import { formatPrice } from "../../util/format";

import * as CartActions from "../../store/modules/cart/actions";

import { Container, ProductTable, Total } from "./styles";

function Cart({ cart, total, removeFromCart, updateAmountRequest }) {
  function increment(product) {
    updateAmountRequest(product.id, product.amount + 1);
  }

  function decrement(product) {
    updateAmountRequest(product.id, product.amount - 1);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {cart.map(product => (
            <tr>
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>
              </td>
              <td>
                <div>
                  <button type="button" onClick={() => decrement(product)}>
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
                  <input type="number" readOnly value={product.amount} />
                  <button type="button" onClick={() => increment(product)}>
                    <MdAddCircleOutline size={20} color="#7159c1" />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subtotal}</strong>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                >
                  <MdDelete size={20} color="#7159c1" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <h1> {total}</h1>
        </Total>
      </footer>
    </Container>
  );
}

// 1 - tudo que estiver dentro do mapStateToProps eu tenho acesso como propriedade lá em cima...
// 2 - sempre que eu quiser realizar algum cálculo baseado em alguma informação que está dentro do reducer,
// que está dentro do estado do redux, o melhor lugar é dentro do mapStateToPros
const mapStateToProps = state => ({
  cart: state.cart.map(product => ({
    ...product, //copio todos os dados que o produto já tem
    subtotal: formatPrice(product.price * product.amount)
  })),
  total: formatPrice(
    state.cart.reduce((total, product) => {
      //usamos o reduce quando queremos pegar um array e reduzi-lo em um unico valor
      return total + product.price * product.amount;
    }, 0)
  )
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

// Conexão com o redux
export default connect(mapStateToProps, mapDispatchToProps)(Cart);

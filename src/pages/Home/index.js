import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MdAddShoppingCart } from "react-icons/md";
import { formatPrice } from "../../util/format";
import api from "../../services/api";

// importar as actions
import * as CartActions from "../../store/modules/cart/actions";

import { ProductList } from "./styles";

class Home extends Component {
  state = {
    products: []
  };

  async componentDidMount() {
    const response = await api.get("products");

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price)
    }));

    this.setState({ products: data });
  }

  handleAddProduct = id => {
    // dispatch serve para disparar uma action ao redux
    const { addToCartRequest } = this.props;

    //action
    // chamada direta do addToCart só é possível por causa do trecho mapDispatchToProps no final
    addToCartRequest(id);

    // A chamada abaixo serve para redirecionar o usuário para o carrinho.
    // Contudo não temos como garantir que a função 'addToCartRequest' irá terminar antes de chegar aqui
    // Desta forma teremos que fazer esse redirecionamento por dentro do saga e não aqui no componente

    // this.props.history.push("/cart");
  };

  render() {
    const { products } = this.state;
    const { amount } = this.props;

    return (
      <ProductList>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>

            <button
              type="button"
              onClick={() => this.handleAddProduct(product.id)}
            >
              <div>
                <MdAddShoppingCart size={16} color="#FFF" />{" "}
                {amount[product.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {})
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

//Conectar a página com o redux
export default connect(mapStateToProps, mapDispatchToProps)(Home);

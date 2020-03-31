import producer from "immer";

export default function cart(state = [], action) {
  switch (action.type) {
    case "@cart/ADD_SUCCESS":
      // trecho abaixo está utilizando immer
      return producer(state, draft => {
        const { product } = action;

        draft.push(product);
      });
    case "@cart/REMOVE":
      return producer(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });

    case "@cart/UPDATE_AMOUNT_SUCCESS": {
      return producer(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft[productIndex].amount = Number(action.amount);
        }
      });
    }
    default:
      return state;
  }
}

// todo reducer sempre ouve todas as actions, por isso usamos o switch para
// tratar apenas o que eu quero de acordo com a propriedade type

// ex: o reducer do carrinho quer ouvir apenas as actions relacionadas a ele

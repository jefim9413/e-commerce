export class CartIsEmptyError extends Error {
  constructor() {
    super('O carrinho está vazio.')
  }
}

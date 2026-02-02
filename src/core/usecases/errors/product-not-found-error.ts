export class ProductNotFoundError extends Error {
  constructor() {
    super('Produto não encontrado.')
  }
}

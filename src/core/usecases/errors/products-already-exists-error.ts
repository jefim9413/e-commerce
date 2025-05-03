export class ProductsAlreadyExistsError extends Error {
  constructor() {
    super('Product already exists')
  }
}

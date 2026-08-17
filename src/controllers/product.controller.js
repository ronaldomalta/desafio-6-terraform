let products = [];
let currentId = 1;

exports.getAllProducts = (req, res) => {
  res.status(200).json(products);
};

exports.getProductById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
};

exports.createProduct = (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const newProduct = {
    id: currentId++,
    name,
    price,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, price } = req.body;

  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    price: price !== undefined ? price : products[productIndex].price,
  };

  products[productIndex] = updatedProduct;
  res.status(200).json(updatedProduct);
};

exports.deleteProduct = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
};

// Only for testing purposes to reset the state
exports._resetState = () => {
  products = [];
  currentId = 1;
};

const request = require('supertest');
const app = require('../src/app');
const productController = require('../src/controllers/product.controller');

describe('Product CRUD API', () => {
  beforeEach(() => {
    // Reset state before each test
    productController._resetState();
  });

  it('should return empty array when no products exist', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new product', async () => {
    const newProduct = { name: 'Laptop', price: 999.99 };
    const response = await request(app).post('/api/products').send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.price).toBe(newProduct.price);
  });

  it('should fail to create product without name or price', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({ name: 'Keyboard' });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name and price are required');
  });

  it('should retrieve a product by ID', async () => {
    // Create first
    const created = await request(app)
      .post('/api/products')
      .send({ name: 'Mouse', price: 29.99 });
    const productId = created.body.id;

    const response = await request(app).get(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe('Mouse');
  });

  it('should return 404 when getting non-existent product', async () => {
    const response = await request(app).get('/api/products/999');
    expect(response.status).toBe(404);
  });

  it('should update an existing product', async () => {
    const created = await request(app)
      .post('/api/products')
      .send({ name: 'Old Product', price: 10.0 });
    const productId = created.body.id;

    const response = await request(app)
      .put(`/api/products/${productId}`)
      .send({ name: 'New Product' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('New Product');
    expect(response.body.price).toBe(10.0);
  });

  it('should delete a product', async () => {
    const created = await request(app)
      .post('/api/products')
      .send({ name: 'To Delete', price: 5.0 });
    const productId = created.body.id;

    const deleteResponse = await request(app).delete(
      `/api/products/${productId}`,
    );
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/api/products/${productId}`);
    expect(getResponse.status).toBe(404);
  });
});

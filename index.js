import fetch from 'node-fetch';
const [, , method, endpoint, ...args] = process.argv;
const BASE_URL = 'https://fakestoreapi.com';
const getAllProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  const data = await res.json();
  console.log(data);
};
const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  const data = await res.json();
  console.log(data);
};
const createProduct = async (title, price, category) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      price: parseFloat(price),
      description: 'Generado desde CLI',
      image: 'https://i.pravatar.cc',
      category
    }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  console.log(data);
};
const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  console.log(data);
};
switch (method) {
  case 'GET':
    if (endpoint === 'products') {
      await getAllProducts();
    } else if (endpoint.startsWith('products/')) {
      const id = endpoint.split('/')[1];
      await getProductById(id);
    }
    break;
  case 'POST':
    if (endpoint === 'products') {
      const [title, price, category] = args;
      await createProduct(title, price, category);
    }
    break;
  case 'DELETE':
    if (endpoint.startsWith('products/')) {
      const id = endpoint.split('/')[1];
      await deleteProduct(id);
    }
    break;
  default:
    console.log('Comando no reconocido');
}

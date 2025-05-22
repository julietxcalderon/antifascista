document.getElementById('cargar').addEventListener('click', async () => {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = 'Cargando...';

  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const productos = await res.json();

    contenedor.innerHTML = '';
    productos.forEach(p => {
      const div = document.createElement('div');
      div.className = 'producto';
      div.innerHTML = `
        <h2>${p.title}</h2>
        <p><strong>Precio:</strong> $${p.price}</p>
        <p><strong>Categoría:</strong> ${p.category}</p>
        <img src="${p.image}" alt="${p.title}" width="100"/>
      `;
      contenedor.appendChild(div);
    });
  } catch (error) {
    contenedor.innerHTML = 'Error al cargar los productos.';
    console.error(error);
  }
});

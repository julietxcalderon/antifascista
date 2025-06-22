import * as productService from '../services/products.service.js';

export async function getAllProducts(req, res) {
  try {
    const productos = await productService.getAllProducts();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

export async function getProductById(req, res) {
  try {
    const id = req.params.id;
    const producto = await productService.getProductById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
}

export async function createProduct(req, res) {
  try {
    const { title, price, category, description } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }

    const nuevoProducto = await productService.createProduct({ title, price, category, description });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    const eliminado = await productService.deleteProduct(id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
}

export async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const { title, price, category, description } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }

    const productoActualizado = await productService.updateProduct(id, { title, price, category, description });

    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }

    res.json(productoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
}
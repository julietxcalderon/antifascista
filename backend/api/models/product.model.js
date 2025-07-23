// src/models/product.model.js
import { db } from '../../config/firebase.js';

const productsCollection = db.collection('products');

export const ProductModel = {
  async getAll() {
    const snapshot = await productsCollection.get();
    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  },

  async getById(id) {
    const docRef = productsCollection.doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    return { id: docSnap.id, ...docSnap.data() };
  },

  async create(producto) {
    const docRef = await productsCollection.add(producto);
    return { id: docRef.id, ...producto };
  },

  async delete(id) {
    const docRef = productsCollection.doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    await docRef.delete();
    return true;
  },

  async update(id, data) {
    const docRef = productsCollection.doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;

    await docRef.update(data);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }
};

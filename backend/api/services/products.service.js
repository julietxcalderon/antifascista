import { db } from '../../config/firebase.js';

const productsCollection = db.collection('products');

export const getAllProducts = async () => {
  const snapshot = await productsCollection.get();
  const products = [];
  snapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return products;
};

export const getProductById = async (id) => {
  const docRef = productsCollection.doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() };
};

export const createProduct = async (producto) => {
  const docRef = await productsCollection.add(producto);
  return { id: docRef.id, ...producto };
};

export const deleteProduct = async (id) => {
  const docRef = productsCollection.doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) return null;
  await docRef.delete();
  return true;
};

export const updateProduct = async (id, data) => {
  const docRef = productsCollection.doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) return null;

  await docRef.update(data);
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};
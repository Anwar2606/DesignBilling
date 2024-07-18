// src/components/ProductForm.js
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MultipleProducts = () => {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState(1);

  const handleInputChange = (index, event) => {
    const values = [...products];
    if (event.target.name === "image") {
      values[index][event.target.name] = event.target.files[0];
    } else {
      values[index][event.target.name] = event.target.value;
    }
    setProducts(values);
  };

  const handleAddRow = () => {
    const values = [...products];
    values.push({ name: "", price: "", quantity: "", image: null });
    setProducts(values);
    setRows(rows + 1);
  };

  const handleRemoveRow = (index) => {
    const values = [...products];
    values.splice(index, 1);
    setProducts(values);
    setRows(rows - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const productCollection = collection(db, "products");

    products.forEach(async (product) => {
      let imageUrl = "";
      if (product.image) {
        const imageRef = ref(storage, `images/${product.image.name}`);
        await uploadBytes(imageRef, product.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(productCollection, {
        name: product.name,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
        imageUrl: imageUrl,
      });
    });

    setProducts([]);
    setRows(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={handleAddRow}>Add Row</button>
      {products.map((product, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={(event) => handleInputChange(index, event)}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={(event) => handleInputChange(index, event)}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={product.quantity}
            onChange={(event) => handleInputChange(index, event)}
          />
          <input
            type="file"
            name="image"
            onChange={(event) => handleInputChange(index, event)}
          />
          <button type="button" onClick={() => handleRemoveRow(index)}>Remove</button>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default MultipleProducts;

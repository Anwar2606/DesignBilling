// src/components/EditProductPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const productDoc = doc(db, "products", id);
      const docSnap = await getDoc(productDoc);
      if (docSnap.exists()) {
        const productData = docSnap.data();
        setProduct(productData);
        setName(productData.name);
        setPrice(productData.price);
        setQuantity(productData.quantity);
      }
    };

    fetchProduct();
  }, [id]);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpdate = async () => {
    let imageUrl = product.imageUrl;

    if (image) {
      const imageRef = ref(storage, `images/${id}.jpg`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const productData = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl,
    };

    const productRef = doc(db, "products", id);
    await updateDoc(productRef, productData);

    navigate("/products");
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Product</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Product Price"
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Product Quantity"
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpdate}>Update</button>
      <button onClick={() => navigate("/products")}>Cancel</button>
    </div>
  );
};

export default EditProductPage;

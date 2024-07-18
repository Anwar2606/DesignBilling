// // src/components/BulkUpload.js
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { db, storage } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const BulkUpload = () => {
//   const [products, setProducts] = useState([]);
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleFileUpload = () => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       setProducts(worksheet);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const productCollection = collection(db, "products");

//     for (const product of products) {
//       if (!product.name || !product.price || !product.quantity) {
//         console.error("Missing field(s) in product: ", product);
//         continue;
//       }

//       let imageUrl = "";
//       if (product.image) {
//         try {
//           const response = await fetch(product.image);
//           const blob = await response.blob();
//           const imageRef = ref(storage, `images/${product.image.split("/").pop()}`);
//           await uploadBytes(imageRef, blob);
//           imageUrl = await getDownloadURL(imageRef);
//         } catch (error) {
//           console.error("Error uploading image: ", error);
//           continue;
//         }
//       }

//       const productData = {
//         name: product.name.trim(),
//         price: parseFloat(product.price),
//         quantity: parseInt(product.quantity),
//         imageUrl: imageUrl
//       };

//       if (isNaN(productData.price) || isNaN(productData.quantity)) {
//         console.error("Invalid price or quantity for product:", product);
//         continue;
//       }

//       try {
//         await addDoc(productCollection, productData);
//       } catch (error) {
//         console.error("Error adding document: ", error);
//       }
//     }

//     setProducts([]);
//   };

//   return (
//     <div>
//       <h1>Bulk Upload Products</h1>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
//       <button onClick={handleFileUpload}>Upload Excel</button>
//       <button onClick={handleSubmit}>Submit to Firestore</button>
//     </div>
//   );
// };

// export default BulkUpload;
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { db, storage } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const BulkUpload = () => {
//   const [products, setProducts] = useState([]);
//   const [file, setFile] = useState(null);

//   // Handle file change for both CSV and Excel
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setFile(file);
//   };

//   // Handle file upload and parsing
//   const handleFileUpload = () => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const fileData = event.target.result;
//       const workbook = XLSX.read(fileData, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//       setProducts(worksheet);
//     };
//     reader.readAsBinaryString(file);
//   };

//   // Handle form submission to Firestore
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const productCollection = collection(db, "products");

//     for (const product of products) {
//       if (!product.name || !product.price || !product.quantity) {
//         console.error("Missing field(s) in product: ", product);
//         continue;
//       }

//       let imageUrl = "";
//       if (product.image) {
//         try {
//           const response = await fetch(product.image);
//           const blob = await response.blob();
//           const imageRef = ref(storage, `images/${product.image.split("/").pop()}`);
//           await uploadBytes(imageRef, blob);
//           imageUrl = await getDownloadURL(imageRef);
//         } catch (error) {
//           console.error("Error uploading image: ", error);
//           continue;
//         }
//       }

//       const productData = {
//         name: product.name.trim(),
//         price: parseFloat(product.price),
//         quantity: parseInt(product.quantity),
//         imageUrl: imageUrl
//       };

//       if (isNaN(productData.price) || isNaN(productData.quantity)) {
//         console.error("Invalid price or quantity for product:", product);
//         continue;
//       }

//       try {
//         await addDoc(productCollection, productData);
//       } catch (error) {
//         console.error("Error adding document: ", error);
//       }
//     }

//     // Clear products state after submission
//     setProducts([]);
//   };

//   return (
//     <div>
//       <h1>Bulk Upload Products</h1>
//       <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} />
//       <button onClick={handleFileUpload}>Upload File</button>
//       <button onClick={handleSubmit}>Submit to Firestore</button>
//     </div>
//   );
// };

// export default BulkUpload;
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./BulkUpload.css"; // Import the CSS file

const BulkUpload = () => {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);

  // Handle file change for both CSV and Excel
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  // Handle file upload and parsing
  const handleFileUpload = () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target.result;
      const workbook = XLSX.read(fileData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setProducts(worksheet);
    };
    reader.readAsBinaryString(file);
  };

  // Handle form submission to Firestore
  const handleSubmit = async (event) => {
    event.preventDefault();

    const productCollection = collection(db, "products");

    for (const product of products) {
      if (!product.name || !product.price || !product.quantity) {
        console.error("Missing field(s) in product: ", product);
        continue;
      }

      let imageUrl = "";
      if (product.image) {
        try {
          const response = await fetch(product.image);
          const blob = await response.blob();
          const imageRef = ref(storage, `images/${product.image.split("/").pop()}`);
          await uploadBytes(imageRef, blob);
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          console.error("Error uploading image: ", error);
          continue;
        }
      }

      const productData = {
        name: product.name.trim(),
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
        imageUrl: imageUrl
      };

      if (isNaN(productData.price) || isNaN(productData.quantity)) {
        console.error("Invalid price or quantity for product:", product);
        continue;
      }

      try {
        await addDoc(productCollection, productData);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }

    // Clear products state after submission
    setProducts([]);
  };

  return (
    <div className="container">
      <h1 className="header">Bulk Upload Products</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fileUpload">Upload File:</label>
          <input
            id="fileUpload"
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
          />
        </div>
        <div className="buttons">
          <button type="button" onClick={handleFileUpload}>
            Upload File
          </button>
          <button type="submit">Submit to Firestore</button>
        </div>
      </form>
    </div>
  );
};

export default BulkUpload;

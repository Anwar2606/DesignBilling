// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     items: [],
//     totalAmount: 0,
//     discountPercentage: 0,
//     discountedTotal: 0,
//     taxPercentage: 0,
//     grandTotal: 0,
//   });

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//         initializeBillingDetails(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const initializeBillingDetails = (fetchedProducts) => {
//     const initialItems = fetchedProducts.map(product => ({
//       productId: product.id,
//       name: product.name,
//       quantity: 0,
//       price: product.price,
//     }));
//     setBillingDetails(prevState => ({
//       ...prevState,
//       items: initialItems,
//     }));
//   };

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedItems = billingDetails.items.map(item =>
//       item.productId === productId ? { ...item, quantity } : item
//     );
//     updateBillingDetails(updatedItems);
//   };

//   const updateBillingDetails = (updatedItems) => {
//     const totalAmount = updatedItems.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = billingDetails.discountPercentage;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     const taxPercentage = billingDetails.taxPercentage;
//     const taxAmount = discountedTotal * (taxPercentage / 100);

//     const grandTotal = discountedTotal + taxAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       items: updatedItems,
//       totalAmount,
//       discountedTotal,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = parseInt(event.target.value) || 0;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   const handleTaxChange = (event) => {
//     const taxPercentage = parseInt(event.target.value) || 0;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       taxPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(billingDetails.items);
//   }, [billingDetails.discountPercentage, billingDetails.taxPercentage]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, billingDetails);
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }

//     const doc = new jsPDF();

//     // Add Header
//     doc.setFontSize(18);
//     doc.text('Company Name', 10, 10);
//     doc.setFontSize(12);
//     doc.text('Company Address', 10, 20);
//     doc.text('Contact: 123-456-7890', 10, 30);
    
//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 10);

//     // Add Table Headers
//     doc.setFontSize(14);
//     doc.text('Item', 10, 50);
//     doc.text('Quantity', 70, 50);
//     doc.text('Price', 120, 50);
//     doc.text('Total', 170, 50);
    
//     // Add Table Rows
//     const filteredItems = billingDetails.items.filter(item => item.quantity > 0);
//     filteredItems.forEach((item, index) => {
//       const y = 60 + index * 10;
//       doc.text(item.name, 10, y);
//       doc.text(item.quantity.toString(), 70, y);
//       doc.text(`₹${item.price.toFixed(2)}`, 120, y);
//       doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 170, y);
//     });

//     // Add Summary
//     const summaryStartY = 70 + filteredItems.length * 10;
//     doc.text(`Total Amount: ₹${billingDetails.totalAmount.toFixed(2)}`, 10, summaryStartY);
//     doc.text(`Discount: ${billingDetails.discountPercentage}%`, 10, summaryStartY + 10);
//     doc.text(`Discounted Total: ₹${billingDetails.discountedTotal.toFixed(2)}`, 10, summaryStartY + 20);
//     doc.text(`Tax: ${billingDetails.taxPercentage}%`, 10, summaryStartY + 30);
//     doc.text(`Tax Amount: ₹${((billingDetails.discountedTotal * billingDetails.taxPercentage) / 100).toFixed(2)}`, 10, summaryStartY + 40);
//     doc.text(`Grand Total: ₹${billingDetails.grandTotal.toFixed(2)}`, 10, summaryStartY + 50);

//     // Add Footer
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, 290);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, 300);

//     doc.save('billing_details.pdf');
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <h2>Billing Calculator</h2>
//         <ul className="billing-list">
//           {products.map(product => (
//             <li key={product.id}>
//               {product.name} - ₹{product.price.toFixed(2)} per unit
//               <input
//                 type="number"
//                 min="0"
//                 value={billingDetails.items.find(item => item.productId === product.id)?.quantity || 0}
//                 onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
//               />
//             </li>
//           ))}
//         </ul>
//         <div className="billing-details">
//           <label>Discount Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.discountPercentage}
//             onChange={handleDiscountChange}
//           />
//           %
//         </div>
//         <div className="billing-details">
//           <label>Tax Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.taxPercentage}
//             onChange={handleTaxChange}
//           />
//           %
//         </div>
//         <div className="billing-summary">
//           <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//           <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//           <p>Tax Amount: ₹{((billingDetails.discountedTotal * billingDetails.taxPercentage) / 100).toFixed(2)}</p>
//           <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//         </div>
//         <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//     } else {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }

//     const doc = new jsPDF();

//     // doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name
//     doc.text(`Customer Name: ${customerName}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],  
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     // Add Table
//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Item', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       didDrawCell: (data) => {
//         // Draw underline and break line for the Grand Total row
//         if (data.row.index === tableBody.length - 1 && data.column.index === 3) {
//           const doc = data.doc;
//           const cell = data.cell;
//           const textPos = cell.textPos;
//           doc.setDrawColor(0);
//           doc.setLineWidth(0.5);
//           doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // underline
//           doc.text(' ', cell.x + cell.width, cell.y + cell.height + 10); // break line
//         }
//       }
//     });

//     // Add Footer
//     const finalY = doc.lastAutoTable.finalY || 10;
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, finalY + 10);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 20);

//     doc.save('billing_details.pdf');
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const productInCart = cart.find(item => item.productId === product.id);
//     if (!productInCart) {
//       setCart(prevCart => [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     }
//     updateBillingDetails(cart);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <h2>Billing Calculator</h2>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="customer-name">
//           <label>Customer Name:</label>
//           <input
//             type="text"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//           />
//           <label>Customer State:</label>
//           <input
//             type="text"
//             value={customerState}
//             onChange={(e) => setCustomerState(e.target.value)}
//           />
//         </div>
//         <ul className="product-list">
//           {searchTerm && filteredProducts.map(product => (
//             <li key={product.id} onClick={() => handleAddToCart(product)}>
//               {product.name} - ₹{product.price.toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <ul className="cart-list">
//           {cart.map(item => (
//             <li key={item.productId}>
//               {item.name} - ₹{item.price.toFixed(2)} x 
//               <input
//                 type="number"
//                 min="1"
//                 value={item.quantity}
//                 onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//               />
//               = ₹{(item.price * item.quantity).toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <div className="billing-details">
//           <label>Discount Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.discountPercentage}
//             onChange={handleDiscountChange}
//           />
//           %
//         </div>
//         <div className="billing-summary">
//           <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//           <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//           <p>CGST (9%): ₹{billingDetails.cgstAmount.toFixed(2)}</p>
//           <p>SGST (9%): ₹{billingDetails.sgstAmount.toFixed(2)}</p>
//           <p>IGST (18%): ₹{billingDetails.igstAmount.toFixed(2)}</p>
//           <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//         </div>
//         <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;



// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
     
//     } else {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
    
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();
  
//     //  doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name
//     doc.text(`Customer Name: ${customerName}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     // Add Table
//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Item', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       styles: {
//         lineColor: [0, 0, 0],
//         lineWidth: 0.1,
//         font: "helvetica",
//         fontSize: 10,
//         cellPadding: 3,
//         textColor: [0, 0, 0],
//       },
//       headStyles: {
//         fillColor: [200, 200, 200],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold',
//       },
//       bodyStyles: {
//         fillColor: [255, 255, 255],
//       },
//       alternateRowStyles: {
//         fillColor: [240, 240, 240],
//       },
//       tableLineWidth: 0.1,
//       tableLineColor: [0, 0, 0],
//       didDrawCell: (data) => {
//         // Draw underline and break line for the Grand Total row
//         if (data.row.index === tableBody.length - 1 && data.column.index === 3) {
//           const doc = data.doc;
//           const cell = data.cell;
//           const textPos = cell.textPos;
//           doc.setDrawColor(0);
//           doc.setLineWidth(0.5);
//           doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // underline
//           doc.text(' ', cell.x + cell.width, cell.y + cell.height + 10); // break line
//         }
//       }
//     });

//     // Add Footer
//     const finalY = doc.lastAutoTable.finalY || 10;
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, finalY + 10);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 20);

//     doc.save('billing_details.pdf');
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const productInCart = cart.find(item => item.productId === product.id);
//     if (!productInCart) {
//       setCart(prevCart => [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     }
//     updateBillingDetails(cart);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <h2>Billing Calculator</h2>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="customer-name">
//           <label>Customer Name:</label>
//           <input
//             type="text"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//           />
//           <label>Customer State:</label>
//           <input
//             type="text"
//             value={customerState}
//             onChange={(e) => setCustomerState(e.target.value)}
//           />
//         </div>
//         <ul className="product-list">
//           {searchTerm && filteredProducts.map(product => (
//             <li key={product.id} onClick={() => handleAddToCart(product)}>
//               {product.name} - ₹{product.price.toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <ul className="cart-list">
//           {cart.map(item => (
//             <li key={item.productId}>
//               {item.name} - ₹{item.price.toFixed(2)} x 
//               <input
//                 type="number"
//                 min="1"
//                 value={item.quantity}
//                 onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//               />
//               = ₹{(item.price * item.quantity).toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <div className="billing-details">
//           <label>Discount Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.discountPercentage}
//             onChange={handleDiscountChange}
//           />
//           %
//         </div>
//         <div className="billing-summary">
//           <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//           <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//           <p>CGST (9%): ₹{billingDetails.cgstAmount.toFixed(2)}</p>
//           <p>SGST (9%): ₹{billingDetails.sgstAmount.toFixed(2)}</p>
//           <p>IGST (18%): ₹{billingDetails.igstAmount.toFixed(2)}</p>
//           <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//         </div>
//         <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//     } else {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
    
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();
  
//     //  doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name
//     doc.text(`Customer Name: ${customerName}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 255] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' } }
//       ]
//     );

//     doc.autoTable({
//       head: [['Item Name', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       startY: 40,
//     });

//     doc.save('billing_invoice.pdf');
//   };

//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filtered = products.filter(product => 
//       product.name.toLowerCase().includes(value)
//     );
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const existingItem = cart.find(item => item.productId === product.id);
//     if (existingItem) {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//       setCart(updatedCart);
//     } else {
//       setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     }
//     updateBillingDetails(cart);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <div className="left-panel">
//           <h3>Search Products</h3>
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>
//           <ul className="product-list">
//             {filteredProducts.map(product => (
//               <li key={product.id} onClick={() => handleAddToCart(product)}>
//                 {product.name} - Rs. {product.price.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="right-panel">
//           <h3>Cart</h3>
//           <ul className="cart-list">
//             {cart.map(item => (
//               <li key={item.productId}>
//                 {item.name} - Rs. {item.price.toFixed(2)}
//                 <input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//               </li>
//             ))}
//           </ul>
//           <div className="customer-name">
//             <label>Customer Name:</label>
//             <input
//               type="text"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//           </div>
//           <div className="customer-name">
//             <label>Customer State:</label>
//             <input
//               type="text"
//               value={customerState}
//               onChange={(e) => setCustomerState(e.target.value)}
//             />
//           </div>
//           <div className="discount-input">
//             <label>Discount Percentage:</label>
//             <input
//               type="number"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//             />
//           </div>
//           <div className="billing-summary">
//             <h3>Billing Summary</h3>
//             <p>Total Amount: Rs. {billingDetails.totalAmount.toFixed(2)}</p>
//             <p>Discounted Total: Rs. {billingDetails.discountedTotal.toFixed(2)}</p>
//             <p>CGST (9%): Rs. {billingDetails.cgstAmount.toFixed(2)}</p>
//             <p>SGST (9%): Rs. {billingDetails.sgstAmount.toFixed(2)}</p>
//             <p>IGST (18%): Rs. {billingDetails.igstAmount.toFixed(2)}</p>
//             <h3>Grand Total: Rs. {billingDetails.grandTotal.toFixed(2)}</h3>
//           </div>
//           <button className="save-button" onClick={handleSave}>Save & Generate PDF</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//     } else {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
    
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();
  
//     //  doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name
//     doc.text(`Customer Name: ${customerName}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     // Add Table
//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Item', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       styles: {
//         lineColor: [0, 0, 0],
//         lineWidth: 0.1,
//         font: "helvetica",
//         fontSize: 10,
//         cellPadding: 3,
//         textColor: [0, 0, 0],
//       },
//       headStyles: {
//         fillColor: [200, 200, 200],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold',
//         lineWidth: 0.5,
//         lineColor: [0, 0, 0]
//       },
//       theme: 'plain',
//       didDrawPage: (data) => {
//         // Add logo/image here if needed
//         doc.setFontSize(10);
//         doc.text('Thank you for your business!', 40, doc.internal.pageSize.height - 20); // Adjust position based on content size
//       }
//     });

//     doc.save(`invoice_${customerName}_${new Date().getTime()}.pdf`);
//   };

//   const handleSearch = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     if (searchTerm.trim() !== '') {
//       const filteredProducts = products.filter(product =>
//         product.name.toLowerCase().includes(searchTerm)
//       );
//       setFilteredProducts(filteredProducts);
//     } else {
//       setFilteredProducts([]);
//     }
//   };

//   const handleAddToCart = (product) => {
//     const existingItem = cart.find(item => item.productId === product.id);
//     if (existingItem) {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//       };
//       setCart([...cart, newCartItem]);
//     }
//     updateBillingDetails([...cart, { ...product, quantity: 1 }]);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <div className="left-panel">
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search items..."
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>
//           <ul className={`product-list ${searchTerm !== '' ? '' : 'hidden'}`}>
//             {searchTerm !== '' ? (
//               filteredProducts.map(product => (
//                 <li key={product.id} onClick={() => handleAddToCart(product)}>
//                   {product.name} - Rs. {product.price.toFixed(2)}
//                 </li>
//               ))
//             ) : (
//               products.map(product => (
//                 <li key={product.id} onClick={() => handleAddToCart(product)}>
//                   {product.name} - Rs. {product.price.toFixed(2)}
//                 </li>
//               ))
//             )}
//           </ul>
//         </div>
//         <div className="right-panel">
//           {/* Display the cart items and billing details here */}
//           <h2>Cart</h2>
//           <ul className="cart-list">
//             {cart.map(item => (
//               <li key={item.productId}>
//                 {item.name} - Qty: <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//               </li>
//             ))}
//           </ul>
//           <div className="billing-summary">
//             <h3>Billing Summary</h3>
//             <p>Total Amount: Rs. {billingDetails.totalAmount.toFixed(2)}</p>
//             <p>Discount Percentage:
//               <input
//                 type="number"
//                 value={billingDetails.discountPercentage}
//                 onChange={handleDiscountChange}
//               />
//             </p>
//             <p>Discounted Total: Rs. {billingDetails.discountedTotal.toFixed(2)}</p>
//             <p>CGST (9%): Rs. {billingDetails.cgstAmount.toFixed(2)}</p>
//             <p>SGST (9%): Rs. {billingDetails.sgstAmount.toFixed(2)}</p>
//             <p>IGST (18%): Rs. {billingDetails.igstAmount.toFixed(2)}</p>
//             <p>Grand Total: Rs. {billingDetails.grandTotal.toFixed(2)}</p>
//           </div>
//           <button className="save-button" onClick={handleSave}>Save Invoice</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;
//     if (customerState === businessState) {
      
//     } else {
//       cgstAmount = discountedTotal * 0.09;
//       sgstAmount = discountedTotal * 0.09;
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, { 
//         ...billingDetails, 
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }

//     const doc = new jsPDF();

//     // doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name and Customer State in a single line
//     doc.text(`Customer Name: ${customerName}     Customer State: ${customerState}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );
//     doc.autoTable({
//             startY: 50, // Adjust starting Y position to leave space for logo and header
//             head: [['Item', 'Quantity', 'Price', 'Total']],
//             body: tableBody,
//             styles: {
//               lineColor: [0, 0, 0],
//               lineWidth: 0.1,
//               font: "helvetica",
//               fontSize: 10,
//               cellPadding: 3,
//               textColor: [0, 0, 0],
//             },
//             headStyles: {
//               fillColor: [200, 200, 200],
//               textColor: [0, 0, 0],
//               fontStyle: 'bold',
//               lineWidth: 0.5,
//               lineColor: [0, 0, 0]
//             },
//             theme: 'plain',
//             didDrawPage: (data) => {
//               // Add logo/image here if needed
//               doc.setFontSize(10);
//               doc.text('Thank you for your business!', 40, doc.internal.pageSize.height - 20); // Adjust position based on content size
//             }
//           });
      
//     // Add Table
   

//     // Add Footer
//     const finalY = doc.lastAutoTable.finalY || 10;
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, finalY + 10);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 20);

//     doc.save('billing_details.pdf');
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const productInCart = cart.find(item => item.productId === product.id);
//     if (!productInCart) {
//       setCart(prevCart => [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     }
//     updateBillingDetails(cart);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <div className="left-panel">
//           <h2>Billing Calculator</h2>
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </div>
//           <ul className="product-list">
//             {searchTerm && filteredProducts.map(product => (
//               <li key={product.id} onClick={() => handleAddToCart(product)}>
//                 {product.name} - ₹{product.price.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="right-panel">
//           <div className="customer-details">
//             <div className="customer-input">
//               <label>Customer Name:</label>
//               <input
//                 type="text"
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//               />
//             </div>
//             <div className="customer-input">
//               <label>Customer State:</label>
//               <input
//                 type="text"
//                 value={customerState}
//                 onChange={(e) => setCustomerState(e.target.value)}
//               />
//             </div>
//           </div>
//           <ul className="cart-list">
//             {cart.map(item => (
//               <li key={item.productId}>
//                 {item.name} - ₹{item.price.toFixed(2)} x 
//                 <input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//                 = ₹{(item.price * item.quantity).toFixed(2)}
//               </li>
//             ))}
//           </ul>
//           <div className="billing-details">
//             <label>Discount Percentage:</label>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//             />
//             %
//           </div>
//           <div className="billing-summary">
//             <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//             <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//             <p>CGST (9%): ₹{billingDetails.cgstAmount.toFixed(2)}</p>
//             <p>SGST (9%): ₹{billingDetails.sgstAmount.toFixed(2)}</p>
//             <p>IGST (18%): ₹{billingDetails.igstAmount.toFixed(2)}</p>
//             <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//           </div>
//           <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taxOption, setTaxOption] = useState('cgst_sgst'); // Default tax option

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;

//     if (taxOption === 'cgst_sgst') {
//       if (customerState === businessState) {
        
//       } else {
//         cgstAmount = discountedTotal * 0.09;
//         sgstAmount = discountedTotal * 0.09;
//         // igstAmount = discountedTotal * 0.18;
//       }
//     } else if (taxOption === 'igst') {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState, taxOption]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, {
//         ...billingDetails,
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();
//     const imgData=
//     doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name and Customer State in a single line
//     doc.text(`Customer Name: ${customerName}`,150,24);     
//     doc.text(`Customer State: ${customerState}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//     );

//     if (taxOption === 'cgst_sgst') {
//       tableBody.push(
//         [
//           { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ],
//         [
//           { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     } else if (taxOption === 'igst') {
//       tableBody.push(
//         [
//           { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     }

//     tableBody.push(
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Item', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       styles: {
//         lineColor: [0, 0, 0],
//         lineWidth: 0.1,
//         font: "helvetica",
//         fontSize: 10,
//         cellPadding: 3,
//         textColor: [0, 0, 0],
//       },
//       headStyles: {
//         fillColor: [200, 200, 200],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold',
//         lineWidth: 0.5,
//         lineColor: [0, 0, 0]
//       },
//       theme: 'plain',
//       didDrawPage: (data) => {
//         // Add logo/image here if needed
//         doc.setFontSize(10);
//         doc.text('Thank you for your business!', 40, doc.internal.pageSize.height - 20); // Adjust position based on content size
//       }
//     });

//     // Add Footer
//     const finalY = doc.lastAutoTable.finalY || 10;
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, finalY + 10);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 20);

//     doc.save('billing_details.pdf');
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm));
//     setFilteredProducts(filtered);
//   };

//   const handleAddToCart = (product) => {
//     const productInCart = cart.find(item => item.productId === product.id);
//     if (!productInCart) {
//       setCart(prevCart => [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     }
//     updateBillingDetails(cart);
//   };

//   const handleTaxOptionChange = (event) => {
//     setTaxOption(event.target.value);
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <div className="left-panel">
//           <h2>Billing Calculator</h2>
//           <div className="search-bar">
//             <input
//             className="search-input"
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </div>
//           <ul className="product-list">
//             {searchTerm && filteredProducts.map(product => (
//               <li key={product.id} onClick={() => handleAddToCart(product)}>
//                 {product.name} - ₹{product.price.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="right-panel">
//           <div className="customer-details">
//             <div className="customer-input">
//               <label>Customer Name:</label>
//               <input
//                 type="text"
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 required 
//               />
//             </div>
//             <div className="customer-input">
//               <label>Customer State:</label>
//               <input
//                 type="text"
//                 value={customerState}
//                 onChange={(e) => setCustomerState(e.target.value)}
//               />
//             </div>
//             <div className="tax-options">
//               <input
//                 type="radio"
//                 id="cgst_sgst"
//                 name="taxOption"
//                 value="cgst_sgst"
//                 checked={taxOption === 'cgst_sgst'}
//                 onChange={handleTaxOptionChange}
//               />
//               <label htmlFor="cgst_sgst">CGST + SGST (9% each)</label>
//               <br />
//               <input
//                 type="radio"
//                 id="igst"
//                 name="taxOption"
//                 value="igst"
//                 checked={taxOption === 'igst'}
//                 onChange={handleTaxOptionChange}
//               />
//               <label htmlFor="igst">IGST (18%)</label>
//             </div>
//           </div>
//           <ul className="cart-list">
//             {cart.map(item => (
//               <li key={item.productId}>
//                 {item.name} - ₹{item.price.toFixed(2)} x
//                 <input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//                 = ₹{(item.price * item.quantity).toFixed(2)}
//               </li>
//             ))}
//           </ul>
//           <div className="billing-details">
//             <label>Discount Percentage:</label>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//             />
//             %
//           </div>
//           <div className="billing-summary">
//             <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//             <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//             {taxOption === 'cgst_sgst' && (
//               <>
//                 <p>CGST (9%): ₹{billingDetails.cgstAmount.toFixed(2)}</p>
//                 <p>SGST (9%): ₹{billingDetails.sgstAmount.toFixed(2)}</p>
//               </>
//             )}
//             {taxOption === 'igst' && (
//               <p>IGST (18%): ₹{billingDetails.igstAmount.toFixed(2)}</p>
//             )}
//             <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//           </div>
//           <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;


// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState(''); // New state for customer state
//   const [businessState, setBusinessState] = useState('YourBusinessState'); // State where the business is located
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taxOption, setTaxOption] = useState('cgst_sgst'); // Default tax option

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;

//     if (taxOption === 'cgst_sgst') {
//       if (customerState === businessState) {
        
//       } else {
//         cgstAmount = discountedTotal * 0.09;
//         sgstAmount = discountedTotal * 0.09;
//         // igstAmount = discountedTotal * 0.18;
//       }
//     } else if (taxOption === 'igst') {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState, taxOption]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, {
//         ...billingDetails,
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(new Date()) // Add the current date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();

//     // doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20); // Adjust position based on logo size
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

//     // Add Customer Name and Customer State in a single line
//     doc.text(`Customer Name: ${customerName}     Customer State: ${customerState}`, 150, 28);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//     );

//     if (taxOption === 'cgst_sgst') {
//       tableBody.push(
//         [
//           { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ],
//         [
//           { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     } else if (taxOption === 'igst') {
//       tableBody.push(
//         [
//           { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     }

//     tableBody.push(
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Product Name', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       theme: 'grid',
//       styles: {
//         halign: 'center',
//         valign: 'middle',
//         fontStyle: 'normal',
//         fontSize: 10,
//         cellPadding: 4,
//         overflow: 'linebreak'
//       },
//       columnStyles: {
//         0: { cellWidth: 60 },
//         1: { cellWidth: 40 },
//         2: { cellWidth: 40 },
//         3: { cellWidth: 50 }
//       },
//       margin: { top: 10, right: 10, bottom: 10, left: 10 }
//     });

//     doc.save('billing_invoice.pdf');
//   };

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     const filteredProducts = products.filter(product =>
//       product.name.toLowerCase().includes(event.target.value.toLowerCase())
//     );
//     setFilteredProducts(filteredProducts);
//   };

//   const handleAddToCart = (product) => {
//     const cartItem = cart.find(item => item.productId === product.id);
//     if (cartItem) {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//       };
//       setCart([...cart, newCartItem]);
//     }
//     updateBillingDetails([...cart, { ...product, quantity: 1 }]);
//   };

//   return (
//     <div className="billing-calculator">
//       <div className="product-list">
//         <input
//           type="text"
//           placeholder="Search Products"
//           value={searchTerm}
//           onChange={handleSearch}
//           className="search-input"
//         />
//         <ul>
//           {filteredProducts.map(product => (
//             <li key={product.id}>
//               <div className="product-details">
//                 <span>{product.name}</span>
//                 <span>Rs. {product.price.toFixed(2)}</span>
//               </div>
//               <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="cart">
//         <h2>Cart</h2>
//         <ul>
//           {cart.map(item => (
//             <li key={item.productId}>
//               <div className="cart-item">
//                 <span>{item.name}</span>
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//                 <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="billing-summary">
//           <div className="billing-details">
//             <label>Discount (%)</label>
//             <input
//               type="number"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//               min="0"
//               max="100"
//             />
//             <label>Customer Name</label>
//             <input
//               type="text"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//             <label>Customer State</label>
//             <input
//               type="text"
//               value={customerState}
//               onChange={(e) => setCustomerState(e.target.value)}
//             />
//             <label>Tax Option</label>
//             <select value={taxOption} onChange={(e) => setTaxOption(e.target.value)}>
//               <option value="cgst_sgst">CGST + SGST</option>
//               <option value="igst">IGST</option>            
//               <option value="no_tax">No Tax</option>
//             </select>
//           </div>
//           <div className="billing-amounts">
//             <table>
//               <tbody>
//                 <tr>
//                   <td>Total Amount:</td>
//                   <td>Rs. {billingDetails.totalAmount.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td>Discounted Total:</td>
//                   <td>Rs. {billingDetails.discountedTotal.toFixed(2)}</td>
//                 </tr>
//                 {taxOption === 'cgst_sgst' && (
//                   <>
//                     <tr>
//                       <td>CGST (9%):</td>
//                       <td>Rs. {billingDetails.cgstAmount.toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <td>SGST (9%):</td>
//                       <td>Rs. {billingDetails.sgstAmount.toFixed(2)}</td>
//                     </tr>
//                   </>
//                 )}
//                 {taxOption === 'igst' && (
//                   <tr>
//                     <td>IGST (18%):</td>
//                     <td>Rs. {billingDetails.igstAmount.toFixed(2)}</td>
//                   </tr>
//                 )}
//                 <tr className="grand-total-row">
//                   <td>Grand Total:</td>
//                   <td>Rs. {billingDetails.grandTotal.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <button onClick={handleSave}>Save</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;

// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     totalAmount: 0,
//     discountPercentage: '',
//     discountedTotal: 0,
//     cgstAmount: 0,
//     sgstAmount: 0,
//     igstAmount: 0,
//     grandTotal: 0,
//   });
//   const [customerName, setCustomerName] = useState('');
//   const [customerState, setCustomerState] = useState('');
//   const [businessState, setBusinessState] = useState('YourBusinessState');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taxOption, setTaxOption] = useState('cgst_sgst');
//   const [currentDate, setCurrentDate] = useState(new Date()); // State for current date

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedCart = cart.map(item =>
//       item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
//     );
//     setCart(updatedCart);
//     updateBillingDetails(updatedCart);
//   };

//   const updateBillingDetails = (updatedCart) => {
//     const totalAmount = updatedCart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     let cgstAmount = 0;
//     let sgstAmount = 0;
//     let igstAmount = 0;

//     if (taxOption === 'cgst_sgst') {
//       if (customerState === businessState) {
        
//       } else {
//         cgstAmount = discountedTotal * 0.09;
//         sgstAmount = discountedTotal * 0.09;
//       }
//     } else if (taxOption === 'igst') {
//       igstAmount = discountedTotal * 0.18;
//     }

//     const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       totalAmount,
//       discountedTotal,
//       cgstAmount,
//       sgstAmount,
//       igstAmount,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = event.target.value;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(cart);
//   }, [billingDetails.discountPercentage, customerState, taxOption]);

//   const handleSave = async () =>  {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, {
//         ...billingDetails,
//         customerName,
//         customerState,
//         date: Timestamp.fromDate(currentDate) // Use the selected date
//       });
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }
//     window.location.reload();
//     const doc = new jsPDF();

//     doc.setFontSize(14);
//     doc.text('Tamizha Software solutions', 40, 20);
//     doc.setFontSize(10);
//     doc.text('Thiruthangal', 40, 28);
//     doc.text('Contact: 123-456-7890', 40, 35);

//     // Add Date
//     doc.text(`Date: ${currentDate.toLocaleDateString()}`, 150, 20);

//     // Add Customer Name and Customer State
//     doc.text(`Customer Name: ${customerName}`,150,28  );  
//     doc.text( `Customer State: ${customerState}`, 150, 38);

//     // Prepare Table Body
//     const tableBody = cart
//       .filter(item => item.quantity > 0)
//       .map(item => [
//         item.name,
//         item.quantity.toString(),
//         `Rs. ${item.price.toFixed(2)}`,
//         `Rs. ${(item.price * item.quantity).toFixed(2)}`
//       ]);

//     // Add Summary Rows
//     tableBody.push(
//       [
//         { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//       [
//         { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//       ],
//     );

//     if (taxOption === 'cgst_sgst') {
//       tableBody.push(
//         [
//           { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ],
//         [
//           { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     } else if (taxOption === 'igst') {
//       tableBody.push(
//         [
//           { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
//           { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
//         ]
//       );
//     }

//     tableBody.push(
//       [
//         { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } },
//         { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5, lineColor: [0, 0, 0] } }
//       ]
//     );

//     doc.autoTable({
//       startY: 50, // Adjust starting Y position to leave space for logo and header
//       head: [['Product Name', 'Quantity', 'Price', 'Total']],
//       body: tableBody,
//       theme: 'grid',
//       styles: {
//         halign: 'center',
//         valign: 'middle',
//         fontStyle: 'normal',
//         fontSize: 10,
//         cellPadding: 4,
//         overflow: 'linebreak'
//       },
//       columnStyles: {
//         0: { cellWidth: 60 },
//         1: { cellWidth: 40 },
//         2: { cellWidth: 40 },
//         3: { cellWidth: 50 }
//       },
//       headStyles: {
//         fillColor: [211, 211, 211], // Light gray background for header
//         textColor: [0, 0, 0], // Black text color
//         fontStyle: 'bold', // Bold font style for header text
//         halign: 'center', // Center-aligned header text
//         lineWidth: 0.5, // Thin border for header
//         lineColor: [0, 0, 0] // Black border color
//       },
//       margin: { top: 10, right: 10, bottom: 10, left: 10 }
//     });

//     doc.save('billing_invoice.pdf');
//   };

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     const filteredProducts = products.filter(product =>
//       product.name.toLowerCase().includes(event.target.value.toLowerCase())
//     );
//     setFilteredProducts(filteredProducts);
//   };

//   const handleAddToCart = (product) => {
//     const cartItem = cart.find(item => item.productId === product.id);
//     if (cartItem) {
//       const updatedCart = cart.map(item =>
//         item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//       };
//       setCart([...cart, newCartItem]);
//     }
//     updateBillingDetails([...cart, { ...product, quantity: 1 }]);
//   };

//   return (
//     <div className="billing-calculator">
//       <div className="product-list">
//         <input
//           type="text"
//           placeholder="Search Products"
//           value={searchTerm}
//           onChange={handleSearch}
//           className="search-input"
//         />
//         <ul>
//           {filteredProducts.map(product => (
//             <li key={product.id}>
//               <div className="product-details">
//                 <span>{product.name}</span>
//                 <span>Rs. {product.price.toFixed(2)}</span>
//               </div>
//               <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="cart">
//         <h2>Cart</h2>
//         <ul>
//           {cart.map(item => (
//             <li key={item.productId}>
//               <div className="cart-item">
//                 <span>{item.name}</span>
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
//                 />
//                 <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="billing-summary">
//           <div className="billing-details">
//             <label>Discount (%)</label>
//             <input
//               type="number"
//               value={billingDetails.discountPercentage}
//               onChange={handleDiscountChange}
//               min="0"
//               max="100"
//             />
//             <label>Customer Name</label>
//             <input
//               type="text"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//             />
//             <label>Customer State</label>
//             <input
//               type="text"
//               value={customerState}
//               onChange={(e) => setCustomerState(e.target.value)}
//             />
//             <label>Date</label>
//             <input
//               type="date"
//              className="custom-datepicker"
//               value={currentDate.toISOString().substr(0, 10)} // Display date in ISO format for input field
//               onChange={(e) => setCurrentDate(new Date(e.target.value))}
//             />
//             <label>Tax Option</label>
//             <select value={taxOption} onChange={(e) => setTaxOption(e.target.value)}>
//               <option value="cgst_sgst">CGST + SGST</option>
//               <option value="igst">IGST</option>            
//               <option value="no_tax">No Tax</option>
//             </select>
//           </div>
//           <div className="billing-amounts">
//             <table>
//               <tbody>
//                 <tr>
//                   <td>Total Amount:</td>
//                   <td>Rs. {billingDetails.totalAmount.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td>Discounted Total:</td>
//                   <td>Rs. {billingDetails.discountedTotal.toFixed(2)}</td>
//                 </tr>
//                 {taxOption === 'cgst_sgst' && (
//                   <>
//                     <tr>
//                       <td>CGST (9%):</td>
//                       <td>Rs. {billingDetails.cgstAmount.toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <td>SGST (9%):</td>
//                       <td>Rs. {billingDetails.sgstAmount.toFixed(2)}</td>
//                     </tr>
//                   </>
//                 )}
//                 {taxOption === 'igst' && (
//                   <tr>
//                     <td>IGST (18%):</td>
//                     <td>Rs. {billingDetails.igstAmount.toFixed(2)}</td>
//                   </tr>
//                 )}
//                 <tr className="grand-total-row">
//                   <td>Grand Total:</td>
//                   <td>Rs. {billingDetails.grandTotal.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <button onClick={handleSave}>Save</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import the initialized firebase instance
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './BillingCalculator.css'; // Import the CSS file

const BillingCalculator = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    totalAmount: 0,
    discountPercentage: '',
    discountedTotal: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    grandTotal: 0,
  });
  const [customerName, setCustomerName] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [businessState, setBusinessState] = useState('YourBusinessState');
  const [searchTerm, setSearchTerm] = useState('');
  const [taxOption, setTaxOption] = useState('cgst_sgst');
  const [currentDate, setCurrentDate] = useState(new Date()); // State for current date

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(productsCollectionRef);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
    );
    setCart(updatedCart);
    updateBillingDetails(updatedCart);
  };

  const updateBillingDetails = (updatedCart) => {
    const totalAmount = updatedCart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
    const discountedTotal = totalAmount * (1 - discountPercentage / 100);

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (taxOption === 'cgst_sgst') {
      if (customerState === businessState) {
        
      } else {
        cgstAmount = discountedTotal * 0.09;
        sgstAmount = discountedTotal * 0.09;
      }
    } else if (taxOption === 'igst') {
      igstAmount = discountedTotal * 0.18;
    }

    const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

    setBillingDetails(prevState => ({
      ...prevState,
      totalAmount,
      discountedTotal,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal,
    }));
  };

  const handleDiscountChange = (event) => {
    const discountPercentage = event.target.value;
    setBillingDetails(prevState => ({
      ...prevState,
      discountPercentage,
    }));
  };

  useEffect(() => {
    updateBillingDetails(cart);
  }, [billingDetails.discountPercentage, customerState, taxOption]);

  const handleSave = async () =>  {
    const billingDocRef = collection(db, 'billing');
    try {
      await addDoc(billingDocRef, {
        ...billingDetails,
        customerName,
        customerState,
        date: Timestamp.fromDate(currentDate), // Use the selected date
        productsDetails: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        createdAt: Timestamp.now(), // Adding creation timestamp
        invoiceNumber: Date.now(), // Using current timestamp as invoice number for simplicity
      });
      console.log('Billing details saved successfully in Firestore');
    } catch (error) {
      console.error('Error saving billing details: ', error);
    }
    window.location.reload();
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Tamizha Software solutions', 40, 20);
    doc.setFontSize(10);
    doc.text('Thiruthangal', 40, 28);
    doc.text('Contact: 123-456-7890', 40, 35);

    // Add Date
    doc.text(`Date: ${currentDate.toLocaleDateString()}`, 150, 20);

    // Add Customer Name and Customer State
    doc.text(`Customer Name: ${customerName}`,150,28  );  
    doc.text( `Customer State: ${customerState}`, 150, 38);

    // Prepare Table Body
    const tableBody = cart
      .filter(item => item.quantity > 0)
      .map(item => [
        item.name,
        item.quantity.toString(),
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${(item.price * item.quantity).toFixed(2)}`
      ]);

    // Add Summary Rows
    tableBody.push(
      [
        { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
        { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ],
      [
        { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
        { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ],
      [
        { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
        { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ],
    );

    if (taxOption === 'cgst_sgst') {
      tableBody.push(
        [
          { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
          { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ],
        [
          { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
          { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ]
      );
    } else if (taxOption === 'igst') {
      tableBody.push(
        [
          { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
          { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ]
      );
    }

    tableBody.push(
      [
        { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5 } },
        { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.5 } }
      ]
    );

    doc.autoTable({
      head: [['Product Name', 'Quantity', 'Price', 'Total']],
      body: tableBody,
      startY: 50,
    });

    doc.save('invoice.pdf');
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts(
      products.filter(product => product.name.toLowerCase().includes(term))
    );
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      updateBillingDetails(updatedCart);
    } else {
      const newItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      updateBillingDetails(updatedCart);
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setCurrentDate(selectedDate);
  };

  return (
    // <div className="nilling-calculator">
    //   <h2>Billing Calculator</h2>
    //   <div className="search-bar">
    //     <input
    //       type="text"
    //       placeholder="Search products..."
    //       value={searchTerm}
    //       onChange={handleSearch}
    //     />
    //   </div>
    //   <div className="product-list">
    //     <h3>Products</h3>
    //     <ul>
    //       {filteredProducts.map(product => (
    //         <li key={product.id}>
    //           {product.name} - Rs. {product.price}
    //           <button onClick={() => addToCart(product)}>Add to Cart</button>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    //   <div className="cart">
    //     <h3>Cart</h3>
    //     <ul>
    //       {cart.map(item => (
    //         <li key={item.productId}>
    //           {item.name} - Rs. {item.price} x
    //           <input
    //             type="number"
    //             min="1"
    //             value={item.quantity}
    //             onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
    //           />
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    //   <div className="billing-details">
    //     <h3>Billing Details</h3>
    //     <label>
    //       Customer Name:
    //       <input
    //         type="text"
    //         value={customerName}
    //         onChange={(e) => setCustomerName(e.target.value)}
    //       />
    //     </label>
    //     <label>
    //       Customer State:
    //       <input
    //         type="text"
    //         value={customerState}
    //         onChange={(e) => setCustomerState(e.target.value)}
    //       />
    //     </label>
    //     <label>
    //       Discount Percentage:
    //       <input
    //         type="number"
    //         value={billingDetails.discountPercentage}
    //         onChange={handleDiscountChange}
    //       />
    //     </label>
    //     <label>
    //       Tax Option:
    //       <select
    //         value={taxOption}
    //         onChange={(e) => setTaxOption(e.target.value)}
    //       >
    //         <option value="cgst_sgst">CGST + SGST</option>
    //         <option value="igst">IGST</option>
    //       </select>
    //     </label>
    //     <label>
    //       Date:
    //       <input
    //         type="date"
    //         value={currentDate.toISOString().split('T')[0]} // Format date as yyyy-mm-dd
    //         onChange={handleDateChange}
    //       />
    //     </label>
    //     <div>
    //       <p>Total Amount: Rs. {billingDetails.totalAmount.toFixed(2)}</p>
    //       <p>Discounted Total: Rs. {billingDetails.discountedTotal.toFixed(2)}</p>
    //       <p>CGST Amount: Rs. {billingDetails.cgstAmount.toFixed(2)}</p>
    //       <p>SGST Amount: Rs. {billingDetails.sgstAmount.toFixed(2)}</p>
    //       <p>IGST Amount: Rs. {billingDetails.igstAmount.toFixed(2)}</p>
    //       <p>Grand Total: Rs. {billingDetails.grandTotal.toFixed(2)}</p>
    //     </div>
    //   </div>
    //   <button onClick={handleSave}>Save & Generate Invoice</button>
    // </div>
    <div className="billing-calculator">
    <div className="product-list">
      <input
        type="text"
        placeholder="Search Products"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>
            <div className="product-details">
              <span>{product.name}</span>
              <span>Rs. {product.price.toFixed(2)}</span>
            </div>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
    <div className="cart">
      <h2>Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item.productId}>
            <div className="cart-item">
              <span>{item.name}</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
              />
              <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="billing-summary">
        <div className="billing-details">
          <label>Discount (%)</label>
          <input
            type="number"
            value={billingDetails.discountPercentage}
            onChange={handleDiscountChange}
            min="0"
            max="100"
          />
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <label>Customer State</label>
          <input
            type="text"
            value={customerState}
            onChange={(e) => setCustomerState(e.target.value)}
          />
          <label>Date</label>
          <input
            type="date"
           className="custom-datepicker"
            value={currentDate.toISOString().substr(0, 10)} // Display date in ISO format for input field
            onChange={(e) => setCurrentDate(new Date(e.target.value))}
          />
          <label>Tax Option</label>
          <select value={taxOption} onChange={(e) => setTaxOption(e.target.value)}>
            <option value="cgst_sgst">CGST + SGST</option>
            <option value="igst">IGST</option>            
            <option value="no_tax">No Tax</option>
          </select>
        </div>
        <div className="billing-amounts">
          <table>
            <tbody>
              <tr>
                <td>Total Amount:</td>
                <td>Rs. {billingDetails.totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Discounted Total:</td>
                <td>Rs. {billingDetails.discountedTotal.toFixed(2)}</td>
              </tr>
              {taxOption === 'cgst_sgst' && (
                <>
                  <tr>
                    <td>CGST (9%):</td>
                    <td>Rs. {billingDetails.cgstAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>SGST (9%):</td>
                    <td>Rs. {billingDetails.sgstAmount.toFixed(2)}</td>
                  </tr>
                </>
              )}
              {taxOption === 'igst' && (
                <tr>
                  <td>IGST (18%):</td>
                  <td>Rs. {billingDetails.igstAmount.toFixed(2)}</td>
                </tr>
              )}
              <tr className="grand-total-row">
                <td>Grand Total:</td>
                <td>Rs. {billingDetails.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  </div>
  );
};

export default BillingCalculator;

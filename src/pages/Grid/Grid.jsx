import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust the path to your firebase.js
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import "./Grid.css"; // Import the CSS file

const Grid = () => {
  const [metrics, setMetrics] = useState({
    numberOfBills: 0,
    todaySalesAmount: 0,
    numberOfProducts: 0,
    numberOfCustomers: 0,
    todayNumberOfBills: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const billsQuery = collection(db, "billing");
      const productsQuery = collection(db, "products");
      const customersQuery = collection(db, "customers");

      try {
        // Fetch number of bills
        const billsSnapshot = await getDocs(billsQuery);
        const numberOfBills = billsSnapshot.size;

        // Fetch today's sales amount and today's number of bills
        const todaySalesQuery = query(
          collection(db, "billing"),
          where("date", ">=", Timestamp.fromDate(startOfDay)),
          where("date", "<=", Timestamp.fromDate(endOfDay))
        );
        const todaySalesSnapshot = await getDocs(todaySalesQuery);
        const todaySalesAmount = todaySalesSnapshot.docs.reduce(
          (total, doc) => total + doc.data().totalAmount,
          0
        );
        const todayNumberOfBills = todaySalesSnapshot.size;

        // Fetch number of products
        const productsSnapshot = await getDocs(productsQuery);
        const numberOfProducts = productsSnapshot.size;

        // Fetch number of customers
        const customersSnapshot = await getDocs(customersQuery);
        const numberOfCustomers = customersSnapshot.size;

        setMetrics({
          numberOfBills,
          todaySalesAmount,
          numberOfProducts,
          numberOfCustomers,
          todayNumberOfBills,
        });
      } catch (error) {
        console.error("Error fetching metrics: ", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-box">
          <h2>Number of Bills</h2>
          <p>{metrics.numberOfBills}</p>
        </div>
        <div className="dashboard-box">
          <h2>Today's Sales Amount</h2>
          <p>₹{metrics.todaySalesAmount.toFixed(2)}</p>
        </div>
        <div className="dashboard-box">
          <h2>Number of Products</h2>
          <p>{metrics.numberOfProducts}</p>
        </div>
        <div className="dashboard-box">
          <h2>Today's Number of Bills</h2>
          <p>{metrics.todayNumberOfBills}</p>
        </div>
      </div>
    </div>
  );
};

export default Grid;

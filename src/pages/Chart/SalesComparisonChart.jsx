// // src/components/SalesComparisonChart.js
// import React, { useEffect, useState } from "react";
// import { db } from "../firebase"; // Adjust the path to your firebase.js
// import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const SalesComparisonChart = () => {
//   const [salesData, setSalesData] = useState([]);

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       const today = new Date();
//       const yesterday = new Date(today);
//       yesterday.setDate(today.getDate() - 1);

//       const startOfDay = (date) => {
//         const start = new Date(date);
//         start.setHours(0, 0, 0, 0);
//         return Timestamp.fromDate(start);
//       };

//       const endOfDay = (date) => {
//         const end = new Date(date);
//         end.setHours(23, 59, 59, 999);
//         return Timestamp.fromDate(end);
//       };

//       const salesQuery = (startDate, endDate) => {
//         return query(
//           collection(db, "billing"), // Change 'billing' to your collection name
//           where("date", ">=", startDate),
//           where("date", "<=", endDate)
//         );
//       };

//       try {
//         const todaySalesSnapshot = await getDocs(salesQuery(startOfDay(today), endOfDay(today)));
//         const yesterdaySalesSnapshot = await getDocs(salesQuery(startOfDay(yesterday), endOfDay(yesterday)));

//         const todaySales = todaySalesSnapshot.docs.reduce((total, doc) => total + doc.data().totalAmount, 0);
//         const yesterdaySales = yesterdaySalesSnapshot.docs.reduce((total, doc) => total + doc.data().totalAmount, 0);

//         setSalesData([
//           { name: "Yesterday", Sales: yesterdaySales },
//           { name: "Today", Sales: todaySales },
//         ]);
//       } catch (error) {
//         console.error("Error fetching sales data: ", error);
//       }
//     };

//     fetchSalesData();
//   }, []);

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="Sales" fill="#8884d8" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default SalesComparisonChart;
// src/components/SalesComparisonChart.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust the path to your firebase.js
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./SalesComparisonChart.css"; // Import the CSS file

const SalesComparisonChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const startOfDay = (date) => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        return Timestamp.fromDate(start);
      };

      const endOfDay = (date) => {
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return Timestamp.fromDate(end);
      };

      const salesQuery = (startDate, endDate) => {
        return query(
          collection(db, "billing"), // Change 'billing' to your collection name
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        );
      };

      try {
        const todaySalesSnapshot = await getDocs(salesQuery(startOfDay(today), endOfDay(today)));
        const yesterdaySalesSnapshot = await getDocs(salesQuery(startOfDay(yesterday), endOfDay(yesterday)));

        const todaySales = todaySalesSnapshot.docs.reduce((total, doc) => total + doc.data().totalAmount, 0);
        const yesterdaySales = yesterdaySalesSnapshot.docs.reduce((total, doc) => total + doc.data().totalAmount, 0);

        setSalesData([
          { name: "Yesterday", Sales: yesterdaySales },
          { name: "Today", Sales: todaySales },
        ]);
      } catch (error) {
        console.error("Error fetching sales data: ", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="chart-container">
      <h1 className="chart-header">Sales Comparison</h1>
      <ResponsiveContainer width="80%" height={400} className="responsive-chart">
        <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Sales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesComparisonChart;

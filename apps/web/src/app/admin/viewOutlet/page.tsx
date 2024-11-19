'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Outlet } from "@/type/outlet";

const OutletsPage = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/outlet");
        setOutlets(response.data);
      } catch (err) {
        setError("Failed to fetch outlets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOutlets();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Outlets</h1>
      <div style={styles.cardContainer}>
        {outlets.map((outlet) => (
          <Link 
            key={outlet.id} 
            href={`/admin/${outlet.id}/updateOutlet`} 
            style={styles.card}
          >
            <div>
              <h2 style={styles.cardTitle}>{outlet.name}</h2>
              <p style={styles.cardText}>Email: {outlet.email}</p>
              <p style={styles.cardText}>Created At: {new Date(outlet.createdAt).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "20px",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    display: "block",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textDecoration: "none",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    color: "#333",
  },
  cardText: {
    fontSize: "1rem",
    color: "#555",
  },
  cardHover: {
    transform: "scale(1.02)",
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
  },
};

export default OutletsPage;

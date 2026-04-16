import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => {
      setProducts(res.data.products);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Products</h2>

      {products.map((p) => (
        <div key={p._id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px",
          borderRadius: "8px"
        }}>
          {p.image && (
            <img
              src={`http://localhost:6000/${p.image}`}
              width="120"
            />
          )}

          <h3>{p.name}</h3>
          <p>₹ {p.price}</p>
          <p>{p.category}</p>

          <Link to={`/product/${p._id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}
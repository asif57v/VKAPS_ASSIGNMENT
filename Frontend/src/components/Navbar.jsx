import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      gap: "20px",
      padding: "10px",
      background: "#222",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white" }}>Products</Link>
      <Link to="/add" style={{ color: "white" }}>Add Product</Link>
    </div>
  );
}
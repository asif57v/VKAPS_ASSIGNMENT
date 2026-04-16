import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const API = "http://localhost:5000/api";

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    inStock: true
  });

  const [editId, setEditId] = useState(null);

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      console.log("DATA:", res.data);

      setProducts(res.data); // 🔥 direct array

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //  ADD / UPDATE
  const handleSubmit = async () => {
    try {
      if (!form.name || !form.price || !form.category) {
        return alert("All fields required");
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        inStock: form.inStock
      };

      if (editId) {
        await axios.put(`${API}/products/${editId}`, payload);
        alert("Updated");
      } else {
        await axios.post(`${API}/products`, payload);
        alert("Added");
      }

      setForm({
        name: "",
        price: "",
        category: "",
        inStock: true
      });

      setEditId(null);

      fetchProducts();

    } catch (err) {
      console.log(err);
    }
  };

  //EDIT
  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      inStock: p.inStock
    });
    setEditId(p._id);
  };

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`${API}/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1> Product Management</h1>

      {/* FORM */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e)=>setForm({...form,price:e.target.value})}
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e)=>setForm({...form,category:e.target.value})}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* PRODUCTS */}
      <h2>All Products</h2>

      {products.length === 0 && <p>No products found</p>}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "15px"
      }}>
        {products.map((p) => (
          <div key={p._id} style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            background: "#f9f9f9"
          }}>
            <h3>{p.name}</h3>
            <p>₹ {p.price}</p>
            <p>{p.category}</p>
            <p>{p.inStock ? "In Stock" : "Out of Stock"}</p>

            <button onClick={()=>handleEdit(p)}>Edit</button>
            <button onClick={()=>handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
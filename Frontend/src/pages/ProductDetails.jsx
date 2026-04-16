import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`).then(res => {
      setProduct(res.data.product);
    });
  }, []);

  const update = async () => {
    await API.put(`/products/${id}`, product);
    alert("Updated");
  };

  const del = async () => {
    await API.delete(`/products/${id}`);
    alert("Deleted");
    navigate("/");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Product</h2>

      <input value={product.name}
        onChange={(e)=>setProduct({...product,name:e.target.value})} /><br /><br />

      <input value={product.price}
        onChange={(e)=>setProduct({...product,price:e.target.value})} /><br /><br />

      <input value={product.category}
        onChange={(e)=>setProduct({...product,category:e.target.value})} /><br /><br />

      <button onClick={update}>Update</button>
      <button onClick={del}>Delete</button>
    </div>
  );
}
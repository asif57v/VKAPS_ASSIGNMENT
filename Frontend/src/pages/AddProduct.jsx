const submit = async () => {
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

    console.log("Sending:", payload);

    const res = await API.post("/products", payload);

    console.log("Response:", res.data);

    alert("Product Added Successfully");
    navigate("/");

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    alert("Error adding product");
  }
};
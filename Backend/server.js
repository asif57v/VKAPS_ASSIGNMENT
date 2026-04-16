import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= DATABASE ================= */
mongoose.connect("mongodb://127.0.0.1:27017/ProductDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

/* ================= MODEL ================= */
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

/* ================= MULTER (IMAGE UPLOAD) ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= AUTH MIDDLEWARE ================= */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= LOGIN ================= */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "1234") {
    const token = jwt.sign({ role: "admin" }, "secretkey", {
      expiresIn: "1h"
    });

    return res.json({
      message: "Login successful",
      token
    });
  }

  res.status(401).json({ message: "Invalid email or password" });
});

 

/* CREATE PRODUCT (Protected + Image) */
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;

    const newProduct = new Product({
      name,
      price,
      category,
      inStock
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct
    });

  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
      error: error.message
    });
  }
});







 
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* 🔍 GET SINGLE PRODUCT (Public) */
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message
    });
  }
});

/* ✏️ UPDATE PRODUCT  */
app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, inStock },
      { returnDocument: "after" }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message
    });
  }
});

/* DELETE PRODUCT (Protected) */
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message
    });
  }
});

 
app.listen(5000, () => {
  console.log(" Server running at http://localhost:5000");
});
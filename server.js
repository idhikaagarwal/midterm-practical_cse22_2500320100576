
const express = require("express");
const app = express();

app.use(express.json());

let products = [];
let nextId = 1;

// POST - Add Product
app.post("/api/products", (req, res) => {
    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
        return res.status(400).json({ message: "Missing data" });
    }

    if (products.some(p => p.name === name)) {
        return res.status(409).json({ message: "Same name exists" });
    }

    const product = {
        id: nextId++,
        name,
        price: Number(price),
        category
    };

    products.push(product);
    res.status(201).json(product);
});

// GET - All Products + Filter
app.get("/api/products", (req, res) => {
    const category = req.query.category;

    if (category) {
        const filtered = products.filter(p => p.category === category);
        return res.status(200).json(filtered);
    }

    res.status(200).json(products);
});

// GET - Product by ID
app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Wrong ID" });
    }

    res.status(200).json(product);
});

// PUT - Update Product
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, price, category } = req.body;

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Wrong ID" });
    }

    if (!name || price === undefined || !category) {
        return res.status(400).json({ message: "Missing data" });
    }

    if (products.some(p => p.name === name && p.id !== id)) {
        return res.status(409).json({ message: "Same name exists" });
    }

    product.name = name;
    product.price = Number(price);
    product.category = category;

    res.status(200).json(product);
});

// DELETE - Delete Product
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Wrong ID" });
    }

    products.splice(index, 1);
    res.status(200).json({ message: "Product deleted" });
});

// Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

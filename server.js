const express = require('express');
const app = express();
const port = 3000;

// Middleware để parse JSON body
app.use(express.json());

// --- 1. GIẢ LẬP CƠ SỞ DỮ LIỆU (DATABASE) ---

// Dữ liệu Categories (như bạn cung cấp)
let categories = [
    {
        "id": 7,
        "name": "Clothes",
        "slug": "clothes",
        "image": "https://i.imgur.com/QkIa5tT.jpeg",
        "creationAt": "2026-02-05T16:51:34.000Z",
        "updatedAt": "2026-02-05T16:51:34.000Z"
    },
    {
        "id": 8,
        "name": "Electronics",
        "slug": "electronics",
        "image": "https://i.imgur.com/ZANVnHE.jpeg",
        "creationAt": "2026-02-05T16:51:35.000Z",
        "updatedAt": "2026-02-05T16:51:35.000Z"
    },
    {
        "id": 9,
        "name": "Furniture",
        "slug": "furniture",
        "image": "https://i.imgur.com/Qphac99.jpeg",
        "creationAt": "2026-02-05T16:51:36.000Z",
        "updatedAt": "2026-02-05T16:51:36.000Z"
    },
    {
        "id": 10,
        "name": "Shoes",
        "slug": "shoes",
        "image": "https://i.imgur.com/qNOjJje.jpeg",
        "creationAt": "2026-02-05T16:51:36.000Z",
        "updatedAt": "2026-02-05T16:51:36.000Z"
    },
    {
        "id": 11,
        "name": "Miscellaneous",
        "slug": "miscellaneous",
        "image": "https://i.imgur.com/BG8J0Fj.jpg",
        "creationAt": "2026-02-05T16:51:37.000Z",
        "updatedAt": "2026-02-05T16:51:37.000Z"
    },
    {
        "id": 13,
        "name": "gargantilla",
        "slug": "gargantilla",
        "image": "https://firebasestorage.googleapis.com/v0/b/pruebasalejandro-597ed.firebasestorage.app/o/gargantilla.jpg?alt=media&token=6bbf8234-5112-4ca8-b130-5e49ed1f3140",
        "creationAt": "2026-02-05T21:09:36.000Z",
        "updatedAt": "2026-02-05T21:09:36.000Z"
    },
    {
        "id": 15,
        "name": "category_B",
        "slug": "category-b",
        "image": "https://pravatar.cc/",
        "creationAt": "2026-02-05T22:04:27.000Z",
        "updatedAt": "2026-02-05T22:04:27.000Z"
    },
    {
        "id": 16,
        "name": "string",
        "slug": "string",
        "image": "https://pravatar.cc/",
        "creationAt": "2026-02-05T22:04:28.000Z",
        "updatedAt": "2026-02-05T22:04:28.000Z"
    },
    {
        "id": 17,
        "name": "Anillos",
        "slug": "anillos",
        "image": "https://firebasestorage.googleapis.com/v0/b/pruebasalejandro-597ed.firebasestorage.app/o/Anillos.jpg?alt=media&token=b7de8064-d4eb-4680-a4e2-ad917838c6c8",
        "creationAt": "2026-02-06T02:40:20.000Z",
        "updatedAt": "2026-02-06T02:40:20.000Z"
    },
    {
        "id": 18,
        "name": "Testing Category",
        "slug": "testing-category",
        "image": "https://placeimg.com/640/480/any",
        "creationAt": "2026-02-06T06:04:54.000Z",
        "updatedAt": "2026-02-06T06:04:54.000Z"
    }
];

const products = [
    { id: 1, title: "T-Shirt", price: 20, categoryId: 7 },
    { id: 2, title: "Jeans", price: 50, categoryId: 7 },
    { id: 3, title: "Laptop", price: 1000, categoryId: 8 },
    { id: 4, title: "Sofa", price: 300, categoryId: 9 },
    { id: 5, title: "Running Shoes", price: 80, categoryId: 10 },
    { id: 6, title: "Ring", price: 150, categoryId: 17 }
];


// URL: /api/v1/categories?name=Clothes
app.get('/api/v1/categories', (req, res) => {
    const { name } = req.query;
    
    if (name) {
        const filtered = categories.filter(c => 
            c.name.toLowerCase().includes(name.toLowerCase())
        );
        return res.json(filtered);
    }
    
    res.json(categories);
});

// URL: /api/v1/categories/7
app.get('/api/v1/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const category = categories.find(c => c.id === id);

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
});

// URL: /api/v1/categories/slug/clothes
app.get('/api/v1/categories/slug/:slug', (req, res) => {
    const slug = req.params.slug;
    const category = categories.find(c => c.slug === slug);

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
});

// URL: POST /api/v1/categories
app.post('/api/v1/categories', (req, res) => {
    const { name, image } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    const maxId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) : 0;
    const newId = maxId + 1;
    const now = new Date().toISOString();

    const slug = name.toLowerCase().replace(/ /g, '-');

    const newCategory = {
        id: newId,
        name,
        slug,
        image: image || "https://placeimg.com/640/480/any",
        creationAt: now,
        updatedAt: now
    };

    categories.push(newCategory);
    res.status(201).json(newCategory);
});

// URL: PUT /api/v1/categories/7
app.put('/api/v1/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Category not found" });
    }

    const { name, image } = req.body;
    const now = new Date().toISOString();

    categories[index] = {
        ...categories[index],
        name: name || categories[index].name,
        image: image || categories[index].image,
        slug: name ? name.toLowerCase().replace(/ /g, '-') : categories[index].slug,
        updatedAt: now
    };

    res.json(categories[index]);
});

// URL: DELETE /api/v1/categories/7
app.delete('/api/v1/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Category not found" });
    }

    const deletedItem = categories.splice(index, 1);
    res.json({ message: "Deleted successfully", deletedItem });
});

// URL: /api/v1/categories/{id}/products
app.get('/api/v1/categories/:id/products', (req, res) => {
    const categoryId = parseInt(req.params.id);

    const categoryExists = categories.some(c => c.id === categoryId);
    if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
    }

    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    
    res.json(categoryProducts);
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
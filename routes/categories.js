// File: routes/categories.js
var express = require('express');
var router = express.Router();

// Import dữ liệu dùng chung
var { categories, products } = require('../utils/data');

/* 1. GET ALL (Có hỗ trợ query ?name=...) */
router.get('/', function(req, res, next) {
  const { name } = req.query;
  
  if (name) {
    const filtered = categories.filter(c => 
      c.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filtered);
  }
  
  res.json(categories);
});

/* 2. GET BY SLUG (Đặt trước get by ID để tránh nhầm lẫn route) */
router.get('/slug/:slug', function(req, res, next) {
  const slug = req.params.slug;
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
});

/* 3. GET PRODUCTS BY CATEGORY ID (Yêu cầu đề bài: /categories/{id}/products) */
// Route này trả về toàn bộ products thuộc category id đó
router.get('/:id/products', function(req, res, next) {
  const categoryId = parseInt(req.params.id);

  // Kiểm tra category có tồn tại không
  const categoryExists = categories.some(c => c.id === categoryId);
  if (!categoryExists) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Lọc lấy danh sách products tương ứng
  const result = products.filter(p => p.categoryId === categoryId);
  res.json(result);
});

/* 4. GET BY ID */
router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
});

/* 5. CREATE */
router.post('/', function(req, res, next) {
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

/* 6. EDIT */
router.put('/:id', function(req, res, next) {
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

/* 7. DELETE */
router.delete('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Category not found" });
  }

  const deletedItem = categories.splice(index, 1);
  res.json({ message: "Deleted successfully", deletedItem });
});

module.exports = router;
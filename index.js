const express = require('express');
const cors = require('cors');
const sqlite = require('sqlite3').verbose();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllResturants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    const results = await fetchAllResturants();
    if (results.restaurants.length === 0)
      return res.status(404).json({
        message: 'No restaurants found',
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getResturantByID(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

app.get('/restaurants/details', async (req, res) => {
  let id = parseInt(req.query.id);
  try {
    const results = await getResturantByID(id);
    if (results.restaurants.length === 0)
      return res.status(404).json({
        message: 'No restaurants found',
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getResturantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine', async (req, res) => {
  let cuisine = req.query.cuisine;
  try {
    const results = await getResturantByCuisine(cuisine);
    if (results.restaurants.length === 0)
      return res.status(404).json({
        message: 'No restaurants found for dish' + cuisine,
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getResturantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    const results = await getResturantByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0)
      return res.status(404).json({
        message: 'No restaurants found',
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getResturantSortedByRating() {
  let query = 'SELECT * FROM restaurants WHERE rating ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const results = await getResturantSortedByRating();
    if (results.restaurants.length === 0)
      return res.status(404).json({
        message: 'No restaurants found',
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    const results = await getAllDishes();
    if (results.dishes.length === 0)
      return res.status(404).json({
        message: 'No dishes found',
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getDishesByID(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details', async (req, res) => {
  let id = parseInt(req.query.id);
  try {
    const results = await getDishesByID(id);
    if (results.dishes.length === 0)
      return res.status(404).json({
        message: 'No dishes found',
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = (req.query.isVeg = 'true');
  try {
    const results = await getDishesByFilter(isVeg);
    if (results.dishes.length === 0)
      return res.status(404).json({
        message: 'No dishes found for ' + isVeg,
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getDishesSortedByPrice() {
  let query = 'SELECT * FROM dishes WHERE price ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const results = await getDishesSortedByPrice();
    if (results.dishes.length === 0)
      return res.status(404).json({
        message: 'No dishes found',
      });

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

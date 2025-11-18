require("dotenv").config();

const jwt = require('jsonwebtoken');

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bcrypt = require('bcrypt');

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());



// MySQL Connect database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) {
      console.error("DB test query failed:", err);
      return res.status(500).send("❌ Database NOT connected");
    }
    res.send("✅ Database is connected");
  });
});

app.get('/',(req,res)=>{
  return res.json("i am Basit fron backend")
})

app.get('/complete_acessory_sets', (req, res) => {
  const query = 'SELECT * FROM products WHERE subcategory_id = 16';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.status(200).json(results);
    }
  });
});


//   try {
//     const { amount, currency = "usd", metadata } = req.body;

//     // Validate amount
//     if (!amount || isNaN(amount) || amount <= 0) {
//       return res.status(400).send({ error: "Invalid amount provided" });
//     }


//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency,
//       metadata: metadata || {}, // Optional metadata for tracking
//       payment_method_types: ["card"], // Only allow card payments
//     });

//     console.log("✅ Payment Intent Created:", paymentIntent.id);

//     res.send({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("❌ Error Creating Payment Intent:", error.message);
//     res.status(500).send({ error: error.message });
//   }
// });
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, customerEmail } = req.body;
  try {
    const customer = await stripe.customers.create({ email: customerEmail });

    const paymentIntent = await stripe.paymentIntents.create({
      amount:Math.round(amount * 100),
      currency,
      customer: customer.id, // Attach customer ID
      automatic_payment_methods: { enabled: true },
    });
    console.log("complete payment intent",paymentIntent)
    console.log("cleint secret",paymentIntent.client_secret)
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// payment cards images APi
app.get("/images", (req, res) => {
  db.query("SELECT * FROM cardsimages", (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});
// Authuntication APIS
app.post('/signup', async (req, res) => {
  const { name, email, password, phone, city } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const query = `INSERT INTO users (name, email, password, phone, city) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [name, email, hashedPassword, phone, city], (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).send(err);
      }
      res.send({ message: 'User created successfully' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error hashing password' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], async (err, result) => {
    if (err || result.length === 0) {
      console.error('User not found:', err);
      return res.status(404).send({ message: 'User not found' });
    }
    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password); // Compare password
    if (!passwordMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    // Generate JWT Token
    const payload = {
      userId: user.user_id,
      email: user.email,
    };
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '30d' });
    res.send({
      userId: user.user_id,
      email: user.email,
      token: token,  // Send the token to the client
      message: 'Login successful',
    });
  });
});
// home screen front model of sale images API
app.get("/api/sale-image", (req, res) => {
  const sql = "SELECT image_url FROM homescreensale_images ORDER BY created_at DESC LIMIT 1";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    if (result.length > 0) {
      res.json({ imageUrl: result[0].image_url });
    } else {
      res.json({ imageUrl: null });
    }
  });
});
app.post("/upload-profile-image", async (req, res) => {
  const { user_id, image_url } = req.body;
  if (!user_id || !image_url) return res.status(400).json({ error: "Missing fields" });

  const query = "INSERT INTO user_images (user_id, image_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_url = ?";
  db.query(query, [user_id, image_url, image_url], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Profile image updated successfully" });
  });
});
// usreimage displaying
app.get("/user_images/:storedUserId", (req, res) => {
  const storedUserId = req.params.storedUserId; // Using storedUserId instead of userId
  const sql = "SELECT image_url FROM user_images WHERE user_id = ? LIMIT 1";
  
  db.query(sql, [storedUserId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    
    if (result.length > 0) {
      res.json({ image_url: result[0].image_url });
    } else {
      res.status(404).json({ message: "No image found for this user" });
    }
  });
});
// faqs APIs
app.get("/faqs", (req, res) => {
  db.query("SELECT * FROM faq", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed." });
    } else {
      res.json(results);
    }
  });
});

app.get("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT user_id, name, email, phone, city FROM users WHERE user_id = ?";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);  // Log error in backend
      return res.status(500).json({ error: "Database error" });
    } 
    
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(results[0]);
  });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, city } = req.body;
  console.log(name, email, phone, city )
  db.query(
    "UPDATE users SET name = ?, email = ?, phone = ?, city = ? WHERE user_id = ?",
    [name, email, phone, city, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ message: "User updated successfully" });
    }
  );
});

app.get('/splash-image',(req,res)=>{
  const query='SELECT * FROM logo_image WHERE id = 2'
  db.query(query,(err,result)=>{
     if(err) throw err;
     res.json(result)
  })
})
// Regitstration screen splash image
app.get('/splash-image3',(req,res)=>{
  const query='SELECT * FROM logo_image WHERE id =3'
  db.query(query,(err,result)=>{
     if(err) throw err;
     res.json(result)
  })
})
// Api for fetching Logo image //
app.get('/logo_image',(req,res)=>{
   const query='SELECT * FROM logo_image WHERE id = 1'
   db.query(query,(err,result)=>{
      if(err) throw err;
      res.json(result)
   })
})
// sliderimages //
app.get('/sliderimages', (req, res) => {
  const query = 'SELECT * FROM sliderimages';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// APi for fecthing categories //
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching categories:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});
// API to fetch subcategories by categoryId //
app.get('/categories/:categoryId/subcategories', (req, res) => {
  const { categoryId } = req.params;
  const query = 'SELECT * FROM subcategories WHERE category_Id = ?';
  db.query(query, [categoryId], (err, results) => {
      if (err) {
          console.error('Error fetching subcategories:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});
// API for products//
app.get('/subcategories/:subcategoryId/products', (req, res) => {
  const { subcategoryId } = req.params;
  const query = 'SELECT * FROM products WHERE subcategory_Id = ?';
  db.query(query, [subcategoryId], (err, results) => {
      if (err) {
          console.error('Error fetching products:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});

// 1. POST /cart: Add product to the cart
app.post('/cart', (req, res) => {
  const { user_id, id, quantity,name,price,image_url,selectedColor} = req.body;
  // Query to check if the product is already in the cart (the id is Product-id) //
  const checkQuery = `SELECT * FROM cart WHERE user_id = ? AND id = ?`;
  db.query(checkQuery, [user_id,id], (err, result) => {
    if (err) {
      console.error('Error checking cart:', err);
      return res.status(500).send({ message: 'Error checking cart' });
    }
    // If the product is already in the cart, update the quantity
    if (result.length > 0) {
      const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND id = ?`;
      db.query(updateQuery, [quantity, user_id, id,name,price,image_url,selectedColor ], (err, updateResult) => {
        if (err) {
          console.error('Error updating cart:', err);
          return res.status(500).send({ message: 'Error updating cart' });
        }
        return res.send({ message: 'Cart updated successfully' });
      });
    } else {
      // If the product is not in the cart, insert a new entry
      const insertQuery = `INSERT INTO cart (user_id, id, quantity,name,price ,image_url,selectedColor) VALUES (?,?,?, ?, ?,?,?)`;
      db.query(insertQuery, [user_id, id, quantity,name ,price,image_url,selectedColor], (err, insertResult) => {
        if (err) {
          console.error('Error adding to cart:', err);
          return res.status(500).send({ message: 'Error adding to cart' });
        }
        return res.send({ message: 'Product added to cart successfully' });
      });
    }
  });
});

// GET /cart: Retrieve cart items for a specific user
app.get('/cart/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = `SELECT * FROM cart WHERE user_id = ?`;
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching cart items:', err);
      return res.status(500).send('Failed to fetch cart items');
    }
    res.status(200).json(results);
  });
});

// PUT /cart/:id: Update the quantity of a product in the cart for a specific user
app.put('/cart/:id', (req, res) => {
  const { quantity, user_id } = req.body; 
  const cart_Id = req.params.id; 
  // Check that the necessary data is provided
  if (!quantity || !user_id || !cart_Id) {
    return res.status(400).send({ message: 'Invalid data provided.' });
  }
  const sql = 'UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?';
  db.query(sql, [quantity, cart_Id, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Cart item not found.' });
    }
    res.status(200).send({ message: 'Quantity updated successfully.' });
  });
});

// DELETE /cart/:id: Remove a product from the cart for a specific user
app.delete('/cart/:user_id/:cart_id', (req, res) => {
  const { user_id, cart_id } = req.params;
  const sql = 'DELETE FROM cart WHERE user_id = ? AND cart_id = ?';
  db.query(sql, [user_id, cart_id], (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to remove item from cart', error: err });
    }
    res.status(200).send({ message: 'Item removed successfully' });
  });
});

// API Endpoint to save address
app.post('/save_address', (req, res) => {
  const { user_id, name, phone, city, address } = req.body;

  if (!user_id || !name || !phone || !city || !address) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO addresses (user_id, name, phone, city, address) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [user_id, name, phone, city, address], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Database error', details: err });
      }
      res.status(200).json({ message: 'Address saved successfully', address_id: result.insertId });
  });
});


// API Endpoint to Place an Order
app.post('/orders', async (req, res) => {
  console.log("📥 Received order request:", req.body);

  const { user_id, name, phone, city, address, receipt_url, subtotal, shipping_charges, total_amount, cart_items } = req.body;

  if (!user_id || !name || !phone || !city || !address || !subtotal || !shipping_charges || !total_amount || !cart_items.length) {
      console.error("❌ Missing required fields in request");
      return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("✅ Order request validated, inserting order...");

  const orderQuery = `
      INSERT INTO apporders (user_id, name, phone, city, address, receipt_url, subtotal, shipping_charges, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'In Progress')`;

  db.query(orderQuery, [user_id, name, phone, city, address, receipt_url, subtotal, shipping_charges, total_amount], (err, result) => {
      if (err) {
          console.error("❌ Error inserting order into apporders:", err);
          return res.status(500).json({ error: "Database error while inserting order" });
      }

      const order_id = result.insertId; // Get the inserted order's ID
      console.log(`✅ Order inserted successfully with order_id: ${order_id}`);

      // Insert Order Items
      const itemsQuery = `
          INSERT INTO apporder_items (order_id, name, quantity, price)
          VALUES ?`;
      
      const itemValues = cart_items.map(item => [order_id, item.name, item.quantity, item.price]);

      console.log("📥 Preparing to insert order items:", itemValues);

      db.query(itemsQuery, [itemValues], (err) => {
          if (err) {
              console.error("❌ Error inserting order items:", err);
              return res.status(500).json({ error: "Database error while inserting order items" });
          }
          console.log("✅ Order items inserted successfully!");
          res.status(201).json({ message: "Order placed successfully!", order_id });
      });
  });
});
// orders list of spsecific user
app.get('/orders', (req, res) => {
  const userId = Number(req.query.userId); // <- convert to number
  console.log("User ID in API:", userId);
  const query = "SELECT * FROM apporders WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Orders fetched:", results); // <- log results
    res.json(results);
  });
});





app.get("/loginbg",(req,res)=>{
  const query= "SELECT * FROM logo_image WHERE id=4";
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})


// Home Welcome paragraph API // 
app.get("/home_paragraphs",(req,res)=>{
  const query='SELECT * FROM home_paragraphs'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})
//  this API is for fetching all products//
app.get("/products",(req,res)=>{
   const query='SELECT * FROM products'
   db.query(query,(err,result)=>{
    if(err) throw err;
    res.json(result)
   })
})
// This APi is for trnding products //
app.get("/trending_products", (req, res) => {
  const query = `
    SELECT p.* 
    FROM trending_products t
    JOIN products p ON t.product_id = p.id
    ORDER BY t.added_at DESC
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching trending products:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.get("/onsale_products", (req, res) => {
  const query = `
    SELECT 
      p.*, 
      o.New_price, 
      o.added_at 
    FROM on_sale_products o
    JOIN products p ON o.product_id = p.id
    ORDER BY o.added_at DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching on-sale products:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

//  About page realted Ap
app.get("/about",(req,res)=>{
  const query='SELECT * FROM about'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})
app.get("/about_image",(req,res)=>{
  const query='SELECT * FROM logo_image WHERE id = 3'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})
app.get('/aboutus',(req,res)=>{
  const query= 'SELECT * FROM aboutus'
  db.query(query,(err,result)=>{
    if (err) throw err;
    res.json(result)
  })
})
app.get('/about_mission',(req,res)=>{
  const query= 'SELECT * FROM about_mission'
  db.query(query,(err,result)=>{
    if (err) throw err;
    res.json(result)
  })
})
// Services page related APIs //
app.get("/services",(req,res)=>{
  const query='SELECT * FROM services'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})
app.get("/plumbers",(req,res)=>{
  const query='SELECT * FROM plumbers'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})
app.post('/bookings', (req, res) => {
  const { techuserID,loginUserId, name, email, phone, city, description, latitude, longitude } = req.body;
  console.log('data recived from booking form',techuserID,loginUserId, name, email, phone, city, description, latitude, longitude)
  if (!techuserID || !loginUserId || !name || !phone || !city || !description) {
      return res.status(400).json({ message: 'Required fields missing' });
  }

  const sql = `INSERT INTO bookings (technician_id,loginuserid, name, email, phone, city, description, latitude, longitude) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;
  const values = [techuserID,loginUserId, name, email, phone, city, description, latitude, longitude];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Booking Error:', err);
          return res.status(500).json({ message: 'Error saving booking' });
      }
      res.status(201).json({ message: 'Booking successful', bookingId: result.insertId });
  });
});

app.get('/bookings/:technicianId', (req, res) => {
  const query = "SELECT * FROM bookings WHERE technician_id = ?";
  db.query(query, [req.params.technicianId], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});

// app.get("/bookingstatus",(req,res)=>{
//   const query='SELECT status FROM bookings'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })
app.get('/get-booking-status/:techUserId/:loginUserId', (req, res) => {
  const {  loginUserId ,techUserId} = req.params;
 console.log(techUserId, loginUserId)
  const query = `
    SELECT status FROM bookings 
    WHERE technician_id = ? AND loginuserid = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  db.query(query, [loginUserId,techUserId ], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      res.json({ status: results[0].status });
    } else {
      res.json({ status: null });  // No booking found
    }
  });
});




app.get("/map_image",(req,res)=>{
  const query='SELECT * FROM map_image'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})
// Brands APis //
app.get("/brands",(req,res)=>{
  const query='SELECT * FROM brands'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})

app.get("/first_column_data", (req, res) => {
  const query = 'SELECT * FROM customer_supportoptions LIMIT 2';
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching first 2 rows:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

app.get("/second_column_data", (req, res) => {
  const query = 'SELECT * FROM customer_supportoptions LIMIT 100 OFFSET 2'; 
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching next rows:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});
// app.get("/customer_supportoptions",(req,res)=>{
//   const query='SELECT * FROM customer_supportoptions'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })

app.get("/payment_methods",(req,res)=>{
  const query= 'SELECT * FROM payment_methods'
  db.query(query,(err,result)=>{
     if(err)  throw err;
     res.json(result)
  })
})

app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = 'SELECT name FROM users WHERE user_id = ?';
  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user name:', error);
      return res.status(500).json({ message: 'Failed to fetch user name' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ userName: results[0].name });
  });
});

  // footer APIS start //
  app.get('/contact_list',(req,res)=>{
    const query= 'SELECT * FROM contact_list'
    db.query(query,(err,result)=>{
      if (err) throw err;
      res.json(result)
    })
  })
  app.get('/footer_links', (req, res) => {
    const query = 'SELECT footer_links_list, routes FROM footer_links';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);  
    });
});

app.get('/footer_info', (req, res) => {
  const query = 'SELECT footer_info_list, routes FROM footer_info';
  db.query(query, (err, result) => {
      if (err) throw err;
      res.json(result);
  });
});
app.get('/social_icons', (req, res) => {
  const query = 'SELECT icons, routes FROM social_icons';
  db.query(query, (err, result) => {
      if (err) throw err;
      res.json(result); 
  });
});
// footer Apis end //

// this API is for videos on homepage //
app.get("/home_videos",(req,res)=>{
  const query='SELECT * FROM home_videos'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})
// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


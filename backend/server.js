const express = require('express');
const cors = require('cors');
const app = express();

const { initPoolAndTables } = require('./utils/db'); // Import fungsi init
const userRoutes = require('./routes/userRoutes');
const laundryRoutes = require('./routes/laundryRoutes');
const orderRoutes = require('./routes/orderRoutes')
const serviceRoutes = require('./routes/serviceRoutes');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/api', (req, res) => {
  res.send(`
    <html>
      <head><title>API Status</title></head>
      <body>
        <h1>🚀 Server is running!</h1>
        <p>Welcome to the Laundry Service API.</p>
      </body>
    </html>
  `);
});

app.use('/api/users', userRoutes);
app.use('/api/laundries', laundryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);

// Start server only after DB is ready
initPoolAndTables().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to initialize DB:', err);
});

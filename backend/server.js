const express = require('express');
const cors = require('cors');
const app = express();

const { initPoolAndTables } = require('./utils/db'); // Import fungsi init
const userRoutes = require('./routes/userRoutes');
const laundryRoutes = require('./routes/laundryRoutes');

app.use(cors());
app.use(express.json());

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

// Start server only after DB is ready
initPoolAndTables().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to initialize DB:', err);
});

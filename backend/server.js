const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const laundryRoutes = require('./routes/laundryRoutes');

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/laundries', laundryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
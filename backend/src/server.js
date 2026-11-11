const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');

connectDB()
  .then(() => app.listen(env.PORT, () => console.log(`API running on port ${env.PORT}`)))
  .catch((err) => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
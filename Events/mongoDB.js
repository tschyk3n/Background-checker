const mongoose = require('mongoose');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    // Connect to the database
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to MongoDB!'))
      .catch(error => console.error(error));
  },
};
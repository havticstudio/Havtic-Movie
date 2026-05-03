import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  premiumExpiry: { type: Date },
  isAdmin: { type: Boolean, default: false },
  payments: [
    {
      amount: Number,
      transactionId: { type: String, required: true },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  watchlist: [
    {
      id: { type: Number, required: true },
      title: String,
      name: String,
      poster_path: String,
      media_type: String,
      vote_average: Number,
      release_date: String,
      first_air_date: String,
      addedAt: { type: Date, default: Date.now }
    }
  ],
  completed: [
    {
      id: { type: Number, required: true },
      title: String,
      name: String,
      poster_path: String,
      media_type: String,
      vote_average: Number,
      release_date: String,
      first_air_date: String,
      addedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);

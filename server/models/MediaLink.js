import mongoose from 'mongoose';

const mediaLinkSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['movie', 'tv'],
    default: 'movie'
  },
  customUrl: {
    type: String,
    required: false
  },
  customUrl1: String,
  customUrl2: String,
  customUrl3: String,
  title: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const MediaLink = mongoose.model('MediaLink', mediaLinkSchema);
export default MediaLink;

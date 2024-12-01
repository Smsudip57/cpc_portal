import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null, // Optional image URL for the publication
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Scheduled'],
      default: 'Draft',
    },
    scheduledAt: {
      type: Date, // For scheduling future publications
      default: null,
    },
    publishedAt: {
      type: Date, // Timestamp when published
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Link to the admin or editor who created the publication
    },
  },
);

// Models
const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;

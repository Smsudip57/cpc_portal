const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    facebook:{
        //facebook link
        type: String,
    },
    diu:{
        //diu link
        type: String,
    },
    upvotes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    downvotes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
});




const News = mongoose.models.News || mongoose.model('News', newsSchema);

module.exports = News;

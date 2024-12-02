const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    lastdate: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    teamMembers: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    regFee: {
      type: Number,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ]
});



// eventSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };


const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;

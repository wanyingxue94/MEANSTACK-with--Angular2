/**
 * Created by wanyingxue on 2018/3/25.
 */
/**
 * Created by wanyingxue on 2017/12/3.
 */

const mongoose =  require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


// Blog Model Definition
const eventSchema = new Schema({
    eventName: { type: String, required: true},
    detail: { type: String, required: true},
    createdBy: { type: String },
    eventTime: { type: Date, default: Date.now() },
    ticketNumber: { type: Number, default: 0 },
    location: { type: String },
    price:{type: Number},
    paymentTokens: [String],
});

// Export Module/Schema
module.exports = mongoose.model('Event', eventSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

let QuoteSchema = new Schema({
    text: {type: String, required: true, max: 1000},
    author: {type: String, required: false, max: 100},
    isNext: {type: Boolean, required: false},
    dateImageGen: {type: Date, required: false},
    datePub: {type: Date, required: false}
    },
    {timestamps: true}
);

// Export the model
module.exports = mongoose.model('Quote', QuoteSchema);
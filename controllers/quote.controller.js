const Quote = require('../models/quote.model');
var aqp = require('api-query-params');

exports.quote_create = function (req, res, next) {
    let quote = new Quote(
        {
            text: req.body.text,
            author: null,
            dateAdded: Date.now(),
            datePublished: null
        }
    );

    quote.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Quote created succesfully.');
    });
};

exports.quote_details = function (req, res, next) {
    Quote.find(req.params.id, function (err, quotes){
        if (err) return err;
        res.send(quote);
    })
};

exports.quote_all = function (req, res, next) {
    const { filter, skip, limit, sort, projection } = aqp(req.query);
    console.log(filter);
    Quote.find(filter, function (err, quote) {
        if (err) return err;
        res.send(quote);
    });
};

exports.quote_update = function (req, res) {
    Quote.findByIdAndUpdate(req.params.id, { $set: req.body },
        function (err, quote) {
            if (err) return err;
            res.send('Quote updated');
        });
};

exports.quote_delete = function (req, res) {
    Quote.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Quote deleted successfully!');
    })
};
var cron = require('node-cron');
const phantom = require('phantom');
const Quote = require('../models/quote.model');
var DomParser = require('dom-parser');
const path = require('path');
var AWS = require('aws-sdk');

cron.schedule('15 14 1 * *', () => {
  Quote.findOneAndUpdate({ dateImageGen: null, datePub: null }, { $set: { isNext: true } }, { new: true }, function (err, quote) {
    if (err) return err;
    if(quote != null){
      console.log(quote);
      var toScrape = quote._id;
      console.log(toScrape);
      //configuring the AWS environment
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });
      var s3 = new AWS.S3();
      (async function () {
        const instance = await phantom.create();
        const page = await instance.createPage();
        await page.on('onResourceRequested', function (requestData) {
          //console.info('Requesting', requestData.url);
        });
        const status = await page.open('https://imagegen.surge.sh/');
        const content = await page.property('content');

        const parser = new DomParser();
        const dom = parser.parseFromString(content);
        await instance.exit();
        var base64Data = dom.getElementsByTagName('img')[1].getAttribute('src').split(',')[1];
        require("fs").writeFile("quote.png", base64Data, 'base64', function (err) {
          if (err) console.log(err);

          var filePath = "quote.png";
          var params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Body: require("fs").createReadStream(filePath),
            Key: Date.now() + "_" + path.basename(filePath)
          };

          s3.upload(params, function (err, data) {
            if (err) console.log("Error", err);
            if (data){
              console.log("Uploaded in:", data.Location);
              Quote.findByIdAndUpdate(toScrape, {$set: {dateImageGen: Date.now(), isNext: false}}, function(err, quote){
                if(err) console.log(err);
                console.log(quote);
              })            
            } 
          });
        });
      })(1);
    }
  });
});
const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all promotions');
});

promotionRouter.route('/:promotionId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res, next) => {
  let promotionId = req.params.promotionId
  res.end(`Will send promotion number ${promotionId} to you!`);
})
.put((req, res, next) => {
    let promotionId = req.params.promotionId
      res.end(`Will update promotion number ${promotionId} for you!`);
})
.post((req, res, next) => {
    let promotionId = req.params.promotionId
      res.end(`Will create promotion number ${promotionId} for you!`);
})
.delete((req, res, next) => {
    let promotionId = req.params.promotionId
      res.end(`Will delete promotion number ${promotionId} for you!`);
})


module.exports = promotionRouter;

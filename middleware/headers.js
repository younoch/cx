module.exports = function (req, res, next) {
  res.setHeader('Cache-Control', 'max-age=0, no-cache, private');
  next();
};

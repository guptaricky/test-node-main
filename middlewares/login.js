const login = (req, res, next) => {
  console.log("User Already Logged In");
  next();
};

module.exports = login;

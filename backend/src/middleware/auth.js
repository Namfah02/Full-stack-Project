import * as user from "../models/users.js";

export default function auth(access_roles) {
  return function (req, res, next) {

    //renable auth once implemented on the front end
    const authenticationKey = req.get("X-AUTH-KEY");

    if (authenticationKey) {
      user
        .getByAuthenticationKey(authenticationKey)
        .then((user) => {
          if (access_roles.includes(user.role)) {
            next();
          } else {
            res.status(403).json({
              status: 403,
              message: "Access forbidden",
            });
          }
        })
        .catch((error) => {
          res.status(401).json({
            status: 401,
            message: "Authentication key invalid",
          });
        });
    } else {
      res.status(401).json({
        status: 401,
        message: "Authentication key missing",
      });
    }
  };
}

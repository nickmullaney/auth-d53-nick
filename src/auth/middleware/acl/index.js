'use strict';
// delivering that 'capability' being passed in
// Essentially the route handler runs the way it runs with the express defined params entered, we cannot just add capabilities to that precise mix of Params. We can however curry the capabilities to the route handler, By adding the outer function call.The inner function callreturns a proper route handler, and the outer function call deliversthe capability Argument to the properly Define route handler.

module.exports = (capability) => (req, res, next) => {
  try {
    if (req.user.capabilities.includes(capability)) {
      next();
    } else {
      next('Access denied(acl not capable)');
    }
  } catch (e) {
    next('invalid login(acl middleware error', e.message);
  }
};
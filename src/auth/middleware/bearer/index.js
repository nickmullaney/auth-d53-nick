'use strict';

const { userModel } = require('../../models');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Not authorized, no token present!');
  } else {
    try {
      // Auth string should be: Bearer very-long-token
      let authType = req.headers.authorization.split(' ')[0];
      if (authType === 'Bearer'){
        let token = req.headers.authorization.split(' ')[1];
        //remove this before deploying
        // console.log('Token: ',token);
        let validUser = await userModel.authenticateBearer(token);
        if(validUser){
          req.user = validUser;
          next();
        }else{
          next('Send a token in a bearer auth string');
        }

      } 
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

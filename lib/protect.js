module.exports = {

    isLoggedIn(req, res, next) {
        
        if(req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/authentication/signin');
        }

    },

    isNotLoggedIn(req, res, next) {
        
        if(!req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/authentication/profile');
        }

    }


}
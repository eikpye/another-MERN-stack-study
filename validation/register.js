const Validator = require('validator');

module.exports = function validateRegisterInput(data){
    if(!Validator.isLength(data.username, {min: 5, max: 20})){
        let errors = 'Name must be between 2 and 30 characters';
        return errors;
    }
    return null;
};
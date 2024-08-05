const joi = require('@hapi/joi');

const validateUser = (data) => {
    try {
        const validateSchema = joi.object({
            tradeRole: joi.string().min(4).max(6).valid("buyer", "seller", "both").trim().messages({
                'string.empty': "Trade Role field can't be left empty",
                'string.min': "Minimum of 3 characters for the Trade Role field",
                'string.max': "Maximum of 6 characters long for the Trade Role field",
                'any.required': "Please Trade Role is required"
            }),
            state: joi.string().min(4).valid("Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi",
                "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun",
                "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara").trim().messages({
                    'string.empty': "State field can't be left empty",
                    'string.min': "Minimum of 3 characters for the State field",
                    'any.required': "Please State is required"
                }),
            email: joi.string().max(50).trim().email({ tlds: { allow: false } }).required().messages({
                'string.empty': "Email field can't be left empty",
                'any.required': "Please Email is required"
            }),
            password: joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required"
            }),
            confirmPassword: joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).valid(joi.ref('password')).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required",
                'any.only': 'Passwords do not match',
            }),
            company: joi.string().min(3).max(30).regex(/^[a-zA-Z0-9\s_\-!@#$%^&*()]*$/).trim().messages({
                'string.empty': "Company field can't be left empty",
                'string.min': "Minimum of 3 characters for the Company field",
                'string.max': "Maximum of 30 characters long for the Company field",
                "string.pattern.base": "Please enter a valid Company",
                'any.required': "Please Company is required"
            }),
            firstName: joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).trim().messages({
                'string.empty': "First name field can't be left empty",
                'string.min': "Minimum of 3 characters for the first name field",
            }),
            lastName: joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).trim().messages({
                'string.empty': "Last name field can't be left empty",
                'string.min': "Minimum of 3 characters for the last name field",
            }),
            tel: joi.string().min(11).max(11).trim().regex(/^0\d{10}$/).messages({
                'string.empty': "Tel field can't be left empty",
                'string.min': "Tel must be atleast 11 digit long e.g: 08123456789",
                'string.pattern.base': "Tel must be atleast 10 digit long e.g: 8123456789",
                'any.required': "Please Tel is required"
            }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        throw error
    }
}



const validateUserLogin = (data) => {
    try {
        const validateSchema = joi.object({
            email: joi.string().max(50).trim().email({ tlds: { allow: false } }).messages({
                'string.empty': "Email field can't be left empty",
                'any.required': "Please Email is required"
            }),
            password: joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required"
            }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        throw error
    }
}



const validateResetPassword = (data) => {
    try {
        const validateSchema = joi.object({
            password: joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required"
            }),
            confirmPassword: joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).valid(joi.ref('password')).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required",
                'any.only': 'Passwords do not match',
            }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        throw error
    }
}

const validateMessage = (data) => {
    try {
        const validateSchema = joi.object({
            Account: joi.string().min(3).regex(/^[a-zA-Z]+$/).valid("Finding", "Products/Suppliers", "Messenger", "Order", "Checkout", "Return and Refund", "Others", "Logistics").trim().required().messages({
                'string.empty': "First name field can't be left empty",
                'string.min': "Minimum of 3 characters for the first name field",
                'any.required': "Please first name is required",
                "string.pattern.base": "Please no space is allowed/No special characters allowed"
            }),
            selectAreason: joi.string().min(3).regex(/^[a-zA-Z]+$/).valid("Verification code expired", "Didn't receive verification code", "Number of verification codes sent has exceeded the daily limit", "Unable to change email address", "Password retrieval failed", "Unable to login the current account", "Account registration failed", "Others").trim().required().messages({
                'string.empty': "Last name field can't be left empty",
                'string.min': "Minimum of 3 characters for the last name field",
                'any.required': "Please last name is required"
            }),
            writeMore: joi.string().min(3).trim().required().messages({
                'string.empty': "Last name field can't be left empty",
                'string.min': "Minimum of 3 characters for the last name field",
                'any.required': "Please last name is required"
            }),
            email: joi.string().max(40).trim().email({ tlds: { allow: false } }).messages({
                'string.empty': "Email field can't be left empty",
                'any.required': "Please Email is required"
            }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        throw error
    }
}



const validateUserPersonalProfile = (data) => {
    try {
        const validateSchema = joi.object({
            tradeRole: joi.string().min(4).max(6).valid("buyer", "seller", "both").trim().messages({
                'string.empty': "Trade Role field can't be left empty",
                'string.min': "Minimum of 3 characters for the Trade Role field",
                'string.max': "Maximum of 6 characters long for the Trade Role field",
                'any.required': "Please Trade Role is required"
            }),
            state: joi.string().min(4).valid("Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi",
                "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun",
                "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara").trim().messages({
                    'string.empty': "State field can't be left empty",
                    'string.min': "Minimum of 3 characters for the State field",
                    'any.required': "Please State is required"
                }),
            email: joi.string().max(50).trim().email({ tlds: { allow: false } }).required().messages({
                'string.empty': "Email field can't be left empty",
                'any.required': "Please Email is required"
            }),
            password: joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required"
            }),
            confirmPassword: joi.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).valid(joi.ref('password')).trim().required().messages({
                'string.empty': "Password field can't be left empty",
                'string.pattern.base': 'Password must contain Lowercase, Uppercase, Numbers, and special characters',
                'string.min': "Password must be at least 8 characters long",
                'any.required': "Please password field is required",
                'any.only': 'Passwords do not match',
            }),
            company: joi.string().min(3).max(30).regex(/^[a-zA-Z0-9\s_\-!@#$%^&*()]*$/).trim().messages({
                'string.empty': "Company field can't be left empty",
                'string.min': "Minimum of 3 characters for the Company field",
                'string.max': "Maximum of 30 characters long for the Company field",
                "string.pattern.base": "Please enter a valid Company",
                'any.required': "Please Company is required"
            }),
            firstName: joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).trim().messages({
                'string.empty': "First name field can't be left empty",
                'string.min': "Minimum of 3 characters for the first name field",
            }),
            lastName: joi.string().min(3).max(30).regex(/^[a-zA-Z]+$/).trim().messages({
                'string.empty': "Last name field can't be left empty",
                'string.min': "Minimum of 3 characters for the last name field",
            }),
            tel: joi.string().min(11).max(11).trim().regex(/^0\d{10}$/).messages({
                'string.empty': "Tel field can't be left empty",
                'string.min': "Tel must be atleast 11 digit long e.g: 08123456789",
                'string.pattern.base': "Tel must be atleast 10 digit long e.g: 8123456789",
                'any.required': "Please Tel is required"
            }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        throw error
    }
}


const validatePackage = (data) => {
    try {
        const validateSchema = joi.object({
            shippingDate: joi.date().iso().required().label('Shipping Date').messages({
                'date.base': '"Shipping Date" should be a valid date',
                'date.format': '"Shipping Date" should be in ISO format',
                'any.required': '"Shipping Date" is a required field'
              }),
              sendersName: joi.string().min(3).max(50).required().label('Sender\'s Name').messages({
                'string.base': '"Sender\'s Name" should be a type of text',
                'string.min': '"Sender\'s Name" should have a minimum length of {#limit}',
                'string.max': '"Sender\'s Name" should have a maximum length of {#limit}',
                'any.required': '"Sender\'s Name" is a required field'
              }),
              sendersPhoneNumber: joi.string().pattern(/^[0-9]{10,15}$/).required().label('Sender\'s Phone Number').messages({
                'string.base': '"Sender\'s Phone Number" should be a type of text',
                'string.pattern.base': '"Sender\'s Phone Number" should contain only digits and be 10 to 15 characters long',
                'any.required': '"Sender\'s Phone Number" is a required field'
              }),
              sendersAddress: joi.string().min(3).max(100).required().label('Sender\'s Address').messages({
                'string.base': '"Sender\'s Address" should be a type of text',
                'string.min': '"Sender\'s Address" should have a minimum length of {#limit}',
                'string.max': '"Sender\'s Address" should have a maximum length of {#limit}',
                'any.required': '"Sender\'s Address" is a required field'
              }),
              receiversName: joi.string().min(3).max(50).required().label('Receiver\'s Name').messages({
                'string.base': '"Receiver\'s Name" should be a type of text',
                'string.min': '"Receiver\'s Name" should have a minimum length of {#limit}',
                'string.max': '"Receiver\'s Name" should have a maximum length of {#limit}',
                'any.required': '"Receiver\'s Name" is a required field'
              }),
              receiversPhoneNumber: joi.string().pattern(/^[0-9]{10,15}$/).required().label('Receiver\'s Phone Number').messages({
                'string.base': '"Receiver\'s Phone Number" should be a type of text',
                'string.pattern.base': '"Receiver\'s Phone Number" should contain only digits and be 10 to 15 characters long',
                'any.required': '"Receiver\'s Phone Number" is a required field'
              }),
              receiversEmail: joi.string().email().required().label('Receiver\'s Email').messages({
                'string.base': '"Receiver\'s Email" should be a type of text',
                'string.email': '"Receiver\'s Email" must be a valid email',
                'any.required': '"Receiver\'s Email" is a required field'
              }),
              receiversAddress: joi.string().min(3).max(100).required().label('Receiver\'s Address').messages({
                'string.base': '"Receiver\'s Address" should be a type of text',
                'string.min': '"Receiver\'s Address" should have a minimum length of {#limit}',
                'string.max': '"Receiver\'s Address" should have a maximum length of {#limit}',
                'any.required': '"Receiver\'s Address" is a required field'
              }),
              receiversCity: joi.string().min(2).max(50).required().label('Receiver\'s City').messages({
                'string.base': '"Receiver\'s City" should be a type of text',
                'string.min': '"Receiver\'s City" should have a minimum length of {#limit}',
                'string.max': '"Receiver\'s City" should have a maximum length of {#limit}',
                'any.required': '"Receiver\'s City" is a required field'
              }),
              receiversPostalCode: joi.string().pattern(/^[0-9A-Za-z -]{3,10}$/).required().label('Receiver\'s Postal Code').messages({
                'string.base': '"Receiver\'s Postal Code" should be a type of text',
                'string.pattern.base': '"Receiver\'s Postal Code" should be alphanumeric and 3 to 10 characters long',
                'any.required': '"Receiver\'s Postal Code" is a required field'
              }),
              receiversCountry: joi.string().min(2).max(50).required().label('Receiver\'s Country').messages({
                'string.base': '"Receiver\'s Country" should be a type of text',
                'string.min': '"Receiver\'s Country" should have a minimum length of {#limit}',
                'string.max': '"Receiver\'s Country" should have a maximum length of {#limit}',
                'any.required': '"Receiver\'s Country" is a required field'
              }),
              description: joi.string().min(5).max(500).required().label('Description').messages({
                'string.base': '"Description" should be a type of text',
                'string.min': '"Description" should have a minimum length of {#limit}',
                'string.max': '"Description" should have a maximum length of {#limit}',
                'any.required': '"Description" is a required field'
              }),
              dimensions: joi.string().min(5).max(50).required().label('Dimensions').messages({
                'string.base': '"Dimensions" should be a type of text',
                'string.min': '"Dimensions" should have a minimum length of {#limit}',
                'string.max': '"Dimensions" should have a maximum length of {#limit}',
                'any.required': '"Dimensions" is a required field'
              }),
              shipmentStatus: joi.string().required().label('Shipment Status').messages({
                'string.base': '"Shipment Status" should be a type of text',
                'any.only': '"Shipment Status" must be one of [Pending, Shipped, Delivered, Cancelled]',
                'any.required': '"Shipment Status" is a required field'
              }),
              shippingCondition: joi.string().min(5).max(100).required().label('Shipping Condition').messages({
                'string.base': '"Shipping Condition" should be a type of text',
                'string.min': '"Shipping Condition" should have a minimum length of {#limit}',
                'string.max': '"Shipping Condition" should have a maximum length of {#limit}',
                'any.required': '"Shipping Condition" is a required field'
              }),
              trackingId: joi.string().min(10).max(30).required().label('Tracking ID').messages({
                'string.base': '"Tracking ID" should be a type of text',
                'string.min': '"Tracking ID" should have a minimum length of {#limit}',
                'string.max': '"Tracking ID" should have a maximum length of {#limit}',
                'any.required': '"Tracking ID" is a required field'
              }),
              parcelCode: joi.string().min(5).max(20).required().label('Parcel Code').messages({
                'string.base': '"Parcel Code" should be a type of text',
                'string.min': '"Parcel Code" should have a minimum length of {#limit}',
                'string.max': '"Parcel Code" should have a maximum length of {#limit}',
                'any.required': '"Parcel Code" is a required field'
              }),
              parcelExpectedDate: joi.date().iso().required().label('Parcel Expected Date').messages({
                'date.base': '"Parcel Expected Date" should be a valid date',
                'date.format': '"Parcel Expected Date" should be in ISO format',
                'any.required': '"Parcel Expected Date" is a required field'
              }),
        })
        return validateSchema.validate(data);
    } catch (error) {
        throw error
    }
}




module.exports = {
    validateUser,
    validateUserLogin,
    validateResetPassword,
    validateMessage, 
    validateUserPersonalProfile,
    validatePackage,

}
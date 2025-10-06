module.exports = (schema) => (req, res, next) => {
    const {error} = schema.validate(req.body,{ abortEarly: false, convert: true});

    if(error){
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details.map(d => ({message: d.message, path: d.path}))
        });
    }

    next();
};
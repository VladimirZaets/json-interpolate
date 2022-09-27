class JSONInterpolateError extends Error {
    constructor(message, context) {
        super(message);
        this.name = "JSONInterpolateError";
        this.context = context;        
    };
}

class VariableTypeError extends JSONInterpolateError {
    constructor(message, context) {
        super(message, context);
        this.name = "VariableTypeError";     
    };
}

class MissedVariableError extends JSONInterpolateError {
    constructor(message, context) {
        super(message, context);
        this.name = "MissedVariableError";     
    };
}

class VariableDeclarationError extends JSONInterpolateError {
    constructor(message, context) {
        super(message, context);
        this.name = "VariableDeclarationError";     
    };
}

class JSONInterpolateAggregateError extends Error {
    constructor(message, list) {
        super(message);
        this.name = "JSONInterpolateAggregateError";
        this.list = list || [];
    };
}

class ValidationTypeNonExistError extends JSONInterpolateError {
    constructor(message, context) {
        super(message, context);
        this.name = "ValidationTypeNonExistError";    
    };
}

module.exports = {
    ValidationTypeNonExistError,
    VariableTypeError,
    VariableDeclarationError,
    JSONInterpolateError,
    JSONInterpolateAggregateError,
    MissedVariableError
}

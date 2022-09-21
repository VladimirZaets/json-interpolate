const validator = require('validator');
const vl = {
    string(value) {
        return typeof value === 'string'
    },
    int(value) {
        return Number.isInteger(value)
    },
    url(value) {
        return validator.isUrl(value)
    }
}

module.exports = (type, value) => {
    const typeTransform = 
        type.charAt(0).toUpperCase() + 
        type.slice(1);

        if (!vl[type]) {
            return new Error(`The type "${type}" doesn't exist in validation library.`);
        }

        return vl[type](value)
};
/**
 * Created by arolave on 15/11/2016.
 */
const ngcsUtils = {
    size(arr) {
        if (!arr)
            return 0;

        return arr.length;
    },
    last(arr) {
        if (!arr)
            return undefined;

        return arr[arr.length - 1];
    },
    isEmpty: function isEmpty(val) {
        if (val == null) return true;

        if (Array.isArray(val) || typeof val === 'string') {
            return val.length === 0;
        }

        if (typeof val === 'object') {
            return Object.keys(val).length === 0;
        }

        return false;
    }
};

module.exports = ngcsUtils;

/**
 * Higher-order function for async awair error handling
 *
 */

export const catchErrors = fn => {
    return function(...args) {
        return fn(...args).catch((err) => {
            console.error(err);
        })
    }
}
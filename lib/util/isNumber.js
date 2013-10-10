/*
 * tells whatever given object represents a number
 * sighly modified from an answer found at stackoverflow
 * see http://stackoverflow.com/a/1830844/1894803
 */

exports = module.exports = isNumber

exports.version = "2";
exports.stability = 2;

function isNumber( o ) {
    o = ( String( o ) ).replace( /,/g, '.' );
    return !isNaN( parseFloat( o ) ) && isFinite( o );
}

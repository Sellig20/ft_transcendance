function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { curry } from 'ramda';
import renameKeys from './renameKeys';

/**
 * Creates a new object with the own properties of the provided object, but a
 * single key is renamed from `oldKey` to `newKey`.
 *
 * Keep in mind that in the case of keys conflict is behavior undefined and
 * the result may vary between various JS engines!
 *
 * @func renameKey
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/4.1.0|v4.1.0}
 * @category Object
 * @sig (String a, String b) => a -> b ->  {a: *} -> {b: *}
 * @param {!string} oldKey
 * @param {!string} newKey
 * @param {!Object} obj
 * @return {!Object} New object with renamed key
 * @see {@link https://github.com/ramda/ramda/wiki/Cookbook#rename-key-of-an-object|Ramda Cookbook}, {@link RA.renameKeyWith|renameKeyWith}
 * @example
 *
 * const input = { firstName: 'Elisia', age: 22, type: 'human' };
 *
 * RA.renameKey('firstName', 'name')(input);
 * //=> { name: 'Elisia', age: 22, type: 'human' }
 */
var renameKey = curry(function (oldKey, newKey, obj) {
  return renameKeys(_defineProperty({}, oldKey, newKey), obj);
});
export default renameKey;
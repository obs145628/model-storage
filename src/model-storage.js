/**
 * model-storage 1.0.0
 * @author Steven Lariau
 */

(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    define([], function(){
      return (root.modelStorage = factory());
    });
  } else if(typeof module === "object" && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.modelStorage = factory());
  } else {
    root.modelStorage = factory();
  }
}(this, function() {

  var _ = {};


  //Library definition


  //#Events

  var _events = {};

  /**
   * Register to a localStorage event
   * @param {string} name
   * @param {Function} callback
   */
  function on(name, callback)
  {
    if(!_events[name])
      _events[name] = [];
    _events[name].push(callback);
  }
  _.on = on;

  /**
   * Unregister from a localStorage event
   * @param {string} name
   * @param {Function} callback
   */
  function off(name, callback)
  {
    var events = _events[name];
    if(!events)
      return;
    var pos = events.indexOf(callback)
    if(pos !== -1)
      events.splice(pos, 1);
  }
  _.off = off;

  /**
   * Register for a set event on a specific item of the localStorage
   * @param {string} key
   * @param {Function} callback
   */
  function onChange(key, callback)
  {
    on("set_" + key, callback);
  }
  _.onChange = onChange;

  /**
   * Unregister for a set event on a specific item of the localStorage
   * @param {string} key
   * @param {Function} callback
   */
  function offChange(key, callback)
  {
    off("set_" + key, callback);
  }
  _.offChange = offChange;

  function triggerEvent(name)
  {
    var args = Array.prototype.slice.call(arguments, 1);
    var events = _events[name];
    if(!events)
      return;
    for(var i = 0; i < events.length; ++i)
      events[i].apply(null, args);
  }

  //#Options

  var _serialize = JSON.stringify;
  var _unserialize = JSON.parse;
  var _store = this && this.localStorage ? this.localStorage : null;


  /**
   * Change the function used to serialize objects (default: JSON.stringify)
   * @param {Function} fn
   */
  function setSerialize(fn)
  {
    _serialize = fn;
  }
  _.setSerialize = setSerialize;

  /**
   * Change the function used to unserialize objects (default: JSON.parse)
   * @param {Function} fn
   */
  function setUnserialize(fn)
  {
    _unserialize = fn;
  }
  _.setUnserialize = setUnserialize;

  /**
   * Replace the default localStorage object by any other Storage-like object
   * @param {Storage} storage
   */
  function setStorage(storage)
  {
    _store = storage;
  }
  _.setStorage = setStorage;


  //#Lib

  /**
   * Test if a key exists in the localStorage
   * @param {string} key
   * @return {boolean}
   */
  function has(key)
  {
    return _store.getItem(key) !== null;
  }
  _.has = has;

  /**
   * Returns an item from the localStorage
   * @param {string} key
   * @return {any}
   */
  function get(key)
  {
    return _unserialize(_store.getItem(key));
  }
  _.get = get;

  /**
   * Set the value of an item in the localStorage
   * @param {string} key
   * @param {any} value
   */
  function set(key, value)
  {
    _store.setItem(key, _serialize(value));
    triggerEvent("set_" + key, value);
    triggerEvent("set", key, value);
  }
  _.set = set;

  /**
   * Get the value of an item in the localStorage
   * or initialize it's value if it doesn't exist
   * Returns the value of the item
   * @param {string} key
   * @param {any} value
   * @return {any}
   */
  function def(key, value)
  {
    var storeValue = _store.getItem(key);

    if(storeValue === null)
    {
      set(key, value);
      return value;
    }
    else
    {
      return _unserialize(storeValue);
    }
  }
  _.def = def;

  /**
   * Remove an item from the localStorage
   * @param {strig} key
   */
  function remove(key)
  {
    if(has(key))
    {
      _store.removeItem(key);
      triggerEvent("remove_" + key);
      triggerEvent("remove", key);
    }
  }
  _.remove = remove;

  /**
   * Remove all items from the localStorage
   */
  function clear()
  {
    var k = keys();
    _store.clear();
    for(var i = 0; i < k.length; ++i)
    {
      triggerEvent("remove_" + k[i]);
      triggerEvent("remove", k[i]);
    }
    triggerEvent("clear");
  };
  _.clear = clear;

  /**
   * Returns the number of keys in the localStorage
   * @return {int}
   */
  function size()
  {
    return _store.length;
  }
  _.size = size;

  /**
   * Returns the list of keys in the localStorage
   * @return {string[]}
   */
  function keys()
  {
    var res = [];
    for(var i = 0; i < _store.length; ++i)
      res[i] = _store.key(i);
    return res;
  }
  _.keys = keys;





  return _;
 }));

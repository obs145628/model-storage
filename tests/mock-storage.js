var fs = require("fs");
var path = require("path");

var URL = path.join(__dirname, "store.json");

var data = JSON.parse(fs.readFileSync(URL));
var keys = [];
for(var key in data)
    keys.push(key);


var mustBeSaved = false;
var saving = false;

function saveData()
{
    fs.writeFileSync(URL, JSON.stringify(data));
}

function hasKey(key)
{
    return typeof data[key] !== "undefined";
}

var store = {
    length: keys.length,

    key: function(key)
    {
        return keys[key];
    },

    getItem: function(key)
    {
        if(hasKey(key))
            return data[key];
        else
            return null;
    },

    setItem: function(key, value)
    {
        if(!hasKey(key))
        {
            keys.push(key);
            ++store.length;
        }

        data[key] = value.toString();
        saveData();
    },

    removeItem: function(key)
    {
        if(!hasKey(key))
            return;

        keys.splice(keys.indexOf(key), 1);
        delete data[key];
        --store.length;
        saveData();
    },

    clear: function()
    {
        store.length = 0;
        keys.length = 0;
        data = {};
        saveData();
    }

}

module.exports = store;

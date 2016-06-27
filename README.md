# model-storage

model-storage is a browser-side javascript library to store and load objects in the localStorage, and listen to events.

## Usage


```javascript
var name = modelStorage.get("name");
modelStorage.set("message", "Hello World !");

modelStorage.has("unknown"); //false
var a = modelStorage.def("message", "init"); //a = "Hello World !"
var b = modelStorage.def("unknown", "init"); //b = "init";
modelStorage.has("unknown"); //true

modelStorage.onChange("key", function(value) {

});
```
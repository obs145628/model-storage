var ms = require("../src/model-storage");
ms.setStorage(require("./mock-storage"));

ms.onChange("a", function(value) {
    console.log("[SET a]: ", value);
});

ms.on("set", function(key, value) {
    console.log("[SET]: ", key, value);
});

ms.on("remove", function(key, value) {
    console.log("[REMOVE]: ", key);
});

ms.on("clear", function() {
    console.log("[CLEAR]");
});

ms.set("a", [8, 12]);
ms.set("b", 29);
ms.set("c", "44");

console.log("X = " + ms.def("x", new Date().getTime()));

console.log(ms.size());
console.log(ms.keys());


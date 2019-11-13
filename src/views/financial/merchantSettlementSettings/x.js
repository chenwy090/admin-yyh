var a = 0;
console.log(a)
var arr = [1, 2, 3];
for (var i = 0; i < 10000; i++) {
    arr.push(i);
}
let b = arr.forEach(function (item) {
    console.log(item)
});
console.log("b", b);
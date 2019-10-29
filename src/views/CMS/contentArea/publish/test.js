var data = [{ "cityName": "上海市", "cityCode": "310100", "shortName": "上海" }, { "cityName": "无锡市", "cityCode": "320200", "shortName": "无锡" }, { "cityName": "杭州市", "cityCode": "330100", "shortName": "杭州" }]


var arr = ["310100", "320200"]

var res = data.filter(item => {

    for (let i = 0; i < arr.length; i++) {
        if (item.cityCode == arr[i]) {
            return true;
        }
    }
});

console.log(res);



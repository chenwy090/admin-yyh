import {
    Message
} from 'iview';

// 时间格式化
export function formatDate(date, fmt) {
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

//图片尺寸


export function checkImageWH(file, width, height, fmt) {
    let self = this;
    return new Promise(function (resolve, reject) {
        if (file.type != "image/gif" && file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/bmp") {

            Message.error("图片格式只能选择png/jpeg/jpg/bmp");
            reject();
        }

        let filereader = new FileReader();
        filereader.onload = e => {

            let src = e.target.result;
            const image = new Image();
            image.onload = function () {
                if (width && this.width != width) {
                    Message.error("请上传宽为" + width + "的图片");


                    reject();
                } else if (height && this.height != height) {
                    Message.error("请上传高为" + height + "的图片");


                    reject();
                } else {
                    resolve();
                }
            };
            image.onerror = reject;
            image.src = src;
        };
        filereader.readAsDataURL(file);
    });
    return fmt
}

//图片尺寸


export function getImageWH(file, fmt) {
    let self = this;
    return new Promise(function (resolve, reject) {
        if (file.type != "image/gif" && file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/bmp") {

            Message.error("图片格式只能选择png/jpeg/jpg/bmp");
            reject();
        }

        let filereader = new FileReader();
        filereader.onload = e => {

            let src = e.target.result;
            const image = new Image();
            image.onload = function () {
                resolve({ w: this.width, h: this.height });
            };
            image.onerror = reject;
            image.src = src;
        };
        filereader.readAsDataURL(file);
    });
    return fmt
}

//图片尺寸


export function checkImage(file, fmt) {
    let self = this;
    return new Promise(function (resolve, reject) {
        if (file.type != "image/gif" && file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/bmp") {
            Message.error("图片格式只能选择gif/png/jpeg/jpg/bmp");
            reject();
        }

        let filereader = new FileReader();
        filereader.onload = e => {

            let src = e.target.result;
            const image = new Image();

            resolve();

            image.onerror = reject;
            image.src = src;
        };
        filereader.readAsDataURL(file);
    });
    return fmt
}



//整数校验

export function checkInteger(text, value, fmt) {
    let self = this;
    return new Promise(function (resolve, reject) {
        let integerReg = /^[1-9]\d*$/;

        if (!integerReg.test(value) && value !== "") {

            Message.error(text + "请输入正整数");
            return;
        } else {
            resolve();
        }
    });
    return fmt
}



//保留两位小数点校验

export function checkTwoDecimal(text, value, fmt) {
    let self = this;
    return new Promise(function (resolve, reject) {
        let integerReg = /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/;

        if (!integerReg.test(value) && value !== "") {

            Message.error(text + "最多为两位小数点");
            return;
        } else {
            resolve();
        }
    });
    return fmt
}


//数据去重复 
export function uniqueArray(array, id) {
    var result = [array[0]];
    for (var i = 1; i < array.length; i++) {
        var item = array[i];
        var repeat = false;
        for (var j = 0; j < result.length; j++) {
            if (item[id] == result[j][id]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            result.push(item);
        }
    }
    return result;
}
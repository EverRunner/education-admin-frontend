import { FILE_ROOT } from "@config";
import dayjs from "moment-timezone";

/**
 * 图片地址格式化
 * @param {*} rawImg 图片地址
 */

export function formatImg(rawImg) {
  if (rawImg) return FILE_ROOT + rawImg;
  else return "";
}

/**
 * 日期时间格式化
 * @param {*} dateTime 日期时间
 * @param {*} forma  格式类型
 * @returns {string}
 */
export function formatDateTime(dateTime, forma = "MM/DD/YYYY HH:mm") {
  if (!dateTime) return "-";

  return (
    dayjs(dateTime)
      // .utcOffset("+00:00") //时区-世界协同时间
      .format(forma)
  );
}

/**
 * 日期时间格式化（不在时区）
 * @param {*} dateTime 日期时间
 * @param {*} forma  格式类型
 * @returns {string}
 */
export function formatDateNoTimezone(dateTime, forma = "MM/DD/YYYY HH:mm") {
  if (!dateTime) return "-";

  return (
    dayjs(dateTime)
      // .utcOffset("+00:00") //时区-世界协同时间
      .format(forma)
  );
}

/**
 * 生成字母选项（ABCD...）
 * @param {*} num 数字从0开始
 */
export function creationLetter(num) {
  const ascii = num + 65;

  if (!isNaN(num) && ascii < 65 && ascii >= 91) return "-";
  return String.fromCharCode(ascii);
}

/**
 * 格式化货币，保留2位小数
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
export function formatCurrency(num) {
  if (!num) return 0;

  num = num.toString().replace(/\$|\,/g, "");
  if (isNaN(num)) {
    num = "0";
  }

  let sign = num == (num = Math.abs(num)); //数字是否为正负数  Math.abs() 返回参数的绝对值
  num = Math.floor(num * 100 + 0.50000000001); //返回小于等于num*100+0.50000000001的最大整数:
  let cents = num % 100; //小数位数
  num = Math.floor(num / 100).toString(); //整数位数
  if (cents < 10) {
    cents = "0" + cents; //小数位补0
  }
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    // 货币，三位数字一间隔
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      "," +
      num.substring(num.length - (4 * i + 3));
  }
  return (sign ? "" : "-") + num + "." + cents;
}

/**
 * 计算两个时间之差
 * @param sDate1 时间1
 * @param sDate1 时间2
 */
export function dateDifference(sDate1, sDate2) {
  sDate1 = Date.parse(dayjs(sDate1).format("YYYY-MM-DD"));
  sDate2 = Date.parse(dayjs(sDate2).format("YYYY-MM-DD"));

  let dateSpan = Math.abs(sDate2 - sDate1);

  return Math.floor(dateSpan / (24 * 3600 * 1000));
}

/**
 * 计算两个时间之差（分钟）
 * @param sDate1 时间1
 * @param sDate2 时间2
 */
// export function minutesBetween(sDate1, sDate2) {
//   sDate1 = Date.parse(dayjs(sDate1).format("YYYY-MM-DD HH:mm:ss"));
//   sDate2 = Date.parse(dayjs(sDate2).format("YYYY-MM-DD HH:mm:ss"));

//   let dateSpan = Math.abs(sDate2 - sDate1);

//   return (dateSpan / (60 * 1000)).toFixed(2)
// }

/**
 * 获取两个日期时间之间的持续时间
 * @param startTime
 * @param dateString2
 * @param type (years、months、days、hours、minutes、seconds)
 * @returns {number}
 */
export function dateDiff(endTime, startTime, type = "days") {
  if (!endTime || !startTime) return 0;

  const diffNumber = dayjs(dayjs(endTime).format("YYYY-MM-DD HH:mm:ss")).diff(
    dayjs(dayjs(startTime).format("YYYY-MM-DD HH:mm:ss")),
    type
  );

  return Math.abs(diffNumber);
}

/**
 * 数组对象排序方法
 */
export function arrayCompare(prop) {
  return function(a, b) {
    return b[prop] - a[prop]; // 降序
    //  return a[prop] - b[prop]  // 升序
  };
}

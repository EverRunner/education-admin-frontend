import {
  formatDateTime,
  formatDateNoTimezone,
  formatImg,
  formatCurrency,
  dateDiff,
} from "@utils/tools";

/**
 * 图片地址格式化
 * @param {*} rawImg 图片地址
 */
export const formatImage = (rawImg) => {
  return formatImg(rawImg);
};

/**
 * 日期时间过滤
 * @param {*} dateTime 日期时间
 * @param {*} forma  格式
 * @returns {string}
 */
export const formatDate = (dateTime, format) => {
  return formatDateTime(dateTime, format);
};

/**
 * 日期时间过滤（不在时区）
 * @param {*} dateTime 日期时间
 * @param {*} forma  格式
 * @returns {string}
 */
export const formatDateNoZone = (dateTime, format) => {
  return formatDateNoTimezone(dateTime, format);
};

/**
 * 格式化货币，保留2位小数
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
export const formatMoney = (dateTime, format) => {
  return formatCurrency(dateTime, format);
};

// dezhenzhao   id=2829
// Xiuli Man   id=3113
// aijunxiong  id=3118

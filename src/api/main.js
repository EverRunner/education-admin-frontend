import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const REVIEW = "/review/";
const USER = "/user/";
const ORDER = "/order/";

/**
 * 获取浏览记录统计（分页）
 * @param {*} params
 */
export async function getPageReviewList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(REVIEW + "getmemberpagereviewlist", {
      params: {
        ...params,
        ...pages,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户访问数量前五的页面
 * @param {*} params
 */
export async function getReviewmostFive(limit) {
  try {
    return await API.get(USER + "getusermostreviewpage", {
      params: {},
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户跳出率最高的页面
 * @param {*} params
 */
export async function getMmostredirectPage(limit) {
  try {
    return await API.get(USER + "getusermostredirectpage", {
      params: {},
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户跳出率最高的页面
 * @param {*} params
 */
export async function getLastweekreview(limit) {
  try {
    return await API.get(USER + "getuserlastweekreview", {
      params: {},
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 营收统计（最近7天每天的订单）
 * @param {*} params
 */
export async function getWeekdaysorderTotal(limit) {
  try {
    return await API.get(ORDER + "getlastweekdaysordertotalconst", {
      params: {},
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取获取易错题库（分页）
 * @param {*} params
 */
export async function getErrorResPageList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get("/requestion/geterrorrespagelist", {
      params: {
        ...params,
        ...pages,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 某段时间内的用户访问详情（去重）
 * @param {*} params
 */
export async function getMemberVisitList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(REVIEW + "getmemberreviewbydistinct", {
      params: {
        ...params,
        ...pages,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取访问统计（渠道）
 * @param {*} params
 */
export async function getReviewmosChannel(type) {
  try {
    return await API.get(REVIEW + "getreviewstaticsbycategory", {
      params: {
        type,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取访问统计（访问设备）
 * @param {*} params
 */
export async function getReviewmosFacility(category) {
  try {
    return await API.get(REVIEW + "getreviewstatics", {
      params: {
        category,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取本月订单数量和金额汇总
 */
export async function getCurrentMonthOrDer() {
  try {
    return await API.get(ORDER + "getcurrentmonthordertotal", {
      params: {},
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 学员学习状态汇总
 * @param {*} params
 */
export async function getMemberStudyStatics(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(USER + "memberstaticsplus", {
      params: {
        ...params,
        ...pages,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取注册用户渠道统计
 * @param {*} params
 */
export async function getRegisterChannelStatics(category) {
  try {
    return await API.get(USER + "getmemberchannelstatics", {
      params: {
        category,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户访问量统计
 */
export async function getViewConstStatics(params) {
  try {
    return await API.get(REVIEW + "getewviewconststatics", {
      params,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

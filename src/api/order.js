import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const ORDER = "/order/";

/**
 * 获取订单列表（分页）
 * @param {*} params
 */
export async function getOrderList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(ORDER + "getdcwordspagelist", {
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
 * 获取订单统计
 */
export async function getOrderStatics() {
  try {
    return await API.get(ORDER + "getorderstatics", {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 添加订单
 */
export async function addOrder(params) {
  try {
    return await API.post(ORDER + "creatorderbymanage", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取本周订单情况
 */
export async function getWeekMemberOrderList() {
  try {
    return await API.get(ORDER + "getlastweekmembertestlist", {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取最近7天订单汇总
 */
export async function getLastSevenDayStatics() {
  try {
    return await API.get(ORDER + "getlastsevendayorderstatics", {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取订单综合统计
 */
export async function getOrderZhStatics(params) {
  try {
    return await API.get(ORDER + "getorderzhstatics", {
      params,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

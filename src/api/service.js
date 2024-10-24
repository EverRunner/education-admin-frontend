import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const IM = "/im";

/**
 * 获取游客列表
 */
export async function getYoukeList(
  pages = {
    pageindex: 1,
    pagesize: 100,
  }
) {
  try {
    return await API.get(IM + "/getyoukepagelist", {
      params: pages,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 发送消息给
 */
export async function sendYoukeMsg(params) {
  try {
    return await API.post(IM + "/sendyoukemsg", params, {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取未读游客消息（所有游客）
 */
export async function getYoukeMsgAll(
  pages = {
    pageindex: 1,
    pagesize: 100,
  }
) {
  try {
    return await API.get(IM + "/getyoukemsgall", {
      params: pages,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取和某个游客消息
 */
export async function getOnlyYoukeMsg(params) {
  try {
    return await API.get(IM + "/getonlyyoukemsg", {
      params,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 游客标记消息为已读
 */
export async function readYoukeMsg(params) {
  try {
    return await API.post(IM + "/readyoukemsg", params, {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

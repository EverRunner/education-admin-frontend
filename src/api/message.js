import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const NOTICE = "/notice/";
const CONTENT = "/content/";
const YOUTUBE_EMAIL_GATHER = "/youtubeEmailGather/";
const APP_UPDATE = "/app/";

/**
 * 获取Youtube邮件列表
 * @param {*} params
 */
export async function getYoutubeEmailGather(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(YOUTUBE_EMAIL_GATHER + "pageList", {
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
 * 获取站内信和通知消息发送列表
 * @param {*} params
 */
export async function getSendNoticeList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(NOTICE + "getsendnoticepagelist", {
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
 * 获取某次通知消息发送明细
 * @param {*} params
 */
export async function getNoticeSendDetail(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(NOTICE + "getnoticesenddetail", {
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
 * 批量发送消息给用户组
 */
export async function sendNoticeToUserCategory(params) {
  try {
    return await API.post(NOTICE + "sendnoticetousercategory", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取我的通知公告列表
 * @param {*} params
 */
export async function getMyContentNotice(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(CONTENT + "getcontentnoticepagelist", {
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
 * 添加通知公告
 */
export async function addContentNotice(params) {
  try {
    return await API.post(CONTENT + "saveaddcontentnotice", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑通知公告
 */
export async function editContentNotice(params) {
  try {
    return await API.post(CONTENT + "saveeditcontentnotice", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除通知公告
 */
export async function deleteContentNotice(id) {
  try {
    return await API.post(CONTENT + "deletecontentnotice", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 根据id获取通知公告
 * @param {*} params
 */
export async function getContentNoticeByid(id) {
  try {
    return await API.get(CONTENT + "getcontentnoticedatabyid", {
      params: {
        id,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 分页获取邮件和短信发送记录
 * @param {*} params
 */
export async function getSendSMSEmailList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(NOTICE + "getemailandphonesendlogpagelist", {
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
 * 获取app更新列表
 * @param {*} params
 */
export async function getAppUpdateList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(APP_UPDATE + "updateList", {
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
 * 添加app更新
 */
export async function addUpdate(params) {
  try {
    return await API.post(APP_UPDATE + "addUpdate", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑app更新
 */
export async function editUpdate(params) {
  try {
    return await API.post(APP_UPDATE + "editUpdate", params);
  } catch (error) {
    return error;
  }
}

/**
 * 根据id获取app更新详情
 */
export async function getUpdateInfo(id) {
  try {
    return await API.get(APP_UPDATE + "getUpdateInfo", {
      params: {
        id,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

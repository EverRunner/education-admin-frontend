import { API } from "@utils/http/api";

const BBS = "/bbs/";

/**
 * 获取所有类型
 */
export async function getBbsCategory() {
  try {
    return await API.get(BBS + "getartcategorylist");
  } catch (error) {
    return error;
  }
}

/**
 * 添加类型
 */
export async function addBbsCategory(params) {
  try {
    return await API.post(BBS + "saveaddartcategory", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑类型
 */
export async function editBbsCategory(params) {
  try {
    return await API.post(BBS + "saveeditorartcategory", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除类型
 */
export async function deleteBbsCategory(params) {
  try {
    return await API.post(BBS + "deletartcategory", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取论坛发贴列表
 * @param {*} params
 */
export async function getBbsTartList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(BBS + "getartpagelist", {
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
 * 添加帖子
 */
export async function addBbsTar(params) {
  try {
    return await API.post(BBS + "creatartconst", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑帖子
 */
export async function editBbsTar(params) {
  try {
    return await API.post(BBS + "saveeditartconst", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除帖子信息
 */
export async function delBbsTar(id) {
  try {
    return await API.post(BBS + "deleteartconst", {
      id,
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取所有类型
 */
export async function getBbsTarInfo(id) {
  try {
    return await API.get(BBS + "getartcontent", {
      params: { id },
    });
  } catch (error) {
    return error;
  }
}

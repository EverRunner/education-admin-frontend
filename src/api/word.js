import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const DCWORD = "/dcword/";

/**
 * 获取单词练习列表（分页）
 * @param {*} params
 */
export async function getPracticeList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(DCWORD + "getnewdcwordpaperpagelist", {
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
 * 获取单词练习对应的单词列表
 * @param {*} params
 */
export async function getWordList(paperid) {
  try {
    return await API.get(DCWORD + "getnewdcwordpaperconstlist", {
      params: {
        paperid,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 添加单词
 */
export async function addWord(params) {
  try {
    return await API.post(DCWORD + "creatnewdcwordpaperconst", params);
  } catch (error) {
    return error;
  }
}

/**
 * 更新单词
 */
export async function updateWord(params) {
  try {
    return await API.post(DCWORD + "updatenewdcwordpaperconst", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除单词
 */
export async function deleteWord(id) {
  try {
    return await API.post(DCWORD + "deletenewdcwordspaperconst", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 导入单词
 */
export async function importWord(params) {
  try {
    return await API.post(DCWORD + "importnewdcwordpaperconst", params);
  } catch (error) {
    return error;
  }
}

/**
 * 添加单词练习
 */
export async function addPractice(params) {
  try {
    return await API.post(DCWORD + "creatnewdcwordpaper", params);
  } catch (error) {
    return error;
  }
}

/**
 * 修改单词练习
 */
export async function updatePractice(params) {
  try {
    return await API.post(DCWORD + "updatenewdcwordpaper", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除单词练习
 */
export async function deletePractice(id) {
  try {
    return await API.post(DCWORD + "deletenewdcwordspaper", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 获取单词内容列表（分页）
 * @param {*} params
 */
export async function getWordRequestionList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(DCWORD + "getnewdcwordpaperconstlistall", {
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

// ------------------------

// /**
//  * 根据id获取单词题详情
//  */
// export async function getWordInfo(id) {
//     try {
//         return await API.get(DCWORD + "getdcwordsfobyid", {
//             params: {
//                 id,
//             },
//         });
//     } catch (error) {
//         return error;
//     }
// }

// /**
//  * 根据id获取单词练习详情
//  */
// export async function getPracticeInfo(id) {
//     try {
//         return await API.get(DCWORD + "getdcwordspaperbyid", {
//             params: {
//                 id,
//             },
//         });
//     } catch (error) {
//         return error;
//     }
// }

// /**
//  * 设置单词练习对应的单词题集合
//  */
// export async function setPracticeOption(params) {
//     try {
//         return await API.post(DCWORD + "setpapersdcwords", params);
//     } catch (error) {
//         return error;
//     }
// }

// /**
//  * 获取单词练习对应的单词题集合
//  */
// export async function getPracticeOption(paperid) {
//     try {
//         return await API.get(DCWORD + "getdcwordlistbypaperid", { paperid });
//     } catch (error) {
//         return error;
//     }
// }

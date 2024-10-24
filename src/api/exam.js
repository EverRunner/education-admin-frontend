import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const REQUESTION = "/requestion/";

/**
 * 获取试题列表（分页）
 * @param {*} params
 */
export async function getRequestionList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(REQUESTION + "getrequestionpagelist", {
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
 * 根据id获取试题详情
 */
export async function getRequestionInfo(id) {
  try {
    return await API.get(REQUESTION + "getrequestionfobyid", {
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
 * 添加试题
 */
export async function addRequestion(params) {
  try {
    return await API.post(REQUESTION + "saverequestiondata", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑试题信息
 */
export async function updateRequestion(params) {
  try {
    return await API.post(REQUESTION + "saveeditrequestion", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除试题
 */
export async function deleteRequestion(id) {
  try {
    return await API.post(REQUESTION + "deletrequestion", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 获取试卷列表（分页）
 * @param {*} params
 */
export async function getExamList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(REQUESTION + "getrequestionpaperpagelist", {
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
 * 根据id获取试卷详情
 */
export async function getExamInfo(id) {
  try {
    return await API.get(REQUESTION + "getrequestionpaperbyid", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 添加试卷
 */
export async function addExam(params) {
  try {
    return await API.post(REQUESTION + "saveaddrequestionpaper", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑试卷
 */
export async function updateExam(params) {
  try {
    return await API.post(REQUESTION + "saveeditrequestionpaper", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除试卷
 */
export async function deleteExam(id) {
  try {
    return await API.post(REQUESTION + "deleterequestionpaper", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 设置试卷对应的试题集合
 */
export async function setExamOption(params) {
  try {
    return await API.post(REQUESTION + "setpapersrequestion", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取试卷试题列表
 */
export async function getExamOption(paperid) {
  try {
    return await API.get(REQUESTION + "getrequestlistbypaperid", {
      params: { paperid },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 试题单词绑定
 */
export async function setWordRequestion(params) {
  try {
    return await API.post(REQUESTION + "bindrequestandword", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取试题绑定的单词
 */
export async function getWordRequestion(requestid) {
  try {
    return await API.get(REQUESTION + "getrequestbindwords", {
      params: {
        requestid,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 试题单词绑定
 */
export async function delWordRequestion(params) {
  try {
    return await API.post(REQUESTION + "unbindrequestandword", params);
  } catch (error) {
    return error;
  }
}

/**
 * 根据试卷id数组返回试题
 */
export async function getRrequesListByIds(params) {
  try {
    return await API.get(REQUESTION + "getpaperrequestionbyids", {
      params,
    });
  } catch (error) {
    return error;
  }
}

/**
 * 根据试卷id修改试题状态
 */
export async function updateRequestStatusById(params) {
  try {
    return await API.post(REQUESTION + "updaterequeststatusbyid", params);
  } catch (error) {
    return error;
  }
}

/**
 * 根据试卷id 导出 试题
 */
export async function exportQuestionsById(paperid, fileName) {
  try {
    return await API.get(REQUESTION + "exportpaperrequest", {
      params: {
        paperid,
      },
      responseType: "blob",
      fileName,
    });
  } catch (error) {
    return error;
  }
}

/**
 * 导入试题
 */
 export async function importQuestion(params) {
  try {
      return await API.post(REQUESTION + "importQuestion", params);
  } catch (error) {
      return error;
  }
}

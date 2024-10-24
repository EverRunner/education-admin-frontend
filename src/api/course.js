import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const COURSE = "/course/";

/**
 * 获取课程列表（分页）
 * @param {*} params
 */
export async function getCourseList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(COURSE + "getcoursepagelist", {
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
 * 根据id获取课程详情
 */
export async function getCourseInfo(id) {
  try {
    return await API.get(COURSE + "getcoursedatabyid", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 添加课程
 */
export async function addCourse(params) {
  try {
    return await API.post(COURSE + "saveaddcourse", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑课程信息
 */
export async function updateCourse(params) {
  try {
    return await API.post(COURSE + "saveeditcourse", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除课程
 */
export async function deleteCourse(id) {
  try {
    return await API.post(COURSE + "deletecourse", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 获取课程的所有章节
 * @param {*} courseid 课程id
 */
export async function getChapterList(courseid) {
  try {
    return await API.get(COURSE + "getcoursechapterlist", {
      params: {
        courseid,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 根据id获取章节详情
 */
export async function getChapterInfo(id) {
  try {
    return await API.get(COURSE + "getcoursechapterdatabyid", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 添加章节
 */
export async function addChapter(params) {
  try {
    return await API.post(COURSE + "saveaddcoursechapter", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑章节
 */
export async function updateChapter(params) {
  try {
    return await API.post(COURSE + "saveeditcoursechapter", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除章节
 */
export async function deleteChapter(id) {
  try {
    return await API.post(COURSE + "deletecoursechapter", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 软删除章节
 */
export async function mildDeleteChapter(id) {
  try {
    return await API.post(COURSE + "deletecoursechapter2", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 获取课程章节树
 */
export async function getCourseChapterTree(type, params) {
  try {
    return await API.get(COURSE + "getcoursechaptertree", {
      params: {
        type,
        ...params,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取评价列表
 * @param {*} params
 */
export async function getEvaluateList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(COURSE + "getcoursecomment", {
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
 * 评价审核
 */
export async function editEvaluate(params) {
  try {
    return await API.post(COURSE + "updatecomment", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户测试记录详情（章节）
 * @param {*} params
 */
export async function getTestResults(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(COURSE + "getquestresbyrequestid", {
      params: {
        ...params,
        ...pages,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户测试记录详情（我的错误题）
 * @param {*} params
 */
export async function getMyTestResults(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(COURSE + "getmembererrorquestdetail", {
      params: {
        ...params,
        ...pages,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户测试记录详情（高频错题）
 * @param {*} params
 */
export async function getAllTestResults(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(COURSE + "getmemberallerrorrequesttestdetail", {
      params: {
        ...params,
        ...pages,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户测试记录详情（综合题）
 * @param {*} params
 */
export async function getComTestResults(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(COURSE + "getmembercomprehensivedetail", {
      params: {
        ...params,
        ...pages,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户测试前(关键词)
 * @param {*} params
 */
export async function getTestBeforeWord(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(COURSE + "getsubmitcqkeytestlist", {
      params: {
        ...params,
        ...pages,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 导出该学员学习记录
 */
export async function getMemberStudyLogs(memberid, fileName) {
  try {
    return await API.get(COURSE + "exportmemberstudylogpart", {
      params: {
        memberid,
      },
      responseType: "blob",
      fileName,
    });
  } catch (error) {
    return error;
  }
}

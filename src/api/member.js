import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const MEMBER = "/member/";
const USER = "/user/";
const MEMBER_COURSE = "/membercourse/";
const MAKE_EXAM = "/testappointment/";

/**
 * 获取会员列表（分页）
 * @param {*} params
 */
export async function getMemberList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MEMBER + "getmemberlist", {
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
 * 根据id获取会员详情
 */
export async function getMemberInfo(id) {
  try {
    return await API.get(MEMBER + "getmemberfobyid", {
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
 * 添加会员
 */
export async function addMemberInfo(params) {
  try {
    return await API.post(MEMBER + "savememberdata", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑会员信息
 */
export async function updateMemberInfo(params) {
  try {
    return await API.post(MEMBER + "saveeditmember", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除会员
 */
export async function deleteMember(id) {
  try {
    return await API.post(MEMBER + "deletemember", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 软删除会员
 */
export async function deleteMemberStatus(id) {
  try {
    return await API.post(MEMBER + "softdeletemember", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 获取所有会员类型列表
 */
export async function getMemberCategory() {
  try {
    return await API.get(MEMBER + "getallcategory", {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取会员类型
 */
export async function getMemberCategoryById(id) {
  try {
    return await API.get(MEMBER + "getMemberCategoryById", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 添加会员类型
 */
export async function addCategoryInfo(params) {
  try {
    return await API.post(MEMBER + "savecategorydata", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑会员类型
 */
export async function updateCategoryInfo(params) {
  try {
    return await API.post(MEMBER + "saveeditcategory", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除会员类型
 */
export async function deleteCategory(id) {
  try {
    return await API.post(MEMBER + "deletecategory", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户的学习记录（分页）
 * @param {*} params
 */
export async function getMemberStudyList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MEMBER + "getmemberstudylogs", {
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
 * 获取用户某个学习进度总览
 */
export async function getMemberProgress(memberid, progressid) {
  try {
    return await API.get(MEMBER_COURSE + "getmemberprogressdetail", {
      params: {
        memberid,
        progressid,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取会员学习进度
 */
export async function getMemberstudyCourse(memberid, type = 0) {
  try {
    return await API.get(MEMBER_COURSE + "getmemberstudycourselist", {
      params: {
        memberid,
        type,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 赠送会员时间
 */
export async function giveVipDates(params) {
  try {
    return await API.post(MEMBER + "givevipdates", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取会员vip记录列表
 */
export async function getMemberVipLog(memberid, category) {
  try {
    return await API.get(MEMBER + "getmemberviplog", {
      params: {
        memberid,
        category,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户我的错题测（分页）
 * @param {*} params
 */
export async function getMemberErrorTestLog(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MEMBER + "getmembererrorrequesttest", {
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
 * 获取用户综合错题测（分页）
 * @param {*} params
 */
export async function getMemberCompleteTestLog(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MEMBER + "getmembercomprehensivetest", {
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
 * 获取用户的高频错题测试记录
 * @param {*} params
 */
export async function getMemberHighTestLog(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MEMBER + "getmemberallerrorrequesttest", {
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
 * 根据用户id获取登录记录
 * @param {*} memberid
 */
export async function getMemberLoginList(
  memberid,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MEMBER + "getmemberloginlogpagelist", {
      params: {
        memberid,
        ...pages,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 修改会员学习进度
 */
export async function updateStudyProgress(params) {
  try {
    return await API.post(MEMBER + "updatestudyprogress", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取特别关注列表
 */
export async function getClaimList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MEMBER + "setspecialattentionpagelist", {
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
 * 获取用户前端临时token
 */
export async function getMenberToken(memberid) {
  try {
    return await API.post(MEMBER + "setmemberfronttemporarytoken", {
      memberid,
    });
  } catch (error) {
    return error;
  }
}

/**
 * 重置复习
 */
export async function resetReview(memberid) {
  try {
    return await API.post(MEMBER + "resetReviewCourse", { memberid });
  } catch (error) {
    return error;
  }
}

/**
 * 根据用户id获取ip统计
 * @param {*} memberid
 */
export async function getLoginIpStatics(memberid) {
  try {
    return await API.get("/user/getuserloginstatics", {
      params: {
        memberid,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 生成分销码
 */
export async function createMemberShare(memberid) {
  try {
    return await API.post(MEMBER + "creatmembersharecode", { memberid });
  } catch (error) {
    return error;
  }
}

/**
 * 统计付费会员平均学习天数、平均学习小时数、平均准确率（中英）、平均准确率（英）
 * @param {*} memberid
 */
export async function getMemberStaticsAverage(memberid) {
  try {
    return await API.get(MEMBER + "getmemberstaticsforpayal", {
      params: {
        memberid,
      },
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 增加支付次数
 */
export async function addMemberPayCount(memberid) {
  try {
    return await API.post(MEMBER + "addmemberpayelsecount", { memberid });
  } catch (error) {
    return error;
  }
}

/**
 * 导出全部会员表格
 */
export async function getMemberExport(params) {
  try {
    return await API.get(MEMBER + "exportmemberlist", {
      params,
      responseType: "blob",
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户详情的统计数据
 */
export async function getMemberDetailStatics(memberid) {
  try {
    return await API.get(MEMBER + "getmemberdetailstatics", {
      params: {
        memberid,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 导出该学员统计的表格
 */
export async function getMemberCourseExport(memberid, fileName) {
  try {
    return await API.get("/user/exportuserchapaterstatics", {
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

/**
 * 获取学员-请求参数
 */
export async function getMemberParamsExport(memberid) {
  try {
    return await API.get("/member/getmemberaidatastring", {
      params: {
        memberid,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取考试预约数据（分页）
 * @param {*} params
 */
export async function getMakeExamList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MAKE_EXAM + "gettppagelist", {
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
 * 添加考试预约数据
 */
export async function addMakeExamInfo(params) {
  try {
    return await API.post(MAKE_EXAM + "creattpap", params);
  } catch (error) {
    return error;
  }
}

/**
 * 修改考试预约数据
 */
export async function editMakeExamInfo(params) {
  try {
    return await API.post(MAKE_EXAM + "updatetpap", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除考试预约数据
 */
export async function delMakeExamInfo(id) {
  try {
    return await API.post(MAKE_EXAM + "deletetpap", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 获取未处理的预约考试数据
 */
export async function getUntreatedExamList(params) {
  try {
    return await API.get(MAKE_EXAM + "gettpapisadoptnulldata", {
      params,
    });
  } catch (error) {
    return error;
  }
}

/**
 * 批量修改预约考试状态
 */
export async function updateBatchExamStatus(data) {
  try {
    return await API.post(MAKE_EXAM + "updatemultpapisadopt", data);
  } catch (error) {
    return error;
  }
}

/**
 * 获取学习记录的统计数据
 */
export async function getStudyLogStatistics(params) {
  try {
    return await API.get(USER + "gettgavgbystudylog", {
      params,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 修改用户是否经常性的提问标志
 */
export async function updateIsMoreReq(params) {
  try {
    return await API.post(MEMBER + "updatememberismorereq", params);
  } catch (error) {
    return error;
  }
}

/**
 * 主页的日历数据
 */
export async function getMemberPayOrYcStatics(params) {
  try {
    return await API.get(MEMBER + "getmemberpayorycstatics", {
      params,
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取会员预测历史（分页）
 * @param {*} params
 */
export async function getUserForecastHistory(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(MEMBER + "getuserforecastinghistory", {
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
 * 同步学员的学习进度
 */
export async function asyncCourseAndChapter(params) {
  try {
    return await API.post(MEMBER + "asyncCourseAndChapter", params);
  } catch (error) {
    return error;
  }
}

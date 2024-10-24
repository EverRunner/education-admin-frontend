import { API } from "@utils/http/api";
import { PAGE_SIZE } from "@config";

const USER = "/user/";

/**
 * 用户登录
 * @param {*} params
 */
export async function login(params) {
  try {
    return await API.post(USER + "login", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取当前登录用户信息
 * @param {*} params
 */
export async function getUserInfo() {
  try {
    return await API.get(USER + "getloginuserinfo");
  } catch (error) {
    return error;
  }
}

/**
 * 注销登录
 */
export async function loginOut() {
  try {
    return await API.get(USER + "loginout");
  } catch (error) {
    return error;
  }
}

/**
 * 管理员列表
 */
export async function getAdminList(params) {
  try {
    return await API.get(USER + "getadminlist", {
      params,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取管理员详情
 */
export async function getAdminInfo(id) {
  try {
    return await API.get(USER + "getadminfobyid", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 管理员添加
 */
export async function addAdmin(params) {
  try {
    return await API.post(USER + "saveadmindata", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑管理员
 */
export async function updateAdmin(params) {
  try {
    return await API.post(USER + "saveeditadmin", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除管理员
 */
export async function deleteAdmin(id) {
  try {
    return await API.post(USER + "deleteadmin", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 修改密码
 */
export async function updateAdminPassowrd(params) {
  try {
    return await API.post(USER + "changeadminpassword", params);
  } catch (error) {
    return error;
  }
}

/**
 * 批量发送历史列表
 * @param {*} params
 */
export async function getNoticeList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(USER + "getmessagepushpagelist", {
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
 * 批量发送历史详细列表
 * @param {*} params
 */
export async function getNoticeInfoList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(USER + "getmessagepushconst", {
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
 * 批量发送邮件给选择的用户
 */
export async function setNoticeEmail(params) {
  try {
    return await API.post(USER + "sendemailtousercategory", params);
  } catch (error) {
    return error;
  }
}

/**
 * 批量发送短信给选择的用户
 */
export async function setNoticeSms(params) {
  try {
    return await API.post(USER + "sendemsgtousercategory", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取在线用户
 */
export async function getOnlineMember() {
  try {
    return await API.get(USER + "getonlinememberid");
  } catch (error) {
    return error;
  }
}

/**
 * 获取登录距离上一次超过100英里的列表
 * @param {*} params
 */
export async function getMemberLoginWornList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(USER + "getmemberlogindistanceworn", {
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
 * 获取用户学习记录历史
 * @param {*} params
 */
export async function getStudyHistory(
  memberid,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(USER + "getuserstudyconstpagelist", {
      params: {
        memberid,
        ...pages,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 移除异常登录
 */
export async function removeMemberException(id) {
  try {
    return await API.post(USER + "removememberlogindistanceworn", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 统计某个会员的学习时长（综合统计）
 */
export async function getUserStudyConstStatics(memberid) {
  try {
    return await API.get(USER + "getuserstudyconststatics", {
      params: {
        memberid,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 导出学员学习历史
 */
export async function getMemberStudyExport(memberid) {
  try {
    return await API.get(USER + "exporrtuserstudyconstpagelist", {
      params: {
        memberid,
      },
      responseType: "blob",
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户同意协议列表列表
 * @param {*} params
 */
export async function getAgreementList(
  memberid,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(USER + "getapplylistty", {
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
 * 获取用户同意协议详情
 */
export async function getAgreementInfo(id) {
  try {
    return await API.get(USER + "getapplylisttydetail", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户执照申请列表
 * @param {*} params
 */
export async function getLicenseList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(USER + "getmemberlicenseapplypagelist", {
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
 * 执照申请申请状态
 */
export async function updateLicenseaStatus(params) {
  try {
    return await API.post(USER + "updatelicenseapplystatus", params);
  } catch (error) {
    return error;
  }
}

/**
 * 执照申请详情
 */
export async function getLicenseInfo(applyid) {
  try {
    return await API.get(USER + "getmemberapplaylicensedetail", {
      params: {
        applyid,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取用户续费次数申请列表
 * @param {*} params
 */
export async function getRenewList(
  params,
  pages = {
    pageindex: 1,
    pagesize: PAGE_SIZE,
  }
) {
  try {
    return await API.get(USER + "getmemberxfcountapplaypagelist", {
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
 * 审核续费次数申请
 */
export async function auditRenew(params) {
  try {
    return await API.post(USER + "shmemberxfapplay", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取本周预约考试情况
 */
export async function getWeekMemberExamList() {
  try {
    return await API.get(USER + "getlastweekmembertestlist", {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取预测通过率统计
 */
export async function getPassStaticsConst() {
  try {
    return await API.get(USER + "getaitcstaticsconst", {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取当前用户的学习雷达图
 */
export async function getUserStudyStaticsData(memberid) {
  try {
    return await API.get(USER + "getcurrentuserstudyalanydata", {
      headers: { isLoading: true },
      params: {
        memberid,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 暂停/恢复
 */
export async function changeUserVipStatus(params) {
  try {
    return await API.post(USER + "changeuservipstatus", params);
  } catch (error) {
    return error;
  }
}

/**
 * 获取暂停/恢复 - 记录
 */
export async function getUserVipStatusRecord(memberid) {
  try {
    return await API.get("/user/getuserstatuschangelist", {
      params: {
        memberid,
      },
    });
  } catch (error) {
    return error;
  }
}

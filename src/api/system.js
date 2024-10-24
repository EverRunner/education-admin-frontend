import { API } from "@utils/http/api";

const ROLE = "/role/";
const MENU = "/menu/";
const SETTING = "/setting/";

/**
 * 角色列表
 */
export async function getRoleList() {
  try {
    return await API.get(ROLE + "getallrole", {
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取角色详情
 */
export async function getRoleInfo(id) {
  try {
    return await API.get(ROLE + "getroledatabyid", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 角色添加
 */
export async function addRole(params) {
  try {
    return await API.post(ROLE + "saveaddrole", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑角色
 */
export async function updateRole(params) {
  try {
    return await API.post(ROLE + "saveeditrole", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除角色
 */
export async function deleteRole(id) {
  try {
    return await API.post(ROLE + "deleterole", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 角色权限设置
 */
export async function setRolePermission(params) {
  try {
    return await API.post(ROLE + "setrolemenu", params);
  } catch (error) {
    return error;
  }
}

/**
 * 角色权限获取
 */
export async function getRolePermission(roleid) {
  try {
    return await API.get(ROLE + "getrolemenu", {
      params: {
        roleid,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 菜单列表
 */
export async function getMenuList(params) {
  try {
    return await API.get(MENU + "getallmenulist", {
      params,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 菜单添加
 */
export async function addMenu(params) {
  try {
    return await API.post(MENU + "saveaddmenu", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑菜单
 */
export async function updateMenu(params) {
  try {
    return await API.post(MENU + "saveeditmenu", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除菜单
 */
export async function deleteMenu(id) {
  try {
    return await API.post(MENU + "deletemenu", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 菜单全部列表（树形）
 */
export async function getAllMenuTree(params) {
  try {
    return await API.get(MENU + "getallmenutree", {
      params,
      headers: { isLoading: true },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 获取节假日设置列表
 */
export async function getFestivalList(id) {
  try {
    return await API.get(SETTING + "getholidaysettingpagelist", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

/**
 * 添加节假日设置
 */
export async function addFestival(params) {
  try {
    return await API.post(SETTING + "addholidaysetting", params);
  } catch (error) {
    return error;
  }
}

/**
 * 编辑节假日设置
 */
export async function updateFestival(params) {
  try {
    return await API.post(SETTING + "editholidaysetting", params);
  } catch (error) {
    return error;
  }
}

/**
 * 删除节假日设置
 */
export async function deleteFestival(id) {
  try {
    return await API.post(SETTING + "deletholidaysetting", { id });
  } catch (error) {
    return error;
  }
}

/**
 * 获取节假日设置情
 */
export async function getFestivalInfo(id) {
  try {
    return await API.get(SETTING + "getholidaysettingbyid", {
      params: {
        id,
      },
    });
  } catch (error) {
    return error;
  }
}

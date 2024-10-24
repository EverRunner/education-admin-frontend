import { API } from "@utils/http/api";

/**
 * 分页获取分类
 * @param {*} params
 */
export async function getArticleClassify(params) {
    try {
        return await API.get("/content/getallcontentcategory", {
            params,
            headers: { isLoading: true },
        });
    } catch (error) {
        return error;
    }
}

/**
 * 分类添加
 * @param {*} params
 */
export async function addArticleClassify(params) {
    try {
        return await API.post("/content/saveaddcontentcategory", params, {
            headers: { isLoading: true },
        });
    } catch (error) {
        return error;
    }
}

/**
 * 分类编辑
 * @param {*} params
 */
export async function eidtArticleClassify(params) {
    try {
        return await API.post("/content/saveeditcontentcategory", params, {
            headers: { isLoading: true },
        });
    } catch (error) {
        return error;
    }
}

/**
 * 分类删除
 * @param {*} id
 */
export async function deleteArticleClassify(id) {
    try {
        return await API.post(
            "/content/deletecontentcategory", {
                id,
            }, {
                headers: { isLoading: true },
            }
        );
    } catch (error) {
        return error;
    }
}

/**
 * 获取分类详情
 * @param {*} id
 */
export async function getArticleClassifyInfo(id) {
    try {
        return await API.get("/content/getcontentcategorydatabyid", {
            params: {
                id,
            },
        });
    } catch (error) {
        return error;
    }
}

/**
 * 分页获取文章列表
 * @param {*} params
 */
export async function getArticleList(
    params,
    pages = {
        pageindex: 1,
        pagesize: PAGE_SIZE,
    }
) {
    try {
        return await API.get("/content/getcontentpagelist", {
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
 * 文章列表添加
 * @param {*} params
 */
export async function addArticle(params) {
    try {
        return await API.post("/content/saveaddcontent", params, {
            headers: { isLoading: true },
        });
    } catch (error) {
        return error;
    }
}

/**
 * 文章列表编辑
 * @param {*} params
 */
export async function eidtArticle(params) {
    try {
        return await API.post("/content/saveeditcontent", params, {
            headers: { isLoading: true },
        });
    } catch (error) {
        return error;
    }
}

/**
 * 文章列表删除
 * @param {*} id
 */
export async function deleteArticle(id) {
    try {
        return await API.post(
            "/content/deletecontent", {
                id,
            }, {
                headers: { isLoading: true },
            }
        );
    } catch (error) {
        return error;
    }
}

/**
 * 文章列表详情
 * @param {*} id
 */
export async function getArticleInfo(id) {
    try {
        return await API.get("/content/getcontentdatabyid", {
            params: {
                id,
            },
        });
    } catch (error) {
        return error;
    }
}
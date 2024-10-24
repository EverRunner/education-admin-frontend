import { API } from "@utils/http/api";

/**
 * 文件上传
 * @param {*} params
 */
export async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append("file", file, file.name);

        return await API.post("/uploadhandler/image", formData);
    } catch (error) {
        return error;
    }
}

/**
 * 用户登录验证码
 * @param {*} params
 */
export async function getLoginCode(params) {
    try {
        return await API.get("getvalidatecode", {
            params,
            headers: { isLoading: true },
        });
    } catch (error) {
        return error;
    }
}
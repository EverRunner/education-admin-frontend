import { API } from "@utils/http/api";

const IM = "/im";

// /**
//  * 初始化IM
//  * @param {*} frindid 客服用户的id
//  */
// export async function initIM(frindid) {
//     try {
//         return await API.post(IM + "/initim", {
//             frindid
//         },{
//             isLoading
//         });
//     } catch (error) {
//         return error;
//     }
// }

/**
 * 获取聊天好友列表
 */
export async function getImMyFriendList(params) {
  try {
    return await API.get(IM + "/getmyfriend", {
      params,
      headers: {
        isLoading: true,
      },
    });
  } catch (error) {
    return error;
  }
}

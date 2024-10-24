export default [{
        path: "list",
        name: "ARTICLE_LIST",
        meta: {
            title: "文章列表",
            icon: "",
            isNav: true,
            keepAlive: true,
        },
        component: () =>
            import ("@/views/article/index.vue"),
    },

    {
        path: "articleEdit",
        name: "ARTICLE_EDIT",
        meta: {
            title: "文章编辑",
            icon: "",
            isNav: false,
            parent: "SYSTEM_ROLE",
        },
        component: () =>
            import ("@/views/article/list/edit.vue"),
    },

    {
        path: "articleClassify",
        name: "ARTICLE_CLASSIFY",
        meta: {
            title: "文章分类",
            icon: "",
            isNav: true,
        },
        component: () =>
            import ("@/views/article/classify/list.vue"),
    },

    {
        path: "classifyEdit",
        name: "ARTICLE_CLASSIFY_EDIT",
        meta: {
            title: "分类编辑",
            icon: "",
            isNav: false,
            parent: "SYSTEM_ROLE",
        },
        component: () =>
            import ("@/views/article/classify/edit.vue"),
    },
];
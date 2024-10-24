export default [{
        path: "list",
        name: "WORD_LIST",
        meta: {
            title: "单词列表",
            icon: "",
            isNav: true,
            keepAlive: true,
        },
        component: () =>
            import ("@/views/word/list/list.vue"),
    },
    {
        path: "edit",
        name: "WORD_EDIT",
        meta: {
            title: "单词编辑",
            icon: "",
            isNav: false,
            parent: "WORD_LIST",
        },
        component: () =>
            import ("@/views/word/list/edit.vue"),
    },
    {
        path: "listTopic",
        name: "WORD_LIST_TOPIC",
        meta: {
            title: "单词列表",
            icon: "",
            isNav: false,
            parent: "WORD_LIST",
        },
        component: () =>
            import ("@/views/word/list/topic.vue"),
    },
    // {
    //     path: "topic",
    //     name: "WORD_TOPIC",
    //     meta: {
    //         title: "单词列表",
    //         icon: "",
    //         isNav: true,
    //     },
    //     component: () =>
    //         import ("@/views/word/topic/list.vue"),
    // },
    // {
    //     path: "topicEdit",
    //     name: "WORD_TOPIC_EDIT",
    //     meta: {
    //         title: "单词编辑",
    //         icon: "",
    //         isNav: false,
    //         parent: "WORD_TOPIC",
    //     },
    //     component: () =>
    //         import ("@/views/word/topic/edit.vue"),
    // },
];
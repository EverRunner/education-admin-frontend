export default [{
        path: "list",
        name: "EXAM_LIST",
        meta: {
            title: "测试列表",
            icon: "",
            isNav: true,
            keepAlive: true,
        },
        component: () =>
            import ("@/views/exam/list/list.vue"),
    },
    {
        path: "edit",
        name: "EXAM_EDIT",
        meta: {
            title: "测试编辑",
            icon: "",
            isNav: false,
            parent: "EXAM_LIST",
        },
        component: () =>
            import ("@/views/exam/list/edit.vue"),
    },
    {
        path: "listTopic",
        name: "EXAM_LIST_TOPIC",
        meta: {
            title: "试题列表",
            icon: "",
            isNav: false,
            parent: "EXAM_LIST",
        },
        component: () =>
            import ("@/views/exam/list/topic.vue"),
    },
    {
        path: "topic",
        name: "EXAM_TOPIC",
        meta: {
            title: "试题列表",
            icon: "",
            isNav: true,
            keepAlive: true,
        },
        component: () =>
            import ("@/views/exam/topic/list.vue"),
    },
    {
        path: "topicEdit",
        name: "EXAM_TOPIC_EDIT",
        meta: {
            title: "试题编辑",
            icon: "",
            isNav: false,
            parent: "EXAM_TOPIC",
        },
        component: () =>
            import ("@/views/exam/topic/edit.vue"),
    },
];
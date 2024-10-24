# client_manage

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

```

client_manage
├─ 📁dist                 // 打包后的目录
├─ 📁public               // 公共配置及入口
├─ 📁node_modules         // node依赖
├─ 📁src                  // 核心目录
│  ├─ 📁api               // api管理目录
│  ├─ 📁assets            // 资源目录（图片、字体、样式）
│  ├─ 📁components        // 公共的组件文件
│  ├─ 📁router            // 路由文件
│  ├─ 📁store             // vuex
│  ├─ 📁theme             // 主题css调整
│  ├─ 📁utils             // 工具函数
│  ├─ 📁views             // 模板目录
│  │  ├─ 📁common         // 公共的目录
│  │  ├─ 📁course         // 课程管理
│  │  ├─ 📁exam           // 试题试卷管理
│  │  │  └─ 📁list        // 试题列表
│  │  │  └─ 📁topic       // 试题列表
│  │  ├─ 📁layout         // 布局
│  │  ├─ 📁main           // 主页
│  │  ├─ 📁member         // 学员管理
│  │  ├─ 📁message        // 消息管理
│  │  ├─ 📁order          // 订单管理
│  │  ├─ 📁pass           // 通过管理
│  │  ├─ 📁system         // 系统管理
│  │  └─ 📁word           // 单词管理
│  │     ├─ 📁list        // 单词试卷列表
│  │     └─ 📁topic       // 单词列表
│  ├─ 📄App.vue           // 模板入口
│  ├─ 📄config.js         // 配置信息
│  ├─ 📄main.js           // 主入口
│  └─ 📄permission.js     // 权限验证
├─ 📄package.json         // 依赖目录
└─ 📄vue.config.js        // 开发环境配置


```
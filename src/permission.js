import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

NProgress.configure({ showSpinner: true }); // NProgress Configuration

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();
    next();
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
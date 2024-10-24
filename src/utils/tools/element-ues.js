import Vue from "vue";
import "../../theme/element-variables.scss";
import "element-ui/lib/theme-chalk/display.css"; // 基于断点的隐藏类

import {
  Loading,
  MessageBox,
  Message,
  Notification,
  Button,
  Input,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Table,
  TableColumn,
  Pagination,
  Select,
  Option,
  Icon,
  Switch,
  Progress,
  Timeline,
  TimelineItem,
  Card,
  Radio,
  RadioGroup,
  ColorPicker,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Upload,
  InputNumber,
  Dialog,
  Tabs,
  TabPane,
  Tree,
  DatePicker,
  Popover,
  OptionGroup,
  Tag,
  Image,
  Drawer,
  Row,
  Col,
  Collapse,
  CollapseItem,
  Tooltip,
  Popconfirm,
  Rate,
  Calendar 
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Icon);
Vue.use(Switch);
Vue.use(Progress);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Card);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(ColorPicker);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Upload);
Vue.use(InputNumber);
Vue.use(Dialog);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tree);
Vue.use(DatePicker);
Vue.use(Popover);
Vue.use(Tag);
Vue.use(Image);
Vue.use(Drawer);
Vue.use(Row);
Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Tooltip);
Vue.use(Popconfirm); 
Vue.use(Rate);
Vue.use(Calendar);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

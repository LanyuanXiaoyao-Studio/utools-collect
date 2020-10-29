import Vue from 'vue'
import {
  Button,
  Card,
  Col,
  Dialog,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Image,
  Message,
  MessageBox,
  Row,
  Table,
  TableColumn,
  Tag,
  Tooltip,
} from 'element-ui';

Vue.use(Card);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Image);
Vue.use(Divider);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tooltip);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);

Vue.prototype.$success = Message.success;
Vue.prototype.$error = Message.error;
Vue.prototype.$info = Message.info;
Vue.prototype.$warning = Message.warning;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

import Vue from 'vue';
import * as featherIcons from 'vue-feather-icons';
for (const [key, icon] of Object.entries(featherIcons)) {
  icon.props.size.default = '24';
  Vue.component(key, icon);
}

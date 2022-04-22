import { filters, bulk } from '@webpack';
import Theme from '@structures/theme';
import { create } from '@patcher';

import AnimatedStatus from './components/AnimatedStatus';
import Settings from './components/Settings';
import Style from '../src/index';

const [
   StatusStore,
   Colors,
   Status
] = bulk(
   filters.byProps('getStatusColor'),
   filters.byProps('isValidHex'),
   filters.byDisplayName('FluxContainer(Status)')
);

const Patcher = create('dark-discord');

export default class extends Theme {
   start() {
      if (this.settings.get('patchStatuses', true)) {
         this.patchStatusColors();
      }

      if (!this.settings.get('customSwitches', true)) {
         const url = '@import "https://discord-modifications.github.io/dark-discord/src/switches.css";';
         Style = Style.replace(url, '');
      }

      super.start(Style);
   }

   stop() {
      Patcher.unpatchAll();
      super.stop();
   }

   patchStatusColors() {
      const [color] = Style.match(/(?!\-\-bsi\-offline\-color:\ )#([a-z0-9]{2,8})*/g) || [];
      if (!color) return;

      const int = Colors.hex2int(color);
      const offlineColor = Colors.int2hsl(int, true);

      Patcher.after(StatusStore, 'getStatusColor', (_, [status], res) => {
         if (~['invisible', 'offline'].indexOf(status)) {
            return offlineColor;
         }
      });

      Patcher.after(StatusStore, 'Status', (_, [{ status, color }], res) => {
         const style = res.props.children.props.style;
         if (!color) {
            style.backgroundColor = StatusStore.getStatusColor(status);
         }
      });

      Patcher.after(Status.prototype, 'render', (_, args, res) => {
         if (!res || !res.type) return;
         const props = res.props;
         res = res.type(props);

         const tooltip = res.props.children(props);
         tooltip.props.children.type = AnimatedStatus;

         return res;
      });
   }

   getSettingsPanel() {
      return Settings;
   }
}

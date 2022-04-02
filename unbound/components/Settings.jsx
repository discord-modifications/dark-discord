import { Switch } from '@components/settings';
import { React } from '@webpack/common';

export default class extends React.Component {
   render() {
      const settings = this.props.settings;

      return (<>
         <Switch
            title='Replace Switches'
            onChange={v => settings.set('customSwitches', v)}
            description='Whether to replace switches with custom ones to match the theme.'
            checked={settings.get('customSwitches', true)}
         />
         <Switch
            title='Darken offline status color'
            onChange={v => settings.set('patchStatuses', v)}
            description="Whether to darken the statuses to match the theme's colours."
            checked={settings.get('patchStatuses', true)}
         />
      </>);
   }
};
import { connectComponent } from '@api/settings';
import { filters, bulk } from '@webpack';
import { React } from '@webpack/common';
import { uuid } from '@utilities';

const [
   Spring,
   Hooks,
   classes,
   Status
] = bulk(
   filters.byProps('useSpring'),
   filters.byProps('useLazyValue'),
   filters.byProps('wrapper', 'avatar'),
   filters.byProps('getStatusMask')
);

const config = { tension: 600, friction: 70 };

const AnimatedStatus = React.memo(props => {
   const { status, className, style } = props;

   const isMobile = props.isMobile !== void 0 && props.isMobile;
   const color = props.color ? props.color : Status.getStatusColor(status);
   const size = props.size ? props.size : 8;

   const statusValues = React.useMemo(() => Status.getStatusValues({ size, status, isMobile }), [size, status, isMobile]);
   const statusDimensions = Spring.useSpring({ config, to: statusValues });
   const statusHeight = Math.ceil(size * 1.5);
   const statusColor = Spring.useSpring(
      { config, fill: color },
      [color]
   )[0].fill;

   const maskId = Hooks.useLazyValue(() => uuid());
   const statusMask = Status.renderStatusMask(statusDimensions, size, maskId);

   return React.createElement('svg', {
      width: size,
      height: statusHeight,
      viewBox: `0 0 ${size} ${statusHeight}`,
      className: [classes.mask, className].filter(Boolean).join(' '),
      'data-bsi-status': status,
      style
   }, statusMask, React.createElement(Spring.animated.rect, {
      x: 0,
      y: 0,
      width: size,
      height: statusHeight,
      fill: statusColor,
      mask: `url(#${maskId})`
   }));
});

export default connectComponent(AnimatedStatus, 'dark-discord');

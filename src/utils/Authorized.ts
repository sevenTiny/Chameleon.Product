import RenderAuthorize from '@/components/Authorized';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
let Authorized = {};

// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = {};
};

/**
 * hard code
 * block need it。
 */
window.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;

export const isDesktopApp = () => {
  if (typeof window !== 'undefined') {
    return navigator.userAgent.includes('HavticDesktopApp');
  }
  return false;
};

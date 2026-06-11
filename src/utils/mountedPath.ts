const DEFAULT_MOUNTED_PATH = '/request';

export const getMountedPath = (): string => {
  return DEFAULT_MOUNTED_PATH;
};

export const withMountedPath = (url: string): string => {
  const mountedPath = getMountedPath();

  if (
    !mountedPath ||
    !url.startsWith('/') ||
    url.startsWith('//') ||
    url === mountedPath ||
    url.startsWith(`${mountedPath}/`)
  ) {
    return url;
  }

  return `${mountedPath}${url}`;
};

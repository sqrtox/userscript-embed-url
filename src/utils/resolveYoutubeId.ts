export const resolveYoutubeId = ({
  hostname,
  searchParams,
  pathname
}: URL): string => {
  switch (hostname) {
    case 'm.youtube.com':
    case 'www.youtube.com': {
      if (pathname !== '/watch') {
        throw new Error('Unsupported pathname');
      }

      const id = searchParams.get('v');

      if (typeof id !== 'string') {
        throw new Error('Could not retrieve id');
      }

      return id;
    }

    case 'youtu.be': {
      return pathname;
    }

    default: {
      throw new Error('Unsupported hostname');
    }
  }
};

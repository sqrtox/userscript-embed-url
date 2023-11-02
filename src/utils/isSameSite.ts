import { parseDomain } from 'parse-domain';

const patchNocookie = (url: URL): URL => {
  if (url.hostname !== 'www.youtube-nocookie.com') {
    return url;
  }

  const cloned = url;

  cloned.hostname = 'www.youtube.com';

  return cloned;
};

export const isSameSite = (a: URL, b: URL): boolean => {
  // TODO: patch
  a = patchNocookie(a);
  b = patchNocookie(b);

  const aParsed = parseDomain(a.hostname);
  const bParsed = parseDomain(b.hostname);

  if (
    'domain' in aParsed &&
    'domain' in bParsed
  ) {
    return `${aParsed.domain}.${aParsed.topLevelDomains.join('.')}` === `${bParsed.domain}.${bParsed.topLevelDomains.join('.')}`;
  } else {
    return true;
  }
};

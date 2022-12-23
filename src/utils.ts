import type { ScriptOptions, ScriptOptionsNorm } from './types';

function isValidString(str: any) {
  return typeof str === 'string' && str.trim() !== '';
}

function normalizeOptions(options: ScriptOptions): ScriptOptionsNorm {
  const { hostUrl, websiteId, doNotTrack, domain } = options;

  return {
    root: isValidString(hostUrl) ? hostUrl : undefined,
    website: isValidString(websiteId) ? websiteId : undefined,
    domain: isValidString(domain) ? domain : undefined,
    dnt: !!doNotTrack,
  };
}

function winDoNotTrack(win: Window) {
  // @ts-expect-error `doNotTrack` might not exist on `window`
  const { doNotTrack, navigator } = win;

  // @ts-expect-error `msDoNotTrack` might not exist on `navigator`
  const dnt = doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack;

  return [1, '1', 'yes'].includes(dnt);
}

export { normalizeOptions, winDoNotTrack };

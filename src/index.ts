import { parse } from 'url';
import { normalizeOptions, winDoNotTrack } from './utils';
import type {
  BasicPayload, EventPayload,
  PayloadType, ScriptOptions,
  Umami,
  ViewPayload,
} from './types';

export async function useUmamiAsMiddleware(opts: ScriptOptions, win: Window) {
  const hostname = 'localhost';
  const port = 3000;
  const dev = process.env.NODE_ENV !== 'production';
  const { DATABASE_URL, url } = normalizeOptions(opts);

  const next = await import('next');
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  await app.prepare();

  return async (req, res, url) => {
    const parsedUrl = parse(url, true);
    const { pathname, query } = parsedUrl;
    await app.render(req, res, pathname, query);
  };
}

export function tracker(opts: ScriptOptions, win: Window) {
  const { website, dnt, domain, root } = normalizeOptions(opts);

  if (!website || !root)
    throw new Error('Params undefined');

  const endpoint = `${root}/api/collect`;
  let cache: string;

  const {
    screen: { width, height },
    navigator: { language },
    localStorage: store,
    document,
    location,
  } = win;

  const { hostname, pathname, search } = location;
  const screen = `${width}x${height}`;
  const currentUrl = `${pathname}${search}`;
  const currentRef = document.referrer;

  const domainList = domain ? domain.split(',').map(d => d.trim()) : undefined;

  const trackingDisabled = () =>
    (store && store.getItem('umami.disabled'))
  || (dnt && winDoNotTrack(win))
  || (domainList && !domainList.includes(hostname));

  const getPayload: BasicPayload = {
    website,
    hostname,
    screen,
    language,
    url: currentUrl,
  };

  const collect = (type: PayloadType, payload: ViewPayload | EventPayload) => {
    if (trackingDisabled())
      return;

    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ type, payload }),
      headers: {
        'Content-Type': 'application/json',
        'x-umami-cache': cache,
      },
    })
      .then(res => res.text())
      .then(text => (cache = text));
  };

  const trackView = (url = currentUrl, referrer = currentRef, websiteId = website) =>
    collect(
      'pageview',
      {
        ...getPayload,
        website: websiteId,
        url,
        referrer,
      } satisfies ViewPayload,
    );

  const trackEvent = (eventName = '', eventData: unknown = '', url = currentUrl, websiteId = website) =>
    collect(
      'event',
      {
        ...getPayload,
        url,
        website: websiteId,
        event_name: eventName,
        event_data: eventData,
      } satisfies EventPayload,
    );

  const umami: Umami = {
    trackView,
    trackEvent,
  };

  return umami;
}

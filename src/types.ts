interface BasicPayload {
  website: string
  hostname: string
  screen: string
  language: string
  url: string
}

interface ViewPayload extends BasicPayload {
  referrer: string
}

interface EventPayload extends BasicPayload {
  event_name: string
  event_data: unknown
}

interface ScriptOptions {
  /**
   * Website identifier provided by Umami
   *
   * Example `3c255b6d-678a-42dd-8074-272ee5b78484`
   */
  websiteId: string
  /**
   * Location to send the tracking data. Usually the location where
   * the default Umami script is located.
   *
   * Example: `http://ijkml.xyz`
   */
  hostUrl: string
  /**
   * Configure Umami to respect the visitor's Do-Not-Track setting
   * @default false
   */
  doNotTrack?: boolean
  /**
   * Configure the tracker to only run on specific domains.
   * Provide a comma seperated list of domain names
   *
   * Example: `mywebsite.com, mywebsite2.com`
   */
  domain?: string
}

interface ScriptOptionsNorm {
  website: string | undefined
  root: string | undefined
  dnt: boolean
  domain: string | undefined
}

type PayloadType = 'pageview' | 'event';

interface Umami {
  /**
   * The url and website_id values are optional. They will default to
   * the page url and website-id defined by the script.
   * @param eventName eg 'SuperClick'
   * @param eventData eg 'downloads', `{ type: 'signup', userId: 123 }`
   * @param url
   * @param websiteId
   */
  trackEvent(eventName?: string, eventData?: unknown, url?: string, websiteId?: string): void
  /**
   * The referrer and website-id values are optional.
   * @param url page being tracked, eg '/about'
   * @param referrer
   * @param websiteId
   */
  trackView(url?: string, referrer?: string, websiteId?: string): void
}

export {
  BasicPayload,
  PayloadType,
  EventPayload,
  ViewPayload,
  ScriptOptions,
  ScriptOptionsNorm,
  Umami,
};

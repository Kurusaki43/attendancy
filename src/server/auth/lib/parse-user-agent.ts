import { UAParser } from 'ua-parser-js';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

export function parseUserAgent(userAgent: string | null) {
  if (!userAgent) {
    return { browser: 'Unknown browser', os: 'Unknown OS', deviceType: 'unknown' as DeviceType };
  }

  const { browser, os, device } = UAParser(userAgent);

  let deviceType: DeviceType = 'desktop';
  if (device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (device.type === 'tablet') {
    deviceType = 'tablet';
  } else if (device.type) {
    deviceType = 'unknown';
  }

  return {
    browser: browser.name ?? 'Unknown browser',
    os: os.name ?? 'Unknown OS',
    deviceType,
  };
}

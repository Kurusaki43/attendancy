import { describe, expect, it } from 'vitest';

import { parseUserAgent } from '../../lib/parse-user-agent';

const CHROME_MACOS =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const SAFARI_IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const CHROME_IPAD =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1';

describe('parseUserAgent', () => {
  it('returns unknown placeholders when the user agent is null', () => {
    expect(parseUserAgent(null)).toEqual({
      browser: 'Unknown browser',
      os: 'Unknown OS',
      deviceType: 'unknown',
    });
  });

  it('parses a desktop Chrome on macOS user agent', () => {
    expect(parseUserAgent(CHROME_MACOS)).toEqual({
      browser: 'Chrome',
      os: 'macOS',
      deviceType: 'desktop',
    });
  });

  it('parses a mobile Safari on iPhone user agent', () => {
    const result = parseUserAgent(SAFARI_IPHONE);

    expect(result.deviceType).toBe('mobile');
    expect(result.os).toBe('iOS');
  });

  it('parses a tablet Chrome on iPad user agent', () => {
    const result = parseUserAgent(CHROME_IPAD);

    expect(result.deviceType).toBe('tablet');
  });

  it('falls back to unknown placeholders for an unrecognizable user agent', () => {
    expect(parseUserAgent('garbage-string')).toEqual({
      browser: 'Unknown browser',
      os: 'Unknown OS',
      deviceType: 'desktop',
    });
  });
});

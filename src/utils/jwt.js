const crypto = require('crypto');

const base64UrlEncode = (input) => {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const base64UrlDecode = (input) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
};

const parseExpiry = (expiresIn) => {
  if (!expiresIn) {
    return 24 * 60 * 60;
  }

  if (typeof expiresIn === 'number') {
    return expiresIn;
  }

  const match = String(expiresIn).match(/^(\d+)([smhd])$/i);
  if (!match) {
    return Number(expiresIn) || 24 * 60 * 60;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };

  return value * multipliers[unit];
};

const signToken = (payload, secret, options = {}) => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expiresInSeconds = parseExpiry(options.expiresIn || '1d');

  const header = { alg: 'HS256', typ: 'JWT' };
  const body = {
    ...payload,
    iat: nowInSeconds,
    exp: nowInSeconds + expiresInSeconds
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedBody}.${signature}`;
};

const verifyToken = (token, secret) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format.');
  }

  const [encodedHeader, encodedBody, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature.');
  }

  const payload = JSON.parse(base64UrlDecode(encodedBody));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && now > payload.exp) {
    throw new Error('Token has expired.');
  }

  return payload;
};

module.exports = {
  signToken,
  verifyToken
};

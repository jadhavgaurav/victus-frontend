const SECRET_KEYS = new Set([
  'token',
  'access_token',
  'refresh_token',
  'api_key',
  'secret',
  'password',
  'cookie',
  'authorization'
]);

// JWT-like: header.payload.signature (each part >= 10 chars base64url-ish)
const JWT_REGEX = /^[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}$/;
const BEARER_REGEX = /^Bearer\s+.*$/i;

export function redactDeep(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    if (JWT_REGEX.test(value) || BEARER_REGEX.test(value)) {
      return '[REDACTED]';
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => redactDeep(item));
  }

  if (typeof value === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(value)) {
      if (SECRET_KEYS.has(key.toLowerCase())) {
        newObj[key] = '[REDACTED]';
      } else {
        newObj[key] = redactDeep(value[key]);
      }
    }
    return newObj;
  }

  return value;
}

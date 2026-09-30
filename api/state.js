// Guarda el torneo en Redis (Upstash) para que todos vean y editen lo mismo.
// Variables de entorno: las crea Vercel al conectar "Upstash for Redis" desde Storage.
// Opcional: EDIT_PASSWORD para que solo quien tenga la clave pueda editar.

const KEY = 'torneo:state';
const VKEY = 'torneo:version';

// Guarda solo si nadie guardó antes (compara la versión), todo en un paso.
const CAS = `
local cur = redis.call('GET', KEYS[2]) or '0'
if cur ~= ARGV[1] then return {0, cur} end
local nv = tostring(tonumber(cur) + 1)
redis.call('SET', KEYS[1], ARGV[2])
redis.call('SET', KEYS[2], nv)
return {1, nv}
`;

function config() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(c, command) {
  const r = await fetch(c.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const c = config();
  if (!c) return res.status(500).json({ error: 'no_storage' });
  const isProtected = Boolean(process.env.EDIT_PASSWORD);

  try {
    if (req.method === 'GET') {
      const version = Number((await redis(c, ['GET', VKEY])) || 0);
      const since = req.query && req.query.since;
      if (since !== undefined && Number(since) === version) {
        return res.status(200).json({ version, unchanged: true, protected: isProtected });
      }
      const raw = await redis(c, ['GET', KEY]);
      return res.status(200).json({ version, state: raw ? JSON.parse(raw) : null, protected: isProtected });
    }

    if (req.method === 'PUT') {
      if (isProtected && req.headers['x-edit-key'] !== process.env.EDIT_PASSWORD) {
        return res.status(401).json({ error: 'key' });
      }
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || typeof body.state !== 'object' || body.state === null) {
        return res.status(400).json({ error: 'bad_request' });
      }
      const data = JSON.stringify(body.state);
      if (data.length > 3500000) return res.status(413).json({ error: 'too_large' });
      const out = await redis(c, ['EVAL', CAS, '2', KEY, VKEY, String(Number(body.baseVersion) || 0), data]);
      if (Number(out[0]) === 1) return res.status(200).json({ version: Number(out[1]) });
      const raw = await redis(c, ['GET', KEY]);
      return res.status(409).json({ version: Number(out[1]), state: raw ? JSON.parse(raw) : null });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'storage', detail: String((e && e.message) || e) });
  }
}

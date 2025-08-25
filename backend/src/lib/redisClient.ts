import { createClient, type RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

let client: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
  if (client) return client;
  client = createClient({ url: redisUrl });
  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });
  // Connect lazily; connection promise is intentionally not awaited here.
  void client.connect();
  return client;
}

export async function redisSetJson(
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  const c = getRedisClient();
  const payload = JSON.stringify(value);
  if (ttlSeconds && ttlSeconds > 0) {
    await c.set(key, payload, { EX: ttlSeconds });
    return;
  }
  await c.set(key, payload);
}

export async function redisGetJson<T = unknown>(
  key: string
): Promise<T | null> {
  const c = getRedisClient();
  const raw = await c.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

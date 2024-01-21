import dbPool from "./db";

export function getIpAddress(request: Request) {
    return request.headers.get('X-Client-IP') ||
        request.headers.get('X-Forwarded-For') ||
        request.headers.get('HTTP-X-Forwarded-For') ||
        request.headers.get('Fly-Client-IP') ||
        request.headers.get('CF-Connecting-IP') ||
        request.headers.get('Fastly-Client-Ip') ||
        request.headers.get('True-Client-Ip') ||
        request.headers.get('X-Real-IP') ||
        request.headers.get('X-Cluster-Client-IP') ||
        request.headers.get('X-Forwarded') ||
        request.headers.get('Forwarded-For') ||
        request.headers.get('Forwarded') ||
        request.headers.get('DO-Connecting-IP') ||
        request.headers.get('oxygen-buyer-ip') ||
        request.headers.get('x-forwarded-for') || // keeping existing ones
        request.headers.get("x-vercel-forwarded-for") ||
        request.headers.get('x-real-ip') ||
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('True-Client-IP') ||
        'unknown';
}

export default async function rateLimiter(ip: string) {
    const limit = 15;
    const timeWindow = 5 * 60 * 1000;

    const result = await dbPool.query(`
        SELECT request_count, last_request
        FROM rate_limits
        WHERE identifier = $1
    `, [ip]);

    const currentTime = new Date().getTime();

    if (result.rows.length > 0) {
        const { request_count, last_request } = result.rows[0];
        const lastRequestTime = new Date(last_request).getTime();

        if (currentTime - lastRequestTime < timeWindow && request_count >= limit) {
            return false;
        }

        await dbPool.query(`
            UPDATE rate_limits
            SET request_count = request_count + 1, last_request = NOW()
            WHERE identifier = $1
        `, [ip]);
    } else {
        await dbPool.query(`
            INSERT INTO rate_limits (identifier, request_count, last_request)
            VALUES ($1, 1, NOW())
        `, [ip]);
    }

    return true;
}

import { NextRequest, NextResponse } from 'next/server';
import { SandboxRequestError, sandboxGet } from '@core/http/sandbox.gateway';

/**
 * Same-origin proxy for every sandbox read. The browser calls
 * `/api/sandbox/zones?offset=0&limit=50`; this handler adds the bearer token
 * and forwards to the real sandbox.
 *
 * Why a proxy rather than calling the sandbox from the browser:
 *   1. The credential stays on the server. The sandbox rules assume it will
 *      leak eventually; shipping it in a JS bundle guarantees it.
 *   2. No CORS negotiation with the license host.
 *   3. One place to enforce the allowlist below.
 */

/**
 * Read paths this template exposes. An allowlist, not a passthrough: a bug in
 * a client component must not be able to reach a path this app has not
 * deliberately published. Extend it when the sandbox spec grows.
 */
const ALLOWED_PATHS = new Set(['ping', 'zones', 'license-types', 'business-activities', 'statistics']);

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    const target = path.join('/');

    if (!ALLOWED_PATHS.has(target)) {
        return NextResponse.json(
            { message: `Unknown sandbox path '${target}'.`, allowed: [...ALLOWED_PATHS] },
            { status: 404 },
        );
    }

    // Forward only the documented paging params; anything else is dropped
    // rather than passed through to the upstream query string.
    const incoming = request.nextUrl.searchParams;
    const forwarded = new URLSearchParams();
    for (const key of ['offset', 'limit'] as const) {
        const value = incoming.get(key);
        if (value !== null) forwarded.set(key, value);
    }
    const search = forwarded.size > 0 ? `?${forwarded}` : '';

    try {
        return NextResponse.json(await sandboxGet(target, search));
    } catch (error) {
        if (error instanceof SandboxRequestError) {
            return NextResponse.json(
                { message: error.message, code: error.code, retryAfterSeconds: error.retryAfterSeconds },
                { status: error.status },
            );
        }
        // Configuration failures (missing env, unreachable host) land here.
        const message = error instanceof Error ? error.message : 'Unexpected sandbox failure.';
        return NextResponse.json({ message }, { status: 500 });
    }
}

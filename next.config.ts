import type { NextConfig } from 'next';

/**
 * Nothing here proxies to the sandbox: the browser never talks to it directly.
 * Every sandbox call goes through the route handler at `/api/sandbox/[...path]`,
 * which is the only place the credential exists. See README §Security.
 */
const nextConfig: NextConfig = {
    reactStrictMode: true,
};

export default nextConfig;

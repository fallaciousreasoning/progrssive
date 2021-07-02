const withPWA = require('next-pwa');

module.exports = withPWA({
    eslint: {
        ignoreDuringBuilds: true
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/stream/all',
                permanent: true,
            },
        ]
    },
});
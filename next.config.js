module.exports = {
    distDir: 'build',
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
}
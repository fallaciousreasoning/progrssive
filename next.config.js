const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    eslint: {
        ignoreDuringBuilds: true
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (process.env.ANALYZE) {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'server',
                    analyzerPort: isServer ? 8888 : 8889,
                    openAnalyzer: true,
                })
            )
        }
        return config
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
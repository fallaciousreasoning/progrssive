const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const withPWA = require('next-pwa');

module.exports = withPWA({
    pwa: {
        dest: 'public',
        scope: '/'
    },
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

        // Add support for importing SVGs.
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

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
});
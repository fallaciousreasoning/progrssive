module.exports = {
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
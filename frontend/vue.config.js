module.exports = {
    // options...
    devServer: {
        disableHostCheck: true,
        public: 'localhost:8080',
        https: false,
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000,
        },
    }
}
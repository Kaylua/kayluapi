module.exports = {
    devServer: {
        port: 8080,
        host: '0.0.0.0'
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "@/assets/_shared.scss";`,
            },
        },
    },
};
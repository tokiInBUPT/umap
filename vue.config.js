module.exports = {
    assetsDir: 'static',
    chainWebpack: (config) => {
        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
    },
}

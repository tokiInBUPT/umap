module.exports = {
    assetsDir: '.',
    filenameHashing: false,
    productionSourceMap: false,
    css: {
        extract: false,
    },
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.delete('splitChunks')
            config.module
                .rule('images')
                .use('url-loader')
                .loader('url-loader')
                .tap((options) => Object.assign(options, { limit: 2000000 }))
            config.module
                .rule('fonts')
                .use('url-loader')
                .loader('url-loader')
                .tap((options) => Object.assign(options, { limit: 2000000 }))
            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .before('copy')
                .use('script-ext-html-webpack-plugin', [
                    {
                        inline: [/app\.js$/],
                    },
                ])
        }
        config.plugins.delete('prefetch')
        config.plugins.delete('preload')
    },
}

// var requireHttp = require('webpack-require-http');
module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://open.duyiedu.com',
                changeOrigin: true
            }
        }
    },
    lintOnSave: false,
    
    outputDir: 'dist',
    assetsDir: '',
    indexPath: 'index.html'
}
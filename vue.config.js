const fs = require('fs');
const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            symlinks: false,
            alias: {
                vue: path.resolve('./node_modules/vue'),
            },
        },
    },
    devServer: {
        host: 'localhost',
        https: {
            key: fs.readFileSync('./private.pem'),
            cert: fs.readFileSync('./certificate.pem'),
        },
    },
};

const path = require('path');

module.exports = {
    mode: 'development',
    entry: './ts/index.ts',
    module:{
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        // ビルド後のファイルが出力される"絶対パス"ディレクトリ
        // https://webpack.js.org/configuration/output/#outputpath
        path: path.join(__dirname, 'out')
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};
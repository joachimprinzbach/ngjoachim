module.exports = {

    entry: {
        'app' : 'src/scope.js'
    },

    resolve: {
        extensions: ['', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel?presets[]=es2015'
            }
        ]
    }
};
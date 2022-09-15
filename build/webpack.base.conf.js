const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

// Main const
const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
}

// Pages const for HtmlWebpackPlugin
// const PAGES_DIR = PATHS.src
const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
    // BASE config
    externals: {
        paths: PATHS
    },
    entry: {
        app: PATHS.src,
        // module: `${PATHS.src}/your-module.js`,
    },
    output: {
        filename: `${PATHS.assets}js/[name].[hash:2].js`,
        path: PATHS.dist,
        publicPath: '/'
    },
    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
    },
    module: {
        rules: [{
            test: /\.pug$/,
            oneOf: [
                // this applies to <template lang="pug"> in Vue components
                {
                    resourceQuery: /^\?vue/,
                    use: ['pug-plain-loader?pretty=true']
                },
                // this applies to pug imports inside JavaScript
                {
                    use: ['pug-loader?pretty=true']
                }
            ],
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loader: {
                    scss: 'vue-style-loader!css-loader!sass-loader'
                }
            }
        }, {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        }, {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        }, {
            test: /\.s[a|c]ss$/,
            use: [
                'vue-style-loader',
                'style-loader',
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        url: false
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {sourceMap: true, config: {path: `./postcss.config.js`}}
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                    }
                }
            ]
        },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {sourceMap: true, config: {path: `./postcss.config.js`}}
                    }
                ]
            }]
    },
    resolve: {
        alias: {
            '~': PATHS.src,
            'vue$': 'vue/dist/vue.js',
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].[hash:2].css`,
        }),
        new CopyWebpackPlugin([
            {from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img`},
            {from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts`},
            {from: `${PATHS.src}/static`, to: ''},
        ]),

        // Automatic creation any html pages (Don't forget to RERUN dev server)
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/, '.html')}`
        }))
    ],
}

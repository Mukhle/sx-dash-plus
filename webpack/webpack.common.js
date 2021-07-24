// const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = path.join(__dirname, '..', 'src');

module.exports = {
	entry: {
		'fixes/button': path.join(srcDir, 'fixes/button.ts'),
		'fixes/carmarket': path.join(srcDir, 'fixes/carmarket.ts'),
		'fixes/stafflist': path.join(srcDir, 'fixes/stafflist.ts'),
		'fixes/tables': path.join(srcDir, 'fixes/tables.ts'),
		'fixes/traficlaws': path.join(srcDir, 'fixes/traficlaws.ts'),
		'lookup/info': path.join(srcDir, 'lookup/info.ts'),
		'lookup/notes': path.join(srcDir, 'lookup/notes.ts'),
		'lookup/punishmentFrequency': path.join(srcDir, 'lookup/punishmentFrequency.ts'),
		'lookup/punishmentnotes': path.join(srcDir, 'lookup/punishmentnotes.ts'),
		'lookup/punishments': path.join(srcDir, 'lookup/punishments.ts'),
		'lookup/shared': path.join(srcDir, 'lookup/shared.ts'),
		'lookup/watcher': path.join(srcDir, 'lookup/watcher.ts'),
		lookupsearch: path.join(srcDir, 'lookupsearch.ts'),
		steamids: path.join(srcDir, 'steamids.ts'),
	},
	output: {
		path: path.join(__dirname, '../dist/js'),
		filename: '[name].js',
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks: 'initial',
		},
		minimize: false,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: '.', to: '../', context: 'public' }],
			options: {},
		}),
	],
};

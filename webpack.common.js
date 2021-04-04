const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
	entry: {
		main: "./src/main.mjs"
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "./bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							url: false
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["**/*", "!images/**", "!favicon.ico"]}),
		new HtmlWebpackPlugin({template: "./src/index.html"}),
		new MiniCssExtractPlugin({filename: "style.css"})
	],
	devServer: {
		contentBase: path.join(__dirname, "dist")
	}
};

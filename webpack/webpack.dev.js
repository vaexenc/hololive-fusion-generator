const common = require("./webpack.common.js");
const {merge} = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
	mode: "development",
	optimization: {
		minimize: false
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, "../dist")
		},
		watchFiles: ["src/*", "static/*"],
		devMiddleware: {
			writeToDisk: true
		}
	}
	// devtool: false,
});

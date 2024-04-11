module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{ico,svg,ttf,png,xml,jpg}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
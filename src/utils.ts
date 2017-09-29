import path = require('path')
import fs = require('fs-extra')

export default {
	isStartWithPath: (t: string) => /^(\.{0,2})\//.test(t),
	isLocalPath: (t: string) => new Promise(async resolve => {
		fs.stat(t)
			.then(s => resolve(s.isDirectory()))
			.catch(err => resolve(false))
	}),
	isPathString: (t: string) => t.indexOf('/') > 0,
	trimSlash: (t: string) => t.replace(/^\//, '').replace(/$\//, ''),
	isExamplesPath: (t: string) => /^next.js\/examples/.test(t),
	isDefaultTempaltePath: (t: string) => /^next-init\/templates\/stable/.test(t),
	isBetaTemplatePath: (t: string) => /^next-init\/templates\/beta/.test(t),
	isDefaults: (t: string) => /^next-init\/templates\//.test(t),
	isBeta: (t: string) => /^@beta/.test(t)
}

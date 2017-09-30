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
	isBeta: (t: string) => /^@beta/.test(t),
	whiteText: text => `\x1b[37m${text}\x1b[0m`,
	greenText: text => `\x1b[32m${text}\x1b[0m`,
	redText: text => `\x1b[31m${text}\x1b[0m`,
	isSamePath: t => path.relative(t, process.cwd()) === ''
}

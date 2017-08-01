import fs = require('mz/fs')
import path = require('path')

const isStartWithPath = t => /^(\.{0,2})\//.test(t)
const isLocalPath = t => new Promise(async resolve => {
	fs.stat(t)
		.then(s => resolve(s.isDirectory()))
		.catch(err => resolve(false))
})

export default async function (input: Array<string>) {
	const args = {
		template: 'nextjs-templates/basic',
		target: path.resolve('./')
	}

	if (input.length === 1) {
		const checkPath = async t => await isLocalPath(t) ||
			await isLocalPath(path.dirname(path.resolve(t)))

		if (isStartWithPath(input[0]) && checkPath(input[0])) {
			args.target = path.resolve(input[0])
		} else {
			args.template = input[0]
		}
	} else if (input.length >= 2) {
		args.template = input[0]
		args.target = path.resolve(input[1])
	}

	// consider that official template even if it's not path style
	if (args.template.indexOf('/') < 0) {
		args.template = `nextjs-templates/${args.template}`
	}

	return args
}

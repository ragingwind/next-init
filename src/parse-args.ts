import path = require('path')
import u from './utils'

export default async function (input: Array<string>) {
	const args = {
		template: 'next-init/templates/stable',
		target: path.resolve('./')
	}

	if (input.length === 1) {
		const isLocalPaths = async t => await u.isLocalPath(t) ||
			await u.isLocalPath(path.dirname(path.resolve(t)))

		if (u.isStartWithPath(input[0]) && isLocalPaths(input[0])) {
			args.target = path.resolve(input[0])
		} else if (u.isBeta(input[0])) {
			args.template = 'next-init/templates/beta'
		} else {
			args.template = input[0]
		}
	} else if (input.length >= 2) {
		args.template = u.isBeta(input[0]) ? 'next-init/templates/beta' : input[0]
		args.target = path.resolve(input[1])
	}

	// consider that official template even if it's not path style
	if (!u.isPathString(args.template)) {
		throw new TypeError(`Template has invalid format. ${args.template}`)
	}

	return args
}

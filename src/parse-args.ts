import path = require('path')
import u from './utils'

export default async function (input: Array<string>) {
	const args = {
		template: 'nextjs-templates/basic',
		target: path.resolve('./')
	}

	if (input.length === 1) {
		const checkPath = async t => await u.isLocalPath(t) ||
			await u.isLocalPath(path.dirname(path.resolve(t)))

		if (u.isStartWithPath(input[0]) && checkPath(input[0])) {
			args.target = path.resolve(input[0])
		} else {
			args.template = input[0]
		}
	} else if (input.length >= 2) {
		args.template = input[0]
		args.target = path.resolve(input[1])
	}

	// consider that official template even if it's not path style
	if (!u.isPathString(args.template)) {
		args.template = `nextjs-templates/${args.template}`
	}

	return args
}

import path = require('path')
import u from './utils'

export default async function (input: Array<string>) {
	const args = {
		template: 'next-init/templates/default',
		target: path.resolve('./'),
		nextVersion: ''
	}

	if (input.length === 1) {
		const isLocalPaths = async t => await u.isLocalPath(t) ||
			await u.isLocalPath(path.dirname(path.resolve(t)))

		if (u.isStartWithPath(input[0]) && isLocalPaths(input[0])) { // might be path string
			args.target = path.resolve(input[0])
		} else if (u.isNext(input[0])) { // or next prefix @canary or @latest
			args.nextVersion = input[0]
		} else { // could be custom repo address some/somerepo
			args.template = input[0]
		}
	} else if (input.length >= 2) {
		if (u.isNext(input[0])) {
			args.nextVersion = input[0]
		} else {
			args.template = input[0]
		}

		args.target = path.resolve(input[1])
	}

	// consider that official template even if it's not path style
	if (!u.isPathString(args.template)) {
		throw new TypeError(`Invalid template path or target path, ${args.template}`)
	}

	return args
}

import path = require('path')
import superb = require('superb')

export default function (input: string) {
	return new Promise(resolve => {
		const env = {
			name: input[0] || path.relative('../', process.cwd()),
			description: `My ${superb()} project with Next.js`
		}

		resolve(env)
	})
}

import spawn = require('cross-spawn')

export default async function (args) {
	return new Promise((resolve, reject) => {
		const child = spawn('npm', [
			'install',
			'--save',
			'next@latest',
			'react@latest',
			'react-dom@latest'
		], {
			stdio: 'inherit',
			cwd: args.target
		})

		child.on('close', code => {
			if (code !== 0) {
				reject(code)
			} else {
				resolve()
			}
		})
	})
}

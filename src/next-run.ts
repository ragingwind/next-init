import path = require('path')
import child = require('child_process')
import fs = require('fs-extra')
import readPkg = require('read-pkg')
import chalk from 'chalk'
import figures = require('figures')

const nextBin = './node_modules/.bin/next'

import u from './utils'

function isNextApp() {
	return readPkg(process.cwd()).then(pkg => {
		return ['next', 'react', 'react-dom'].every(d => pkg.dependencies && pkg.dependencies[d])
	})
}

function existNextBin() {
	return fs.pathExists(path.resolve(nextBin))
}

function runNextBin(subcmd) {
	child.fork(`${nextBin}`, subcmd ? [subcmd] : [])
}

export default async function (subcmd = '') {
	try {
		if (!await existNextBin()) {
			console.log(chalk`\n {red ${figures.cross} }next cannot be found. Please install 'next' using 'npm install next'`)
			process.exit(-1)
		} else if (!await isNextApp()) {
			console.log(chalk`\n {red ${figures.cross} }next app cannot be found. next/react/react-dom dependencies is not exist in package.json`)
			process.exit(-1)
		}

		runNextBin(subcmd)
	} catch (err) {
		console.log(err)
	}
}

import path = require('path')
import fs = require('fs-extra')
import inquirer = require('inquirer')
import template = require('lodash.template')
import PQueue = require('p-queue')
import globby = require('globby')
import chalk = require('chalk')
import u from './utils'

async function check(target) {
	if (await fs.pathExists(target)) {
		const answers = await inquirer.prompt({
			type: 'confirm',
			name: 'overwrite',
			message: 'Target path is exist already, overwrite?',
		})

		return answers.overwrite
	}

	await fs.ensureDir(target)

	return true
}

async function isFile(f) {
	return (await fs.lstat(f)).isFile()
}

async function isDirectory(f) {
	return (await fs.lstat(f)).isDirectory()
}

async function isExist(f) {
	let s
	try {
		s = await fs.lstat(f)
	} catch (err) {}

	return s && (s.isFile() || s.isDirectory())
}

function copy(args) {
	return new Promise(async resolve => {
		const src = path.join(args.cachePath, args.templateName)
		const target = args.target
		const jobs = new PQueue({concurrency: 2})
		const files = await globby(path.join(src, '**/*'))

		files.forEach(f => {
			const output = path.join(target, f.replace(src, ''))
			const job = () => {
				return new Promise(async resolve => {
					if (await isDirectory(f)) {
						await fs.ensureDir(output)
					} else {
						// prevent exepctions of irregular syntax
						try {
							const content = await fs.readFile(f)
							const compiled = template(content)
							await fs.ensureDir(path.dirname(output))
							await fs.writeFile(output, compiled(args))
						} catch (err) {}
					}

					resolve()
				})
			}

			jobs.add(() => job().then())
		})

		jobs.onEmpty().then(resolve)
	})
}

export default async function (args) {
	if (await check(args.target)) {
		console.log(chalk`\nCreate a new Next.js app in {green ${args.target} }`)
		await copy(args)
	}
}

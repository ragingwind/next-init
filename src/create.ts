import path = require('path')
import fs = require('mz/fs')
import mkdir = require('make-dir')
import inquirer = require('inquirer')
import template = require('lodash.template')
import PQueue = require('p-queue')
import globby = require('globby')
import u from './utils'

async function check(target) {
	if (await fs.exists(target)) {
		const answers = await inquirer.prompt({
			type: 'confirm',
			name: 'overwrite',
			message: 'Target path is exist already, overwrite?',
		})

		return answers.overwrite
	}

	await mkdir(target)

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
		const src = path.join(args.cachePath, args.template)
		const target = args.target
		const jobs = new PQueue({concurrency: 2})
		const files = await globby(path.join(src, '**/*'))

		files.forEach(f => {
			const output = path.join(target, f.replace(src, ''))
			const job = () => {
				return new Promise(async resolve => {
					if (await isDirectory(f)) {
						if (!await isExist(output)) {
							console.log(`Creating a path, ${output}`)
							await mkdir(output)
						}
					} else {
						console.log(`Writing a file, ${output}`)

						// prevent exepctions of irregular syntax
						try {
							const content = await fs.readFile(f)
							const compiled = template(content)
							await mkdir(path.dirname(output))
							await fs.writeFile(output, compiled(args))
						} catch (err) {}
					}

					resolve()
				})
			}

			console.log(`Adding task, ${f}`)
			jobs.add(() => job().then())
		})

		jobs.onEmpty().then(() => {
			resolve()
		})
	})
}

export default async function (args) {
	if (await check(args.target)) {
		await copy(args)
	}
}

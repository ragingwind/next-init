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

function copy({
	args,
	target,
	templatesPath,
	templateName
}) {
	if (!args || Object.keys(args).length === 0) {
		throw new TypeError('Templating requires default arguments')
	}

	return new Promise(async resolve => {
		const src = path.join(templatesPath, templateName)
		const jobs = new PQueue({concurrency: 2})
		const files = await globby(path.join(src, '**/*'))

		if (files.length === 0) {
			resolve()
			return
		}

		jobs.onEmpty().then(resolve)

		files.forEach(f => {
			const output = path.resolve(path.join(target, f.replace(src, '')))
			const job = () => {
				return fs.lstat(f).then(stat => {
					if (stat.isFile()) {
						return fs.readFile(f).then(content => {
							const compiled = template(content)
							return fs.outputFile(output, compiled(args))
						})
					} else {
						return fs.ensureDir(output)
					}
				})
			}

			jobs.add(() => job().then())
		})
	})
}

export default async function ({
	args,
	target,
	templatesPath,
	templateName
}) {
	if (await check(target)) {
		console.log(chalk`\nCreate a new Next.js app in {green ${target} }`)

		await copy({
			args,
			target,
			templatesPath,
			templateName
		})
	}
}

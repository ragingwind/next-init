import path = require('path')
import fs = require('fs-extra')
import inquirer = require('inquirer')
import template = require('lodash.template')
import PQueue = require('p-queue')
import globby = require('globby')
import u from './utils'

function copy({
	args,
	target,
	cachePath,
	templatesPath,
	templateName
}) {
	if (!args || Object.keys(args).length === 0) {
		throw new TypeError('Templating requires default arguments')
	}

	return new Promise(async resolve => {
		const src = path.join(cachePath, templatesPath, templateName)
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
							try {
								const compiled = template(content)
								return fs.outputFile(output, compiled(args))
							} catch (err) {
								return fs.outputFile(output, content)
							}
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
	cachePath,
	templatesPath,
	templateName
}) {
	await fs.ensureDir(target)

	await copy({
		args,
		target,
		cachePath,
		templatesPath,
		templateName
	})
}

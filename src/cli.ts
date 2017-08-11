#!/usr/bin/env node

import path = require('path')
import meow = require('meow')
import findCacheDir = require('find-cache-dir')
import Listr = require('listr')
import chalk = require('chalk')
import figures = require('figures')
import env from './env'
import parseArgs from './parse-args'
import prepare from './prepare'
import prompt from './prompt'
import create from './create'

const cli = meow(`
	Usage

	Options

	Examples
		$ next-init
`, {
	alias: {
		'e': 'example'
	}
})

async function main() {
	const cacheRoot = findCacheDir({
		name: 'next-init',
		create: true,
		cwd: __dirname
	})

	// const envInfo = await env()

	// let cacheInfo

		// const cacheInfo = await prepare({
		// 	template: args.template,
		// 	cacheRoot: cacheRoot,
		// 	force: cli.flags.force,
		// })

		// const answers = await prompt(await env(), {
		// 	projectName: path.basename(args.target),
		// 	templates: cacheInfo.templates,
		// target
		// })

		// await create({...args, ...cacheInfo, ...answers})

	// const args = await
	// const prepare = new CacheManager(tempalte, ...)
	// const updated =

	// const answers = await prompt(await env(), {
	// 	projectName: path.basename(args.target),
	// 	templates: cacheInfo.templates,
	// 	target: args.target
	// })

	const tasks = new Listr([{
		title: 'Preparing...',
		task: ctx => parseArgs(cli.input).then(args => ctx.args = args)
	}, {
		title: 'Checking the cache',
		task: (ctx, task) => {
			task.title = `Checking the updates of ${ctx.args.template.replace(/\/$/, '')}`
			return prepare({
				template: ctx.args.template,
				cacheRoot: cacheRoot,
				force: cli.flags.force
			}).then(cacheInfo => {
				ctx.cacheInfo = cacheInfo
				console.log(cacheInfo)
				const updates = cacheInfo.update ? 'Updates has been completed' : 'No updates'
				const template = ctx.args.template.replace(/\/$/, '')
				task.title = `${updates} for ${template}`
			})
		}
	}])

	tasks.run().then(ctx => {
		return env().then(e => {
			console.log('')
			return prompt(e, {
				projectName: path.basename(ctx.args.target),
				templates: ctx.cacheInfo.templates,
				target: ctx.args.target
			}).then(answers => {
				console.log(chalk`\n {green ${figures.tick} }Create a new Next.js app in {green ${ctx.args.target} }`)

				ctx.answers = answers
				return create({args: ctx.args,...ctx.args, ...ctx.cacheInfo, ...ctx.answers})
			})
		})
	}).catch(err => {
		console.error(chalk`\n {red ${figures.cross} }${err.stack}`)
		process.exit(-1)
	})
}

main()


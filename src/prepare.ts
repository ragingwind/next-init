import path = require('path')
import fs = require('mz/fs')
import execa = require('execa')
import rimraf = require('rimraf')
import mkdirp = require('mkdirp')
import findCacheDir = require('find-cache-dir')
import u from './utils'

// $ next-init
// $ next-init ./my-next-app
// $ next-init default
// $ next-init default ./my-next-app
// $ next-init /someone/someone-next-app
// $ next-init /someone/someone-next-app ./my-next-app
// $ next-init /next.js/examples/with-glamorous
// $ next-init /next.js/examples/with-glamorous ./my-next-app
// $ next-init --example
// $ next-init --example ./my-next-app
// $ next-init /next.js/examples/
// $ next-init /next.js/examples/ ./my-next-app

async function cacheWithGit(repo, target) {
	try {
		let res

		if (await fs.exists(target)) {
			const cwd = process.cwd()

			process.chdir(target)
			res = await execa.shell('git pull origin master')
			process.chdir(cwd)
		} else {
			res = await execa.shell(`git clone ${repo} ${target}`)
		}

		if (res.failed) {
			throw new Error(res.stderr)
		}
	} catch(err) {
		rimraf.sync(target)
		throw new Error(`The template cache have some problems. Please retry it later, ${err.toString()}`)
	}
}

async function cacheOfficialTemplates(root, template) {
	const cachedPath = path.resolve(path.join(root, template))
	await cacheWithGit(`https://${path.join('/github.com/nextjs-templates', template)}`, cachedPath)
	return cachedPath
}

async function cacheOfficialExamples(root, template) {
	const cachedPath = path.resolve(path.join(root, 'next.js'))
	await cacheWithGit(`https://github.com/zeit/next.js/`, cachedPath)
	return `${cachedPath}/examples/${path.basename(template.replace('next.js/examples', ''))}`
}

async function cacheUserTemplate(root, template) {
	const cachedPath = path.resolve(path.join(root, template))
	await cacheWithGit(`https://${path.join('/github.com/', template)}`, cachedPath)
	return cachedPath
}

export default async function (cacheName = 'next-init', args: any) {
	const cachePath = findCacheDir({
		name: cacheName,
		create: true
	})

	if (u.isExamplesPath(args.template)) {
		return await cacheOfficialExamples(cachePath, args.template)
	} else if (u.isPathString(args.template)) {
		return await cacheUserTemplate(cachePath, args.template)
	} else {
		return await cacheOfficialTemplates(cachePath, args.template)
	}
}

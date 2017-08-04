import path = require('path')
import fs = require('mz/fs')
import execa = require('execa')
import rimraf = require('rimraf')
import mkdirp = require('mkdirp')
import findCacheDir = require('find-cache-dir')
import pFilter = require('p-filter')
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

async function readTemplateList(root) {
	return pFilter(await fs.readdir(root),
		async f => !/^\./.test(f) && (await fs.lstat(path.join(root, f))).isDirectory())
}

async function cacheDefaultTemplates(root, template) {
	const cachedPath = path.resolve(path.join(root, 'nextjs-templates'))
	await cacheWithGit(`https://${path.join('/github.com/next-init/nextjs-templates')}`, cachedPath)
	return cachedPath
}

async function cacheExamples(root, template) {
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
	const cacheInfo = {
		template: args.template,
		templateName: path.basename(args.template),
		rootPath: findCacheDir({
			name: cacheName,
			create: true
		}),
		cacheName: cacheName,
		cachePath: '',
		templates: []
	}

	if (u.isExamplesPath(args.template)) {
		cacheInfo.cachePath = await cacheExamples(cacheInfo.rootPath, args.template)
		cacheInfo.templates = await readTemplateList(cacheInfo.cachePath.replace(cacheInfo.templateName, ''))
	} else if (u.isPathString(args.template)) {
		cacheInfo.cachePath = await cacheUserTemplate(cacheInfo.rootPath, args.template)
	} else {
		cacheInfo.cachePath = await cacheDefaultTemplates(cacheInfo.rootPath, args.template)
		cacheInfo.templates = await readTemplateList(cacheInfo.cachePath)
	}

	return cacheInfo
}

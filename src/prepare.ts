import path = require('path')
import fs = require('mz/fs')
import execa = require('execa')
import rimraf = require('rimraf')
import mkdirp = require('mkdirp')
import findCacheDir = require('find-cache-dir')
import pFilter = require('p-filter')
import u from './utils'

async function cacheWithGit(repo, target) {
	try {
		let res

		if (await fs.exists(target)) {
			const cwd = process.cwd()

			process.chdir(target)
			console.log(`Starting pulling from ${repo}`)
			res = await execa.shell('git pull origin master')
			process.chdir(cwd)
		} else {
			console.log(`Starting clonning from ${repo}`)
			res = await execa.shell(`git clone ${repo} ${target}`)
		}

		if (res.failed) {
			throw new Error(res.stderr)
		}
	} catch(err) {
		console.log(`Cleanup cached directory from ${target}. try it later`)
		rimraf.sync(target)
		throw err
	}
}

async function readTemplateList(root) {
	return pFilter(await fs.readdir(root),
		async f => !/^\./.test(f) && (await fs.lstat(path.join(root, f))).isDirectory())
}

async function cacheDefaultTemplates(root, template) {
	const cachedPath = path.resolve(path.join(root, 'nextjs-templates'))
	await cacheWithGit(`https://${path.join('github.com/next-init/nextjs-templates')}`, cachedPath)
	return cachedPath
}

async function cacheExamples(root, template) {
	const cachedPath = path.resolve(path.join(root, 'next.js'))
	await cacheWithGit(`https://github.com/zeit/next.js/`, cachedPath)
	return `${cachedPath}/examples/`
}

async function cacheUserTemplate(root, template) {
	const cachedPath = path.resolve(path.join(root, template))
	await cacheWithGit(`https://${path.join('github.com/', template)}`, cachedPath)
	return root
}

export default async function (args: any, cacheName = 'next-init') {
	const cacheInfo = {
		templateName: '',
		rootPath: findCacheDir({
			name: cacheName,
			create: true
		}),
		cacheName: cacheName,
		cachePath: '',
		templates: []
	}

	if (!u.isPathString(args.template)) {
		throw new TypeError(`Template path has invalid format: ${args.template}`)
	}

	if (u.isDefaultTempaltePath(args.template)) {
		cacheInfo.cachePath = await cacheDefaultTemplates(cacheInfo.rootPath, args.template)
		cacheInfo.templates = await readTemplateList(cacheInfo.cachePath)
		cacheInfo.templateName = args.template.replace(/nextjs-templates\/?/, '')
	} else if (u.isExamplesPath(args.template)) {
		cacheInfo.cachePath = await cacheExamples(cacheInfo.rootPath, args.template)
		cacheInfo.templates = await readTemplateList(cacheInfo.cachePath.replace(cacheInfo.templateName, ''))
		cacheInfo.templateName = args.template.replace(/next.js\/examples\/?/, '')
	} else {
		cacheInfo.cachePath = await cacheUserTemplate(cacheInfo.rootPath, args.template)
		cacheInfo.templateName = args.template
	}

	return cacheInfo
}

import path = require('path')
import fs = require('mz/fs')
import execa = require('execa')
import pFilter = require('p-filter')
import chalk = require('chalk')
import cacheGithubRepo = require('cache-github-repo')
import log from './log'
import u from './utils'

let forceUpdate = false

function cacheWithGit(repo, target, cachePath) {
	log.update(chalk`Start caching from {green ${repo} }`)

	return cacheGithubRepo(repo, target, {
		force: forceUpdate,
		cachePath
	})
}

async function readTemplateList(root) {
	return pFilter(await fs.readdir(root),
		async f => !/^\./.test(f) && (await fs.lstat(path.join(root, f))).isDirectory())
}

async function cacheDefaultTemplates(root, template) {
	const cachedPath = path.resolve(path.join(root, 'nextjs-templates'))
	await cacheWithGit(`next-init/nextjs-templates`, cachedPath, root)
	return cachedPath
}

async function cacheExamples(root, template) {
	const cachedPath = path.resolve(path.join(root, 'next.js'))
	await cacheWithGit(`zeit/next.js`, cachedPath, root)
	return `${cachedPath}/examples/`
}

async function cacheUserTemplate(root, template) {
	const cachedPath = path.resolve(path.join(root, template))
	await cacheWithGit(template, cachedPath, root)
	return path.resolve(root)
}

export default async function (args: any) {
	forceUpdate = args.force

	const cacheInfo = {
		templateName: '',
		rootPath: args.rootPath,
		cachePath: '',
		templates: []
	}

	log.start(chalk`Preparing...`)

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

	log.stop()

	return cacheInfo
}

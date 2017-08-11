import path = require('path')
import fs = require('mz/fs')
import execa = require('execa')
import pFilter = require('p-filter')
import chalk = require('chalk')
import CacheGithubRepo from 'cache-github-repo'
import u from './utils'

async function readTemplateList(root) {
	return pFilter(await fs.readdir(root),
		async f => !/^\./.test(f) && (await fs.lstat(path.join(root, f))).isDirectory())
}

export default async function ({
	template,
	cacheRoot,
	force = false
}) {
	const cache = new CacheGithubRepo()

	const cacheInfo = {
		repo: '',
		cachePath: '',
		templateName: '',
		templatesPath: '',
		templates: [],
		update: false,
		force: false
	}

	if (!u.isPathString(template)) {
		throw new TypeError(chalk`Template path has invalid format: {green ${template} }`)
	}

	if (u.isDefaultTempaltePath(template)) {
		cacheInfo.repo = `next-init/nextjs-templates`
		cacheInfo.cachePath = path.resolve(path.join(cacheRoot, 'nextjs-templates'))
		cacheInfo.templateName = template.replace(/nextjs-templates\/?/, '')
		cacheInfo.templatesPath = cacheInfo.cachePath
	} else if (u.isExamplesPath(template)) {
		cacheInfo.repo = `zeit/next.js`
		cacheInfo.cachePath = path.resolve(path.join(cacheRoot, 'next.js'))
		cacheInfo.templateName = template.replace(/next.js\/examples\/?/, '')
		cacheInfo.templatesPath = `${cacheInfo.cachePath}/examples/`
	} else {
		cacheInfo.repo = template
		cacheInfo.cachePath = path.resolve(path.join(cacheRoot, template))
		cacheInfo.templateName = template
		cacheInfo.templatesPath = ''
	}

	try {
		cacheInfo.update = await cache.updatable(cacheInfo.repo, cacheRoot)

		if (cacheInfo.force || cacheInfo.update) {
			await cache.cache(cacheInfo.repo, cacheInfo.cachePath)
		}

		if (cacheInfo.templatesPath !== '') {
			cacheInfo.templates = await readTemplateList(cacheInfo.templatesPath)
		}
	} catch (err) {
		throw new Error(chalk`Preparing failed {green ${err.toString()} }`)
	}

	return cacheInfo
}

import path = require('path')
import fs = require('fs-extra')
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
		repoLocalPath: '',
		templatePath: '',
		templates: [],
		update: false,
		force: false
	}

	if (!u.isPathString(template)) {
		throw new TypeError(chalk`Template path has invalid format: {green ${template} }`)
	}

	if (u.isDefaultTempaltePath(template)) {
		cacheInfo.repo = `next-init/templates`
		cacheInfo.templatePath = path.resolve(__dirname, '../template')
	} else {
		if (u.isExamplesPath(template)) {
			cacheInfo.repo = `zeit/next.js`
			cacheInfo.repoLocalPath = path.resolve(path.join(cacheRoot, 'next.js'))
			cacheInfo.templatePath = path.resolve(cacheInfo.repoLocalPath,
				'examples',
				template.replace(/next.js\/examples\/?/, '')
			)
		} else {
			cacheInfo.repo = template
			cacheInfo.repoLocalPath = path.resolve(path.join(cacheRoot, template))
			cacheInfo.templatePath = cacheInfo.repoLocalPath
		}

		try {
			cacheInfo.update = await cache.updatable(cacheInfo.repo, cacheRoot)

			if (cacheInfo.force || cacheInfo.update) {
				await cache.cache(cacheInfo.repo, cacheInfo.repoLocalPath)
			}

			if (u.isExamplesPath(template)) {
				const tpl = template.replace(/next.js\/examples\/?/, '')
				const templates = await readTemplateList(path.join(cacheInfo.repoLocalPath, 'examples'))

				if (tpl.length === 0 || templates.indexOf(tpl) === -1) {
					cacheInfo.templates = templates
				}
			}
		} catch (err) {
			throw new Error(chalk`Preparing failed {green ${err.toString()} }`)
		}
	}

	return cacheInfo
}

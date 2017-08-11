import * as path from 'path'
import test from 'ava'
import fs from 'fs-extra'
import findCacheDir from 'find-cache-dir'
import prepare from '../dist/prepare'

const cacheRoot = './node_modules/.cache/test-next-init-prepare'

test.before(async t => {
	await fs.remove(path.resolve(cacheRoot))
	await fs.ensureDir(path.resolve(cacheRoot))
})

test('next-init', async t => {
	let cacheInfo

	cacheInfo = await prepare({
		template: 'next-init/templates/default',
		cacheRoot,
		force: true
	})

	t.true(await fs.exists(`${cacheRoot}/next-init/default/package.json`))
	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/next-init`)) === 0)
	t.true(cacheInfo.templateName === 'default')

	try {
		await prepare({
			template: 'default',
			cacheRoot
		})
	} catch (err) {
		t.true(err !== undefined)
	}
})

test('nextjs/examples', async t => {
	let cacheInfo = await prepare({
		template: 'next.js/examples',
		cacheRoot,
		force: true
	})

	t.true(await fs.exists(`${cacheRoot}/next.js/package.json`))
	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/next.js`)) === 0)
	t.true(cacheInfo.templates.indexOf('with-glamorous') > -1)
	t.true(cacheInfo.templateName === '')
	t.true(cacheInfo.templatesPath === 'examples')

	cacheInfo = await prepare({
		template: 'next.js/examples/with-glamorous',
		cacheRoot
	})

	t.true(await fs.exists(`${cacheRoot}/next.js/examples/with-glamorous/package.json`))
	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/next.js`)) === 0)
	t.true(cacheInfo.templates.indexOf('with-glamorous') > -1)
	t.true(cacheInfo.templateName === 'with-glamorous')
	t.true(cacheInfo.templatesPath === 'examples')
})

test('user/repo', async t => {
	const cacheInfo = await prepare({
		template: 'ragingwind/nextjs-hnpwa',
		cacheRoot,
		force: true
	})

	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/ragingwind/nextjs-hnpwa`)) === 0)
	t.true(await fs.exists(`${cacheRoot}/ragingwind/nextjs-hnpwa/package.json`))
})

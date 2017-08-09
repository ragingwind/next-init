import * as path from 'path'
import test from 'ava'
import fs from 'fs-extra'
import findCacheDir from 'find-cache-dir'
import prepare from '../dist/prepare'

const rootPath = './node_modules/.cache/test-next-init-prepare'

test.before(async t => {
	await fs.remove(path.resolve(rootPath))

	findCacheDir({
		name: 'test-next-init-prepare',
		create: true
	})
})

test('nextjs-templates', async t => {
	let cacheInfo

	cacheInfo = await prepare({
		template: 'nextjs-templates/',
		force: true,
		rootPath
	})

	t.true(await fs.exists(`${rootPath}/nextjs-templates/basic/package.json`))
	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${rootPath}/nextjs-templates`)) === 0)
	t.true(cacheInfo.templateName === '')
	t.true(cacheInfo.templates.indexOf('basic') >= 0)

	cacheInfo = await prepare({
		template: 'nextjs-templates/basic',
		rootPath
	})

	t.true(await fs.exists(`${rootPath}/nextjs-templates/basic/package.json`))
	t.true(cacheInfo.templates.indexOf('basic') >= 0)
	t.true(cacheInfo.templateName === 'basic')

	try {
		await prepare({
			template: 'basic',
			rootPath
		})
	} catch (err) {
		t.true(err !== undefined)
	}
})

test('nextjs/examples', async t => {
	let cacheInfo = await prepare({
		template: 'next.js/examples',
		force: true,
		rootPath
	})

	t.true(await fs.exists(`${rootPath}/next.js/package.json`))
	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${rootPath}/next.js/examples`)) === 0)
	t.true(cacheInfo.templates.indexOf('with-glamorous') > -1)
	t.true(cacheInfo.templateName === '')

	cacheInfo = await prepare({
		template: 'next.js/examples/with-glamorous',
		rootPath
	})

	t.true(await fs.exists(`${rootPath}/next.js/examples/with-glamorous/package.json`))
	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${rootPath}/next.js/examples`)) === 0)
	t.true(cacheInfo.templates.indexOf('with-glamorous') > -1)
	t.true(cacheInfo.templateName === 'with-glamorous')
})

test('user/repo', async t => {
	const cacheInfo = await prepare({
		template: 'ragingwind/nextjs-hnpwa',
		force: true,
		rootPath
	})

	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${rootPath}`)) === 0)
	t.true(await fs.exists(`${rootPath}/ragingwind/nextjs-hnpwa/package.json`))
	t.true(cacheInfo.templateName === 'ragingwind/nextjs-hnpwa')
})

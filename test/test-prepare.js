import * as path from 'path'
import test from 'ava'
import fs from 'mz/fs'
import rimraf from 'rimraf'
import findCacheDir from 'find-cache-dir'
import prepare from '../dist/prepare'

const cacheRoot = './node_modules/.cache/test-next-init'

test.before(t => {
	rimraf.sync(cacheRoot)
})

test('nextjs-templates', async t => {
	let cacheInfo

	cacheInfo = await prepare({
		template: 'nextjs-templates/'
	}, 'test-next-init')

	t.true(await fs.exists(`${cacheRoot}/nextjs-templates/basic/package.json`))
	t.true(cacheInfo.templateName === '')
	t.true(cacheInfo.templates.indexOf('basic') >= 0)

	cacheInfo = await prepare({
		template: 'nextjs-templates/basic'
	}, 'test-next-init')

	t.true(await fs.exists(`${cacheRoot}/nextjs-templates/basic/package.json`))
	t.true(cacheInfo.templates.indexOf('basic') >= 0)
	t.true(cacheInfo.templateName === 'basic')

	try {
		await prepare({
			template: 'basic'
		}, 'test-next-init')
	} catch (err) {
		t.true(err !== undefined)
	}
})

test('nextjs/examples', async t => {
	let cacheInfo = await prepare({
		template: 'next.js/examples'
	}, 'test-next-init')

	t.true(await fs.exists(`${cacheRoot}/next.js/package.json`))
	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/next.js/examples`)) === 0)
	t.true(cacheInfo.templates.indexOf('with-glamorous') > -1)
	t.true(cacheInfo.templateName === '')

	cacheInfo = await prepare({
		template: 'next.js/examples/with-glamorous'
	}, 'test-next-init')

	t.true(await fs.exists(`${cacheRoot}/next.js/examples/with-glamorous/package.json`))
	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/next.js/examples`)) === 0)
	t.true(cacheInfo.templates.indexOf('with-glamorous') > -1)
	t.true(cacheInfo.templateName === 'with-glamorous')
})

test.serial('user/repo', async t => {
	const cacheInfo = await prepare({
		template: 'ragingwind/nextjs-hnpwa'
	}, 'test-next-init')

	t.true(cacheInfo.cachePath.indexOf(path.resolve(`${cacheRoot}/ragingwind/nextjs-hnpwa`)) === 0)
	t.true(await fs.exists(`${cacheRoot}/ragingwind/nextjs-hnpwa/package.json`))
	t.true(cacheInfo.templateName === 'ragingwind/nextjs-hnpwa')
})

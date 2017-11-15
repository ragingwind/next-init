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

test('stable', async t => {
	let cacheInfo

	cacheInfo = await prepare({
		template: 'next-init/templates/default',
		cacheRoot,
		force: true
	})

	t.true(cacheInfo.templatePath === path.resolve('./template/default'))

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
	t.true(cacheInfo.templates.indexOf('with-glamorous') > -1)
	t.true(cacheInfo.templatePath === path.resolve(`${cacheRoot}/next.js/examples`))

	cacheInfo = await prepare({
		template: 'next.js/examples/with-glamorous',
		cacheRoot
	})

	t.true(await fs.exists(`${cacheRoot}/next.js/examples/with-glamorous/package.json`))
	t.true(cacheInfo.templates.indexOf('with-glamorous') === -1)
	t.true(cacheInfo.templatePath === path.resolve(`${cacheRoot}/next.js/examples/with-glamorous`))
})

test('user/repo', async t => {
	const cacheInfo = await prepare({
		template: 'ragingwind/nextjs-hnpwa',
		cacheRoot,
		force: true
	})

	t.true(await fs.exists(`${cacheRoot}/ragingwind/nextjs-hnpwa/package.json`))
	t.true(cacheInfo.templatePath === path.resolve(`${cacheRoot}/ragingwind/nextjs-hnpwa`))
})

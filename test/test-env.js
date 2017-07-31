import test from 'ava'
import env from '../dist/env'
import * as path from 'path'

test(async t => {
	const e = await env()

	t.true(e.projectName === path.basename(process.cwd()))
})

test(async t => {
	const u = (await env()).user

	t.true(u !== undefined)
	t.true(u.name !== undefined)
})

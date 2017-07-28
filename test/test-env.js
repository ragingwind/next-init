import test from 'ava'
import env from '../dist/env'
import * as path from 'path'

test(async t => {
	const e = await env(['default'])

	t.true(e.name === 'default')
})

test(async t => {
	const e = await env([])

	t.true(e.name === path.basename(process.cwd()))
})

test(async t => {
	const u = (await env([])).user

	t.true(u !== undefined)
	t.true(u.name !== undefined)
})

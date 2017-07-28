import test from 'ava'
import env from '../dist/env'
import userinfo from '../dist/userinfo'
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
	const u = await userinfo()

	t.true(u !== undefined)
	t.true(u.name !== undefined)
})

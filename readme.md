![](https://avatars2.githubusercontent.com/u/30463846?v=4&u=b080ecd2d7d1226eb6e982cf1de875d4765e275d&s=200)

# next-init

> CLI for Next.js apps scaffolding from whatever

## Install

```sh
$ npm install -g next-init
```

## Getting Started

```sh
# init with default tempalte
$ next-init ./my-next-app

# install dependencies
$ cd ./my-next-app
$ npm install

# start next app in dev mode. equivalent to use `npm run dev`
$ next-dev

# start the next app in production. equivalent to use `npm run build && npm start`
$ next-build && next-start
```

## More Usage

```sh
next-init --help
```

## Examples

```sh
# default template
$ next-init
$ next-init ./my-next-app

# with interactive mode to update template values
$ next-init -i

# default template with @latest stable version
$ next-init @latest
$ next-init @latest ./my-next-app

# default template with @canary version
$ next-init @canary
$ next-init @canary ./my-next-app

# community template on github, inspired from `vue init`
$ next-init username/username-next-app
$ next-init username/someone-next-app ./my-next-app

# official examples to current or target path
$ next-init next.js/examples/
$ next-init next.js/examples/ ./my-next-app
$ next-init next.js/examples/with-glamorous ./my-next-app
```

## Alias

next-init supports alias of next commands. those of registered global scope commands will execute next bin in current path after discoverying in local path of `node_modules`

```sh
# equivalent command of `next dev`
next-dev

# equivalent command of `next start`
next-start

# equivalent command of `next build`
next-build
```

## License

MIT © [next-init](https://github.com/next-init)

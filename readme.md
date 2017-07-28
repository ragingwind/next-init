# next-init [![Build Status](https://travis-ci.org/next-init/next-init.svg?branch=master)](https://travis-ci.org/next-init/next-init)

> ✒ CLI for Next.js apps scaffolding from whatever

## Install

```
$ npm install -g next-init
```

## Examples

```sh
# Initialize a project at current path
$ next-init default

# Initialize a project with an official template `default` to target path
# Same as `next init`
$ next-init default ./my-next-app

# Initialize a project with a boilerplate or a custom template inspired from `vue init`
$ next-init /someone/someone-next-app ./my-next-app

# Initialize a project with an official example by --example / -e flag
$ next-init --example with-glamorous ./my-next-app

# Initialize a project with an official example by examples list
$ next-init --example ./my-next-app
$ next-init -e ./my-next-app

# Initialize a project with an official example by path of next.js repo
$ next-init /next.js/examples/with-glamorous ./my-next-app

# Get a list of official tempaltes
$ next-init --list

# Get a list of official examples
$ next-init --example --list

# Show help
$ next-init --help
```

## License

MIT © [next-init](https://github.com/next-init)

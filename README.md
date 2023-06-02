## Old SIMS website (retired 2023-06-02). The [rcrcsims.org](http://rcrcsims.org/) URL now points to the new site.

## Development

### Environment

To set up the development environment for this website, you'll need to install the following on your system:

- Install [nvm](https://github.com/creationix/nvm)
- `nvm use`
- [rvm](https://rvm.io/) and [Bundler](http://bundler.io/)
- `rvm use 2.3.1`
- Gulp ( $ npm install -g gulp )

After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install
```
Will also run `bundle install`


### Getting started

```
$ gulp serve
```
Compiles the compass files, javascripts, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

The `_config-dev.yml` file will be loaded alongside `_config.yml`.


### Other commands

Clean the compiled site. I.e. the `_site` folder
```
$ gulp clean
```

Compile the compass files, javascripts, and builds the jekyll site using `_config-dev.yml`.
Use this instead of ```gulp serve``` if you don't want to watch.
```
$ gulp
```

Compiles the site loading the `_config-prod.yml` alongside `_config.yml`. The javascript files will be minified.
```
$ gulp prod
```

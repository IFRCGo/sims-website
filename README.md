## SIMS
#### [rcrcsims.org](http://rcrcsims.org/)

## Contributing

### Update network directory
1. From this [github.com/AmericanRedCross/sims-website](https://github.com/AmericanRedCross/sims-website) page press the `Fork` button in the top right. This will create a copy of the project on your profile that you can work on without worrying about directly modifying the files creating the live webpage.
2. If you get a message that "You already have a fork of this repository:" then click the link to go to your fork of the project, click settings, and scroll down to delete the repository. Then go back to step 1. By deleting and then working with a new fork you can ensure your changes are based on a current copy of the main project.
3. Once you have created a new fork, you should go to github.com/danbjoseph/sims-website (with your username instead of `danbjoseph`).
4. Navigate to `/app/_network/`, click on `dan-joseph.md`, click on the `Raw` button, select all the text and copy it. Then press 'back' in your browser twice to get to the page for the `/_network` folder.
5. Click `Create new file`, name your file `first-last.md`, and paste the text copied from `dan-joseph.md` into the 'Edit new file' input section. 
6. At the top of the document, update everything between the two lines with only `---` on them to have your information. Update the description at the bottom of the document with your own blurb. When done, press the green `Commit changes` button.
    - For multiple languages, use the two letter [ISO code](https://www.loc.gov/standards/iso639-2/php/code_list.php) and separate them with a comma. For example: `[en,es]`.
7.  Navigate to `app/assets/img/network/` and click `Upload files` and upload a 1:1 aspect ratio picture of your face with the same filename as the value for `image:` at the top of `first-last.md` text file.
- Go back to this [github.com/AmericanRedCross/sims-website](https://github.com/AmericanRedCross/sims-website) page and press `New pull request`
- Click the link to `compare across forks.` Leave the `base fork` as "AmericanRedCross/sims-website" and `base` as "publish" and change the head fork to "danbjoseph/sims-website" and leave `compare` as "publish". With those selections you should then see a summary of your changes and be able to press a green `Create pull request` button. A project maintainer will then be able to review your files and merge them into the main project.
- TODO: instructions to add a logo for your organization to `app/assets/img/ns/`

### Update toolkit
- TODO

### Update gallery images
- add files to the dropbox in `rcrcsims/gallery/`
- each new image requires two files with identical names except one has `_THUMB` appended, for example `EbolaCasesTimeSeries_THUMB.png` and `EbolaCasesTimeSeries.png`
- file type should be .jpg, .jpeg, or .png
- the thumbnail should have a 1:1 aspect ratio, at least 150x150 pixels (though they currently display at 88x88), and as small as possible (less than 50kb)
- the full size image can probably have height < 900px for portrait or width < 1200px for landscape and should be around 500kb or less


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

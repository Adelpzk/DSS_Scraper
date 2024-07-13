# Waterloo works Scraper as a Browser Extension

Browser extension to scrape waterloo works data for FindWorks, which is a course project for the Decision Support Systems Course at UW.
This was built using the opensource code: https://github.com/uwwave/extension, which is the chrome extension for https://uwwave.ca/


## Getting started

1. Clone the repository
2. Run `yarn` to install dependencies
3. Run `yarn start` to start the development server
4. Open Chrome and go to `chrome://extensions/`
5. Enable developer mode by clicking the toggle switch
6. Click "Load unpacked" and select the `dist` folder

## Build

To build the extension, run `yarn build`. The built extension will be in the `dist` folder.

To build the extension for Firefox, run `yarn build:firefox`. The built extension will be in the `dist_firefox` folder.  
Firefox build is currently experimental and may not work as expected. Importing data does not work.

To build the extension library, run `yarn build:lib`. The built library will be in the `lib` folder.  
The extension library is used by the website to load in data.  

## Development

For test data, see `test_data` folder. Upload this to the extension using the advanced options menu.

For release managers, when updating the version, make sure to update both `manifest.json` and `package.json`.  
Create a new tag to trigger a draft release, then publish the release to publish to npm.  

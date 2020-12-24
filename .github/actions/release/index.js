module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 162:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(508);
const { Octokit } = __webpack_require__(918);
const path = __webpack_require__(622);
const fs = __webpack_require__(747);

const octokit = new Octokit({
	auth: core.getInput('token')
});

async function main() {
	const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
	core.info(`Repository ${owner}/${repo}`);

	let currentVersion
	try {
		const manifestPath = path.join(process.env.GITHUB_WORKSPACE, 'src/manifest.json')
		const manifest = fs.readFileSync(manifestPath)
		const { version } = JSON.parse(manifest);

		currentVersion = version

		core.info(`Detected version: ${currentVersion}`);
	} catch (error) {
		core.setFailed(`Unable to get current version.`);
		core.error(error);
		process.exit();
	}

	let previousVersion
	try {
		const { data } = await octokit.repos.getLatestRelease({
			owner,
			repo
		});
		previousVersion = data.tag_name

		core.info(`Previous release version: ${previousVersion}`);

		if (previousVersion === currentVersion) {
			core.info('Version has not changed.');
			process.exit();
		}
	} catch (error) {
		core.info('No previous release version.');
	}

	const changelog = previousVersion ? `https://github.com/${owner}/${repo}/compare/${previousVersion}...${version}` : `Initial release`

	let upload_url
	try {
		const { data } = await octokit.repos.createRelease({
			owner,
			repo,
			tag_name: currentVersion,
			name: currentVersion,
			body: changelog
		});
		upload_url = data.upload_url

		core.info(`Created release ${data.name}`);
	} catch (error) {
		core.setFailed(`Failed to create release ${currentVersion} for ${owner}/${repo}#${process.env.GITHUB_SHA}.`);
		core.error(error);
		core.debug(JSON.stringify(error.headers));
		core.debug(JSON.stringify(error.request));
		process.exit();
	}

	let buffer
	try {
		const sourcePath = path.join(process.env.GITHUB_WORKSPACE, 'src')

		const zip = new AdmZip();
		zip.addLocalFolder(sourcePath, ".");
		buffer = zip.toBuffer();

		core.info(`Stored zip to buffer.`);
	} catch (error) {
		core.setFailed(`Failed to save zip.`);
		core.error(error);
		process.exit();
	}

	try {
		await octokit.repos.uploadReleaseAsset({
			url: upload_url,
			headers: {
				'content-type': 'application/zip',
				'content-length': buffer.length
			},
			name: `SxDashPlus-${currentVersion}.zip`,
			data: buffer
		});

		core.info(`Uploaded asset to release.`);
	} catch (error) {
		core.setFailed(`Failed to upload release asset.`);
		core.error(error);
		process.exit();
	}
}

main();

/***/ }),

/***/ 508:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 918:
/***/ ((module) => {

module.exports = eval("require")("@octokit/rest");


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(162);
/******/ })()
;
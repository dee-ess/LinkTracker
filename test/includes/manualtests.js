/**
@name manualTests
@namespace
@description Manages the files and interface for manual tests
*/
// global namespace for manualTest
var manualTests = (function() {
	
	var manualTests = {},
		repoRoot = getRepoRoot();
	
	var devConfig = {
		// root of the cloned copy of glow
		repoRoot: repoRoot,
		linkTrackerPath: repoRoot + 'src/linktracker.js'
	};
	
	var distConfig = {
		// root of the cloned copy of glow
		repoRoot: repoRoot,
		linkTrackerPath: repoRoot + 'dist/linktracker.js'
	};
	
	/**
	@name manualTests.config
	@type Object
	@description Config options & paths for the manual tests
	*/
	manualTests.config = devConfig;
	
	// gets a relative path to the repo root including trailing slash
	function getRepoRoot() {
		var lastScriptElm = ( document.body || document.getElementsByTagName('head')[0] ).lastChild;
		return lastScriptElm.src.replace('manualtests.js', '../../');
	}
	
	// output the source for a given script element
	function revealSrcFor(scriptElm) {
		// filter code so it can be safely displayed
		var code = getSource( scriptElm ),
			preElement = document.createElement("pre");
		
		// TODO move this stuff into a stylesheet?
		preElement.style.border = '1px solid #ccc';
		preElement.style.padding = '10px';
		preElement.style.maxHeight = '200px';
		preElement.style.overflow = 'auto';
		
		preElement.className = "src";
		preElement.innerHTML = "<code>" + code + "<\/code>";
		scriptElm.parentNode.insertBefore(preElement, scriptElm);
	}
	
	// gets the source for a given script element, tidies it up, returns an html string
	function getSource( scriptElm ) {
		var code = scriptElm.innerHTML;
		
		// trim empty lines at start & end
		code = code.replace("// <![CDATA[", "").replace("// ]]>", "").replace(/^(\s*\n\r?)*|(\n\r?\s*)*$/g, '');
		
		// match the initial spacing of the first line, so we can shift it left
		var initialWhiteSpaceRe = new RegExp("^" + code.match(/^\s*/)[0], "mg");
		
		code = code.replace(initialWhiteSpaceRe, '')
			.replace("// <![CDATA[", "").replace("// ]]>", "")
			// simple html encoding
			.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
			// tabs to spaces
			.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
			// change newlines to <br />
			.replace(/\n\r?/g, "<br />");
			
		return code;
	}
	
	/**
	@name manualTests.showSrc
	@function
	@description Outputs script elements with a given class so they can be read
	
	@param {String} [className=showSrc] Only show scripts with this classname
	*/
	manualTests.showSrc = function(className) {
		var classNamePadded = ' ' + (className || 'showSrc') + ' ';
		
		var scriptElms = document.getElementsByTagName('script'),
			i = scriptElms.length;
		
		while (i--) {
			// does the script element have the class name?
			if ( (' ' + scriptElms[i].className + ' ').indexOf(classNamePadded) != -1 ) {
				revealSrcFor(scriptElms[i]);
			}
		}
	}
	
	// the element to log to, will be undefined before onload
	var logElm;
	
	// creates an element to send log messages to
	function createLog() {
		// create ogging element
		// todo: move this to stylesheet
		logElm = document.createElement("div");
		logElm.style.position = 'fixed';
		logElm.style.width = '200px';
		logElm.style.height = '200px';
		logElm.style.border = '1px solid #ccc';
		logElm.style.padding = '10px';
		logElm.style.margin = '0';
		logElm.style.overflow = 'auto';
		logElm.style.top = '0';
		logElm.style.right = '0';
		logElm.style.background = '#eee';
		
		// wait for the dom to be ready
		var prev = window.onload;
		window.onload = function() {
			// call any previous onload functions
			prev && prev();
			// add logging element to page
			document.body.appendChild(logElm);
		}
	}
	
	/**
	@name manualTests.log
	@function
	@description Logs a string
	
	@param {String} msg String to log
	*/
	manualTests.log = function(msg) {
		var text = document.createTextNode(msg);
		logElm.appendChild(text);
		logElm.appendChild( document.createElement('br') );
		// scroll the element to the bottom
		logElm.scrollTop = logElm.scrollHeight;
	}
	
	/**
	@name manualTests.clearLog
	@function
	@description Clears the log
	*/
	manualTests.clearLog = function() {
		logElm.innerHTML = '';
	}
	
	createLog();
	return manualTests;
})();
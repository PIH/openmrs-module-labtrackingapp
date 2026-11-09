// Loads AngularJS and the app's component scripts into the jsdom window, the way the GSP pages load them
// with ui.includeJavascript. The app's scripts are plain (non-module) scripts that use the global `angular`,
// so they are evaluated as scripts rather than imported.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const COMPONENTS_DIR = path.resolve(__dirname, '../../main/webapp/resources/scripts/components');

// Globals the pages normally provide
window.OPENMRS_CONTEXT_PATH = 'openmrs';

function loadScript(file) {
  window.eval(fs.readFileSync(file, 'utf8') + `\n//# sourceURL=${file}`);
}

// Same AngularJS version uicommons serves (1.5.8)
loadScript(require.resolve('angular/angular.js'));

// Registers the ngMock module ($httpBackend etc.). Its module()/inject() helpers need Jasmine's or Mocha's
// per-test context, so tests use createInjector() below instead.
loadScript(require.resolve('angular-mocks/angular-mocks.js'));

loadScript(path.join(COMPONENTS_DIR, 'EncounterFactory.js'));
loadScript(path.join(COMPONENTS_DIR, 'LabTrackingOrderFactory.js'));

/**
 * Creates a fresh injector for the given app modules (plus ng and ngMock), so each test gets its own
 * service instances. Usage: const Encounter = createInjector('encounterFactory').get('Encounter');
 */
globalThis.createInjector = (...modules) => window.angular.injector(['ng', 'ngMock', ...modules]);

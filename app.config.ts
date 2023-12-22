/*
Copyright 2023 Dynatrace LLC.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { userInfo } from 'os';
import type { CliOptions } from 'dt-app';

const isBuildSystem = !!process.env.JOB_NAME;

/* Supplies app id suffix */
function appIdPostfixSupplier(userBuildSuffix: string, buildSystemSuffix: string) {
  return isBuildSystem ? buildSystemSuffix.toLowerCase() : userBuildSuffix.toLowerCase();
}

/* Supplies app id prefix */
function appIdPrefixSupplier(userBuildSuffix: string, buildSystemSuffix: string) {
  return isBuildSystem ? buildSystemSuffix.toLowerCase() : userBuildSuffix.toLocaleLowerCase();
}

/* Supplies app name suffix */
function namePostfixSupplier(userBuildSuffix: string, buildSystemSuffix: string) {
  return isBuildSystem ? buildSystemSuffix : userBuildSuffix;
}

const environmentUrl = '';
const username = userInfo().username;
const appIdPostfix = appIdPostfixSupplier(`.${username}`, process.env.APP_ID_POSTFIX ?? '');
const namePostfix = namePostfixSupplier(` (${username})`, process.env.NAME_POSTFIX ?? '');

// NOTE: Deploying into the `dynatrace.` namespace requires an app-certificate which is bound to the App ID
//       to enable deployments of unsigned artifacts (e.g., local builds, e2e tests), my. is prepended to the App ID
const appIdPrefix = appIdPrefixSupplier('my.', process.env.APP_ID_PREFIX ?? '');

let desiredAppId = `dynatrace.automation.samples`;
let desiredAppName = 'Automation Workflow Creator Sample';

const MAX_APP_ID_LENGTH = 50; // see PS-7540
const MAX_APP_NAME_LENGTH = 40; // see PS-7540

if (desiredAppId.length + appIdPrefix.length + appIdPostfix.length > MAX_APP_ID_LENGTH) {
  console.warn(
    `appId='${desiredAppId}' in combination with prefix='${appIdPrefix}' and postfix='${appIdPostfix}' could lead to AppIds longer than ${MAX_APP_ID_LENGTH} characters (e.g., for E2E tests), deploying your app might fail (see PS-7540) -> reducing it...`,
  );
  desiredAppId = desiredAppId.substring(0, MAX_APP_ID_LENGTH - appIdPrefix.length - appIdPostfix.length - 1);
}

if (desiredAppName.length + namePostfix.length > MAX_APP_NAME_LENGTH) {
  console.warn(
    `appName=${desiredAppName} with postfix='${namePostfix}' could lead to a name longer than ${MAX_APP_NAME_LENGTH} characters (e.g., for E2E tests), deploying your app might fail (see PS-7540) -> reducing it...`,
  );
  desiredAppName = desiredAppName.substring(0, MAX_APP_NAME_LENGTH - namePostfix.length - 1);
}

const appId = `${appIdPrefix}${desiredAppId}${appIdPostfix}`;

function getAppVersion(): string {
  const pkgVersion = process.env.npm_package_version;
  if (!pkgVersion) {
    throw new Error('Unable to read NPM_PACKAGE_VERSION from environment!');
  }

  return isBuildSystem ? pkgVersion : `${pkgVersion}-dev.${Date.now()}`;
}

const config: CliOptions = {
  environmentUrl: environmentUrl,
  icon: './assets/AW-logo-small.png',
  app: {
    id: appId,
    description: 'A step by step guide to assist in building the first automated workflow.',
    name: `${desiredAppName}${namePostfix}`,
    version: getAppVersion(),
    scopes: [
      {
        name: 'automation:workflows:read',
        comment: '',
      },
      {
        name: 'automation:workflows:write',
        comment: '',
      },
    ],
  },

  // Build options for the dtp-cli, the mode should be production
  // and the tsconfig should point to the version that excludes tests
  build: {
    mode: 'production',
    ui: {
      assets: [{ glob: '**/*', input: 'assets', output: 'assets' }],
      tsconfig: './tsconfig.app.json',
    },
  },
};

module.exports = config;

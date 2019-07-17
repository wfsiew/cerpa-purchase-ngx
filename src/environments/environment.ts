// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  /** @see zul */
  // baseUrl: 'http://192.168.0.48:8000',
  // baseEnvUrl: 'http://192.168.0.48:8000',

  /** @see  Server */
  // baseUrl: 'http://192.168.0.154/cerpa-purchase',
  // baseEnvUrl: 'http://192.168.0.154',

  /** @see Wing_fe production */
  // baseUrl: 'http://192.168.0.53:8080/cerpa',
  // baseEnvUrl: 'http://192.168.0.53:8080/cerpa',

  /** @see  faiz  */
  //  baseUrl: 'http://192.168.0.41:8100',
  //  baseEnvUrl: 'http://192.168.0.41:8100',

  /** @see  development server */
  //  baseUrl: 'http://192.168.0.154/strawhat-test/cerpa-purchase',
  //  baseEnvUrl: 'http://192.168.0.154/strawhat-test/',

  /**@see Testing Server */
  // baseUrl: 'https://192.168.0.154/strawhat-test/cerpa-purchase',
  // baseEnvUrl: 'https://192.168.0.154/strawhat-test/cerpa-purchase'

  /** @see myServer */
  // baseUrl: 'http://127.0.0.1:8000',
  // baseEnvUrl: 'http://127.0.0.1:8000'

  /** Inventory */

  baseUrl: 'http://localhost:8080/cerpa',
  baseEnvUrl: 'http://localhost:8080/cerpa'
};

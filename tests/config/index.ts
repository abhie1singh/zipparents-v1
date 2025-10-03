/**
 * Test Configuration Index
 *
 * Exports environment-specific test configurations
 */

import { PlaywrightTestConfig } from '@playwright/test';
import { localConfig } from './local.config';
import { devConfig } from './dev.config';
import { prodConfig } from './prod.config';

export type Environment = 'local' | 'dev' | 'prod';

/**
 * Get test configuration for specific environment
 */
export function getConfig(env: Environment): Partial<PlaywrightTestConfig> {
  const configs = {
    local: localConfig,
    dev: devConfig,
    prod: prodConfig,
  };

  return configs[env];
}

/**
 * Get current environment from env variable
 */
export function getCurrentEnvironment(): Environment {
  const env = process.env.TEST_ENV || 'local';

  if (!['local', 'dev', 'prod'].includes(env)) {
    console.warn(`Unknown TEST_ENV: ${env}, defaulting to 'local'`);
    return 'local';
  }

  return env as Environment;
}

export { localConfig, devConfig, prodConfig };

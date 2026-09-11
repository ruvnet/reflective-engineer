import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',testMatch:'browser.spec.mjs',use:{headless:true,launchOptions:{executablePath:process.env.BROWSER_EXECUTABLE||undefined,chromiumSandbox:process.env.BROWSER_UNSANDBOXED!=='1'}},webServer:{command:'node console/serve.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:false},reporter:'list'});

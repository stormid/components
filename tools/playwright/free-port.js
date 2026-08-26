const { execFileSync } = require('child_process');

// Playwright loads playwright.config.js synchronously and does not await a Promise export, so a free
// port must be resolved synchronously here. Node has no synchronous TCP bind, so run a short-lived
// child that binds port 0 (OS-assigned free port), reports it, and exits.
module.exports = function freePort() {
    const finder = "const s=require('net').createServer();s.listen(0,()=>{process.stdout.write(String(s.address().port));s.close();});";
    return Number(execFileSync(process.execPath, ['-e', finder], { encoding: 'utf8' }).trim());
};

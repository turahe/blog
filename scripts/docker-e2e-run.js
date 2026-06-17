const { spawnSync } = require('child_process')

function parseWorkersArg(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--workers' || arg === '-w') {
      return argv[index + 1]
    }

    if (arg.startsWith('--workers=')) {
      return arg.slice('--workers='.length)
    }
  }

  return null
}

const workers = parseWorkersArg(process.argv.slice(2)) || process.env.PLAYWRIGHT_WORKERS || '50%'

console.log(`→ Running E2E container (Chromium, ${workers} workers)...`)

const result = spawnSync(
  'docker',
  ['compose', '--profile', 'e2e', 'run', '--rm', '-e', `PLAYWRIGHT_WORKERS=${workers}`, 'e2e'],
  { stdio: 'inherit', shell: false }
)

process.exit(result.status ?? 1)

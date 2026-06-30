const { spawnSync } = require('child_process')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

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

console.log('→ Building E2E images (app + runner)...')
run('docker', ['compose', '--profile', 'e2e', 'build', 'app-e2e', 'e2e'])

console.log('→ Starting app-e2e (seed + production server)...')
run('docker', ['compose', '--profile', 'e2e', 'up', '-d', '--force-recreate', '--wait', 'app-e2e'])

console.log(`→ Running E2E tests in Docker (Chromium, ${workers} workers)...`)
const result = spawnSync(
  'docker',
  ['compose', '--profile', 'e2e', 'run', '--rm', '-e', `PLAYWRIGHT_WORKERS=${workers}`, 'e2e'],
  { stdio: 'inherit', shell: false }
)

process.exit(result.status ?? 1)

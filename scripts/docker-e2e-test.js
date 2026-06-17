const { spawnSync } = require('child_process')
const os = require('os')

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

const workersFromCli = parseWorkersArg(process.argv.slice(2))
const workers =
  workersFromCli ||
  process.env.PLAYWRIGHT_WORKERS ||
  `${Math.max(2, Math.min(os.cpus().length, 4))}`

console.log('→ Starting Postgres and MinIO...')
run('docker', ['compose', '--profile', 'e2e', 'up', '-d', 'db', 'minio'])
run('docker', ['compose', 'up', 'minio-init'])

console.log('→ Building E2E images...')
run('docker', ['compose', '--profile', 'e2e', 'build', 'app-e2e', 'e2e'])

console.log('→ Starting app (seed + dev server)...')
run('docker', ['compose', '--profile', 'e2e', 'up', '-d', '--force-recreate', '--wait', 'app-e2e'])

console.log(`→ Running E2E tests in Docker (Chromium, ${workers} workers)...`)
run('docker', [
  'compose',
  '--profile',
  'e2e',
  'run',
  '--rm',
  '-e',
  `PLAYWRIGHT_WORKERS=${workers}`,
  'e2e',
])

console.log('✅ Docker E2E run completed')
console.log('   Report: playwright-report/index.html')

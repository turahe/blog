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

console.log('→ Starting Postgres and MinIO...')
run('docker', ['compose', 'up', '-d', 'db', 'minio'])
run('docker', ['compose', 'up', 'minio-init'])

console.log('→ Running unit + integration tests in Docker...')
run('docker', ['compose', '--profile', 'test', 'run', '--rm', '--build', 'test'])

console.log('✅ Docker test run completed')

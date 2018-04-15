const log = console.log

module.exports = {
  name: 'exit',
  description: 'Leaves the CLI.',
  execute () {
    log('See you soon!')
    process.exit(0)
  }
}
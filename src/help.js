const chalk = require('chalk')
const log = console.log

module.exports = {
  name: 'help',
  description: 'Shows this menu.',
  execute (_, __, ___, commandList) {
    let message = `${chalk.underline.bold('Help Menu')}\n`
    for (let item in commandList) message += `\n${chalk.bold.red(commandList[item].name)} - ${commandList[item].description}`
    log(message)
  }
}
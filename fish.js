const chalk = require('chalk')
const prompts = require('prompts')
const fig = require('figlet')
const fs = require('fs')
const sqlite = require('better-sqlite3')
const sql = new sqlite('./data.sqlite')
const fish = require('./resources/settings.json')
const log = console.log

const table = sql.prepare('SELECT count(*) FROM sqlite_master WHERE type="table" AND name = "data";').get();
if (!table['count(*)']) {
  sql.prepare('CREATE TABLE data (user TEXT PRIMARY KEY, credits INTEGER, upgrades TEXT, common INTEGER, uncommon INTEGER, rare STRING);').run()
  sql.pragma('synchronous = 1')
  sql.pragma('journal_mode = wal')
}
const getData = sql.prepare('SELECT * FROM data WHERE user = "1"')
const setData = sql.prepare('INSERT OR REPLACE INTO data (user, credits, upgrades, common, uncommon, rare) VALUES (?, ?, ?, ?, ?, ?);')
let data = getData.get()
if (!data) data = ['1', 0, '', 0, 0, '']
else data = [data.user, data.credits, data.upgrades, data.common, data.uncommon, data.rare]
const keys = { user: 0, credits: 1, upgrades: 2, common: 3, uncommon: 4, rare: 5 }
setData.run(data)

let commands = {
  setCommand (name, content) { this.cmds[name] = content },
  getCommand (name) { return this.cmds[name] },
  cmds: {}
}
const commandFiles = fs.readdirSync('./src')
for (const file of commandFiles) {
  const command = require(`./src/${file}`)
  commands.setCommand(command.name, command)
}

let cooldown = {}
log(chalk.cyan(fig.textSync('Fish!', { horizontalLayout: 'full' })))
async function getInput() {
  const response = await prompts({
    type: 'text',
    name: 'input',
    message: '',
    initial: 'help'
  })
  if (!response.input) log("Type 'exit' to quit!")
  else {
    const command = response.input.toLowerCase()
    if (!commands.cmds[command]) log('Invalid command!')
    else {
      try {
        if (cooldown[command] > 0) log(`Slow down! ${cooldown[command]} seconds remaining.`)
        else {
          if (commands.getCommand(command).cooldown) {
            cooldown[command] = commands.getCommand(command).cooldown
            commands.getCommand(command).execute(setData, data, keys, commands.cmds)
            let timeout = setInterval(() => {
              cooldown[command]--
              if (cooldown[command] === 0) clearInterval(timeout)
            }, 1000)
          } else commands.getCommand(command).execute(setData, data, keys, commands.cmds)
        }
      } catch (err) {
        log('There was an error!\n\n' + err)
      }
    }
  }
  getInput()
}

getInput()

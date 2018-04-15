const fish = require('../resources/settings.json')
const chalk = require('chalk')
const log = console.log

module.exports = {
  name: 'fish',
  description: 'Catches a fish!',
  cooldown: 2,
  execute (setData, data, keys) {
    const randomChance = ~~(Math.random() * 100) + 1
    let fishType = (randomChance >= fish.settings.rarities.rare) ? 'rare' : (randomChance >= fish.settings.rarities.uncommon) ? 'uncommon' : 'common'
    let fishy = fish.types[fishType]
    fishy.icon = fishy.icon.constructor === Array ? fishy.icon[~~(Math.random() * fishy.icon.length)] : fishy.icon
    log(chalk.yellow.bold(`You caught a${fishType === 'uncommon' ? 'n' : ''} ${fishy.icon} ${fishy.name} [${fishy.value} 💴]`))
    if (fishType === 'rare') data[keys.rare] += fishy.icon
    else data[keys[fishType]]++
    setData.run(data)
  }
}
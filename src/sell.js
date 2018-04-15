const fish = require('../resources/settings.json')
const chalk = require('chalk')
const log = console.log
const eToA = (str) => {
  split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
  arr = []
  for (var i=0; i<split.length; i++) {
    char = split[i]
    if (char !== "") {
      arr.push(char)
    }
  }
  return arr
}

module.exports = {
  name: 'sell',
  description: 'Sells your fish for credits.',
  cooldown: 2,
  execute (setData, data, keys) {
    const rareEtoa = eToA(data[keys.rare])
    const total = data[keys.common] + data[keys.uncommon] + rareEtoa.length
    if (!total) log(`You don't have any fish!`)
    else {
      const totalCost = (data[keys.common] * fish.types.common.value) + (data[keys.uncommon] * fish.types.uncommon.value) + (rareEtoa.length * fish.types.rare.value)
      data[keys.credits] += totalCost
      data[keys.common] = 0
      data[keys.uncommon] = 0
      data[keys.rare] = ''
      log(chalk.cyan.bold(`Sold ${total} fish for ${totalCost} 💴!`))
      setData.run(data)
    }
  }
}
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
  name: 'inv',
  description: 'Shows your inventory!',
  execute (setData, data, keys) {
    const rareEtoa = eToA(data[keys.rare])
    log(chalk.blue([
      '-- Inventory --',
      `• Credits: ${data[keys.credits]} 💴`,
      `• Common Fish: ${data[keys.common]} 🐟`,
      `• Uncommon Fish: ${data[keys.uncommon]} 🐠`,
      `• Rare Fish: ${data[keys.rare].length > 0 ? rareEtoa.length === 1 ? data[keys.rare] : rareEtoa.join(', ') : '0'}`
    ].join('\n')))
  }
}
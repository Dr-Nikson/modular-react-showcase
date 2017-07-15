
const isEnvPreset = preset => Array.isArray(preset) && preset[0] === 'env'

const modifyEnvTarget = (envPreset, targetName) => {
  const [ name, options ] = envPreset
  const target = options.targets && options.targets[targetName]

  if (!target) {
    throw new Error(`No such target [${targetName}] in provided .babelrc`)
  }

  return [
    name,
    Object.assign({}, options, { targets: { [targetName]: target } })
  ]
}


module.exports = function setBabelRarget(babelRc, target) {
  return Object.assign({}, babelRc, {
    presets: babelRc.presets.map(
      preset => !isEnvPreset(preset) ? preset : modifyEnvTarget(preset, target)
    )
  })
}

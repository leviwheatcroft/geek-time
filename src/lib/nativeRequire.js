// const debug = require('debug')

// const dbg = debug('gt')

// function loadPlugins (pluginDefinitions) {
//   const plugins = {}
//   Object.entries(pluginDefinitions).forEach(([name, definition]) => {
//     const module = definition.module || definition.name || name
//     const paths = [
//       module,
//       `./corePlugins/${module}`,
//       `./plugins/${module}`
//     ]
//     let plugin
//     while (paths.length) {
//       try {
//         const path = paths.shift()
//         dbg(path)
//         // eslint-disable-next-line import/no-dynamic-require, global-require
//         plugin = require(path)
//         console.log(`${module}: loaded ${path}`)
//       } catch (err) {
//         // noop
//       }
//     }
//     if (!plugin)
//       throw new Error(`couldn't load plugin: ${module}`)

//     plugins[name] = plugin
//   })
//   return plugins
// }

module.exports = {
  nativeRequire: require
}

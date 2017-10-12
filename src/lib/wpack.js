const path = require('path');
const webpack = require('webpack'); // eslint-disable-line import/no-unresolved
const service = require('./service');

/**
 * Creates the inputs element to be used in the final config
 * @param {object} fns Serverless functions object
 * @param {string} servicePath Serverless service path
 */
const createInputs = (fns, servicePath) => {
  return Object.keys(fns).reduce((last, fnKey) => {
    var fn = fns[fnKey];
    return Object.assign({}, last, {
      [service.fnName(fn)]: path.join(servicePath, service.fnTsPath(fn))
    })
  }, {});
}

/**
 * Creates the outputs element to be used in the final webpack config
 * @param {object} defaultOutput Webpack default output object
 * @param {string} outputPath Webpack output path
 */
const createOutput = (defaultOutput, outputPath) => {
  return Object.assign({}, defaultOutput, {
    path: outputPath
  });
}

/**
 * Creates an array of webpack configurations
 * @param {object} fns Serverless functions object
 * @param {object} config Webpack config
 * @param {string} servicePath Serverless service path
 * @param {object} defaultOutput Webpack default output object
 * @param {string} folder Webpack output folder
 * @returns {array} Array of webpack configurations
 */
const createConfigs = (fns, config, servicePath, defaultOutput, folder) => {
  return Object.assign({}, config, {
    entry: createInputs(fns, servicePath),
    output: createOutput(defaultOutput, path.join(servicePath, folder))
  });
}

/**
 * Runs webpack with an array of configurations
 * @param {array} configs Array of webpack configurations
 * @returns {Promise} Webpack stats
 */
const run = configs =>
  new Promise((resolve, reject) => {
    webpack(configs, (err, stats) => {
      if (err) reject(`Webpack compilation error: ${err}`);

      console.log(stats.toString({ // eslint-disable-line no-console
        colors: true,
        hash: false,
        chunks: false,
        version: false,
      }));

      if (stats.hasErrors()) reject('Webpack compilation error, see stats above');

      resolve(stats);
    });
  });

module.exports = {
  createConfigs,
  run,
};
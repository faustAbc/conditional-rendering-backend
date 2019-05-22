const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const model = tf.sequential();

const configureModel = (model) => {
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
}

const fitData = async (data, model) => {
  await model.fit(data, { epochs: 1000 });
}

const predictByData = (predictData, model) => {
  return model.predict(tf.tensor2d(predictData));
}

module.exports = {
  model,
  configureModel,
  fitData,
  predictByData,
}




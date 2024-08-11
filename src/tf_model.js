const tf = require("@tensorflow/tfjs-node")
let test_count = 0


class tf_model {
    constructor () {
        this.model = tf.sequential()
    }
}

const add_conv = (model, filters,stride) => {
    model.add (tf.layers.conv2d({
        kernelSize: 3,
        filters: filters,
        strides:stride,
        activation:"relu",
        kernelInitializer: "varianceScaling"
    }));
    model.add(tf.layers.maxPooling2d({poolSize:[2,2], strides:[2,2], padding:"same"}));


}

const build_model = (data) =>
{
    const model = tf.sequential();

    model.add (tf.layers.conv2d({
        inputShape: [ 28 , 28, 1],
        kernelSize: 3,
        filters: 8,
        strides:1,
        activation:"relu",
        kernelInitializer: "varianceScaling"
    }));
    model.add(tf.layers.maxPooling2d({poolSize:[2,2]}));
     model.add (tf.layers.conv2d({
        kernelSize: 3,
        filters: 16,
        strides:1,
        activation:"relu",
        kernelInitializer: "varianceScaling"
    }));
    model.add(tf.layers.maxPooling2d({poolSize:[2,2], strides:[2,2]}));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: 128,
        kernelnitializer: 'varianceScaling',
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: data.kinds,
        kernelnitializer: 'varianceScaling',
        activation: 'softmax'
    }));
    const optimizer = tf.train.adam();
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

  return model;
}

const train_model = async (model, data) => {

  const BATCH_SIZE = 10;
  const TRAIN_DATA_SIZE = 500;
  const TEST_DATA_SIZE = 100;

  const train_data = data.get_next_train_set(TRAIN_DATA_SIZE)
  const test_data = data.get_next_test_set(TEST_DATA_SIZE)

    // console.log(train_data)

  return model.fit(train_data.data, train_data.labels, {
    batchSize: BATCH_SIZE,
    validationData: [test_data.data, test_data.labels],
    epochs: 10,
    shuffle: true,
    callbacks: tf.node.tensorBoard("./logs")

  });
}


const predict = (model, data, count) => {
    const testdata = data.get_next_test_set(count)

    const predictions = model.predict(testdata.data);
    // file_writer = tf.node.summaryFileWriter(logdir + "train_" + test_count.toString()).
    // file_writer.

    return {pred: predictions, real: testdata.labels}
}

module.exports = {build_model, train_model, predict}

const tf = require("@tensorflow/tfjs-node")


class tf_model {
    constructor () {
        this.model = tf.sequential()
        this.lastDimensions = []
    }


    add_conv_layer = (options) => {
        if (options["inputShape"]) {
            this.lastDimensions = options["inputShape"]
        }
        model.add (tf.layers.conv2d(options));

        let newDim = (this.lastDimensions[0] - options["kernelSize"])

        if (options["padding"])
            newDim += 2 * options["padding"]
        newDim /= options["strides"] + 1

        this.lastDimensions = newDim
    }

    add_maxPool_layer = (poolSize, stride, padding) =>
    {
        model.add(tf.layers.maxPooling2d({poolSize:poolSize, strides:stride, padding:padding}));
    }

    add_flatten_layer = () => {
        this.model.add(tf.layers.flatten())
        let total = 1;
        for (let dim of this.lastDimensions) {
            total *= dim;
        }
        this.lastDimensions = [total]
    }
    add_dense_layer = (units, activation) => {
        if (units == 0)
            units = this.lastDimensions
        this.model.add(tf.layers.dense({
            units: units,
            kernelnitializer: 'varianceScaling',
            activation: activation
        }));
    }

    finalize = () => {
        model.compile({
            optimizer: optimizer,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });
    }

    delete = () => {
        this.model.dispose();
    }
}

// const build_model = (data) =>
// {
//     const model = tf.sequential();

//     model.add (tf.layers.conv2d({
//         inputShape: [ 28 , 28, 1],
//         kernelSize: 3,
//         filters: 8,
//         strides:1,
//         activation:"relu",
//         kernelInitializer: "varianceScaling"
//     }));
//     model.add(tf.layers.maxPooling2d({poolSize:[2,2]}));
//      model.add (tf.layers.conv2d({
//         kernelSize: 3,
//         filters: 16,
//         strides:1,
//         activation:"relu",
//         kernelInitializer: "varianceScaling"
//     }));
//     model.add(tf.layers.maxPooling2d({poolSize:[2,2], strides:[2,2]}));

//     model.add(tf.layers.flatten());
//     model.add(tf.layers.dense({
//         units: 128,
//         kernelnitializer: 'varianceScaling',
//         activation: 'relu'
//     }));
//     model.add(tf.layers.dense({
//         units: data.kinds,
//         kernelnitializer: 'varianceScaling',
//         activation: 'softmax'
//     }));
//     const optimizer = tf.train.adam();
//     model.compile({
//         optimizer: optimizer,
//         loss: 'categoricalCrossentropy',
//         metrics: ['accuracy'],
//     });

//   return model;
// }

// const train_model = async (model, data) => {

//   const BATCH_SIZE = 10;
//   const TRAIN_DATA_SIZE = 500;
//   const TEST_DATA_SIZE = 100;

//   const train_data = data.get_next_train_set(TRAIN_DATA_SIZE)
//   const test_data = data.get_next_test_set(TEST_DATA_SIZE)

//     // console.log(train_data)

//   return model.fit(train_data.data, train_data.labels, {
//     batchSize: BATCH_SIZE,
//     validationData: [test_data.data, test_data.labels],
//     epochs: 10,
//     shuffle: true,
//     callbacks: tf.node.tensorBoard("./logs")

//   });
// }


// const predict = (model, data, count) => {
//     const testdata = data.get_next_test_set(count)

//     const predictions = model.predict(testdata.data);
//     // file_writer = tf.node.summaryFileWriter(logdir + "train_" + test_count.toString()).
//     // file_writer.

//     return {pred: predictions, real: testdata.labels}
// }
// }

module.exports = {tf_model}

"use node"

const tf = require("@tensorflow/tfjs")


export const build_model = () =>
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
        units: 10,
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

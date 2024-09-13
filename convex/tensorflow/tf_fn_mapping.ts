// import tf from "@tensorflow/tfjs"

const tf = require("@tensorflow/tfjs")
export const mappings = {
 "elu" : tf.layers.elu,
 "leakyReLU" : tf.layers.leakyReLU,
 "prelu" : tf.layers.prelu,
 "reLU" : tf.layers.reLU,
 "softmax" : tf.layers.softmax,
 "thresholdedReLU" : tf.layers.thresholdedReLU,
 "activation" : tf.layers.activation,
 "dense" : tf.layers.dense,
 "dropout" : tf.layers.dropout,
 "embedding" : tf.layers.embedding,
 "flatten" : tf.layers.flatten,
 "permute" : tf.layers.permute,
 "repeatVector" : tf.layers.repeatVector,
 "reshape" : tf.layers.reshape,
 "spatialDropout1d" : tf.layers.spatialDropout1d,
 "conv1d" : tf.layers.conv1d,
 "conv2d" : tf.layers.conv2d,
 "conv2dTranspose" : tf.layers.conv2dTranspose,
 "conv3d" : tf.layers.conv3d,
 "cropping2D" : tf.layers.cropping2D,
 "depthwiseConv2d" : tf.layers.depthwiseConv2d,
 "separableConv2d" : tf.layers.separableConv2d,
 "upSampling2d" : tf.layers.upSampling2d,
 "add" : tf.layers.add,
 "average" : tf.layers.average,
 "concatenate" : tf.layers.concatenate,
 "dot" : tf.layers.dot,
 "maximum" : tf.layers.maximum,
 "minimum" : tf.layers.minimum,
 "multiply" : tf.layers.multiply,
 "batchNormalization" : tf.layers.batchNormalization,
 "layerNormalization" : tf.layers.layerNormalization,
 "averagePooling1d" : tf.layers.averagePooling1d,
 "averagePooling2d" : tf.layers.averagePooling2d,
 "averagePooling3d" : tf.layers.averagePooling3d,
 "globalAveragePooling1d" : tf.layers.globalAveragePooling1d,
 "globalAveragePooling2d" : tf.layers.globalAveragePooling2d,
 "globalMaxPooling1d" : tf.layers.globalMaxPooling1d,
 "globalMaxPooling2d" : tf.layers.globalMaxPooling2d,
 "maxPooling1d" : tf.layers.maxPooling1d,
 "maxPooling2d" : tf.layers.maxPooling2d,
 "maxPooling3d" : tf.layers.maxPooling3d,
 "convLstm2d" : tf.layers.convLstm2d,
 "convLstm2dCell" : tf.layers.convLstm2dCell,
 "gru" : tf.layers.gru,
 "gruCell" : tf.layers.gruCell,
 "lstm" : tf.layers.lstm,
 "lstmCell" : tf.layers.lstmCell,
 "rnn" : tf.layers.rnn,
 "simpleRNN" : tf.layers.simpleRNN,
 "simpleRNNCell" : tf.layers.simpleRNNCell,
 "stackedRNNCells" : tf.layers.stackedRNNCells,
 "bidirectional" : tf.layers.bidirectional,
 "timeDistributed" : tf.layers.timeDistributed,
 "inputLayer" : tf.layers.inputLayer,
 "zeroPadding2d" : tf.layers.zeroPadding2d,
 "alphaDropout" : tf.layers.alphaDropout,
 "gaussianDropout" : tf.layers.gaussianDropout,
 "gaussianNoise" : tf.layers.gaussianNoise,
 "masking" : tf.layers.masking,
 "rescaling" : tf.layers.rescaling,
 "centerCrop" : tf.layers.centerCrop,
 "resizing" : tf.layers.resizing,
 "categoryEncoding" : tf.layers.categoryEncoding,
 "randomWidth" : tf.layers.randomWidth,
}
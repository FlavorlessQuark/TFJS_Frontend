const fs = require('fs')
const tf = require("@tensorflow/tfjs-node")

class model_data {
    constructor() {
        this.trainIdx = 0;
        this.testIdx = 0;
        this.train_data = []
        this.test_data = []
        this.kinds = 0
        this.names = []
    }

    read_file_stream = async (path, idx) =>
    {
        const promise = new Promise((resolve, reject) => {

        const readStream = fs.createReadStream(path,{ highWaterMark: 28 * 28, encoding: 'hex' });
        const data = []
            readStream.on('data', function(chunk) {
                const current = []
                for (let i = 0; i < chunk.length; i += 2) {
                    current.push(Number("0x" + chunk[i] + chunk[i + 1]))
                }
                data.push({data: current, label: idx});

            }).on('end', function() {
                resolve(data)
            });
        })
        return promise
    }

    shuffle = (array) => {
        return array
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    build = async (count) => {
        let filenames = []
        let train_data = []
        let test_data = []



        fs.readdirSync("./data/training").forEach(file => filenames.push(file))

        filenames.sort()
        if (count <= 0)
            this.kinds = filenames.length;
        else
            this.kinds = count;
        for (let i = 0; i < this.kinds; i++) {
            const res_train = await this.read_file_stream("data/training/" + filenames[i], i)
            const res_test  = await this.read_file_stream("data/testing/" + filenames[i], i)
            train_data = train_data.concat(res_train)
            test_data  = test_data.concat(res_test)
        }
        this.train_data = this.shuffle(train_data)
        this.test_data = this.shuffle(test_data)
    }

    make_tensors = (array) => {
        let data_tensor = tf.tensor1d([])
        let label_tensor = tf.tensor1d([])
        array.forEach(element => {
            data_tensor = data_tensor.concat(tf.tensor1d(element.data))

            let label_list = Array(this.kinds).fill(0)

            label_list[element.label] = 1
            label_tensor = label_tensor.concat(tf.tensor(label_list))
        });
        return {data: data_tensor, labels:label_tensor};
    }

    get_next_train_set = (count) => {
        const shuffled = this.train_data.slice(this.trainIdx, this.trainIdx + count);
        this.trainIdx += count
        const result = tf.tidy(() =>
        {
            const tensors = this.make_tensors(shuffled)

            return {
                data: tensors.data.reshape([count, 28, 28, 1]),
                labels: tensors.labels.reshape([count, this.kinds])
            };
        })
        return result
    }


    get_next_test_set = (count) => {
        const shuffled = this.test_data.slice(this.testIdx, this.testIdx + count);
        this.testIdx += count
        const result = tf.tidy(() =>
        {
            const tensors = this.make_tensors(shuffled)
            return {
                data: tensors.data.reshape([count, 28, 28, 1]),
                labels: tensors.labels.reshape([count, this.kinds])
            };
        })
        return result
    }


}

module.exports = { model_data }

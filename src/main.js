const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const fs = require("fs")
const {model_data} = require("./data");
const tf = require("@tensorflow/tfjs-node");
const { build_model, train_model, predict } = require('./tf_model');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let win;

// const handler = tf.io.fileSystem("./model/model.json");
const mdata = new model_data()
let model;


const createWindow = () => {

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation:true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('./views/index.html');
}

require('electron-reloader')(module, {
            debug: false,
            watchRenderer: true,
            ignore: ["data/*, logs/*, node_modules/*"]
});

app.whenReady().then(async() => {

    createWindow();
    // loaded_model = await tf.loadLayersModel(handler);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            app.quit();
    })

})

ipcMain.on("close", (e, args) => {
    app.quit();
})

ipcMain.on("test", async (e, args) => {
    const result = predict(model, mdata, 1)

    result.pred.argMax(-1).print()
    result.real.argMax(-1).print()
    tf.dispose(result.pred)
    tf.dispose(result.real)
})

const loadata = async() => {
    if (!mdata.kinds) {
        console.log("loading data...")
        await mdata.build(10)
        console.log("loaded data")
    }
}

ipcMain.on("load", async (e, args) => {
    await loadata()
})

ipcMain.on("eval", async (e, args) => {
    if (!model) {
        await loadata()
        if (fs.existsSync("./model/model.json")) {
            console.log("found existing mode")
            // const handler = tf.io.fileSystem("./model/model.json");
            model = await tf.loadLayersModel('file://./model/model.json');
            console.log("loaded mode")
            const optimizer = tf.train.adam();
            model.compile({
                  optimizer: optimizer,
                    loss: 'categoricalCrossentropy',
                    metrics: ['accuracy'],
            })
            console.log("compiled mode")

        }
        else {
            model = build_model(mdata)
            console.log("loaded new model")
        }
    }
    try {
        for (let i = 0; i < 50; i++) {
            console.log(" ITERATION %d OF %d", i + 1, 50)
            await train_model(model, mdata)

            model.save('file://./model');
        }

    }
    catch(err) {
        console.log("error taining model", err)
    }
})

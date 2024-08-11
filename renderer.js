const WIDTH = 500;
const HEIGHT = 500;
const canvas = document.getElementById("canvas");
const img = document.getElementById("image");
const converter = document.getElementById("converter");
const ctx = canvas.getContext("2d");
const DEFAULT_BG = "#ffffff"
const lpos = {x:0, y:0}
const cpos = {x:0, y:0}

const paths = []

window.addEventListener("keyup", (e) => {
        if (e.key == "Escape")
        {
            const menu = document.getElementById("menu");
            if (menu.style.display != "flex")
            {
                menu.style.display = "flex";

            }
            else
                menu.style.display = "none";
        }
    }
    , true)

window.onload = () =>
{
    console.log("Loaded")
    // document.getElementById("quit").addEventListener("click", quitApp);
    // document.getElementById("resume").addEventListener("click", resumeApp);
    document.getElementById("run").addEventListener("click", runModel);
    document.getElementById("test").addEventListener("click", testModel);
    document.getElementById("load").addEventListener("click", loadData);
    // document.getElementById("makeimage").addEventListener("click", make_canv_image);
    // document.getElementById("clear").addEventListener("click", () => {
    //     ctx.fillStyle = DEFAULT_BG;
    //     ctx.fillRect(0, 0, WIDTH, HEIGHT);
    //     paths.length = 0
    // });

    // canvas.width = WIDTH
    // canvas.height = HEIGHT

    // canvas.addEventListener('mousemove', function(e) {setPosition(e)}, false);


	// /* Drawing on Paint App */
	// ctx.lineWidth = 5;
	// ctx.lineJoin = 'round';
	// ctx.lineCap = 'round';
	// ctx.strokeStyle = 'black';

	// canvas.addEventListener('mousedown', function(e) {
	// 	canvas.addEventListener('mousemove', draw);
	// }, false);

	// canvas.addEventListener('mouseup', function() {
	// 	canvas.removeEventListener('mousemove', draw);
    //     make_canv_image()
	// }, false);

	// const draw = () => {
	// 	ctx.beginPath();
	// 	ctx.moveTo(lpos.x, lpos.y);
	// 	ctx.lineTo(cpos.x, cpos.y);
    //     paths.push({...lpos})
	// 	ctx.closePath();
	// 	ctx.stroke();
	// };

    // window.requestAnimationFrame(draw)
}

window.api.receive("message", (msg) => {
    console.log("got message from main process", msg)
    const encoded = btoa(String.fromCharCode.apply(null, msg));
    document.getElementById("receiver").innerHTML = msg;
    document.getElementById("image").src = "data:image/jpg;base64" + encoded
})

const runModel = () =>{

    window.api.send("eval", "");
}
const testModel = () =>{

    window.api.send("test", "");
}
const loadData = () =>{

    window.api.send("load", "");
}


// const make_canv_image = () => {
//     // const img = ctx.getImageData(0,0, WIDTH, HEIGHT);
//     console.log(paths)
//     let svg = "";
//     let small = {x: WIDTH, y:HEIGHT}
//     let big = {x: 0, y:0}
//     svg += "<path d=\"";

//     svg += "M" + paths[0].x.toString() + " " +paths[1].y.toString()

//     for (let i = 1; i < paths.length; i += 1) {
//         small.x = Math.min(small.x, paths[i].x)
//         small.y = Math.min(small.y, paths[i].y)
//         big.x = Math.max(big.x, paths[i].x)
//         big.y = Math.max(big.y, paths[i].y)
//         svg += " L " + paths[i].x.toString() + " " +paths[i].y.toString()
//     }

//     svg += '" fill="transparent" stroke="black"/> </svg>'
//     svg = '<svg width="500" height="500" viewbox=" 0 0 500 500"'
//         + ' xmlns="http://www.w3.org/2000/svg">'
//         + svg;

//     console.log(svg)

//     const svg_blob = new Blob([svg], {type: "image/svg+xml"})
//     const uri = URL.createObjectURL(svg_blob)
//     let data;


//     const converter_canv = document.getElementById('converter');
//     img.height = 500
//     img.width = 500

//     img.onload = () =>
//     {
//         converter_canv.width = 28;
//         converter_canv.height = 28;

//         const converter_ctx = converter_canv.getContext('2d');
//         converter_ctx.drawImage(img, 0, 0, 28, 28);
//         data = converter_ctx.getImageData(0, 0, 28, 28)
//         console.log("img bitmap", data)
//         const bits = new Uint8Array(28 * 28)
//         let i = 0;
//         for (let x = 0; x < data.data.length; x += 3)
//         {
//             bits[i] = (data.data[x] != 0 ||  data.data[x + 1] != 0 ||  data.data[x + 1] != 0) * 255
//             i++;
//         }
//         console.log("final", bits)
//          window.api.send("eval", bits);
//     }
//     img.src = uri;
// }

// function setPosition(e) {
//   lpos.x = cpos.x;
//   lpos.y = cpos.y;

//   cpos.x = e.pageX - canvas.offsetLeft;
//   cpos.y = e.pageY - canvas.offsetTop;
// }

// const quitApp = () =>
// {
//     console.log("trying to close")
//     window.api.send("close", "");
// }

// const resumeApp = () =>
// {
//     console.log("trying to resume")
//     document.getElementById("menu").style.display = "none";
// }



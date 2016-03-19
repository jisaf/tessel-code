// Running on tessel.

var http = require('http');
var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['D']);

camera.on('ready', function () {

    camera.takePicture(function (err, imageBuffer) {

        if (err) return console.error(err);

        var request = http.request({
            hostname: '192.168.1.193', // Where your other process is running
            port: 3001,
            path: '/pics',
            method: 'POST',
            headers: {
                'Content-Type': 'image/jpg',
                'Content-Length': imageBuffer.length
            }
        });

        request.write(imageBuffer);

    });

});
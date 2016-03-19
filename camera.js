var tessel = require('tessel');
var notificationLED = tessel.led[3];
var http = require('http')

var camera = require('camera-vc0706').use(tessel.port['D']);
var accel = require('accel-mma84').use(tessel.port['A']); // Replace '../' with 'accel-mma84' in your own code

var thingsReady = 0;

var isReady = function () {

	thingsReady++;

	if (thingsReady === 2) {

		var checkMotion = function (xyz) {
			console.log('x:', xyz[0].toFixed(2),
				'y:', xyz[1].toFixed(2),
				'z:', xyz[2].toFixed(2));
			if(xyz[2] > 0.12 || xyz[2] < -0.12) {
				takePic()
			}
		}

		accel.on('data', checkMotion)

		var takePic = function(){
			console.log("pausing")
			accel.removeAllListeners('data');
			camera.takePicture(function (err, imageBuffer) {
				if (err) return console.error(err);
				process.sendfile('person.jpg', imageBuffer);
				// if (err) return console.error(err);
				// console.log("took a picture")

				// var request = http.request({
		  //           hostname: '192.168.1.156', // Where your other process is running
		  //           port: 3000,
		  //           path: '/pics',
		  //           method: 'POST',
		  //           headers: {
		  //           	'Content-Type': 'image/jpg',
		  //           	'Content-Length': imageBuffer.length
		  //           }
		  //       }, function (response) {
		  //       	console.log(response.statusCode);
		  //       });

				// request.write(imageBuffer);
				// // request.end();
				console.log("resuming")
				accel.on('data', checkMotion)
			})
	    		// console.log('taking a picture');



					// request.end();
				// });
	    	// }

	    }

	} 

};

camera.on('ready', isReady);
accel.on('ready', isReady);

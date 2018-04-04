const WebSocket = require('ws');
const mathsteps = require('mathsteps');
const https = require('http');


var search2 = '';
var check = '';
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('Turing Machine v 0.112');
    ws.send('© Cunev Dmitriy Computations 2018');
    ws.send(' ');
    //console.log(calculate(message));
    const steps = mathsteps.solveEquation(message);
	steps.forEach(step => { 
	ws.send(step.newEquation.ascii());
	}); 



 	search2 = message;

 	while ( search2.indexOf("+") >=0 ) {
	search2 = search2.replace("+","%2B");
	}
	ws.send('');
	ws.send('Input: ' + search2);
 	ws.send('Solution :');
	https.get('http://api.wolframalpha.com/v1/result?appid=K2K8GR-Y3826G6L87&input=solve '+search2+'&podstate=Result__Step-by-step+solution&format=plaintext', (resp) => {
 	 let data = '';

 	 // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
 	   data += chunk;
	  });

	  // The whole response has been received. Print out the result.
 	 resp.on('end', () => {

 	 	if (data.indexOf("Wolfram|Alpha") >=0) {
 	 		data = data.replace("Wolfram|Alpha","Turing Machine")
 	 	}

 	 	check = data;

 	   ws.send(data);
		ws.send('');
 	   
	https.get('http://api.wolframalpha.com/v1/result?appid=K2K8GR-Y3826G6L87&input=ExpandedForm '+search2+'&podstate=Result__Step-by-step+solution&format=plaintext', (resp) => {
 	 let data = '';

 	 // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
 	   data += chunk;
	  });

	  // The whole response has been received. Print out the result.
 	 resp.on('end', () => {
 	 	if (data.indexOf("Wolfram|Alpha") >=0) {
 	 		data = data.replace("Wolfram|Alpha","Turing Machine")
 	 	}

 	 	 if (check != data) {
 	 ws.send('Expanded Form :');
 	  ws.send(data);
	ws.send('');
 	  const steps = mathsteps.simplifyExpression(message);

	steps.forEach(step => {

		ws.send(step.newNode.toString());    // after change: 6 x

	});

 	}
 	 });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});   

 	 });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});                  
  }); 
});

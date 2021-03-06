const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const Firestore = require('@google-cloud/firestore');

exports.writeApplication = functions.https.onRequest((request, response) => {

  switch (request.method) {
    case 'POST': {
      let errorMessage = '';
      let source = '';
      if(request.headers.authorization === undefined) {
        response.status(400).send("Invalid auth method");
        break;
      }
      const base64Credentials = request.headers.authorization.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      console.log('invoked ', username);
      if(username === undefined || password === undefined) {
        response.status(400).send("Invalid auth method");
        break;
      } else {
        if(username === "izbiram.com" && password === "CrediYes1234!@#$") {
          source = 'izbiram.bg';
        } else if (username === "crediyes.bg" || password === "CrediYes1234!@#$") {
          source = 'crediyes.bg';
        } else {
          response.status(400).send("Invalid auth method");
          break;
        }
      }

      let body = request.body;
      if(body.creditType === undefined || (body.creditType !== "personal" && body.creditType !== "mortgage")) {
        errorMessage = "Invalid parameter 'creditType'"
      }
      console.log('FUNCTION INVOKED for ' + body.name);
      if(body.name === undefined) {
        errorMessage = "Invalid parameter 'name'"
      }
      if(body.location === undefined) {
        errorMessage = "Invalid parameter 'location'"
      }
      if(body.phone === undefined) {
        errorMessage = "Invalid parameter 'phone'"
      }
      if(body.email === undefined) {
        errorMessage = "Invalid parameter 'email'"
      }

      if(source === "crediyes.bg") {
        if(body.sum === undefined) {
          errorMessage = "Invalid parameter 'sum'"
        }

        // if(body.egn === undefined) {
        //   errorMessage = "Invalid parameter 'egn'"
        // }

        // if(body.address === undefined) {
        //   errorMessage = "Invalid parameter 'address'"
        // }
      }

      if(errorMessage === '') {
        let data = {
          full_name: body.name,
          phone: body.phone,
          email: body.email,
          city: body.location,
          source: source
        };

        if(body.sum !== undefined) {
          data.amount = parseInt(body.sum);
        }
        if(body.address !== undefined) {
          data.address = body.address;
        }
        if(body.egn !== undefined) {
          data.egn = body.egn;
        }
        if(body.serviceBy !== undefined) {
          data.service_by = parseInt(body.serviceBy);
        }

        const PROJECTID = 'fir-test-c82d3';
        const COLLECTION_NAME = 'loans';
        const firestore = new Firestore({
          projectId: PROJECTID,
          timestampsInSnapshots: true,
        });

        console.log('Writing...');
        test = firestore.collection(COLLECTION_NAME).add(data);
        test.then(function() {
          console.log('Written. Returning 200 success.');
          response.status(200).send("Success! Application is created");
          return;
        }).catch(function(err) { 
          console.log('returning 400 ' + err);
          response.status(400).send('Returning error ' + err);
          return;
        });
      } else {
        console.log('Returning 400', errorMessage);
        response.status(400).send(errorMessage);
      }
      break;
    }
    default:
      response.status(403).send({error: 'Forbidden!'});
      break;
  }

});

// exports.writeApplicationTest = functions.https.onRequest((request, response) => {

//   switch (request.method) {
//     case 'POST': {
//       let errorMessage = '';
//       let source = '';
//       if(request.headers.authorization === undefined) {
//         response.status(400).send("Invalid auth method");
//         break;
//       }
//       const base64Credentials = request.headers.authorization.split(' ')[1];
//       const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//       const [username, password] = credentials.split(':');

//       console.log('invoked ', username);
//       if(username === undefined || password === undefined) {
//         response.status(400).send("Invalid auth method");
//         break;
//       } else {
//         if(username === "izbiram.com" && password === "CrediYes1234!@#$") {
//           source = 'izbiram.bg';
//         } else if (username === "crediyes.bg" || password === "CrediYes1234!@#$") {
//           source = 'crediyes.bg';
//         } else {
//           response.status(400).send("Invalid auth method");
//           break;
//         }
//       }

//       let body = request.body;
//       if(body.creditType === undefined || (body.creditType !== "personal" && body.creditType !== "mortgage")) {
//         errorMessage = "Invalid parameter 'creditType'"
//       }
//       console.log('FUNCTION INVOKED for ' + body.name);
//       if(body.name === undefined) {
//         errorMessage = "Invalid parameter 'name'"
//       }
//       if(body.location === undefined) {
//         errorMessage = "Invalid parameter 'location'"
//       }
//       if(body.phone === undefined) {
//         errorMessage = "Invalid parameter 'phone'"
//       }
//       if(body.email === undefined) {
//         errorMessage = "Invalid parameter 'email'"
//       }

//       if(source === "crediyes.bg") {
//         if(body.sum === undefined) {
//           errorMessage = "Invalid parameter 'sum'"
//         }

//         // if(body.egn === undefined) {
//         //   errorMessage = "Invalid parameter 'egn'"
//         // }

//         // if(body.address === undefined) {
//         //   errorMessage = "Invalid parameter 'address'"
//         // }
//       }

//       if(errorMessage === '') {
//         let data = {
//           full_name: body.name,
//           phone: body.phone,
//           email: body.email,
//           city: body.location,
//           source: source
//         };

//         if(body.sum !== undefined) {
//           data.amount = parseInt(body.sum);
//         }
//         if(body.address !== undefined) {
//           data.address = body.address;
//         }
//         if(body.egn !== undefined) {
//           data.egn = body.egn;
//         }
//         if(body.serviceBy !== undefined) {
//           data.service_by = parseInt(body.serviceBy);
//         }

//         const PROJECTID = 'fir-test-c82d3';
//         const COLLECTION_NAME = 'loans';
//         const firestore = new Firestore({
//           projectId: PROJECTID,
//           timestampsInSnapshots: true,
//         });

//         console.log('Writing...');
//         test = firestore.collection(COLLECTION_NAME).add(data);
//         test.then(function() {
//           console.log('Written. Returning 200 success.');
//           response.status(200).send("Success! Application is created");
//           return;
//         }).catch(function(err) { 
//           console.log('returning 400 ' + err);
//           response.status(400).send('Returning error ' + err);
//           return;
//         });
//       } else {
//         console.log('Returning 400', errorMessage);
//         response.status(400).send(errorMessage);
//       }
//       break;
//     }
//     default:
//       response.status(403).send({error: 'Forbidden!'});
//       break;
//   }

// });

'use strict';

var fs = require('fs');
// var data = require ( './cognito-user-list-201904261342.json' );
const AWS = require ( 'aws-sdk' );

var counter = 1;
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ region: 'eu-west-1',});
var params = {
    UserPoolId: '', /* required */
    AttributesToGet: [
      'email',
      /* more items */
    ],
    Limit: '0',
    //PaginationToken: 'pages60' 
  };

const listThemAll = async (params) => {
  return new Promise((resolve,reject) => {
    cognitoidentityserviceprovider.listUsers(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            reject (err);
        } else {
            fs.writeFile(`result_${counter}.json`, JSON.stringify(data, null, 2), (err)=>{
                console.log ( data.PaginationToken );
                if(data.hasOwnProperty('PaginationToken')) {
                    resolve (data.PaginationToken);
                } else {
                    resolve(null);
                }
            });
        }
      });
  });
};

async function getAll() {
    let pagination_token = null;
    do {
        let _params = Object.assign({}, params, {PaginationToken: pagination_token});
        pagination_token = await listThemAll(_params);
    } while( pagination_token !== null );
}
getAll();

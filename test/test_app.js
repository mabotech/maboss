var request = require('request');

//request.post(  'http://127.0.0.1:3003/v2/si/002'   , {form:{key:'value'} })

var start = new Date()

var url_dataset = 'http://127.0.0.1:6226/dataset'

request.post(url_dataset, function(err, httpResponse, body) {

    ms = new Date() - start;
    console.log(url_dataset);
    console.log(ms);

    if (err) {
        return console.error('failed:', err);
    }
    console.log('debug:', body);
}).form({});

var url_dbfunc = 'http://127.0.0.1:6227/dbfunc'

request.post(url_dbfunc, function(err, httpResponse, body) {

    ms = new Date() - start;
    console.log(url_dbfunc);
    console.log(ms);

    if (err) {
        return console.error('failed:', err);
    }
    console.log('debug:', body);
}).form({
    key: 'value',
    attr: {
        'name': 'tobi',
        'info': {
            "time": start.toISOString()
        }
    }
})

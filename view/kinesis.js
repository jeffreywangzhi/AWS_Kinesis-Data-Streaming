AWS.config.region = 'aws-region';
AWS.config.credentials = new AWS.Credentials({
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
});
const kinesis = new AWS.Kinesis();
const streamName = 'TestTradeStream';

var params_shardIterator = {
  ShardId: 'shardId-000000000000', /* required */
  ShardIteratorType: 'LATEST', /* required */
  StreamName: streamName
};

function getShardIterator(params) {
    return new Promise((resolve, reject) => {
        kinesis.getShardIterator(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            }
            else {
                console.log('Shard Iterator:', data.ShardIterator);
                resolve(data.ShardIterator);
            }
        });
    });
}

function getRecords(params) {
    return new Promise((resolve, reject) => {
        kinesis.getRecords(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            }
            else if (data.Records.length<=0){
                console.log("no latest data");
            }
            else {
                console.log('Raw Records:', data.Records);
                decodedRecords = new TextDecoder().decode(data.Records[0].Data);
                console.log('Decoded Records:', decodedRecords);
                resolve(decodedRecords);
            }
        });
    });
}

getShardIterator(params_shardIterator)
.then((result) => {
    var params_records = {
        ShardIterator: result, /* required */
        Limit: 3
    };
    getRecords(params_records)
})
.catch((err) => {
    console.error('Error:', err);
});
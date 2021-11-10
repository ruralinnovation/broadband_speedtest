if (window.Worker) {

    // const eventProcessor = new Worker('dist/ndt7-service.js');
    //
    // eventProcessor.postMessage({
    //     "action": "Test network speed",
    //     "payload": {
    //         "userAcceptedDataPolicy": true,
    //         "downloadworkerfile": "https://speedtest-assets.s3.us-east-1.amazonaws.com/public/ndt7-download-worker.js",
    //         "uploadworkerfile": "https://speedtest-assets.s3.us-east-1.amazonaws.com/public/ndt7-upload-worker.min.js"
    //     }
    // });
    //
    //
    // eventProcessor.onmessage = function(event) {
    //     console.log(event);
    // };

    const downloadWorkerBlob = new Blob([
        document.querySelector('#download-worker').textContent,
    ], {type: 'text/javascript'});

    const uploadWorkerBlob = new Blob([
        document.querySelector('#upload-worker').textContent,
    ], {type: 'text/javascript'});

    window.runSpeedTest = function (args) {

        console.log(args[0]);

        const button_input = args[0].target;
        const button_parent = button_input.parentElement;
        const button_spinner = document.getElementById('CDB-LoaderIcon-spinner');

        button_input.style.display = 'none';
        button_spinner.style.display = 'inline-block';

        const endTestCallback = function (success) {
            if (!!success) {
                button_spinner.style.display = 'none';
                button_input.style.display = 'inline-block';
                button_input.value = "Run Speed Test Again";
            }
        }

        ndt7.test(
            {
                userAcceptedDataPolicy: true,
                downloadworkerfile: window.URL.createObjectURL(downloadWorkerBlob),
                uploadworkerfile: window.URL.createObjectURL(uploadWorkerBlob),
            },
            {
                serverChosen: function (server) {
                    console.log('Testing to:', {
                        machine: server.machine,
                        locations: server.location,
                    });
                    document.getElementById('server').innerHTML = 'Testing to: ' + server.machine + ' (' + server.location.city + ')';
                },
                downloadMeasurement: function (data) {
                    if (data.Source === 'client') {
                        document.getElementById('download').innerHTML = 'Download: ' + data.Data.MeanClientMbps.toFixed(2) + ' Mb/s';
                    }
                },
                downloadComplete: function (data) {
                    console.log(data);
                    // (bytes/second) * (bits/byte) / (megabits/bit) = Mbps
                    const serverBw = data.LastServerMeasurement.BBRInfo.BW * 8 / 1000000;
                    const clientGoodput = data.LastClientMeasurement.MeanClientMbps;
                    console.log(
                        `Download test is complete:
    Instantaneous server bottleneck bandwidth estimate: ${serverBw} Mbps
    Mean client goodput: ${clientGoodput} Mbps`);
                    document.getElementById('download').innerHTML = 'Download: ' + clientGoodput.toFixed(2) + ' Mb/s';
                    // Download speed
                    if (!!document.getElementById('RESULT_TextField-19')) {
                        document.getElementById('RESULT_TextField-19').value = clientGoodput.toFixed(2);
                    }
                    // UUID-download
                    if (!!document.getElementById('RESULT_TextField-17')) {
                        document.getElementById('RESULT_TextField-17').value = data.LastServerMeasurement.ConnectionInfo.UUID;
                    }
                },
                uploadMeasurement: function (data) {
                    if (data.Source === 'server') {
                        document.getElementById('upload').innerHTML = 'Upload: ' + (data.Data.TCPInfo.BytesReceived /
                            data.Data.TCPInfo.ElapsedTime * 8).toFixed(2) + ' Mb/s';
                    }
                },
                uploadComplete: function (data) {
                    // TODO: used actual upload duration for rate calculation.
                    // bytes * (bits/byte() * (megabits/bit) * (1/seconds) = Mbps
                    const serverBw =
                        data.LastServerMeasurement.TCPInfo.BytesReceived * 8 / 1000000 / 10;
                    const clientGoodput = data.LastClientMeasurement.MeanClientMbps;
                    console.log(
                        `Upload test is complete:
    Mean server throughput: ${serverBw} Mbps
    Mean client goodput: ${clientGoodput} Mbps`);
                    document.getElementById('upload').innerHTML = 'Upload: ' + clientGoodput.toFixed(2) + ' Mb/s';
                    // Upload speed
                    if (!!document.getElementById('RESULT_TextField-20')) {
                        document.getElementById('RESULT_TextField-20').value = clientGoodput.toFixed(2);
                    }
                    // UUID-upload
                    if (!!document.getElementById('RESULT_TextField-18')) {
                        document.getElementById('RESULT_TextField-18').value = data.LastServerMeasurement.ConnectionInfo.UUID;
                    }
                    endTestCallback(true);
                },
                error: function (err) {
                    console.log('Error while running the test:', err.message);
                },
            },
        ).then((exitcode) => {
            console.log('ndt7 test completed with exit code:', exitcode);
        });
    };

} else {
    window.runSpeedTest = function () {
        console.log('Your browser doesn\'t support web workers.');
        window.alert('Your browser doesn\'t support web workers, so no event data can be loaded.');
    }
}

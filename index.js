/*
<br /></br /><br />
<span class="question top_question">Broadband Internet Speed Test&nbsp;<b class="icon_required" style="color:#FF0000">*</b></span>

<div id="server" style="visibility: hidden;"></div>
<div id="download" style="visibility: hidden;"></div>
<div id="upload" style="visibility: hidden;"></div>
<br />

<style type="text/css">
@keyframes dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0
    }

    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35
    }

    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124
    }
}

@keyframes rotate {
    100% {
        transform: rotate(360deg)
    }
}
</style>

<div class="outside_container">
  <div class="buttons_reverse">
    <input id="test" type="button" name="test" value="Run Speed Test" class="submit_button" onclick="runSpeedTest(arguments);">
    <svg id="CDB-LoaderIcon-spinner" viewBox="0 0 50 50" style="display:none; height: 40px; width: 40px; animation: rotate 1s linear infinite;">
        <circle class="CDB-LoaderIcon-path" cx="25" cy="25" r="20" fill="none" style="stroke: #3c8dbc; stroke-linecap: round; animation: dash 3s ease-in-out infinite; stroke-width: 4px"></circle>
    </svg>
  </div>
</div>
<br /></br /><br />

<script src="https://speedtest-assets.s3.us-east-1.amazonaws.com/public/ndt7.min.js" type="text/javascript"></script>

<script id="download-worker" type="javascript/worker">
  "undefined"==typeof WebSocket&&(global.WebSocket=require("isomorphic-ws"));const workerMain=function(e){"use strict";const n=e.data["///ndt/v7/download"],o=new WebSocket(n,"net.measurementlab.ndt.v7");let t=()=>(new Date).getTime();"undefined"!=typeof performance&&void 0!==performance.now&&(t=()=>performance.now()),downloadTest(o,postMessage,t)},downloadTest=function(e,n,o){e.onclose=function(){n({MsgType:"complete"})},e.onerror=function(e){n({MsgType:"error",Error:e})};let t=o(),s=t,a=0;e.onopen=function(){t=o(),s=t,a=0,n({MsgType:"start",Data:{ClientStartTime:t}})},e.onmessage=function(e){a+=void 0!==e.data.size?e.data.size:e.data.length;const r=o();r-s>250&&(n({MsgType:"measurement",ClientData:{ElapsedTime:(r-t)/1e3,NumBytes:a,MeanClientMbps:a/(r-t)*.008},Source:"client"}),s=r),"string"==typeof e.data&&n({MsgType:"measurement",ServerMessage:e.data,Source:"server"})}};"undefined"!=typeof self?self.onmessage=workerMain:void 0!==this?this.onmessage=workerMain:"undefined"!=typeof onmessage&&(onmessage=workerMain);
</script>

<script id="upload-worker" type="javascript/worker">
  "undefined"==typeof WebSocket&&(global.WebSocket=require("isomorphic-ws"));const workerMain=function(e){const n=e.data["///ndt/v7/upload"],t=new WebSocket(n,"net.measurementlab.ndt.v7");let o=()=>(new Date).getTime();"undefined"!=typeof performance&&void 0!==performance.now&&(o=()=>performance.now()),uploadTest(t,postMessage,o)},uploadTest=function(e,n,t){let o=!1;function r(s,a,i,u,f){if(o)return;const c=t();if(c>=i)return void e.close();const d=s.length>=8388608?1/0:16*s.length;f-e.bufferedAmount>=d&&(s=new Uint8Array(2*s.length));const m=7*s.length;if(e.bufferedAmount<m&&(e.send(s),f+=s.length),c>=u+250){const t=f-e.bufferedAmount,o=(c-a)/1e3;n({MsgType:"measurement",ClientData:{ElapsedTime:o,NumBytes:t,MeanClientMbps:8*t/1e6/o},Source:"client",Test:"upload"}),u=c}setTimeout((()=>r(s,a,i,u,f)),0)}e.onclose=function(){o||(o=!0,n({MsgType:"complete"}))},e.onerror=function(e){n({MsgType:"error",Error:e})},e.onmessage=function(e){void 0!==e.data&&n({MsgType:"measurement",Source:"server",ServerMessage:e.data})},e.onopen=function(){const e=new Uint8Array(8192),o=t(),s=o+1e4;n({MsgType:"start",Data:{StartTime:o/1e3,ExpectedEndTime:s/1e3}}),r(e,o,s,o,0)}};"undefined"!=typeof self?self.onmessage=workerMain:void 0!==this?this.onmessage=workerMain:"undefined"!=typeof onmessage&&(onmessage=workerMain);
</script>

 */


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

    document.getElementById("FSForm").onsubmit = function () {
        var downloadField = document.getElementById('RESULT_TextField-10');
        downloadField.disabled = false;
        console.log(downloadField.value, downloadField.disabled);
        var uploadField = document.getElementById('RESULT_TextField-11');
        uploadField.disabled = false;
        console.log(uploadField.value, uploadField.disabled);
    };

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
                    if (!!document.getElementById('RESULT_TextField-10')) {
                        document.getElementById('RESULT_TextField-10').value = clientGoodput.toFixed(2);
                        document.getElementById('RESULT_TextField-10').disabled = true;
                    }
                    // UUID-download
                    if (!!document.getElementById('RESULT_TextField-8')) {
                        document.getElementById('RESULT_TextField-8').value = data.LastServerMeasurement.ConnectionInfo.UUID;
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
                    if (!!document.getElementById('RESULT_TextField-11')) {
                        document.getElementById('RESULT_TextField-11').value = clientGoodput.toFixed(2);
                        document.getElementById('RESULT_TextField-11').disabled = true;
                    }
                    // UUID-upload
                    if (!!document.getElementById('RESULT_TextField-9')) {
                        document.getElementById('RESULT_TextField-9').value = data.LastServerMeasurement.ConnectionInfo.UUID;
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

const RtspServer = require('node-rtsp-stream');
(async () => {
  const sourceMapSupport = await import('source-map-support');
  sourceMapSupport.default.install();
})();
const options = {  name: 'playback-stream',
  url: 'rtsp://admin:mudunuru123@192.168.1.230/Streaming/tracks/101/?starttime=20230503T082815Z&amp;endtime=20230503T104500Z&amp;name=00000000278000000&amp;size=1063084000',  port: 80,
  width: 640,  height: 480,
};
RtspServer.createServer(options)
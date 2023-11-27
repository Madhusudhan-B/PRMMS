<template> 
  <div> 
    <button @click="openRTSPStream">Open RTSP Stream</button> 
  </div> 
</template> 
 
<script> 
export default { 
  methods: { 
    openRTSPStream() { 
      const rtspUrl = 'rtsp://your-rtsp-stream-url'; 
      const vlcExtensionUrl = vlc;//${rtspUrl}; 
       
      window.open(vlcExtensionUrl); 
    } 
  } 
}; 
</script>

<script setup>
// import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import imagemap from '@images/pages/map.jpg'





const mouseOver =()=>{
  markerScale.props.from = 1;
  markerScale.props.to = markerGrowSize;
  imageScale.props.playDirection = 1;
  iconScale.props.playDirection = 1;
  hoverTimeline.props.playDirection = 1;
  textToggle.props.playDirection = 1; 
  markerScale.start();
  hoverTimeline.start();  
 }

// marker.addEventListener('mouseleave', () => {
//   markerScale.props.from = markerGrowSize;
//   markerScale.props.to = 1;
//   hoverTimeline.reverse();
//   hoverTimeline.start();
//   markerScale.start();
// });

</script>


<template>
  <VCard style="block-size: 50% !important;">
    
    <img :src="imagemap" style="height:100% !important"/>
   
</VCard>

<a class="snapchat" style="margin: 5px 5px 0 -2px;" ><span class="dot"></span><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBzpuB2SoUO2rGRPKqQ6eXD_nCcWLBtbMbuGcQEbs1OwcojgFA-4wqZZk82KUXLuqZPhc&usqp=CAU/"></a>

  
</template>

<style>
/* .e-marker {
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  transform-origin: bottom center;
  position: absolute;
    left: 40%;
    top: 42%;
}
.e-marker__image {
  transform: scale(0);
  transform-origin: 50% 50%;
}
.e-marker__circle {
  fill: rgba(255, 255, 255, 0.9);
}
.e-marker__box {
  display: none;
}
.e-marker__text {
  font-size: 12px;
  font-family: brandon-grotesque, sans-serif;
  text-align: center;
  opacity: 0;
  transform-origin: 50% 50%;
} */

/* Styling to make the demo look purrrty! */
.dot {
  position:absolute;
  height: 25px;
  width: 25px;
  background-color: #000;
  border-radius: 50%;
  display: inline-block;
  top: 200px;
  left: 350px;
}
a.snapchat {
  position: relative;
  /* background: lightgrey; */
}

a.snapchat img {
  /* position: absolute; */
  opacity: 0;
  width: 100px;
  height: 100px;
  left: 0;
  top: -20px;
  transition: opacity .5s, top .5s;
}

a.snapchat:hover img {
  opacity: 1;
  top: 20px;
}
  </style>





<script setup>
// import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import imagemap from '@images/pages/map.jpg'

</script>
<template>
  <div class="image-container">
    <img src="@images/pages/port-5.jpg" alt="Image" style="width:100% !important">
    <div
      v-for="point in points"
      :key="point.id"
      class="pointer"
      :style="{ top: point.y + 'px', left: point.x + 'px' }"
      @mouseover="showPopup(point)"
      @mouseleave="hideTooltip"
    >
      <span class="tooltip" v-show="activePointId === point.id">Location : {{ point.location }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      points: [
        { id: 1, x: 100, y: 200, text: 'FOB-1' },
        { id: 2, x: 300, y: 400, text: 'WS1-1' },
        { id: 3, x: 500, y: 600, text: 'WS1-2' },
      ],
      activePointId: null,
    }
  },
  methods: {
    showTooltip(point) {
      this.activePointId = point.id
    },
    hideTooltip() {
      this.activePointId = null
    },
    showPopup(point) {
      this.activePointId = point.id
      const x = point.x
      const y = point.Y
      const pointer = this.pointers.find(p => Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 10)
      if (pointer) {
        this.popupVisible = true
        this.popupText = pointer.text
        this.popupTop = y + 10
        this.popupLeft = x + 10
      } else {
        this.popupVisible = false
      }
    }
  },
}
</script>

<style>
.image-container {
  /* position: relative; */
}
.pointer {
  position: absolute;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 50%;
  background-color: green;
  cursor: pointer;
}
.tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}
.pointer:hover .tooltip {
  opacity: 1;
}
</style>

<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="headline">
        Preview Data
      </v-card-title>
      <v-card-text>
        <!-- Display the preview data here -->
        <pre>{{ JSON.stringify(previewData, null, 2) }}</pre>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    previewData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    show() {
      this.dialog = true;
    }
  }
};
</script>
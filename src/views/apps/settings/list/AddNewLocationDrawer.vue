<script setup>
    import { PerfectScrollbar } from "vue3-perfect-scrollbar";
    import axios from "axios";
    import {
    
    requiredValidator,
    } from '@validators'

    import { location } from "@/helpers/helper";
    import { URL, token } from "@/helpers/token";
    const props = defineProps({
        isDrawerOpen: {
            type: Boolean,
            required: true,
        },
    });

    const emit = defineEmits(["update:isDrawerOpen", "userData"]);

    const isFormValid = ref(false);
    const refForm = ref();
    const location_description = ref("");
    const location_short_code = ref("");
    const is_active = ref(true);

    // ?? drawer close
    const closeNavigationDrawer = () => {
        emit("update:isDrawerOpen", false);
        nextTick(() => {
            refForm.value?.reset();
            refForm.value?.resetValidation();
        });
    };

    const onSubmit = () => {
        refForm.value?.validate().then(({ valid }) => {
            if (valid) {
                axios
                    .post(
                        URL() + "/location",
                        {
                            requestType: "create",
                            location_data: {
                                location_description: location_description.value,
                                location_short_code: location_short_code.value,
                                is_active: true,
                            },
                        },
                        { headers: { Authorization: token() } }
                    )
                    .then((response) => {
                        console.log(response.data.data);
                        let data = response.data.data;

                        emit("locationData", {
                            status: "success",
                            data: {
                                id: 0,
                                location_description: location_description.value,
                                location_short_code: location_short_code.value,
                                is_active: is_active.value,
                            },
                            message: "Location Successfully Created",
                        });
                    })
                    .catch((error) => {
                        console.log(error);

                        emit("locationData", {
                            status: "failed",
                            data: {
                                id: 0,
                                location_description: location_description.value,
                                location_short_code: location_short_code.value,
                                is_active: is_active.value,
                            },
                            message: error,
                        });
                    });

                emit("update:isDrawerOpen", false);
                nextTick(() => {
                    refForm.value?.reset();
                    refForm.value?.resetValidation();
                });
            }
        });
    };

    const handleDrawerModelValueUpdate = (val) => {
        emit("update:isDrawerOpen", val);
    }

    
const status=[
  {
    title:'Active',
    value:true,
  },
  {
    title:'Inactive',
    value:false,
  }
]
</script>

<template>
    <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen" @update:model-value="handleDrawerModelValueUpdate">
        <!-- ?? Title -->
        <div class="d-flex align-center pa-6 pb-1">
            
            <h3 class="title-header"> {{$t('Location - Create')}}</h3>

            <VSpacer />

            <!-- ?? Close btn -->
            <VBtn variant="tonal" color="default" icon size="32" class="rounded" @click="closeNavigationDrawer">
                <VIcon size="18" icon="tabler-x" />
            </VBtn>
        </div>

        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCard flat>
                <VCardText>
                    <!-- ?? Form -->
                    <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                        <VRow>
                            <!-- ?? Full name -->
                            <VCol cols="12">
                                <VTextField v-model="location_description" :rules="[requiredValidator]" label="Location Name" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="location_short_code" :rules="[requiredValidator]" label="Short Code" />
                            </VCol>

                            <!--VCol cols="12">
                                <VSelect v-model="is_active" label="Select status" :rules="[requiredValidator]" :items="status" />
                            </VCol-->

                            <!-- ?? Submit and Cancel -->
                            <VCol cols="12">
                                <VBtn type="submit" class="me-3">
                                    Create
                                </VBtn>
                                <VBtn type="reset" variant="tonal" color="secondary" @click="closeNavigationDrawer">
                                    Cancel
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </PerfectScrollbar>
    </VNavigationDrawer>
</template>

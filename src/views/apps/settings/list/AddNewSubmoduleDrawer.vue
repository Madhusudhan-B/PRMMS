<script setup>
    import { PerfectScrollbar } from "vue3-perfect-scrollbar";
    import axios from "axios";
    import {
    
    requiredValidator,
    } from '@validators'
    import { location, moduleslist } from "@/helpers/helper";
    import { URL, token } from "@/helpers/token";
    const props = defineProps({
        isDrawerOpen: {
            type: Boolean,
            required: true,
        },
    });

    const emit = defineEmits(["update:isDrawerOpen", "submoduleData"]);

    const isFormValid = ref(false);
    const refForm = ref();
    const sub_module_name = ref("");
    const short_code = ref("");
    const display_priority = ref(1);
    const is_active = ref(true);
    const access_config = ref("");
    const module = ref();
    const modiuleList = moduleslist();

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
              const newArr = access_config.value.filter((a) => a)
                axios
                    .post(
                        URL() + "/sub_module",
                        {
                            requestType: "create",
                            sub_module_data: {
                                sub_module_name: sub_module_name.value,
                                short_code: short_code.value,
                                display_priority: parseInt(display_priority.value),
                                is_active: is_active.value,
                                access_config: newArr.toString(),
                                module: module.value,
                            },
                        },
                        { headers: { Authorization: token() } }
                    )
                    .then((response) => {
                        emit("submoduleData", {
                            status: "success",
                            data: {
                                id: 0,
                                sub_module_name: sub_module_name.value,
                                short_code: short_code.value,
                                display_priority: display_priority.value,
                                is_active: is_active.value,
                                access_config: access_config.value,
                                module: module.value,
                            },
                            message: "Sub Module Successfully Created",
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        emit("submoduleData", {
                            status: "failed",
                            data: {
                                id: 0,
                                sub_module_name: sub_module_name.value,
                                short_code: short_code.value,
                                display_priority: display_priority.value,
                                is_active: is_active.value,
                                access_config: access_config.value,
                                module: module.value,
                            },
                            message: error,
                        });
                        console.log(error);
                    });
                // emit("submoduleData", {
                //     id: 0,
                // });

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
    };

    const items = ["Add", "View", "Edit", "Delete"];

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
        <h3 class="title-header">{{$t('Sub Module - Create')}}</h3>
           

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
                            <VCol cols="12">
                                <VSelect v-model="module" label=" Module List" :rules="[requiredValidator]" :items="modiuleList" />
                            </VCol>

                            <!-- ?? Full name -->
                            <VCol cols="12">
                                <VTextField v-model="sub_module_name" :rules="[requiredValidator]" label="Sub Module Name" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="short_code" :rules="[requiredValidator]" label="Short Code" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="display_priority" :rules="[requiredValidator]" label="Display Priority" />
                            </VCol>
                            <VCol cols="12">
                                <VSelect v-model="is_active" label="Select One" :rules="[requiredValidator]" :items="status" />
                            </VCol>
                            <VCol cols="12">
                                <VSelect v-model="access_config" label="Select Access Config" :rules="[requiredValidator]" :items="items" multiple />
                                <!-- <VMultiple
                  v-model="selected"
                  :items="items"
                  label="Select"
                  multiple
                /> -->
                            </VCol>

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

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

    const emit = defineEmits(["update:isDrawerOpen", "leaveData"]);

    const isFormValid = ref(false);
    const refForm = ref();
    const leave_type_name = ref("");
    const description = ref("");
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
                        URL() + "/leave_type",
                        {
                            Authorization: token(),

                            requestType: "create",
                            leave_type_data: {
                                leave_type_name: leave_type_name.value,
                                description: description.value,
                                is_active: is_active.value,
                            },
                        },
                        { headers: { Authorization: token() } }
                    )
                    .then((response) => {
                        emit("leaveData", {
                            status: "success",
                            data: {
                                id: 0,
                                leave_type_name: leave_type_name.value,
                                description: description.value,
                                is_active: is_active.value,
                            },
                            message: "Leave Type Successfully Created",
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        emit("leaveData", {
                            status: "failed",
                            data: {
                                id: 0,
                                leave_type_name: leave_type_name.value,
                                description: description.value,
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
    };

    const status = [
        {
            title: "Active",
            value: true,
        },
        {
            title: "Inactive",
            value: false,
        },
    ];
</script>

<template>
    <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen" @update:model-value="handleDrawerModelValueUpdate">
        <!-- ?? Title -->
        <div class="d-flex align-center pa-6 pb-1">
           
            <h3 class="title-header">{{$t('Leave - Create')}}</h3>

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
                                <VTextField v-model="leave_type_name" id="leave_type_name" :rules="[requiredValidator]" label="Leave Type" />
                                <!-- :items="['Casual Leave', 'Sick Leave', 'Earned Leave']" -->
                            </VCol>
                            <VCol cols="12">
                                <VTextField v-model="description" id="description" :rules="[requiredValidator]" label="Description" />
                            </VCol>

                            <VCol cols="12">
                                <VSelect v-model="is_active" id="is_active" label="Select One" :rules="[requiredValidator]" :items="status" />
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

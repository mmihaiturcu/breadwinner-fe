<template>
    <div
        class="input-container flex-centered"
        :class="{ 'image-available': field.previewURL }"
        :style="{
            backgroundImage:
                field.previewURL && field.value ? `url(${field.previewURL})` : undefined,
        }"
    >
        <input
            class="hidden-file-input"
            type="file"
            :accept="acceptedTypesString"
            @input="$emit('update:modelValue', ($event?.target as HTMLInputElement).files)"
            v-bind="field.customProps"
        />
        <h3 class="so-title flex-centered">
            {{ field.label }}
        </h3>
        <p class="flex-centered">
            {{ field.description || '' }}
        </p>
        <div class="upload-icon-container flex-centered">
            <div class="icon-container interactive">
                <img v-svg-inline src="@/assets/icons/upload-file.svg" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { InputFieldFile } from '@/types';
import { defineComponent, PropType } from '@vue/runtime-core';

export default defineComponent({
    name: 'InputFile',
    props: {
        field: {
            type: Object as PropType<InputFieldFile>,
            required: true,
        },
    },
    computed: {
        acceptedTypesString: function() {
            return Object.keys(this.field.acceptedMIMETypes).join(', ');
        },
    },
});
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/form.scss';

.input-container {
    padding: 10px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
    border-top: 3px solid $main-color;
    flex-direction: column;
    position: relative;
    border: 3px dashed $main-color;
    cursor: pointer;
    background-size: cover;

    &:hover svg {
        fill: $main-color;
    }

    .hidden-file-input {
        position: absolute;
        opacity: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .so-title {
        position: relative;
    }

    p {
        position: relative;
        color: $main-color;
    }

    .upload-icon-container {
        position: relative;
    }

    &.image-available {
        &::before {
            content: '';
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            transition: background-color $transition;
        }

        .so-title,
        p,
        .upload-icon-container {
            opacity: 0;
            transition: opacity $transition;
        }
    }

    &.image-available:hover {
        &::before {
            content: '';
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            background-color: rgba(255, 255, 255, 0.5);
        }

        .so-title,
        p,
        .upload-icon-container {
            opacity: 1;
        }
    }
}
</style>

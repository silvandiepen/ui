<template>
	<Popup />
	<Toast />
</template>

<script setup lang="ts">
import { provide } from 'vue';
import Popup from './Popup/Popup.vue';
import { popupService } from './Popup/Popup.service';
import Toast from './Toast/Toast.vue';
import { toastService } from './Toast/Toast.service';

defineOptions({
	name: 'SilFeedback',
});

provide('popupService', popupService);
provide('toastService', toastService);
</script>

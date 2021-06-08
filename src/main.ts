import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    ElButton,
    ElSelect,
    ElOption,
    ElForm,
    ElFormItem,
    ElSlider,
    ElInput,
    ElPopover,
    ElCard,
    ElTag,
    ElEmpty,
    ElLoading,
    ElIcon,
} from 'element-plus'
import { faDirections, faMapMarkedAlt, faFileDownload, faPrint } from '@fortawesome/free-solid-svg-icons'
import { faPauseCircle, faPlayCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
library.add(faDirections, faMapMarkedAlt, faFileDownload, faPrint, faPauseCircle, faPlayCircle, faTimesCircle)

const app = createApp(App)
app.component(ElButton.name, ElButton)
    .component(ElSelect.name, ElSelect)
    .component(ElOption.name, ElOption)
    .component(ElInput.name, ElInput)
    .component(ElForm.name, ElForm)
    .component(ElFormItem.name, ElFormItem)
    .component(ElSlider.name, ElSlider)
    .component(ElPopover.name, ElPopover)
    .component(ElCard.name, ElCard)
    .component(ElTag.name, ElTag)
    .component(ElEmpty.name, ElEmpty)
    .component(ElIcon.name, ElIcon)
app.use(ElLoading)
app.component('FaIcon', FontAwesomeIcon)
app.mount('#app')

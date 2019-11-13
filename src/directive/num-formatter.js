import Vue from 'vue'

export default Vue.directive('numformatter', {
    bind: function (el, binding) {
        console.log('ere');
    },
    inserted: function (el) {
        // el.querySelector('input').blur(console.log('etset'))
    },
    update: function (el, binding, vnode, oldVnode) {
        console.log('vnode', vnode)
        let express = vnode.data.directives[1].expression
        if (!Number(binding.value) && binding.value !== '0' && binding.value !== '0.' && binding.value !== 0 && binding.value !== '') {
            // binding.value = binding.oldValue
            setValueWithExpressionVue(vnode.context.$data, express, binding.oldValue);
        } else {
            let value = String(vnode.data.directives[1].value);
            if (typeof value === 'string') { } //在重置的时候清空
            if (value.split('.').length - 1 > 1) {
                value = value.replace(/\.{2,}/g, '') // 只保留第一个. 清除多余的
                value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
            }
            let repeatValue = value.replace(/[^\d.]/g, '')
            // setTimeout(() => {
            //  el.querySelector('input').value = repeatValue
            // }, 5)
            if (repeatValue.split('.').length === 2 && repeatValue.split('.')[1].length > 2) {
                repeatValue = repeatValue.split('.')[0] + '.' + repeatValue.split('.')[1].slice(0, 2)
            }
            setValueWithExpressionVue(vnode.context.$data, express, repeatValue)
        }
    },
    componentUpdated: function () { },
    unbind: function (el) { }
})

//
function setValueWithExpressionVue(currObj, expression, value) {
    expression = expression.split('.')
    expression.forEach(function (arg, i) {
        if (i < expression.length - 1) {
            currObj = currObj[arg]
        } else {
            currObj[arg] = value
        }
    })
}

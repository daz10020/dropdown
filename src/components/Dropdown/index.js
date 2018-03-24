import Vue from 'vue'
import DropdownComponent from './index.vue'

const merge = ($data, option) => {
    for ( let prop in option) {
        if ($data.hasOwnProperty(prop)) {
            $data[prop] = option[[prop]]
        }
    }
};

//extend 是构造一个组件的语法器.传入参数，返回一个组件
let DropdownConstructor = Vue.extend(DropdownComponent);

const Dropdown = (target='body',option={},...arg) => {
    let initComponent = new DropdownConstructor();

    if (typeof option !== 'object') {
        initComponent[option](...arg);
    }else{
        merge(initComponent.$data, option)
    }
    initComponent.$mount();

    document.querySelector(target).appendChild(initComponent.$el);

    // return new Promise( (resolve, reject) => {
    //     initComponent.success = () => {
    //         resolve()
    //     }
    // })
}

export default Vue => {
    Vue.prototype.$dropdown = Dropdown;
}
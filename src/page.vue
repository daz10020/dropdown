<template>
  <div id="page">
    <div class="dropdown-wrap">
      <div class="dropdown">
        <Dropdown :readOnly="readonly"/>
      </div>
      <label for="isre">
        <input type="checkbox" v-model="readonly" id="isre"/>只读
      </label>
    </div>
    <div class="dropdown-wrap">
      <div class="dropdown">
        <Dropdown :multiple="multiple"/>
      </div>
      <label for="ismul">
        <input type="checkbox" v-model="multiple" id="ismul"/>多选
      </label>
    </div>
    <div class="dropdown-wrap">
      <div class="dropdown">
        <Dropdown v-bind="stlObj"/>
      </div>
      <div>
        <label for="">宽度 ：<input type="text" v-model="stlObj.textWidth"/></label>
        <label for="">高度 ：<input type="text" v-model="stlObj.textHeight"/></label>
        <label for="">面板宽度 ：<input type="text" v-model="stlObj.panelWidth"/></label>
        <label for="">面板高度 ：<input type="text" v-model="stlObj.panelHeight"/></label>
      </div>
      <div>
        <label for="">面板最大高度 ：<input type="text" v-model="stlObj.panelMaxHeight"/></label>
        <label for="">选项行高度 ：<input type="text" v-model="stlObj.itemHeight"/></label>
        <label for="">填充 ：<input type="text" v-model="stlObj.placeholder"/></label>
      </div>
    </div>
    <div class="dropdown-wrap">
      <div class="dropdown">
        <Dropdown v-bind="listOpt"/>
      </div>
      <div>
        <label for="">value字段名 ：<input type="text" v-model="listOpt.idField"/></label>
        <label for="">value ：<input type="text" v-model="nObj.value"/></label>
        <label for="">title ：<input type="text" v-model="nObj.label"/></label>
      </div>
      <div class="label">
        <label for="">显示文本字段名 ：<input type="text" v-model="listOpt.textField"/></label>
        <label for="">显示文本 ：<input type="text" v-model="nObj.text"/></label>
        <label for=""><a href="javascript:;" @click="add">同组添加</a></label>
        <label for=""><a href="javascript:;" @click="add(1,1)">异组添加</a></label>
      </div>
    </div>
    <div :style="{height:scroll ? '1500px' : 0}"></div>
    <div class="dropdown-wrap bottom" :style="{bottom: bottom}">
      <div class="dropdown">
        <Dropdown/>
      </div>
      <div>
        <label for="">
          居底部高度 ：<input type="text" v-model="bottom"/>
        </label>
        <label for="scroll">
          滚动条 ：<input type="checkbox" v-model="scroll" id="scroll"/>
        </label>
      </div>
      <div class="label">
        注：根据选项长度调节自制滚动条位置，以及绑定拖动，滚动事件；<br>
        根据输入框位置，判断菜单显示位置并进行位置跟随
      </div>
    </div>
  </div>
</template>

<script>
//import Vue from 'vue'
import  Dropdown from './components/Dropdown/index.vue'

export default {
  name: 'Page',
  components: { Dropdown },
  data () {
    return {
      readonly : true,
      multiple : false,
      stlObj : {
        textWidth :'240px',
        textHeight : '70px',
        panelWidth : '280px',
        panelHeight : 'auto',
        panelMaxHeight : '240px',
        itemHeight : '30px',
        placeholder : 'placeholder'
      },
      listOpt : {
        idField : 'id',
        textField : 'text',
        data : [],
      },
      nObj : {
        value : 0,
        text : 'txt-0',
        label : 'title'
      },
      bottom : '80px',
      scroll : true,
    }
  },
  methods : {
    add (e,flg) {
      let nObj = {};
      nObj[this.listOpt.idField] = this.nObj.value;
      nObj[this.listOpt.textField] = this.nObj.text;
      let l = this.listOpt.data.length;
      if (flg || (!flg && !l)) {
        this.listOpt.data.push({
          label:this.nObj.label,
          list:[nObj]
        });
      } else {
        this.listOpt.data[l - 1].list.push(nObj);
      }
      this.nObj.value ++;
      this.nObj.text = this.nObj.text.substr(0,3) + this.nObj.value;
    },
  },
  mounted () {
    //Vue.prototype.$dropdown('#dropdown_readonly',{
    //  readOnly:true,
    //});
  }
}
</script>

<style>
  .dropdown-wrap {
    overflow: hidden;
    margin: 10px;
  }
  .dropdown {
    float: left;
    height: 100%;
  }
  .bottom {
    position: fixed;
    left: 18px;
  }
  .label {
    margin-left: 240px;
  }
  label {
    padding: 0 10px;
    line-height: 40px;
    font-size: 1.25em;
  }
  input[type=text] {
    width: 50px;
  }
</style>

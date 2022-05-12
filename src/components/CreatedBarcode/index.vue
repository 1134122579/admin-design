<template>
  <div>
         <img class="img" v-if="value" :id="'barcode'+value"></img>
  </div>
</template>

<script>
import JsBarcode from "jsbarcode";
export default {
  props: ["propsvalue"],
  data() {
    return {
      value:this.propsvalue
    };
  },
  mounted() {
    this.createdBarcode();
  },
  methods: {
    // 生成条码
    createdBarcode() {
      JsBarcode(`#barcode${this.value}`, this.value, {
        format: "code39", //条形码的格式
        lineColor: "#333", //线条颜色
        width: 4, //线宽
        height: 40, //条码高度
        displayValue: true, //是否显示文字信息
        valid(data){
          console.log('createdBarcode',data)
        }
      });
    }
  }
};
</script>

<style lang="scss">
.img {
  width: 120px;
  height: 40px;
}
</style>

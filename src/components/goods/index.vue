<template>
  <div id="DataComparison">
    <div id="header">
      <h2>电信物联网卡清单对比</h2>
    </div>
    <hr />

    <div id="body">
      <div id="FileSubmmit">
        <!-- action="http://127.0.0.1:8080/api/data_comparison" method="post" enctype="multipart/form-data" -->
        <form id="form">
          <p><input type="file" name="NL_excel" /> 纳龙清单excel文件</p>
          <p><input type="submit" value="提交" /></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
let form = document.querySelector('#form')
// 将html表单转换为formData表单对象
var formData = new FormData(form)
this.axios
  .post('http://127.0.0.1:8080/api/data_comparison', formData)
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
</script>

<style scoped>
h2 {
  text-align: center;
}
#FileSubmmit {
  text-align: center;
}
</style>

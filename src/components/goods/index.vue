<template>
  <div id="DataComparison">
    <div id="header">
      <h2>电信物联网卡清单对比</h2>
    </div>
    <hr />

    <div id="body">
      <div id="FileSubmmit">
        <form
          id="excelForm"
          action="api/data_comparison"
          method="post"
          enctype="multipart/form-data"
          onsubmit="return func1()"
        >
          <p><input type="file" name="NL_excel" /> 纳龙清单excel文件</p>
          <p><input type="submit" value="提交" /></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    func1() {
      let formData = new FormData()
      this.$axios
        .post(
          'https://it-security-test.aecg.com.cn/api/data_comparison',
          formData
        )
        .then(function (res) {
          console.log(res)
        })
      return false
    },
  },
}
</script>

<style scoped>
h2 {
  text-align: center;
}
#FileSubmmit {
  text-align: center;
}
</style>

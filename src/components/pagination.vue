<!--
 * @Date: 2022-03-23 15:35:29
 * @LastEditors: OBKoro1
 * @LastEditTime: 2022-03-23 16:35:29
 * @FilePath: \portal_v6.0\src\components\pagination.vue
-->
<template>
    <!-- <el-pagination
    :current-page.sync="currentPage"
    :page-size.sync="pageSize"
    :layout="layout"
    :page-sizes="pageSizes"
    :total="total"
    :pager-count="pagerCount"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  /> -->
  <el-pagination
    :layout="layout"
    :page-sizes="pageSizes"
    :total="total"
    :pager-count="pagerCount"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'pagination',
  props: {
    page: {
      type: Number, // 页码
      default: 1
    },
    size: {
      type: Number, // 每页显示数量
      default: 5
    },
    total: {
      type: Number, // 数据总条数
      require: true,
    },

    pagerCount: {
      type: Number, // 每页显示数量
      default: 7
    },
    pageSizes: {
      type: Array, // 每页显示数量
      default: () => [5, 10, 20, 30]
    },
    layout: {
      type: String, // 每页显示数量
      default: 'total, sizes, prev, pager, next, jumper',
    }
  },
  data() {
    return {
      // currentPage: '1'
    }
  },
  methods: {

    // currentPage(value) {
    //   this.$emit('update:page', this.page)
    // },

    // pageSize(value) {
    //   this.$emit('update:size', this.size)
    // },

    handleSizeChange(value) {
      // this.currentPage = 1
      this.$emit('getTableData')
    },

    handleCurrentChange(value) {
      this.$emit('getTableData')
    }
  }
}
</script>

<style>

</style>

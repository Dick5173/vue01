<template lang="pug">
  div.list-wrapper
    el-table(:data="dataList.data", :border="true", row-key="id")
      el-table-column(label="文件ID", width="")
        template(slot-scope="scope")
          div {{scope.row.id}}
      el-table-column(label="管理员", width="")
        template(slot-scope="scope")
          div {{scope.row.oper_name}}
      el-table-column(label="导出条件", width="300px")
        template(slot-scope="scope")
          div
            p(v-html="getText(scope.row)")
      el-table-column(label="操作时间", width="")
        template(slot-scope="scope")
          div {{scope.row.ct | datetime}}
      el-table-column(label="状态", width="")
        template(slot-scope="scope")
          div {{getStatus(scope.row)}}
      el-table-column(label="操作", width="")
        template(slot-scope="scope")
          div(v-if="scope.row.status === 2")
            el-button(:type="'success'", size="mini", plain, @click="download(scope.row)") 下载
</template>

<script>
import * as EXPORT_TASK from 'src/constants/export_task'
import { dateFormat } from 'src/util/format'
import { allStatus } from 'src/service/product/index'
export default {
  components: {
  },
  props: {
    dataList: {}
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  methods: {
    goToDetail (id) {
      this.$router.push({
        name: 'OrderDetail',
        params: {
          id: id
        }
      })
    },
    showImg (row) {
      if (row) {
        return row.url
      }
      return ''
    },
    getStatus (row) {
      return EXPORT_TASK.StatusMap[row.status]
    },
    download (task) {
      if (task.download_url === '') {
        this.$message({
          showClose: true,
          message: '没有下载地址',
          type: 'warning'
        })
        return
      }
      window.open(task.download_url)
    },
    setStatus (val) {
      if (val === allStatus.all.value) {
        return '上架/下架/缺货'
      } else if (val === allStatus.up.value) {
        return allStatus.up.text
      } else if (val === allStatus.down.value) {
        return allStatus.down.text
      } else if (val === allStatus.stockout.value) {
        return allStatus.stockout.text
      }
    },
    getText (row) {
      let data = ''
      let condition = JSON.parse(row.condition)
      data += '商品状态：' + this.setStatus(condition.status) + '</br>'
      if (condition.text) {
        data += '商品编码/名称：' + condition.text + '</br>'
      }
      if (condition.id) {
        data += '商品ID：' + condition.id + '</br>'
      }
      if (condition.tp) {
        data += '商品来源：' + '平台供货' + '</br>'
      }
      if (condition.category_name) {
        data += '商品分类：' + condition.category_name + '</br>'
      }
      if (condition.start) {
        const start = dateFormat(condition.start, 'YYYY-MM-DD')
        data += '上架时间：' + start + '</br>'
      }
      if (condition.supply_scope_tp) {
        data += '供货类型：定项供货' + '</br>'
      }
      return data
    },
    exportTaskStatus (status) {
      return EXPORT_TASK[status]
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  margin-top: 20px;

  .info-wrapper {
    display: flex;

    .head-wrapper {
      width: 70px;
      margin-right: 10px;
    }
    .icon-wrapper {
      width: 60px;
      height: 60px;
      background-size: cover;
      margin: 5px 10px 5px 0px;
    }

    .desc-wrapper {
      flex: 1;

      .name-wrapper {
        display: flex;

        .left {
          flex: 1;
          max-height: 28px;
          width: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
        }
        .right {
          padding-left: 5px;
        }
      }
    }
  }

  .remark {
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 5px;
    border: solid 1px #ddd;
    border-radius: 5px;
    min-height: 50px;

    .title {
      font-size: 14px;
    }

    .edit {
      position: absolute;
      right: 10px;
      bottom: 0;
    }
  }

  .pager-wrapper {
    text-align: center;
  }

  .txt-ex {
    margin-left: 10px;
  }

  .txt-blod {
    font-size: 14px;
    font-weight: bold;
  }

  .refund-color {
    color: $color-danger;
  }

  .text-code {
    color: $color-primary;
    cursor: pointer;
  }
}

.control-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .btn {
    margin-bottom: 5px;
    margin-left: auto;
    margin-right: auto;
  }
}

.bottom-tool-bar {
  margin-top: 15px;
}
</style>

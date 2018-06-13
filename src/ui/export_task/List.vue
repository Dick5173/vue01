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
import * as orderIndex from 'src/service/order/index'
import { dateFormat } from 'src/util/format'
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
      if (val === 0) {
        return '全部'
      } else if (val === 1) {
        return '上架'
      } else if (val === 2) {
        return '下架'
      } else if (val === 3) {
        return '下架'
      }
    },
    getText (row) {
      if (row.condition === '{}') {
        return '全部'
      }
      let data = ''
      let condition = JSON.parse(row.condition)
      if (this.$route.query.tp === 1) {
        if (condition.status) {
          var statusStr = ''
          var arr = condition.status.split(',')
          for (var i = 0; i < arr.length; i++) {
            statusStr += orderIndex.orderStatusMap[arr[i]]
            if (i < arr.length - 1) {
              statusStr += ','
            }
          }
          data += '订单状态：' + statusStr + '</br>'
        }
        if (condition.start) {
          data += '起始时间：' + dateFormat(condition.start_time) + '</br>'
        }
        if (condition.end) {
          //          服务器返回的时间是第二天的凌晨，为了统一，显示前一天的最后一秒钟
          data += '结束时间：' + dateFormat(condition.end_time - 1) + '</br>'
        }
        if (condition.prod) {
          data += '商品/订单号：' + condition.prod + '</br>'
        }
        if (condition.buyer) {
          data += '买家姓名/手机：' + condition.buyer + '</br>'
        }
        if (condition.devNo) {
          data += '物流单号：' + condition.devNo + '</br>'
        }
        if (condition.user) {
          data += '用户昵称/ID：' + condition.user + '</br>'
        }
      } else {
        if (condition.status) {
          data += '状态：' + this.setStatus(condition.status) + '</br>'
        }
        if (condition.text) {
          data += '商品ID/编码/名称：' + condition.text + '</br>'
        }
        if (condition.tp) {
          data += '来源：' + '平台供货' + '</br>'
        }
        if (condition.category_name) {
          data += '分类：' + condition.category_name + '</br>'
        }
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

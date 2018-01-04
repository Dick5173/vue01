import Vue from 'vue'
import './TableBody.scss'
import Draggable from 'vuedraggable'

export default {
  name: 'TableBody',
  components: {
    Draggable
  },
  render (h) {
    const dataArray = this.$parent.dataList
    const columns = this.$parent.store.states.columns
    const isDraggable = columns.findIndex((item => {
      return item.type === 'drag'
    })) !== -1
    const columnExpand = columns.find((item) => {
      return item.type === 'expand'
    })

    return (
      <draggable class="el-table__body" element="table" value={dataArray}
                 options={{handle: '.drag-td', disabled: !isDraggable}}
                 onEnd={() => this.handleDragEnd()} onStart={() => this.handleDragStart()}
                 onInput={(e) => this.handleInput(e)} cellpadding="0" cellspacing="0" width="100%">
        {
          this._l(dataArray, (dataItem, index) =>
            <tbody>
            <tr>
              {
                this._l(columns, column => {
                    if (column.type === '' || !column.type) {
                      return (
                        <td style={{minWidth: column.minWidth}} width={column.width}>
                          <div class="drag-content-cell">{column.renderCell({row: dataItem, index: index})}</div>
                        </td>
                      )
                    } else if (column.type === 'drag') {
                      return (
                        <td class='drag-td'>
                          <div class="cell">
                            <svg-icon icon="drag_button"/>
                          </div>
                        </td>
                      )
                    } else if (column.type === 'expand') {
                      return (
                        <td class='st-expand-td'>
                          <div class="cell" onClick={() => this.toggleExpand(dataItem, index)}>
                            <i
                              class={this.isExpand(dataItem, index) ? 'el-icon el-icon-arrow-right st-expand-arrow-open' : 'el-icon el-icon-arrow-right st-expand-arrow-close'}></i>
                          </div>
                        </td>
                      )
                    }
                  }
                )
              }
            </tr>
            {
              columnExpand ? <tr v-show={this.isExpand(dataItem, index)}>
                <td class="cell" colSpan={columns.length}>
                  <div>{columnExpand.renderCell({row: dataItem, index: index})}</div>
                </td>
              </tr> : ''
            }

            </tbody>
          )
        }
      </draggable>
    )
  },
  data () {
    return {
      expandInfo: {}
    }
  },
  methods: {
    handleDragStart () {
      this.$parent.store.commit('dragStart')
    },
    handleDragEnd () {
      this.$parent.store.commit('dragEnd')
    },
    handleInput (e) {
      this.$parent.store.commit('dragChange', e)
    },
    toggleExpand (data, index) {
      const key = `${this.$parent.rowKey}` ? data[this.$parent.rowKey] : `${index}`
      Vue.set(this.expandInfo, key, !this.expandInfo[key])
    },
    isExpand (data, index) {
      const key = `${this.$parent.rowKey}` ? data[this.$parent.rowKey] : `${index}`
      return this.expandInfo[key]
    }
  }
}

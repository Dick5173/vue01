const getDefaultColumn = options => {
  const column = {}
  for (let name in options) {
    if (options.hasOwnProperty(name)) {
      const value = options[name]
      if (typeof value !== 'undefined') {
        column[name] = value
      }
    }
  }
  if (!column.minWidth) {
    column.minWidth = '80px'
  }
  column.realWidth = column.width || column.minWidth
  return column
}

export default {
  props: {
    prop: String,
    label: String,
    width: {},
    minWidth: {},
    type: ''
  },
  render (h) {
  },
  mounted () {
    const store = this.$parent.store
    const columnOpt = {
      prop: this.prop,
      label: this.label,
      width: this.width,
      minWidth: this.minWidth,
      type: this.type
    }
    let _self = this
    let renderCell
    if (this.$scopedSlots.default) {
      renderCell = function (props) {
        return _self.$scopedSlots.default(props)
      }
    } else {
      renderCell = function (props) {
        return <div>{props.row[_self.prop]}</div>
      }
    }
    columnOpt.renderCell = renderCell
    store.states.columns.push(getDefaultColumn(columnOpt))
  }
}

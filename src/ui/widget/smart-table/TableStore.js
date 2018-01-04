const TableStore = function (table) {
  if (!table) {
    throw new Error('Table is required')
  }
  this.table = table
  this.states = {
    columns: []
  }
}

TableStore.prototype.mutations = {
  dragStart () {
    this.table.$emit('drag-start')
  },
  dragEnd () {
    this.table.$emit('drag-end')
  },
  dragChange (e) {
    this.table.$emit('update:dataList', e)
    this.table.$emit('drag-change', e)
  }
}

TableStore.prototype.getColumnNames = function () {
  return this.states.columns.map((item) => {
    return item.prop
  })
}

TableStore.prototype.commit = function (name, ...args) {
  const mutations = this.mutations
  if (mutations[name]) {
    mutations[name].apply(this, args)
  } else {
    throw new Error(`Action not found ${name}`)
  }
}

export default TableStore

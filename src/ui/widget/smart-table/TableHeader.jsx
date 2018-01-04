import './TableBody.scss'

export default {
  name: 'TableHeader',
  render (h) {
    const columns = this.$parent.store.states.columns
    return (
      <table cellpadding="0" cellspacing="0" width="100%">
        <thead class="el-table__header drag-header">
        <tr>
          {
            this._l(columns, column => {
                if (column.type === '' || !column.type) {
                  return (
                    <th style={{minWidth: column.minWidth}} width={column.width}>
                      <div class="cell">{column.label}</div>
                    </th>
                  )
                } else if (column.type === 'drag') {
                  return (
                    <th class='drag-td'>
                    </th>
                  )
                } else if (column.type === 'expand') {
                  return (
                    <th class='st-expand-th'>
                    </th>
                  )
                }
              }
            )
          }
        </tr>
        </thead>
      </table>
    )
  }
}

import * as R from 'ramda'
import Vue from 'vue'
import { dateFormat } from 'src/util/format'
import { getRndNum } from 'src/util/number'
import { allTp } from '../resource'

export const productTagTp = {
  product_tag_group_id: {
    value: 1,
    text: '标签组ID'
  },
  product_tag_id: {
    value: 2,
    text: '标签页ID'
  }
}

export const allPageTp = {
  min: {
    value: 1,
    text: '微页面'
  },
  home: {
    value: 2,
    text: '自定义首页'
  }
}

export const allGroupTp = {
  def: {
    value: 1,
    text: '普通'
  },
  buy_group: {
    value: 2,
    text: '拼团'
  }
}

export const allContentTp = {
  banner: {
    value: 1,
    text: '轮播图'
  },
  fast_in: {
    value: 2,
    text: '快捷入口'
  },
  product: {
    value: 3,
    text: '商品'
  },
  image: {
    value: 4,
    text: '图片'
  },
  text: {
    value: 5,
    text: '文本'
  },
  buy_group: {
    value: 6,
    text: '拼团'
  },
  voucher: {
    value: 9,
    text: '优惠券'
  },
  navigate: {
    value: 7,
    text: '搜索'
  },
  channel: {
    value: 8,
    text: '频道'
  }
}

export const allMinPageContentTp = {
  banner: {
    value: 1,
    text: '轮播图'
  },
  fast_in: {
    value: 2,
    text: '快捷入口'
  },
  product: {
    value: 3,
    text: '商品'
  },
  image: {
    value: 4,
    text: '图片'
  },
  text: {
    value: 5,
    text: '文本'
  },
  buy_group: {
    value: 6,
    text: '拼团'
  },
  voucher: {
    value: 9,
    text: '优惠券'
  }
}

export const allProductTp = {
  product: {
    value: 1,
    text: '商品'
  },
  product_group: {
    value: 2,
    text: '商品组'
  },
  all_product: {
    value: 3,
    text: '全部商品'
  }
}

export const allBuyGroupTp = {
  product: {
    value: 1,
    text: '自定义'
  },
  product_group: {
    value: 2,
    text: '拼团组'
  },
  all_product: {
    value: 3,
    text: '全部拼团商品'
  }
}

export const allShowTp = {
  show_long: {
    value: 1,
    text: '长期'
  },
  show_limit: {
    value: 2,
    text: '限时'
  }
}

export const allProductStyleTp = {
  banner: {
    value: 2,
    text: '通栏'
  },
  half: {
    value: 1,
    text: '半幅'
  },
  column_two: {
    value: 3,
    text: '2列'
  },
  column_three: {
    value: 4,
    text: '3列'
  }
}

export const allProductGroupStyleTp = {
  cross_slip: {
    value: 5,
    text: '横向滑动'
  },
  banner: {
    value: 2,
    text: '通栏'
  },
  half: {
    value: 1,
    text: '半幅'
  },
  column_two: {
    value: 3,
    text: '2列'
  },
  column_three: {
    value: 4,
    text: '3列'
  }
}

export const allCustomTp = {
  product: {
    value: 2,
    text: '商品'
  },
  product_group: {
    value: 3,
    text: '商品组'
  },
  product_tag: {
    value: 11,
    text: '标签商品页'
  },
  all_product: {
    value: 4,
    text: '全部商品'
  },
  min_page: {
    value: 5,
    text: '微页面'
  },
  other_app: {
    value: 10,
    text: '其它小程序'
  },
  empty: {
    value: 1,
    text: '无'
  }
}

export const channelCustomTp = {
  product_group: {
    value: 3,
    text: '商品组'
  },
  all_product: {
    value: 4,
    text: '全部商品'
  },
  product_tag: {
    value: 11,
    text: '标签商品页'
  },
  min_page: {
    value: 5,
    text: '微页面'
  },
  tag_group: {
    value: 9,
    text: '标签页'
  },
  other_app: {
    value: 10,
    text: '其它小程序'
  }
}

export const productDemo = [
  {
    name: '此处显示商品名称',
    sell_point: '此处显示买点',
    min_price: 88800,
    st_price: 99900,
    cover: {
      url: ''
    },
    prop: {
      stock: 1
    },
    buy_groups: [
      {
        price: 88800,
        scope_tp: 2,
        member_count: 5
      }
    ]
  },
  {
    name: '此处显示商品名称',
    sell_point: '此处显示买点',
    min_price: 88800,
    st_price: 99900,
    cover: {
      url: ''
    },
    prop: {
      stock: 1
    },
    buy_groups: [
      {
        price: 88800,
        scope_tp: 2,
        member_count: 5
      }
    ]
  },
  {
    name: '此处显示商品名称',
    sell_point: '此处显示买点',
    min_price: 88800,
    st_price: 99900,
    cover: {
      url: ''
    },
    prop: {
      stock: 1
    },
    buy_groups: [
      {
        price: 88800,
        scope_tp: 2,
        member_count: 5
      }
    ]
  },
  {
    name: '此处显示商品名称',
    sell_point: '此处显示买点',
    min_price: 88800,
    st_price: 99900,
    cover: {
      url: ''
    },
    prop: {
      stock: 1
    },
    buy_groups: [
      {
        price: 88800,
        scope_tp: 2,
        member_count: 5
      }
    ]
  },
  {
    name: '此处显示商品名称',
    sell_point: '此处显示买点',
    min_price: 88800,
    st_price: 99900,
    cover: {
      url: ''
    },
    prop: {
      stock: 1
    },
    buy_groups: [
      {
        price: 88800,
        scope_tp: 2,
        member_count: 5
      }
    ]
  },
  {
    name: '此处显示商品名称',
    sell_point: '此处显示买点',
    min_price: 88800,
    st_price: 99900,
    cover: {
      url: ''
    },
    prop: {
      stock: 1
    },
    buy_groups: [
      {
        price: 88800,
        scope_tp: 2,
        member_count: 5
      }
    ]
  }
]

const rndNum = () => {
  return getRndNum(3)
}

export const createBanner = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 1, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道
    wgt_carousel: {
      createWithUser: true,
      items: []
    }
  }
}

export const createFastIn = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 2, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道
    wgt_short_entry: {
      createWithUser: true,
      online_tp: 1,
      items: []
    }
  }
}

export const createProduct = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 3, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道
    wgt_product: {
      createWithUser: true,
      online_tp: 1, //  1 - 长期，2 - 限时 ,
      online_start: 0,
      online_end: 0,
      name: '商品',
      s_tp: 1, //  1 - 自定义选择商品，2 - 商品组，3 - 全部商品 ,
      style_tp: 2, // 样式：1 - 半幅，2 - 通栏， 3 - 两列，4 - 三列，5 - 横向滚动 ,
      products: productDemo,
      product_group: {}
    }
  }
}

export const createImage = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 4, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道
    wgt_img: {
      createWithUser: true,
      online_tp: 1,
      online_start: 0,
      online_end: 0,
      style_tp: 1, //  样式：1 - 1行1张，2 - 1行2张， 3 - 1行3张 ,
      margin_bottom: true,
      items: [
        {
          cover: {
            id: 0,
            tp: 0,
            text: '',
            url: null,
            width: 0,
            height: 0
          },
          action_tp: 0,
          product: {},
          product_group: {},
          min_page: {},
          product_tag: {},
          product_tag_group: {},
          product_tag_tp: 0
        }
      ]
    }
  }
}

export const createText = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 5, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道
    wgt_txt: {
      createWithUser: true,
      online_tp: 1,
      online_start: 0,
      online_end: 0,
      show_logo: true,
      txt: '',
      action_tp: 0,
      product: {},
      product_group: {},
      min_page: {}
    }
  }
}

export const createBuyGroup = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 6, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道
    wgt_buy_group: {
      createWithUser: true,
      online_tp: 1, //  1 - 长期，2 - 限时 ,
      online_start: 0,
      online_end: 0,
      name: '拼团',
      s_tp: 1, //  1 - 自定义选择商品，2 - 商品组，3 - 全部商品 ,
      style_tp: 2, // 样式：1 - 半幅，2 - 通栏， 3 - 两列，4 - 三列，5 - 横向滚动 ,
      products: productDemo,
      product_group: {}
    }
  }
}

export const createNavigate = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 7, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道
    wgt_search: {
      createWithUser: true,
      def_keyword: '',
      show_tag: false,
      show_logo: false,
      logo: {
        id: 0,
        tp: 0,
        text: '',
        url: null,
        width: 0,
        height: 0
      }
    }
  }
}

export const createChannel = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 8, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道
    wgt_channel: {
      createWithUser: true,
      items: [
        {
          show_id: rndNum(),
          name: '首页',
          badge: '', // 角标
          action_tp: 0, // 跳转：3-商品组，4 - 全部商品，5 - 微网页
          min_page: {},
          product_group: {}
        }
      ]
    }
  }
}

export const createVoucher = () => {
  return {
    show_id: rndNum(),
    wgt_tp: 9, // 1：轮播图，2：快捷入口，3：商品，4：图片，5：文本，6：拼团，7：导航栏，8：频道，9：优惠券
    wgt_voucher: {
      createWithUser: true,
      name: '优惠券',
      online_tp: 1, //  1 - 长期，2 - 限时
      online_start: 0,
      online_end: 0,
      items: []
    }
  }
}

export const createChannelItem = () => {
  return {
    show_id: rndNum(),
    name: '',
    badge: '', // 角标
    action_tp: 0, // 跳转：4 - 全部商品，5 - 微网页
    min_page: {},
    product_group: {}
  }
}

export const createImageItem = () => {
  return {
    cover: {
      id: 0,
      tp: 0,
      text: '',
      url: null,
      width: 0,
      height: 0
    },
    action_tp: 0,
    product: {},
    product_group: {},
    min_page: {}
  }
}

export const createBannerItem = () => {
  return {
    online_tp: 1,
    online_start: 0,
    online_end: 0,
    cover: {
      id: 0,
      tp: 0,
      text: '',
      url: null,
      width: 0,
      height: 0
    },
    name: '',
    action_tp: 0,
    product: {},
    product_group: {},
    min_page: {}
  }
}

export const createWgtCell = (contentTp) => {
  switch (contentTp) {
    case allContentTp.navigate.value:
      return createNavigate()
    case allContentTp.product.value:
      return createProduct()
    case allContentTp.channel.value:
      return createChannel()
    case allContentTp.image.value:
      return createImage()
    case allContentTp.banner.value:
      return createBanner()
    case allContentTp.fast_in.value:
      return createFastIn()
    case allContentTp.text.value:
      return createText()
    case allContentTp.buy_group.value:
      return createBuyGroup()
    case allContentTp.voucher.value:
      return createVoucher()
  }
}

export const isChannelError = (item) => {
  if (item.action_tp === channelCustomTp.min_page.value) {
    return (!item.min_page || !item.min_page.id) ? '微页面缺失' : null
  } else if (item.action_tp === channelCustomTp.product_group.value) {
    return (!item.product_group || !item.product_group.id) ? '商品组缺失' : null
  } else if (item.action_tp === allCustomTp.product_tag.value) {
    if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
      return (!item.product_tag_group || !item.product_tag_group.id) ? '标签商品页缺失' : null
    } else if (item.product_tag_tp === productTagTp.product_tag_id.value) {
      return (!item.product_tag || !item.product_tag.id) ? '标签商品页缺失' : null
    }
  }
  return null
}

export const isCustomError = (item) => {
  if (item.action_tp === allCustomTp.product.value) {
    return (!item.product || !item.product.id) ? '商品缺失' : null
  } else if (item.action_tp === allCustomTp.product_group.value) {
    return (!item.product_group || !item.product_group.id) ? '商品组缺失' : null
  } else if (item.action_tp === allCustomTp.min_page.value) {
    return (!item.min_page || !item.min_page.id) ? '微页面缺失' : null
  } else if (item.action_tp === allCustomTp.product_tag.value) {
    if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
      return (!item.product_tag_group || !item.product_tag_group.id) ? '标签商品页缺失' : null
    } else if (item.product_tag_tp === productTagTp.product_tag_id.value) {
      return (!item.product_tag || !item.product_tag.id) ? '标签商品页缺失' : null
    }
  } else {
    return null
  }
}

export const isErrorItem = (item) => {
  if (item.wgt_tp === allContentTp.product.value) {
    if (item.wgt_product.s_tp === allProductTp.product.value) {
      return (!item.wgt_product.products || item.wgt_product.products.length === 0) ? '商品：商品组件缺失' : null
    } else if (item.wgt_product.s_tp === allProductTp.product_group.value) {
      return (!item.wgt_product.product_group || !item.wgt_product.product_group.id) ? '商品：商品组件缺失' : null
    } else if (item.wgt_product.s_tp === allProductTp.all_product.value) {
      return (!item.wgt_product.products || item.wgt_product.products.length === 0) ? '商品：全部商品组件缺失' : null
    }
  } else if (item.wgt_tp === allContentTp.channel.value) {
    if (!item.wgt_channel.items || item.wgt_channel.items.length === 0) {
      return '频道：所有组件缺失'
    }
    let emptyText = null
    item.wgt_channel.items.some((item) => {
      if (item.action_tp === channelCustomTp.min_page.value) {
        emptyText = (!item.min_page || !item.min_page.id) ? '频道：微页面组件缺失' : null
        return emptyText
      } else if (item.action_tp === channelCustomTp.product_group.value) {
        emptyText = (!item.product_group || !item.product_group.id) ? '频道：商品组组件缺失' : null
        return emptyText
      } else if (item.action_tp === channelCustomTp.product_tag.value) {
        if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
          emptyText = !item.product_tag_group ? '频道：标签商品页组件缺失' : null
        } else if (item.product_tag_tp === productTagTp.product_tag_id.value) {
          emptyText = !item.product_tag ? '频道：标签商品页组件缺失' : null
        }
        return emptyText
      } else {
        return null
      }
    })
    return emptyText
  } else if (item.wgt_tp === allContentTp.text.value) {
    if (item.wgt_txt.action_tp === allCustomTp.product.value) {
      return (!item.wgt_txt.product || !item.wgt_txt.product.id) ? '文本：商品组件缺失' : null
    } else if (item.wgt_txt.action_tp === allCustomTp.product_group.value) {
      return (!item.wgt_txt.product_group || !item.wgt_txt.product_group.id) ? '文本：商品组组件缺失' : null
    } else if (item.wgt_txt.action_tp === allCustomTp.min_page.value) {
      return (!item.wgt_txt.min_page || !item.wgt_txt.min_page.id) ? '文本：微页面组件缺失' : null
    } else if (item.wgt_txt.action_tp === allCustomTp.product_tag.value) {
      if (item.wgt_txt.product_tag_tp === productTagTp.product_tag_group_id.value) {
        return (!item.wgt_txt.product_tag_group || !item.wgt_txt.product_tag_group.id) ? '文本：标签商品页组件缺失' : null
      } else if (item.wgt_txt.product_tag_tp === productTagTp.product_tag_id.value) {
        return (!item.wgt_txt.product_tag || !item.wgt_txt.product_tag.id) ? '文本：标签商品页组件缺失' : null
      }
    } else {
      return null
    }
  } else if (item.wgt_tp === allContentTp.fast_in.value) {
    if (!item.wgt_short_entry.items || item.wgt_short_entry.items.length === 0) {
      return '快捷入口：所有组件缺失'
    }
    let emptyText = null
    item.wgt_short_entry.items.some((item) => {
      if (item.action_tp === allCustomTp.product.value) {
        emptyText = (!item.product || !item.product.id) ? '快捷入口：商品组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.product_group.value) {
        emptyText = (!item.product_group || !item.product_group.id) ? '快捷入口：商品组组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.min_page.value) {
        emptyText = (!item.min_page || !item.min_page.id) ? '快捷入口：微页面组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.product_tag.value) {
        if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
          emptyText = !item.product_tag_group ? '快捷入口：标签商品页组件缺失' : null
        } else if (item.product_tag_tp === productTagTp.product_tag_id.value) {
          emptyText = !item.product_tag ? '快捷入口：标签商品页组件缺失' : null
        }
        return emptyText
      } else {
        return false
      }
    })
    return emptyText
  } else if (item.wgt_tp === allContentTp.image.value) {
    if (!item.wgt_img.items || item.wgt_img.items.length === 0) {
      return '图片：所有组件缺失'
    }

    let emptyText = null
    item.wgt_img.items.some((item) => {
      if (item.action_tp === allCustomTp.product.value) {
        emptyText = (!item.product || !item.product.id) ? '图片：商品组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.product_group.value) {
        emptyText = (!item.product_group || !item.product_group.id) ? '图片：商品组组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.min_page.value) {
        emptyText = (!item.min_page || !item.min_page.id) ? '图片：微页面组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.product_tag.value) {
        if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
          emptyText = !item.product_tag_group ? '图片：标签商品页组件缺失' : null
        } else if (item.product_tag_tp === productTagTp.product_tag_id.value) {
          emptyText = !item.product_tag ? '图片：标签商品页组件缺失' : null
        }
        return emptyText
      } else {
        return false
      }
    })
    return emptyText
  } else if (item.wgt_tp === allContentTp.banner.value) {
    if (!item.wgt_carousel.items || item.wgt_carousel.items.length === 0) {
      return '轮播图：所有组件缺失'
    }
    let emptyText = null
    item.wgt_carousel.items.some((item) => {
      if (item.action_tp === allCustomTp.product.value) {
        emptyText = (!item.product || !item.product.id) ? '轮播图：商品组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.product_group.value) {
        emptyText = (!item.product_group || !item.product_group.id) ? '轮播图：商品组组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.min_page.value) {
        emptyText = (!item.min_page || !item.min_page.id) ? '轮播图：微页面组件缺失' : null
        return emptyText
      } else if (item.action_tp === allCustomTp.product_tag.value) {
        if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
          emptyText = !item.product_tag_group ? '轮播图：标签商品页组件缺失' : null
        } else if (item.product_tag_tp === productTagTp.product_tag_id.value) {
          emptyText = !item.product_tag ? '轮播图：标签商品页组件缺失' : null
        }
        return emptyText
      } else if (item.action_tp === 0 && !item.createWithUser) {
        return '轮播图：跳转缺失'
      } else {
        return false
      }
    })
    return emptyText
  } else if (item.wgt_tp === allContentTp.buy_group.value) {
    if (item.wgt_buy_group.s_tp === allProductTp.product.value) {
      return (!item.wgt_buy_group.products || item.wgt_buy_group.products.length === 0) ? '商品：商品组件缺失' : null
    } else if (item.wgt_buy_group.s_tp === allProductTp.product_group.value) {
      return (!item.wgt_buy_group.product_group || !item.wgt_buy_group.product_group.id) ? '商品：商品组组件缺失' : null
    } else if (item.wgt_buy_group.s_tp === allProductTp.all_product.value) {
      return (!item.wgt_buy_group.products || item.wgt_buy_group.products.length === 0) ? '商品：全部商品组件缺失' : null
    }
  } else if (item.wgt_tp === allContentTp.voucher.value) {
    if (!item.wgt_voucher.items || item.wgt_voucher.items.length === 0) {
      return '优惠券：所有组件缺失'
    }
    const emptyItem = item.wgt_voucher.items.some(actItem => {
      return !actItem.voucher_activ_item
    })
    return emptyItem ? '优惠券：优惠券缺失' : null
  }
}

export const checkInputInfo = (dataList) => {
  const showError = (errTxt) => {
    Vue.prototype.$message({
      message: errTxt,
      type: 'error'
    })
  }

  if (!dataList || dataList.length === 0) {
    showError('没有任何内容')
    return -2
  }

  let position = -1
  dataList.some((item, index) => {
    if (item.wgt_tp === allContentTp.navigate.value) {
      if (item.wgt_search.show_logo && (!item.wgt_search.logo || !item.wgt_search.logo.url)) {
        showError('导航栏：勾选LOGO后 必须上传LOGO图片')
        position = index
        return true
      }
      return false
    } else if (item.wgt_tp === allContentTp.channel.value) {
      const emptyTitle = item.wgt_channel.items.some((item) => {
        return !item.name || item.name === ''
      })
      if (emptyTitle) {
        showError('频道：频道名称不能为空')
        position = index
        return true
      }
      return false
    } else if (item.wgt_tp === allContentTp.banner.value) {
      const emptyImage = item.wgt_carousel.items.some((item) => {
        return !item.cover || !item.cover.url || item.cover.url === ''
      })
      if (emptyImage) {
        showError('轮播图：图片不能为空')
        position = index
        return true
      }
      return false
    } else if (item.wgt_tp === allContentTp.image.value) {
      const emptyImage = item.wgt_img.items.some((item) => {
        return !item.cover || !item.cover.url || item.cover.url === ''
      })
      if (emptyImage) {
        showError('图片：图片不能为空')
        position = index
        return true
      }
      return false
    } else if (item.wgt_tp === allContentTp.buy_group.value) {
      if (!item.wgt_buy_group.name || item.wgt_buy_group.name === '') {
        showError('拼团：请输入标题')
        position = index
        return true
      }
      return false
    } else if (item.wgt_tp === allContentTp.text.value) {
      if (!item.wgt_txt.txt || item.wgt_txt.txt === '') {
        showError('文本：请输入文本')
        position = index
        return true
      }
      return false
    } else if (item.wgt_tp === allContentTp.fast_in.value) {
      if (item.wgt_short_entry.items.length < 2) {
        showError('快捷入口：最少2项')
        position = index
        return true
      }
      const emptyImage = item.wgt_short_entry.items.some((item) => {
        return !item.cover || !item.cover.url || item.cover.url === ''
      })
      const emptyTitle = item.wgt_short_entry.items.some((item) => {
        return !item.name || item.name === ''
      })
      if (emptyImage) {
        showError('快捷入口：图片不能为空')
        position = index
        return true
      } else if (emptyTitle) {
        showError('快捷入口：标题不能为空')
        position = index
        return true
      }
      return false
    } else if (item.wgt_tp === allContentTp.product.value) {
      if (item.wgt_product.s_tp === allProductTp.all_product.value && (!item.wgt_product.name || item.wgt_product.name === '')) {
        showError('商品：请输入标题')
        position = index
        return true
      }
      return false
    } else if (item.wgt_tp === allContentTp.voucher.value) {
      return false
    }
  })
  return position
}

export const convertVoucerSearchFormToParam = R.curry((data) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const newKey = {
        activ_name: ['name']
      }
      R.forEachObjIndexed((val, key) => {
        obj[key] = R.path(val)(obj)
      }, newKey)
      return obj
    },
    (obj) => {
      return R.pickAll(['enabled', 'put_point', 'voucher_run_ss', 'voucher_on_ss', 'left_min_count', 'user_scope', 'product_pos', 'share_tp', 'activ_id', 'voucher_id', 'voucher_name', 'page', 'limit', 'activ_name'])(obj)
    }
  )(data)
})

export const convertHomePageFormToParam = (minPage) => {
  const page = {}
  page.name = minPage.name
  page.share_text = minPage.share_text
  page.sys_remark = minPage.sys_remark
  page.capture_image = minPage.capture_image
  page.tmpl_id = minPage.tmpl_id
  page.data_tp = minPage.data_tp
  page.sys_tp = minPage.sys_tp
  page.tp = minPage.tp
  page.id = minPage.id

  if (minPage.items && minPage.items.length > 0) {
    page.items = R.map((item) => {
      const newItem = {}
      newItem.id = item.id
      newItem.wgt_tp = item.wgt_tp
      if (item.wgt_tp === allContentTp.product.value) {
        newItem.wgt_product = {}
        newItem.wgt_product.name = item.wgt_product.name
        newItem.wgt_product.online_tp = item.wgt_product.online_tp
        if (newItem.wgt_product.online_tp === allShowTp.show_limit.value) {
          newItem.wgt_product.online_start = dateFormat(item.wgt_product.online_start)
          newItem.wgt_product.online_end = dateFormat(item.wgt_product.online_end)
        }
        newItem.wgt_product.s_tp = item.wgt_product.s_tp
        newItem.wgt_product.style_tp = item.wgt_product.style_tp
        if (newItem.wgt_product.s_tp === allProductTp.product_group.value) {
          newItem.wgt_product.product_group_id = item.wgt_product.product_group.id
        } else {
          newItem.wgt_product.products = R.map((item) => {
            return item.id
          })(item.wgt_product.products)
        }
      } else if (item.wgt_tp === allContentTp.buy_group.value) {
        newItem.wgt_buy_group = {}
        newItem.wgt_buy_group.name = item.wgt_buy_group.name
        newItem.wgt_buy_group.online_tp = item.wgt_buy_group.online_tp
        if (newItem.wgt_buy_group.online_tp === allShowTp.show_limit.value) {
          newItem.wgt_buy_group.online_start = dateFormat(item.wgt_buy_group.online_start)
          newItem.wgt_buy_group.online_end = dateFormat(item.wgt_buy_group.online_end)
        }
        newItem.wgt_buy_group.s_tp = item.wgt_buy_group.s_tp
        newItem.wgt_buy_group.style_tp = item.wgt_buy_group.style_tp
        if (newItem.wgt_buy_group.s_tp === allProductTp.product_group.value) {
          newItem.wgt_buy_group.product_group_id = item.wgt_buy_group.product_group.id
        } else {
          newItem.wgt_buy_group.products = R.map((item) => {
            return item.id
          })(item.wgt_buy_group.products)
        }
      } else if (item.wgt_tp === allContentTp.navigate.value) {
        newItem.wgt_search = {}
        newItem.wgt_search.online_tp = 1
        newItem.wgt_search.def_keyword = item.wgt_search.def_keyword
        newItem.wgt_search.show_tag = item.wgt_search.show_tag
        newItem.wgt_search.show_logo = item.wgt_search.show_logo
        if (item.wgt_search.logo.url && item.wgt_search.logo.url !== '') {
          newItem.wgt_search.logo = item.wgt_search.logo
          newItem.wgt_search.logo.tp = allTp.img.value
        }
      } else if (item.wgt_tp === allContentTp.channel.value) {
        newItem.wgt_channel = {}
        newItem.wgt_channel.online_tp = 1
        newItem.wgt_channel.items = R.map((item) => {
          let minPageId = 0
          let productGroupId = 0
          let tagGroupId = 0
          if (item.action_tp === channelCustomTp.min_page.value) {
            minPageId = item.min_page.id
          }
          if (item.action_tp === channelCustomTp.product_group.value) {
            productGroupId = item.product_group.id
          }
          if (item.action_tp === channelCustomTp.tag_group.value) {
            const tg = item.tag_group
            tagGroupId = tg ? tg.id : 0
          }
          if (item.product_tag_tp === productTagTp.product_tag_group_id.value && item.product_tag_group) {
            return {
              action_tp: item.action_tp,
              badge: item.badge,
              min_page_id: minPageId,
              product_group_id: productGroupId,
              name: item.name,
              tag_group_id: tagGroupId,
              app_id: item.app_id,
              app_page: item.app_page,
              product_tag_tp: item.product_tag_tp,
              product_tag_group_id: item.product_tag_group.id
            }
          } else if (item.product_tag_tp === productTagTp.product_tag_id.value) {
            return {
              action_tp: item.action_tp,
              badge: item.badge,
              min_page_id: minPageId,
              product_group_id: productGroupId,
              name: item.name,
              tag_group_id: tagGroupId,
              app_id: item.app_id,
              app_page: item.app_page,
              product_tag_tp: item.product_tag_tp,
              product_tag_id: item.product_tag.id
            }
          } else {
            return {
              action_tp: item.action_tp,
              badge: item.badge,
              min_page_id: minPageId,
              product_group_id: productGroupId,
              name: item.name,
              tag_group_id: tagGroupId,
              app_id: item.app_id,
              app_page: item.app_page
            }
          }
        })(item.wgt_channel.items)
      } else if (item.wgt_tp === allContentTp.image.value) {
        newItem.wgt_img = {}
        newItem.wgt_img.online_tp = item.wgt_img.online_tp
        if (newItem.wgt_img.online_tp === allShowTp.show_limit.value) {
          newItem.wgt_img.online_start = dateFormat(item.wgt_img.online_start)
          newItem.wgt_img.online_end = dateFormat(item.wgt_img.online_end)
        }
        newItem.wgt_img.style_tp = item.wgt_img.style_tp
        newItem.wgt_img.margin_bottom_tp = item.wgt_img.margin_bottom ? 0 : 1
        newItem.wgt_img.items = R.map((item) => {
          const backItem = {}
          backItem.action_tp = item.action_tp
          if (backItem.action_tp === allCustomTp.product.value) {
            backItem.product_id = item.product.id
          } else if (backItem.action_tp === allCustomTp.product_group.value) {
            backItem.product_group_id = item.product_group.id
          } else if (backItem.action_tp === allCustomTp.min_page.value) {
            backItem.min_page_id = item.min_page.id
          } else if (backItem.action_tp === allCustomTp.other_app.value) {
            backItem.app_id = item.app_id
            backItem.app_page = item.app_page
          } else if (backItem.action_tp === allCustomTp.product_tag.value) {
            backItem.product_tag_tp = item.product_tag_tp
            if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
              backItem.product_tag_group_id = item.product_tag_group.id
            } else {
              backItem.product_tag_id = item.product_tag.id
            }
          }
          backItem.cover = item.cover
          if (backItem.cover.url && backItem.cover.url !== '') {
            backItem.cover.tp = allTp.img.value
          }
          return backItem
        })(item.wgt_img.items)
      } else if (item.wgt_tp === allContentTp.banner.value) {
        newItem.wgt_carousel = {}
        newItem.wgt_carousel.items = R.map((item) => {
          const backItem = {}
          backItem.action_tp = item.action_tp
          if (backItem.action_tp === allCustomTp.product.value) {
            backItem.product_id = item.product.id
          } else if (backItem.action_tp === allCustomTp.product_group.value) {
            backItem.product_group_id = item.product_group.id
          } else if (backItem.action_tp === allCustomTp.min_page.value) {
            backItem.min_page_id = item.min_page.id
          } else if (backItem.action_tp === allCustomTp.other_app.value) {
            backItem.app_id = item.app_id
            backItem.app_page = item.app_page
          } else if (backItem.action_tp === allCustomTp.product_tag.value) {
            backItem.product_tag_tp = item.product_tag_tp
            if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
              backItem.product_tag_group_id = item.product_tag_group.id
            } else {
              backItem.product_tag_id = item.product_tag.id
            }
          }
          backItem.cover = item.cover
          if (backItem.cover.url && backItem.cover.url !== '') {
            backItem.cover.tp = allTp.img.value
          }
          backItem.online_tp = item.online_tp
          if (backItem.online_tp === allShowTp.show_limit.value) {
            backItem.online_start = dateFormat(item.online_start)
            backItem.online_end = dateFormat(item.online_end)
          }
          return backItem
        })(item.wgt_carousel.items)
      } else if (item.wgt_tp === allContentTp.fast_in.value) {
        newItem.wgt_short_entry = {}
        newItem.wgt_short_entry.online_tp = 1
        newItem.wgt_short_entry.items = R.map((item) => {
          const backItem = {}
          backItem.name = item.name
          backItem.action_tp = item.action_tp
          if (backItem.action_tp === allCustomTp.product.value) {
            backItem.product_id = item.product.id
          } else if (backItem.action_tp === allCustomTp.product_group.value) {
            backItem.product_group_id = item.product_group.id
          } else if (backItem.action_tp === allCustomTp.min_page.value) {
            backItem.min_page_id = item.min_page.id
          } else if (backItem.action_tp === allCustomTp.other_app.value) {
            backItem.app_id = item.app_id
            backItem.app_page = item.app_page
          } else if (backItem.action_tp === allCustomTp.product_tag.value) {
            backItem.product_tag_tp = item.product_tag_tp
            if (item.product_tag_tp === productTagTp.product_tag_group_id.value) {
              backItem.product_tag_group_id = item.product_tag_group.id
            } else if (item.product_tag_tp === productTagTp.product_tag_id.value) {
              backItem.product_tag_id = item.product_tag.id
            }
          }
          backItem.cover = item.cover
          if (backItem.cover.url && backItem.cover.url !== '') {
            backItem.cover.tp = allTp.img.value
          }
          return backItem
        })(item.wgt_short_entry.items)
      } else if (item.wgt_tp === allContentTp.text.value) {
        newItem.wgt_txt = {}
        newItem.wgt_txt.txt = item.wgt_txt.txt
        newItem.wgt_txt.logo_tp = item.wgt_txt.show_logo ? 2 : 1
        newItem.wgt_txt.action_tp = item.wgt_txt.action_tp
        if (newItem.wgt_txt.action_tp === allCustomTp.product.value) {
          newItem.wgt_txt.product_id = item.wgt_txt.product.id
        } else if (newItem.wgt_txt.action_tp === allCustomTp.product_group.value) {
          newItem.wgt_txt.product_group_id = item.wgt_txt.product_group.id
        } else if (newItem.wgt_txt.action_tp === allCustomTp.min_page.value) {
          newItem.wgt_txt.min_page_id = item.wgt_txt.min_page.id
        } else if (newItem.wgt_txt.action_tp === allCustomTp.other_app.value) {
          newItem.wgt_txt.app_id = item.wgt_txt.app_id
          newItem.wgt_txt.app_page = item.wgt_txt.app_page
        } else if (newItem.wgt_txt.action_tp === allCustomTp.product_tag.value) {
          newItem.wgt_txt.product_tag_tp = item.wgt_txt.product_tag_tp
          if (item.wgt_txt.product_tag_tp === productTagTp.product_tag_group_id.value) {
            newItem.wgt_txt.product_tag_group_id = item.wgt_txt.product_tag_group.id
          } else if (item.wgt_txt.product_tag_tp === productTagTp.product_tag_id.value) {
            newItem.wgt_txt.product_tag_id = item.wgt_txt.product_tag.id
          }
        }
        newItem.wgt_txt.online_tp = item.wgt_txt.online_tp
        if (newItem.wgt_txt.online_tp === allShowTp.show_limit.value) {
          newItem.wgt_txt.online_start = dateFormat(item.wgt_txt.online_start)
          newItem.wgt_txt.online_end = dateFormat(item.wgt_txt.online_end)
        }
      } else if (item.wgt_tp === allContentTp.voucher.value) {
        newItem.wgt_voucher = {}
        newItem.wgt_voucher.name = item.wgt_voucher.name
        newItem.wgt_voucher.s_tp = item.wgt_voucher.s_tp
        newItem.wgt_voucher.voucher_activ_items = R.map((item) => item.voucher_activ_item.id)(item.wgt_voucher.items || [])
        newItem.wgt_voucher.online_tp = item.wgt_voucher.online_tp
        if (newItem.wgt_voucher.online_tp === allShowTp.show_limit.value) {
          newItem.wgt_voucher.online_start = dateFormat(item.wgt_voucher.online_start)
          newItem.wgt_voucher.online_end = dateFormat(item.wgt_voucher.online_end)
        }
      }
      return newItem
    })(minPage.items)
  } else {
    page.items = []
  }
  return page
}

export const convertPageContentModelToForm = (page) => {
  const newPage = R.clone(page)
  if (newPage.items && newPage.items.length > 0) {
    newPage.items = R.map((item) => {
      item.show_id = item.id
      if (item.wgt_tp === allContentTp.product.value) {
        item.wgt_product.old_s_tp = item.wgt_product.s_tp
        item.wgt_product.products = productDemo
        item.wgt_product.product_group = {}
      } else if (item.wgt_tp === allContentTp.buy_group.value) {
        item.wgt_buy_group.old_s_tp = item.wgt_buy_group.s_tp
        item.wgt_buy_group.products = productDemo
        item.wgt_buy_group.product_group = {}
      } else if (item.wgt_tp === allContentTp.channel.value) {
        item.wgt_channel.items.forEach((item) => {
          item.show_id = rndNum()
          if (!item.min_page) {
            item.min_page = {}
          }
          if (!item.product_group) {
            item.product_group = {}
          }
        })
      } else if (item.wgt_tp === allContentTp.text.value) {
        item.wgt_txt.old_action_tp = item.wgt_txt.action_tp
        item.wgt_txt.show_logo = item.wgt_txt.logo_tp === 2
        if (!item.wgt_txt.product) {
          item.wgt_txt.product = {}
        }
        if (!item.wgt_txt.product_group) {
          item.wgt_txt.product_group = {}
        }
        if (!item.wgt_txt.min_page) {
          item.wgt_txt.min_page = {}
        }
      } else if (item.wgt_tp === allContentTp.banner.value) {
        item.wgt_carousel.items.forEach((item) => {
          if (!item.product) {
            item.product = {}
          }
          if (!item.product_group) {
            item.product_group = {}
          }
          if (!item.min_page) {
            item.min_page = {}
          }
        })
      } else if (item.wgt_tp === allContentTp.image.value) {
        item.wgt_img.margin_bottom = item.wgt_img.margin_bottom_tp === 0
        item.wgt_img.items.forEach((item) => {
          if (!item.product) {
            item.product = {}
          }
          if (!item.product_group) {
            item.product_group = {}
          }
          if (!item.min_page) {
            item.min_page = {}
          }
        })
      } else if (item.wgt_tp === allContentTp.fast_in.value) {
        item.wgt_short_entry.items.forEach((item) => {
          if (!item.product) {
            item.product = {}
          }
          if (!item.product_group) {
            item.product_group = {}
          }
          if (!item.min_page) {
            item.min_page = {}
          }
        })
      } else if (item.wgt_tp === allContentTp.navigate.value) {
        if (!item.wgt_search.logo) {
          item.wgt_search.logo = {
            id: 0,
            tp: 0,
            text: '',
            url: null,
            width: 0,
            height: 0
          }
        }
      }
      item.error = isErrorItem(item)
      return item || {}
    })(page.items)
  }
  return newPage
}

// 跳转代号一样
export const getOtherAppInfo = (item) => {
  return {app_id: item.app_id, app_page: item.app_page}
}

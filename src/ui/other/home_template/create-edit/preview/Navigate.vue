<template lang="pug">
  div.navigate-bar
    div.logo(v-if="queryParams.wgt_search.show_logo")
      img(:src="queryParams.wgt_search.logo.url || emptyImage")
    div.search.single-line
      img.search-logo(:src="searchImage")
      div.txt {{queryParams.wgt_search.def_keyword}}
    div.classify(v-if="queryParams.wgt_search.show_tag")
</template>

<script>
  import EditNavigate from '../edit/EditNavigate'
  import emptyImage from 'src/assets/image/empty-image.png'
  import searchImage from 'src/assets/image/icon-search.png'

  export default {
    components: {
      EditNavigate
    },
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        showNavigate: true,
        emptyImage: emptyImage,
        searchImage: searchImage
      }
    },
    computed: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .navigate-bar {
    height: 44px;
    width: 375px;
    display: flex;
    align-items: center;
    background: #fff;

    .logo {
      height: 32px;
      margin-left: 10px;
      background-size: cover;
      background-position: center;
      color: #fff;

      img {
        height: 32px;
        width: auto;
        max-width: 128px;
      }
    }

    .search {
      flex: 1;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      margin: 5px 10px;
      border: 1px solid #f1f1f1;
      border-radius: 6px;
      background: #f8f8f8;
      color: #767676;
      font-size: 12px;
      display: flex;
      align-items: center;

      .search-logo {
        width: 16px;
        height: 16px;
      }

      .txt {
        margin-left: 10px;
      }
    }



    .classify {
      width: 27px;
      height: 27px;
      margin-right: 8px;
      text-align: center;
      line-height: 40px;
      background: #EB9E05;
      color: #fff;
      background: url("~@/assets/image/navbar-type-top.png") no-repeat center / 100% 100%;
    }
  }
</style>

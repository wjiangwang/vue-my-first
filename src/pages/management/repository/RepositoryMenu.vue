<template>
  <div class="page">
    <breadcrumb :items="[{ name: '知识库管理' }]"></breadcrumb>

    <div class="page-main">
      <page-card :scrollable="false" v-loading="loading">
        <div class="card-menu">
          <ul>
            <li v-for="item in menuItems" :key="item.id" @click="menuItemClick(item.id)">
              <div class="warp">
                <div class="icon">
                  <img :src="item.icon" alt>
                </div>
                <div class="name">{{item.name}}</div>
              </div>
            </li>
          </ul>
        </div>
      </page-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import PageCard from '@/components/PageCard'
import Breadcrumb from '@/components/Breadcrumb'


export default {
  name: 'RepositoryMenu',

  components: {
    PageCard,
    Breadcrumb
  },

  data () {
    return {
      menuItems: [
        { id: 1, name: '安全知识库', icon: 'static/images/repository-menu-icon.png', detail: '' },
        { id: 2, name: 'MSDS库', icon: 'static/images/repository-menu-icon.png', detail: '' },
      ],
      loading: false,
    }
  },
  methods: {
    menuItemClick (id) {
      this.$router.push({
        name: 'safety-repository-msds',
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-menu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-60%);
  ul {
    width: 100%;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    li {
      margin: 14px 50px;
      width: 280px;
      height: 210px;
      display: inline-block;
      border-radius: 4px;
      color: #3d4451;
      font-weight: bold;
      border: 1px solid #cbcdcf;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);
      transition: box-shadow 0.4s;
      &:hover {
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.19),
          0 6px 10px rgba(0, 0, 0, 0.23);
        .warp {
          img {
            opacity: 1;
            transform: scale3d(1.1, 1.1, 1);
          }
        }
      }

      .warp {
        background: whitesmoke;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        img {
          opacity: 0.6;
          transition: opacity 0.7s, transform 0.7s;
        }
        .icon {
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>

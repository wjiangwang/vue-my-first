<template>
  <div class="notice-marquee">
    <div class="remark">
      <p>{{notice.remarkTwo}}</p>
    </div>
    <div class="inscribe">
      负责人：{{notice.enterprinc}}
      <span class="date">{{notice.lastDay | strftime }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NoticeMarquee',

  computed: {
    ...mapState('dashboardNotice', ['notice'])
  }
}
</script>

<style lang="scss" scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.notice-marquee {
  display: flex;
  background: rgba(246,246,246,1);
  box-shadow: 0px 1px 3px 0px rgba(4,26,55,0.1);
  font-size: 15px;
  line-height: 20px;
  color: #333;
  padding: 20px;
  z-index: 2;

  .remark {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 20px;

    p {
      margin: 0;
      animation: marquee 15s linear infinite;
    }
  }
}

.screen-drop {
  &.dark-mode .notice-marquee {
    background: #272B34;
    color: #fff;
  }

  .notice-marquee {
    font-size: 1.5em;
    line-height: 1.357;
    padding: 8px 10px;
  }
}
</style>

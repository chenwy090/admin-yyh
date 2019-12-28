
<template>
  <div class="row">
    <draggable
      class="list-group"
      tag="ul"
      :list="list"
      v-bind="dragOptions"
      @start="isDragging=true"
      @end="isDragging=false"
    >
      <transition-group type="transition" :name="!isDragging ? 'flip-list' : null">
        <slot class="list-group-item"></slot>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'sort-drag',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    draggable,
  },
  watch: {
    isDragging() {
      if (!this.isDragging) {
        this.list.forEach((item, index) => {
          item.index = index
          // console.log(JSON.stringify(item));
        })
      }
    },
  },
  data() {
    return {
      isDragging: false,
    }
  },
  methods: {},
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
}
</script>

<style lang="less" scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>


<!--  
使用：
import SortDrag from "@/components/CompSortDrag";

<SortDrag :list="list">
  <div
    class="list-group-item"
    v-for="(item,index) in list"
    :key="index"
  >{{ item.name }}---- {{ item.index }}---- <span @click.stop="handleRemove(index)">{{ item.order }}</span></div>
</SortDrag>

methods: {
  handleRemove(index) {
    console.log("handleRemove", index);
    this.list.splice(index,1);
  }
}

-->
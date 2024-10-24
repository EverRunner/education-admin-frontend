<style lang="scss" scoped></style>

<template>
  <section>
    <!-- IM 聊天 -->
    <div class="chat">
      <service />
    </div>
  </section>
</template>

<script>
import Service from "@comp/Service";

export default {
  components: {
    Service,
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <section style="display: flex;justify-content: center;padding-top: 20px;">
    <!-- IM 聊天 -->
    <div class="chat">
      <im />
    </div>
  </section>
</template>

<script>
import Im from "@comp/IM";

export default {
  components: {
    Im,
  },
};
</script>

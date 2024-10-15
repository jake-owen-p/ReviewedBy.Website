<script lang="ts">
  export let title: string;
  export let tag: string;
  export let icon: string;
</script>

<div class="container">
  <div class="title_container">
    <img class="icon" src={icon} alt="icon">
    <p class="title">{title}</p>
  </div>
  <p class="tag">{tag}</p>
</div>

<style>
  .title_container {
    display: flex;
    gap: 10px;
    margin-top: 10%;
    align-items: flex-end;
  }
  .title {
    font-size: 24px;
    font-weight: bold;

  }
  .tag {
    font-size: 16px;
    margin-top: 4px;
    font-weight: 300;
  }
  .icon {
    margin-bottom: 4px;
    height: 20px;
    width: 20px;
  }
</style>

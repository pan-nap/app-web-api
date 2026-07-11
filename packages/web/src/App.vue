<template>
  <hs-config-provider>
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </hs-config-provider>
</template>

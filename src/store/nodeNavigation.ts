import { ref } from 'vue'

export type NodeNavigation = 'nodes' | 'groups' | 'subscriptions'

export const nodeNavigation = ref<NodeNavigation>('nodes')

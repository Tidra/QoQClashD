import { useStorage } from '@/helper/storage'

/**
 * 节点页的显示偏好（与其他页面一样存后端 KV）。
 *
 * 这几个键必须放在模块级：ProxiesPage 用 v-show 同时挂着 view="nodes" 和
 * view="groups" 两个 NodePoolPage 实例，写在组件里就是每人一套 ref + 一次 GET，
 * 一边改了另一边还是旧值，回写时能把新值顶回去。
 */
export const nodeViewMode = useStorage<'card' | 'table'>('nodeViewMode', 'card')
export const groupViewMode = useStorage<'card' | 'table'>('groupViewMode', 'card')

export const nodeTableColumns = useStorage<string[]>('nodeTableColumns', [
  'type',
  'server',
  'port',
  'cipher',
  'sni',
  'latency',
])
// 默认多给几列：只有类型/成员/当前选择三列时，剩下的宽度全被名称列吸走，
// 一屏表格拉得老长。测速地址与间隔对 select 组显示成占位符，用户可自行增删。
export const groupTableColumns = useStorage<string[]>('groupTableColumns', [
  'type',
  'members',
  'currentSelected',
  'url',
  'interval',
  'filter',
])

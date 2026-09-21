import { TEST_URL } from '@/constant'
import { whenStorageReady } from '@/helper/storage'
import { buildMergedNodeList, nodePools } from '@/store/nodePool'
import {
  autoUrlTestSeed,
  isProtectedGroup,
  proxyGroups,
  pruneProxyGroupMembers,
  syncBuiltInGroups,
} from '@/store/proxyGroups'
import { seedRoutingDefaults } from '@/store/routing'
import { speedtestUrl } from '@/store/settings'
import { watch } from 'vue'

/**
 * 冷启动引导：灌默认分流内容 + 维护内置代理组。
 *
 * 面板不注入任何示例数据 —— 首启就是空白，节点与订阅全部由用户自己导入。
 * 只有「全部节点」由当前节点列表派生；「自动选择」是首启播种的普通组，种完就归用户，
 * 改名、改成员、删除都随他，不会再被同步覆盖。
 */
void whenStorageReady().then(() => {
  seedRoutingDefaults()

  const nodeNames = () => buildMergedNodeList().map((node) => node.name)
  pruneProxyGroupMembers(new Set([...nodeNames(), ...proxyGroups.value.map((g) => g.name)]))
  // 用户还没自己建过组（只有内置的「全部节点」）才补种一次，删掉就不会再回来。
  const firstBoot = proxyGroups.value.every((group) => isProtectedGroup(group.name))
  syncBuiltInGroups(nodeNames())
  if (firstBoot) {
    proxyGroups.value = [
      ...proxyGroups.value,
      autoUrlTestSeed(speedtestUrl.value.trim() || TEST_URL),
    ]
  }
  // 节点增删后重新同步（sync 幂等，收敛后不再触发循环写入）
  watch([nodePools, proxyGroups], () => syncBuiltInGroups(nodeNames()), { deep: true })
})

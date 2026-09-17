<template>
  <div
    :class="
      isRuleTable
        ? 'relative flex size-full flex-col overflow-hidden'
        : 'relative size-full overflow-x-hidden'
    "
    :style="isRuleTable ? padding : undefined"
  >
    <template v-if="isRuleTable">
      <RulesCtrl />
      <RulesTable />
    </template>
    <template v-else-if="!isVirtualScroller">
      <RulesCtrl />
      <div
        class="p-3"
        :style="padding"
      >
        <template v-if="rulesTabShow === RULE_TAB_TYPE.PROVIDER">
          <div class="flex flex-col gap-2">
            <div
              v-for="(ruleProvider, index) in renderRulesProvider"
              :key="ruleProvider.name"
              class="base-container"
            >
              <RuleProvider
                :ruleProvider="ruleProvider"
                :index="index + 1"
              />
            </div>
          </div>
        </template>
        <template v-else-if="rulesTabShow === RULE_TAB_TYPE.INBOUND">
          <div class="flex flex-col gap-3">
            <div class="base-container flex items-center justify-between gap-3 p-3">
              <div>
                <div class="font-medium">{{ $t('inboundConfig') }}</div>
                <div class="text-xs text-base-content/60">端口、局域网、IPv6 与 TUN 配置</div>
              </div>
              <button
                class="btn btn-sm btn-outline"
                @click="showConfigEditor = true"
              >
                YAML 编辑
              </button>
            </div>
            <InboundPanel />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-2">
            <div
              v-for="rule in renderRules"
              :key="rule.payload"
              class="base-container"
            >
              <RuleCard
                :rule="rule"
                :index="rules.indexOf(rule) + 1"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
    <VirtualScroller
      v-else
      :data="renderRules"
      :size="44"
    >
      <template v-slot:before>
        <RulesCtrl />
      </template>
      <template v-slot="{ item: rule }: { item: Rule }">
        <RuleCard
          :key="rule.payload"
          :rule="rule"
          :index="rules.indexOf(rule) + 1"
        />
      </template>
    </VirtualScroller>
    <UpdateConfigModal v-model="showConfigEditor" />
  </div>
</template>

<script setup lang="ts">
import VirtualScroller from '@/components/common/VirtualScroller.vue'
import RulesCtrl from '@/components/controls/RulesCtrl'
import InboundPanel from '@/components/inbound/InboundPanel.vue'
import RuleCard from '@/components/rules/RuleCard.vue'
import RuleProvider from '@/components/rules/RuleProvider.vue'
import RulesTable from '@/components/rules/RulesTable.vue'
import { usePaddingForViews } from '@/composables/paddingViews'
import { LIST_DISPLAY_STYLE, RULE_TAB_TYPE } from '@/constant'
import { fetchRules, renderRules, renderRulesProvider, rules, rulesTabShow } from '@/assembly/rules'
import { ruleDisplayStyle } from '@/store/settings'
import type { Rule } from '@/types'
import { computed, onMounted, provide, ref } from 'vue'
import UpdateConfigModal from '@/components/settings/backend/UpdateConfigModal.vue'

onMounted(() => {
  fetchRules()
})

const expandedRule = ref<string | null>(null)
provide('expandedRule', expandedRule)

const isRuleTable = computed(() => ruleDisplayStyle.value === LIST_DISPLAY_STYLE.TABLE)
const cardPadding = usePaddingForViews({
  offsetTop: 12,
  offsetBottom: 8,
})
const tablePadding = usePaddingForViews({
  offsetTop: 0,
  offsetBottom: 0,
})
const padding = computed(() =>
  isRuleTable.value ? tablePadding.padding.value : cardPadding.padding.value,
)
const isVirtualScroller = computed(() => {
  return rulesTabShow.value === RULE_TAB_TYPE.RULES && renderRules.value.length > 200
})
const showConfigEditor = ref(false)
</script>

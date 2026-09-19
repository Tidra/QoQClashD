<template>
  <div
    class="flex h-full w-full min-w-0 flex-1 flex-col overflow-auto"
    :style="padding"
  >
    <CtrlsBar solid>
      <div class="flex min-h-12 items-center gap-2 p-2">
        <SegmentedControl
          v-model="tab"
          :options="tabOptions"
          class="shrink-0"
        />
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <TextInput
            v-model="search"
            :placeholder="`${$t('search')} | Regex`"
            clearable
            class="w-32 max-w-80 flex-1"
          />
        </div>
        <div class="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="btn btn-circle btn-sm"
            :title="$t('displaySettings')"
            @click="displaySettingsOpen = true"
          >
            <WrenchScrewdriverIcon class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="btn btn-circle btn-sm"
            :title="viewMode === 'card' ? $t('tableMode') : $t('cardMode')"
            @click="viewMode = viewMode === 'card' ? 'table' : 'card'"
          >
            <TableCellsIcon
              v-if="viewMode === 'card'"
              class="h-4 w-4"
            />
            <Squares2X2Icon
              v-else
              class="h-4 w-4"
            />
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="openCreate"
          >
            <PlusIcon class="h-4 w-4" />
            <span class="hidden sm:inline">{{ addButtonLabel }}</span>
          </button>
        </div>
      </div>
    </CtrlsBar>

    <div
      class="base-container m-3 min-h-0 flex-1 overflow-auto backdrop-blur-none!"
      :class="viewMode === 'card' && 'p-3 md:p-4'"
    >
      <!-- ── 入口（主入口 + listeners 子入口） ─────────────────── -->
      <template v-if="tab === 'inbounds'">
        <div
          v-if="viewMode === 'card'"
          class="flex flex-col gap-2"
        >
          <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2">
            <div
              class="bg-base-200 hover:bg-base-300/50 flex min-w-0 flex-col gap-2 overflow-hidden rounded-md p-2 transition-colors hover:shadow-sm"
            >
              <div class="flex w-full min-w-0 items-start justify-between gap-2">
                <div class="min-w-0">
                  <div class="flex min-w-0 items-center gap-1">
                    <span class="min-w-0 truncate font-medium">{{ $t('mainEntry') }}</span>
                    <span class="badge badge-warning shrink-0 text-[10px]">{{
                      $t('builtinBadge')
                    }}</span>
                  </div>
                  <div
                    class="text-base-content/60 mt-1 truncate text-xs"
                    :title="mainEntryPortsText"
                  >
                    {{ mainEntryPortsText || $t('mainEntryNoPorts') }}
                  </div>
                  <div class="text-base-content/60 mt-1 flex items-center gap-1 truncate text-xs">
                    TUN:
                    <span
                      class="badge badge-xs"
                      :class="mainEntry.tun?.enable ? 'badge-success' : 'badge-ghost'"
                      >{{ mainEntry.tun?.enable }}</span
                    >
                    <template v-if="mainEntry.tun?.enable">· {{ mainEntry.tun.stack }}</template>
                  </div>
                </div>
              </div>
              <div class="relative z-10 flex shrink-0 gap-0.5">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :title="$t('mainEntryEditTitle')"
                  @click.stop="mainEntryEditorOpen = true"
                >
                  <PencilIcon class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div
              v-for="inbound in filteredInbounds"
              :key="inbound.id"
              class="bg-base-200 hover:bg-base-300/50 flex min-w-0 cursor-pointer flex-col gap-2 overflow-hidden rounded-md p-2 transition-colors hover:shadow-sm"
              @click="openEditInbound(inbound)"
            >
              <div class="flex w-full min-w-0 items-start justify-between gap-2">
                <div class="min-w-0">
                  <div class="flex min-w-0 items-center gap-1">
                    <span class="min-w-0 truncate font-medium">{{ inbound.name }}</span>
                    <span class="badge badge-info shrink-0 text-[10px]">{{ inbound.type }}</span>
                  </div>
                  <div class="text-base-content/60 mt-1 truncate text-xs">
                    :{{ inbound.port || '—' }} · {{ inbound.listen || '0.0.0.0'
                    }}<template v-if="inbound.udp"> · UDP</template>
                  </div>
                  <div
                    v-if="inbound.proxy || inbound.rule"
                    class="text-base-content/60 mt-1 truncate text-xs"
                  >
                    {{ inbound.proxy || ruleLabel(inbound.rule) }}
                  </div>
                </div>
              </div>
              <div class="relative z-10 flex shrink-0 gap-0.5">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :title="$t('edit')"
                  @click.stop="openEditInbound(inbound)"
                >
                  <PencilIcon class="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                  :title="$t('delete')"
                  @click.stop="confirmDeleteInbound(inbound)"
                >
                  <TrashIcon class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="!filteredInbounds.length"
            class="text-base-content/60 flex flex-col items-center gap-2 py-6 text-sm"
          >
            {{ $t('inboundEmpty') }}
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="openCreate"
            >
              <PlusIcon class="h-4 w-4" /> {{ $t('inboundAdd') }}
            </button>
          </div>
        </div>
        <div
          v-else
          class="table-glass min-h-full min-w-min pb-6"
        >
          <table class="table-sm table">
            <thead
              class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!"
            >
              <tr>
                <th class="min-w-32">{{ $t('name') }}</th>
                <th
                  v-if="inboundColumns.includes('type')"
                  class="w-24 whitespace-nowrap"
                >
                  {{ $t('type') }}
                </th>
                <th
                  v-if="inboundColumns.includes('port')"
                  class="min-w-24 whitespace-nowrap"
                >
                  {{ $t('port') }}
                </th>
                <th
                  v-if="inboundColumns.includes('listen')"
                  class="min-w-24"
                >
                  {{ $t('inboundListen') }}
                </th>
                <th
                  v-if="inboundColumns.includes('udp')"
                  class="w-16 whitespace-nowrap"
                >
                  {{ $t('inboundUdp') }}
                </th>
                <th
                  v-if="inboundColumns.includes('rule')"
                  class="min-w-24"
                >
                  {{ $t('inboundSubRule') }}
                </th>
                <th
                  v-if="inboundColumns.includes('proxy')"
                  class="min-w-24"
                >
                  {{ $t('inboundFixedProxy') }}
                </th>
                <th
                  v-if="inboundColumns.includes('tun')"
                  class="w-28 whitespace-nowrap"
                >
                  {{ $t('tunSettings') }}
                </th>
                <th class="bg-base-100 sticky right-0 z-40 w-20 text-right whitespace-nowrap">
                  {{ $t('actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover group table-row-stripe">
                <td class="max-w-44 truncate">
                  {{ $t('mainEntry') }}
                  <span class="badge badge-warning badge-xs ml-1">{{ $t('builtinBadge') }}</span>
                </td>
                <td
                  v-if="inboundColumns.includes('type')"
                  class="whitespace-nowrap"
                >
                  —
                </td>
                <td
                  v-if="inboundColumns.includes('port')"
                  class="max-w-52 truncate font-mono text-xs"
                  :title="mainEntryPortsText"
                >
                  {{ mainEntryPortsText || '—' }}
                </td>
                <td
                  v-if="inboundColumns.includes('listen')"
                  class="whitespace-nowrap"
                >
                  —
                </td>
                <td
                  v-if="inboundColumns.includes('udp')"
                  class="whitespace-nowrap"
                >
                  —
                </td>
                <td
                  v-if="inboundColumns.includes('rule')"
                  class="whitespace-nowrap"
                >
                  —
                </td>
                <td
                  v-if="inboundColumns.includes('proxy')"
                  class="whitespace-nowrap"
                >
                  —
                </td>
                <td
                  v-if="inboundColumns.includes('tun')"
                  class="whitespace-nowrap"
                >
                  <span
                    class="badge badge-xs"
                    :class="mainEntry.tun?.enable ? 'badge-success' : 'badge-ghost'"
                    >{{ mainEntry.tun?.enable }}</span
                  >
                  <template v-if="mainEntry.tun?.enable"> · {{ mainEntry.tun.stack }}</template>
                </td>
                <td class="pinned-td sticky right-0 z-10 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    :title="$t('mainEntryEditTitle')"
                    @click="mainEntryEditorOpen = true"
                  >
                    <PencilIcon class="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
              <tr
                v-for="(inbound, index) in filteredInbounds"
                :key="inbound.id"
                class="hover group"
                :class="(index + 1) % 2 === 0 && 'table-row-stripe'"
              >
                <td
                  class="max-w-44 truncate"
                  :title="inbound.name"
                >
                  {{ inbound.name }}
                </td>
                <td
                  v-if="inboundColumns.includes('type')"
                  class="whitespace-nowrap"
                >
                  {{ inbound.type }}
                </td>
                <td
                  v-if="inboundColumns.includes('port')"
                  class="whitespace-nowrap"
                >
                  {{ inbound.port || '—' }}
                </td>
                <td
                  v-if="inboundColumns.includes('listen')"
                  class="max-w-32 truncate"
                >
                  {{ inbound.listen || '0.0.0.0' }}
                </td>
                <td
                  v-if="inboundColumns.includes('udp')"
                  class="whitespace-nowrap"
                >
                  <span
                    class="badge badge-xs"
                    :class="inbound.udp ? 'badge-success' : 'badge-ghost'"
                    >{{ inbound.udp }}</span
                  >
                </td>
                <td
                  v-if="inboundColumns.includes('rule')"
                  class="max-w-32 truncate"
                  :title="inbound.rule || ''"
                >
                  {{ inbound.rule ? ruleLabel(inbound.rule) : $t('inboundDefaultSubRule') }}
                </td>
                <td
                  v-if="inboundColumns.includes('proxy')"
                  class="max-w-32 truncate"
                  :title="inbound.proxy || ''"
                >
                  {{ inbound.proxy || $t('inboundDefaultProxy') }}
                </td>
                <td
                  v-if="inboundColumns.includes('tun')"
                  class="whitespace-nowrap"
                >
                  <span class="badge badge-ghost badge-xs">false</span>
                </td>
                <td class="pinned-td sticky right-0 z-10 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    :title="$t('edit')"
                    @click="openEditInbound(inbound)"
                  >
                    <PencilIcon class="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                    :title="$t('delete')"
                    @click="confirmDeleteInbound(inbound)"
                  >
                    <TrashIcon class="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="!filteredInbounds.length"
            class="text-base-content/60 py-6 text-center text-sm"
          >
            {{ $t('inboundEmpty') }}
          </div>
        </div>
      </template>

      <!-- ── 规则（主规则与各子规则同构，一条列表 = 一卡片/一行） ── -->
      <template v-else-if="tab === 'rules'">
        <div
          v-if="viewMode === 'card'"
          class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2"
        >
          <div
            class="bg-base-200 hover:bg-base-300/50 flex min-w-0 cursor-pointer flex-col gap-2 overflow-hidden rounded-md p-2 transition-colors hover:shadow-sm"
            @click="mainRuleEditorOpen = true"
          >
            <div class="flex w-full min-w-0 items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex min-w-0 items-center gap-1">
                  <span class="min-w-0 truncate font-medium">{{ $t('mainRulesSection') }}</span>
                  <span class="badge badge-warning shrink-0 text-[10px]">{{
                    $t('builtinBadge')
                  }}</span>
                </div>
                <div class="text-base-content/60 mt-1 truncate text-xs">
                  {{ routingRules.length }} {{ $t('ruleCount') }}
                </div>
              </div>
              <div class="relative z-10 flex shrink-0 gap-0.5">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :title="$t('mainRuleEditTitle')"
                  @click.stop="mainRuleEditorOpen = true"
                >
                  <PencilIcon class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <div
                v-for="(row, rowIdx) in subRulesExpanded[MAIN_RULES_KEY]
                  ? mainRulesPreview
                  : mainRulesPreview.slice(0, 4)"
                :key="rowIdx"
                class="bg-base-100/70 min-w-0 truncate rounded px-1.5 py-0.5 font-mono text-[10px]"
                :title="row"
              >
                {{ row }}
              </div>
              <button
                v-if="mainRulesPreview.length > 4"
                type="button"
                class="btn btn-ghost btn-xs self-start text-xs"
                @click.stop="subRulesExpanded[MAIN_RULES_KEY] = !subRulesExpanded[MAIN_RULES_KEY]"
              >
                {{
                  subRulesExpanded[MAIN_RULES_KEY]
                    ? $t('proxyGroupEditorShowLess')
                    : $t('proxyGroupEditorShowAll', { count: routingRules.length })
                }}
              </button>
            </div>
          </div>
          <div
            v-for="sub in filteredSubRules"
            :key="sub.name"
            class="bg-base-200 hover:bg-base-300/50 flex min-w-0 cursor-pointer flex-col gap-2 overflow-hidden rounded-md p-2 transition-colors hover:shadow-sm"
            @click="openEditSubRule(sub)"
          >
            <div class="flex w-full min-w-0 items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="truncate font-medium">{{ sub.name }}</div>
                <div class="text-base-content/60 mt-1 truncate text-xs">
                  {{ sub.rules.length }} {{ $t('ruleCount') }} ·
                  {{ $t('subRuleReferenced', { count: subRuleReferenceCount(sub.name) }) }}
                </div>
              </div>
              <div class="relative z-10 flex shrink-0 gap-0.5">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :title="$t('edit')"
                  @click.stop="openEditSubRule(sub)"
                >
                  <PencilIcon class="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                  :title="$t('delete')"
                  @click.stop="confirmDeleteSubRule(sub)"
                >
                  <TrashIcon class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <div
                v-for="(row, rowIdx) in subRulesExpanded[sub.name]
                  ? sub.rules
                  : sub.rules.slice(0, 4)"
                :key="rowIdx"
                class="bg-base-100/70 min-w-0 truncate rounded px-1.5 py-0.5 font-mono text-[10px]"
                :title="row"
              >
                {{ row }}
              </div>
              <button
                v-if="sub.rules.length > 4"
                type="button"
                class="btn btn-ghost btn-xs self-start text-xs"
                @click.stop="subRulesExpanded[sub.name] = !subRulesExpanded[sub.name]"
              >
                {{
                  subRulesExpanded[sub.name]
                    ? $t('proxyGroupEditorShowLess')
                    : $t('proxyGroupEditorShowAll', { count: sub.rules.length })
                }}
              </button>
            </div>
          </div>
          <div
            v-if="!filteredSubRules.length"
            class="text-base-content/60 col-span-full flex flex-col items-center gap-2 py-6 text-sm"
          >
            {{ $t('subRuleEmpty') }}
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="openCreateSubRule"
            >
              <PlusIcon class="h-4 w-4" /> {{ $t('subRuleAdd') }}
            </button>
          </div>
        </div>
        <div
          v-else
          class="table-glass min-h-full min-w-min pb-6"
        >
          <table class="table-sm table">
            <thead
              class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!"
            >
              <tr>
                <th class="min-w-32">{{ $t('name') }}</th>
                <th
                  v-if="subRuleColumns.includes('count')"
                  class="w-20 whitespace-nowrap"
                >
                  {{ $t('ruleCount') }}
                </th>
                <th
                  v-if="subRuleColumns.includes('terminal')"
                  class="min-w-32"
                >
                  {{ $t('subRuleRulesLabel') }}
                </th>
                <th
                  v-if="subRuleColumns.includes('references')"
                  class="w-20 whitespace-nowrap"
                >
                  {{ $t('subRuleReferencesColumn') }}
                </th>
                <th class="bg-base-100 sticky right-0 z-40 w-20 text-right whitespace-nowrap">
                  {{ $t('actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="hover group table-row-stripe"
                @click="mainRuleEditorOpen = true"
              >
                <td class="max-w-44 truncate">
                  {{ $t('mainRulesSection') }}
                  <span class="badge badge-warning badge-xs ml-1">{{ $t('builtinBadge') }}</span>
                </td>
                <td
                  v-if="subRuleColumns.includes('count')"
                  class="whitespace-nowrap"
                >
                  {{ routingRules.length }}
                </td>
                <td
                  v-if="subRuleColumns.includes('terminal')"
                  class="max-w-64 truncate font-mono text-xs"
                  :title="mainRulesPreview.join(' | ')"
                >
                  {{ mainRulesPreview[0] || '—'
                  }}<template v-if="mainRulesPreview.length > 1"> …</template>
                </td>
                <td
                  v-if="subRuleColumns.includes('references')"
                  class="whitespace-nowrap"
                >
                  —
                </td>
                <td class="pinned-td sticky right-0 z-10 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    :title="$t('mainRuleEditTitle')"
                    @click="mainRuleEditorOpen = true"
                  >
                    <PencilIcon class="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
              <tr
                v-for="(sub, index) in filteredSubRules"
                :key="sub.name"
                class="hover group"
                :class="(index + 1) % 2 === 0 && 'table-row-stripe'"
                @click="openEditSubRule(sub)"
              >
                <td
                  class="max-w-44 truncate"
                  :title="sub.name"
                >
                  {{ sub.name }}
                </td>
                <td
                  v-if="subRuleColumns.includes('count')"
                  class="whitespace-nowrap"
                >
                  {{ sub.rules.length }}
                </td>
                <td
                  v-if="subRuleColumns.includes('terminal')"
                  class="max-w-64 truncate font-mono text-xs"
                  :title="sub.rules.join(' | ')"
                >
                  {{ sub.rules[0] || '—' }}<template v-if="sub.rules.length > 1"> …</template>
                </td>
                <td
                  v-if="subRuleColumns.includes('references')"
                  class="whitespace-nowrap"
                >
                  {{ subRuleReferenceCount(sub.name) }}
                </td>
                <td class="pinned-td sticky right-0 z-10 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    :title="$t('edit')"
                    @click="openEditSubRule(sub)"
                  >
                    <PencilIcon class="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                    :title="$t('delete')"
                    @click="confirmDeleteSubRule(sub)"
                  >
                    <TrashIcon class="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="!filteredSubRules.length"
            class="text-base-content/60 py-6 text-center text-sm"
          >
            {{ $t('subRuleEmpty') }}
          </div>
        </div>
      </template>

      <!-- ── 规则集合（rule-providers） ────────────────────────── -->
      <template v-else>
        <div
          v-if="!filteredProviders.length"
          class="bg-base-100 border-base-300/60 rounded-xl border p-8 text-center"
        >
          <div class="text-base-content/60 mb-2 text-sm">{{ $t('ruleProviderEmpty') }}</div>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="openCreate"
          >
            <PlusIcon class="h-4 w-4" /> {{ $t('ruleProviderAdd') }}
          </button>
        </div>
        <div
          v-else-if="viewMode === 'card'"
          class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2"
        >
          <div
            v-for="provider in filteredProviders"
            :key="provider.name"
            class="bg-base-200 hover:bg-base-300/50 flex min-w-0 cursor-pointer flex-col gap-2 overflow-hidden rounded-md p-2 transition-colors hover:shadow-sm"
            @click="openEditProvider(provider)"
          >
            <div class="flex w-full min-w-0 items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex min-w-0 items-center gap-1">
                  <span class="min-w-0 truncate font-medium">{{ provider.name }}</span>
                  <span class="badge badge-info shrink-0 text-[10px]">{{ provider.type }}</span>
                  <span class="badge badge-ghost shrink-0 text-[10px]">{{ provider.format }}</span>
                  <span
                    v-if="provider.behavior"
                    class="badge badge-ghost shrink-0 text-[10px]"
                    >{{ provider.behavior }}</span
                  >
                </div>
                <div
                  class="text-base-content/60 mt-1 truncate font-mono text-xs"
                  :title="provider.url || provider.path || ''"
                >
                  {{ provider.url || provider.path || '—' }}
                </div>
                <div class="text-base-content/60 mt-1 truncate text-xs">
                  <template v-if="provider.type === 'http'">
                    {{ $t('ruleProviderInterval') }}: {{ provider.interval ?? '—' }}s<template
                      v-if="provider.proxy"
                    >
                      · {{ provider.proxy }}</template
                    >
                  </template>
                  <template v-else-if="provider.type === 'inline'"
                    >{{ (provider.payload ?? []).length }} {{ $t('ruleCount') }}</template
                  >
                  <template v-else>{{ provider.path || '—' }}</template>
                  ·
                  {{
                    $t('ruleProviderReferenced', {
                      count: ruleProviderReferenceCount(provider.name),
                    })
                  }}
                </div>
              </div>
              <div class="relative z-10 flex shrink-0 gap-0.5">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :title="$t('edit')"
                  @click.stop="openEditProvider(provider)"
                >
                  <PencilIcon class="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                  :title="$t('delete')"
                  @click.stop="confirmDeleteProvider(provider)"
                >
                  <TrashIcon class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="table-glass min-h-full min-w-min pb-6"
        >
          <table class="table-sm table">
            <thead
              class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!"
            >
              <tr>
                <th class="min-w-28">{{ $t('ruleProviderName') }}</th>
                <th
                  v-if="providerColumns.includes('type')"
                  class="w-28 whitespace-nowrap"
                >
                  {{ $t('type') }}
                </th>
                <th
                  v-if="providerColumns.includes('behavior')"
                  class="w-24 whitespace-nowrap"
                >
                  {{ $t('ruleProviderBehavior') }}
                </th>
                <th
                  v-if="providerColumns.includes('url')"
                  class="min-w-32"
                >
                  {{ $t('ruleProviderUrl') }}
                </th>
                <th
                  v-if="providerColumns.includes('interval')"
                  class="w-20 whitespace-nowrap"
                >
                  {{ $t('ruleProviderInterval') }}
                </th>
                <th
                  v-if="providerColumns.includes('references')"
                  class="w-20 whitespace-nowrap"
                >
                  {{ $t('subRuleReferencesColumn') }}
                </th>
                <th class="bg-base-100 sticky right-0 z-40 w-20 text-right whitespace-nowrap">
                  {{ $t('actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(provider, index) in filteredProviders"
                :key="provider.name"
                class="hover group"
                :class="index % 2 === 0 && 'table-row-stripe'"
                @click="openEditProvider(provider)"
              >
                <td
                  class="max-w-40 truncate"
                  :title="provider.name"
                >
                  {{ provider.name }}
                </td>
                <td
                  v-if="providerColumns.includes('type')"
                  class="whitespace-nowrap"
                >
                  {{ provider.type }} · {{ provider.format }}
                </td>
                <td
                  v-if="providerColumns.includes('behavior')"
                  class="whitespace-nowrap"
                >
                  {{ provider.behavior || '—' }}
                </td>
                <td
                  v-if="providerColumns.includes('url')"
                  class="max-w-64 truncate font-mono text-xs"
                  :title="provider.url || provider.path || ''"
                >
                  {{ provider.url || provider.path || '—' }}
                </td>
                <td
                  v-if="providerColumns.includes('interval')"
                  class="whitespace-nowrap"
                >
                  {{ provider.interval ?? '—' }}
                </td>
                <td
                  v-if="providerColumns.includes('references')"
                  class="whitespace-nowrap"
                >
                  {{ ruleProviderReferenceCount(provider.name) }}
                </td>
                <td class="pinned-td sticky right-0 z-10 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    :title="$t('edit')"
                    @click="openEditProvider(provider)"
                  >
                    <PencilIcon class="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                    :title="$t('delete')"
                    @click="confirmDeleteProvider(provider)"
                  >
                    <TrashIcon class="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- 显示设置 -->
      <DialogWrapper
        v-model="displaySettingsOpen"
        :title="$t('displaySettings')"
        box-class="max-w-lg"
      >
        <div class="flex flex-col gap-3 text-sm">
          <div class="settings-grid">
            <div class="setting-item">
              <div class="setting-item-label shrink-0!">{{ $t('displayStyle') }}</div>
              <SelectInput
                v-model="viewMode"
                class="select select-sm min-w-24"
                :options="[
                  { label: t('cardMode'), value: 'card' },
                  { label: t('tableMode'), value: 'table' },
                ]"
              />
            </div>
            <div class="flex flex-col">
              <div class="m-4 mb-2">{{ $t('customTableColumns') }}</div>
              <div class="grid grid-cols-2 gap-3 px-4 pb-2">
                <div class="flex flex-col gap-2">
                  <div class="text-base-content/60 flex items-center justify-between px-1 text-xs">
                    <span>{{ $t('activeLabel') }}</span>
                    <span class="badge badge-ghost badge-sm">{{ activeColumns.length }}</span>
                  </div>
                  <Draggable
                    class="bg-base-200 flex min-h-24 flex-col gap-2 rounded-lg p-2"
                    v-model="activeColumns"
                    group="routing-columns"
                    :animation="150"
                    ghost-class="ghost"
                    :item-key="(id: string) => id"
                  >
                    <template #item="{ element }">
                      <div
                        class="btn btn-sm bg-base-100 flex-nowrap justify-between gap-1 shadow-sm"
                        :title="getColumnLabel(element)"
                      >
                        <Bars2Icon class="h-4 w-4 shrink-0 cursor-move opacity-40" />
                        <span class="truncate">{{ getColumnLabel(element) }}</span>
                        <button
                          class="opacity-50 transition-opacity hover:opacity-100"
                          @click.stop="removeColumn(element)"
                        >
                          <XMarkIcon class="h-4 w-4 shrink-0" />
                        </button>
                      </div>
                    </template>
                    <template #footer>
                      <div
                        v-if="!activeColumns.length"
                        class="text-base-content/40 flex h-16 items-center justify-center px-2 text-center text-xs"
                      >
                        {{ $t('dragOrClickToAdd') }}
                      </div>
                    </template>
                  </Draggable>
                </div>
                <div class="flex flex-col gap-2">
                  <div class="text-base-content/60 flex items-center justify-between px-1 text-xs">
                    <span>{{ $t('availableLabel') }}</span>
                    <span class="badge badge-ghost badge-sm">{{ availableColumns.length }}</span>
                  </div>
                  <Draggable
                    class="border-base-300 flex min-h-24 flex-col gap-2 rounded-lg border border-dashed p-2"
                    v-model="availableColumns"
                    group="routing-columns"
                    :animation="150"
                    ghost-class="ghost"
                    :item-key="(id: string) => id"
                  >
                    <template #item="{ element }">
                      <button
                        class="btn btn-sm btn-ghost border-base-300/60 flex-nowrap justify-between gap-1"
                        :title="getColumnLabel(element)"
                        @click="addColumn(element)"
                      >
                        <span class="truncate">{{ getColumnLabel(element) }}</span>
                        <PlusIcon class="h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </template>
                  </Draggable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogWrapper>

      <!-- 编辑器弹窗 -->
      <MainEntryEditor
        v-model="mainEntryEditorOpen"
        :initial="mainEntry"
        @save="saveMainEntry"
      />
      <RuleListEditor
        v-model="mainRuleEditorOpen"
        mode="main"
        :initial-rows="mainRows"
        :existing-names="subRuleNameList"
        :group-options="groupNames"
        :rule-provider-names="ruleProviderNameList"
        @save-main="saveMainRules"
      />
      <RuleListEditor
        v-model="subRuleEditorOpen"
        mode="sub"
        :initial-rows="editingSubRuleRows"
        :initial-name="editingSubRule?.name"
        :existing-names="subRuleNameList"
        :group-options="groupNames"
        :rule-provider-names="ruleProviderNameList"
        @save-sub="saveSubFromEditor"
      />
      <InboundEditor
        v-model="inboundEditorOpen"
        :initial="editingInbound ?? undefined"
        :sub-rule-names="subRuleNameList"
        :group-options="groupNames"
        :node-options="nodeNames"
        @save="saveInbound"
      />
      <RuleProviderEditor
        v-model="providerEditorOpen"
        :initial="editingProvider ?? undefined"
        :existing-names="ruleProviderNameList"
        :proxy-options="providerProxyOptions"
        @save="saveProvider"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Bars2Icon,
  PencilIcon,
  PlusIcon,
  Squares2X2Icon,
  TableCellsIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import Draggable from 'vuedraggable'
import CtrlsBar from '@/components/common/CtrlsBar.vue'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import SegmentedControl from '@/components/common/SegmentedControl.vue'
import SelectInput from '@/components/common/SelectInput.vue'
import TextInput from '@/components/common/TextInput.vue'
import InboundEditor from '@/components/routing/InboundEditor.vue'
import MainEntryEditor from '@/components/routing/MainEntryEditor.vue'
import RuleListEditor, { type RuleListRow } from '@/components/routing/RuleListEditor.vue'
import RuleProviderEditor from '@/components/routing/RuleProviderEditor.vue'
import { usePaddingForViews } from '@/composables/paddingViews'
import { showNotification } from '@/helper/notification'
import { useStorage } from '@/helper/storage'
import { buildMergedNodeList } from '@/store/nodePool'
import { proxyGroups } from '@/store/proxyGroups'
import {
  parseRuleString,
  renameRuleProviderReferences,
  renameSubRuleReferences,
  removeRuleProvider,
  removeRoutingInbound,
  removeSubRule,
  routingInbounds,
  routingMainEntry,
  routingRuleProviders,
  routingRules,
  ruleProviderReferenceCount,
  ruleToString,
  setRoutingRules,
  subRuleReferenceCount,
  subRules,
  upsertRoutingInbound,
  upsertRoutingMainEntry,
  upsertRuleProvider,
  upsertSubRule,
} from '@/store/routing'
import type { InboundDraft, MainEntryDraft, RuleProviderDraft, SubRuleDraft } from '@/store/routing'

type RoutingTab = 'inbounds' | 'rules' | 'ruleSets'
type ColumnSet = 'subrules' | 'inbounds' | 'providers'

const { t } = useI18n()
const { padding } = usePaddingForViews({ offsetTop: 0, offsetBottom: 0 })

const tab = useStorage<RoutingTab>('config/routing-tab', 'inbounds')
// 旧版 'subrules' 独立 tab 与逐条规则表格已并入统一规则列表
if ((tab.value as string) === 'subrules') tab.value = 'rules'
const viewMode = useStorage<'card' | 'table'>('routingViewMode', 'card')
const search = ref('')
const displaySettingsOpen = ref(false)

const tabOptions = computed(() => [
  { value: 'inbounds' as const, label: t('routingTabInbounds') },
  { value: 'rules' as const, label: t('routingTabRules') },
  { value: 'ruleSets' as const, label: t('routingTabRuleSets') },
])

const addLabelByTab: Record<RoutingTab, string> = {
  inbounds: 'inboundAdd',
  rules: 'subRuleAdd',
  ruleSets: 'ruleProviderAdd',
}
const addButtonLabel = computed(() => t(addLabelByTab[tab.value]))

const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

// ── 表格列（各集合独立持久化） ─────────────────────────────────
const subRuleColumns = useStorage<string[]>('routingSubRuleColumns', [
  'count',
  'terminal',
  'references',
])
const inboundColumns = useStorage<string[]>('routingInboundColumns', [
  'type',
  'port',
  'listen',
  'udp',
  'rule',
  'proxy',
  'tun',
])
const providerColumns = useStorage<string[]>('routingProviderColumns', [
  'type',
  'behavior',
  'url',
  'interval',
  'references',
])

const columnStorage: Record<ColumnSet, ReturnType<typeof useStorage<string[]>>> = {
  subrules: subRuleColumns,
  inbounds: inboundColumns,
  providers: providerColumns,
}

const columnOptions = computed<{ key: string; label: string; set: ColumnSet }[]>(() => {
  if (tab.value === 'rules') {
    return [
      { set: 'subrules' as const, key: 'count', label: t('ruleCount') },
      { set: 'subrules', key: 'terminal', label: t('subRuleRulesLabel') },
      { set: 'subrules', key: 'references', label: t('subRuleReferencesColumn') },
    ]
  }
  if (tab.value === 'ruleSets') {
    return [
      { set: 'providers' as const, key: 'type', label: t('type') },
      { set: 'providers', key: 'behavior', label: t('ruleProviderBehavior') },
      { set: 'providers', key: 'url', label: t('ruleProviderUrl') },
      { set: 'providers', key: 'interval', label: t('ruleProviderInterval') },
      { set: 'providers', key: 'references', label: t('subRuleReferencesColumn') },
    ]
  }
  return [
    { set: 'inbounds' as const, key: 'type', label: t('type') },
    { set: 'inbounds', key: 'port', label: t('port') },
    { set: 'inbounds', key: 'listen', label: t('inboundListen') },
    { set: 'inbounds', key: 'udp', label: t('inboundUdp') },
    { set: 'inbounds', key: 'rule', label: t('inboundSubRule') },
    { set: 'inbounds', key: 'proxy', label: t('inboundFixedProxy') },
    { set: 'inbounds', key: 'tun', label: t('tunSettings') },
  ]
})

const currentColumnSet = computed<ColumnSet>(() =>
  tab.value === 'rules' ? 'subrules' : tab.value === 'ruleSets' ? 'providers' : 'inbounds',
)

const activeColumns = computed({
  get: () => columnStorage[currentColumnSet.value].value,
  set: (value: string[]) => {
    columnStorage[currentColumnSet.value].value = value
  },
})

const availableColumns = computed({
  get: () =>
    columnOptions.value
      .filter((opt) => !activeColumns.value.includes(opt.key))
      .map((opt) => opt.key),
  set: () => {},
})

const getColumnLabel = (key: string) =>
  columnOptions.value.find((opt) => opt.key === key)?.label || key

const removeColumn = (key: string) => {
  activeColumns.value = activeColumns.value.filter((col) => col !== key)
}

const addColumn = (key: string) => {
  if (!activeColumns.value.includes(key)) activeColumns.value = [...activeColumns.value, key]
}

// ── 过滤 ────────────────────────────────────────────────────────
const keyword = () => search.value.trim().toLowerCase()

const filteredSubRules = computed(() => {
  const q = keyword()
  if (!q) return subRules.value
  return subRules.value.filter(
    (sub) =>
      sub.name.toLowerCase().includes(q) || sub.rules.some((row) => row.toLowerCase().includes(q)),
  )
})

const filteredInbounds = computed(() => {
  const q = keyword()
  if (!q) return routingInbounds.value
  return routingInbounds.value.filter(
    (inbound) =>
      inbound.name.toLowerCase().includes(q) ||
      inbound.type.toLowerCase().includes(q) ||
      String(inbound.port ?? '').includes(q),
  )
})

const filteredProviders = computed(() => {
  const q = keyword()
  if (!q) return routingRuleProviders.value
  return routingRuleProviders.value.filter((provider) =>
    [
      provider.name,
      provider.type,
      provider.format,
      provider.behavior ?? '',
      provider.url ?? '',
      provider.path ?? '',
    ].some((value) => value.toLowerCase().includes(q)),
  )
})

const subRulesExpanded = reactive<Record<string, boolean>>({})
const MAIN_RULES_KEY = '__main__'

// ── 编辑器数据源 ────────────────────────────────────────────────
const groupNames = computed(() => proxyGroups.value.map((group) => group.name))
const nodeNames = computed(() => buildMergedNodeList().map((node) => node.name))
const subRuleNameList = computed(() => subRules.value.map((sub) => sub.name))
const ruleProviderNameList = computed(() => routingRuleProviders.value.map((p) => p.name))

/** listeners 的 rule 可填主规则名 rules 或子规则名 */
const ruleLabel = (rule?: string) => (rule === 'rules' ? t('inboundMainRuleOption') : (rule ?? ''))

// ── 主入口（顶层端口 + TUN） ───────────────────────────────────
const mainEntry = computed(() => routingMainEntry.value as MainEntryDraft)
const mainEntryEditorOpen = ref(false)

const MAIN_PORT_LABELS: [keyof MainEntryDraft, string][] = [
  ['port', 'http'],
  ['socks-port', 'socks'],
  ['mixed-port', 'mixed'],
  ['redir-port', 'redir'],
  ['tproxy-port', 'tproxy'],
]

const mainEntryPortsText = computed(() =>
  MAIN_PORT_LABELS.flatMap(([key, label]) => {
    const value = mainEntry.value[key]
    return typeof value === 'number' && value > 0 ? [`${label} :${value}`] : []
  }).join(' · '),
)

const saveMainEntry = (payload: MainEntryDraft) => {
  upsertRoutingMainEntry(payload)
  showNotification({ content: 'routingSaved', type: 'alert-success' })
}

// ── 主规则（与子规则同构的整表编辑） ───────────────────────────
const mainRuleEditorOpen = ref(false)

const mainRows = computed<RuleListRow[]>(() =>
  routingRules.value.map((rule) => ({
    id: rule.id,
    type: rule.type,
    payload: rule.payload,
    target: rule.target,
    noResolve: rule.noResolve ?? false,
    ...(rule.builtin ? { builtin: true } : {}),
  })),
)

const mainRulesPreview = computed(() => routingRules.value.map((rule) => ruleToString(rule)))

const saveMainRules = (rows: RuleListRow[]) => {
  setRoutingRules(
    rows.map((row) => ({
      id: row.id,
      type: row.type,
      payload: row.payload,
      target: row.target,
      ...(row.noResolve ? { noResolve: true } : {}),
      enabled: true,
      ...(row.builtin ? { builtin: true } : {}),
    })),
  )
  showNotification({ content: 'routingSaved', type: 'alert-success' })
}

// ── 子规则 ──────────────────────────────────────────────────────
const subRuleEditorOpen = ref(false)
const editingSubRule = ref<SubRuleDraft | null>(null)

const editingSubRuleRows = computed<RuleListRow[]>(() => {
  const sub = editingSubRule.value
  if (!sub) return []
  return sub.rules.flatMap((line, index) => {
    const parsed = parseRuleString(line)
    if (!parsed) return []
    return [
      {
        id: `subrow-${index}-${line}`,
        type: parsed.type,
        payload: parsed.payload,
        target: parsed.target,
        noResolve: parsed.noResolve ?? false,
      },
    ]
  })
})

const openCreateSubRule = () => {
  editingSubRule.value = null
  subRuleEditorOpen.value = true
}

const openEditSubRule = (sub: SubRuleDraft) => {
  editingSubRule.value = sub
  subRuleEditorOpen.value = true
}

const saveSubFromEditor = (name: string, rows: RuleListRow[], originalName?: string) => {
  upsertSubRule(
    {
      name,
      rules: rows.map((row) =>
        ruleToString({
          id: '',
          type: row.type,
          payload: row.payload,
          target: row.target,
          ...(row.noResolve ? { noResolve: true } : {}),
          enabled: true,
        }),
      ),
    },
    originalName,
  )
  if (originalName) renameSubRuleReferences(originalName, name)
  showNotification({ content: 'routingSaved', type: 'alert-success' })
  editingSubRule.value = null
}

const confirmDeleteSubRule = async (sub: SubRuleDraft) => {
  const { showConfirmDialog } = await import('@/helper/confirmDialog')
  const result = await showConfirmDialog({
    message: t('subRuleDeleteConfirm', { name: sub.name }),
    confirmButtonClass: 'btn-error',
  })
  if (!result.confirmed) return
  removeSubRule(sub.name)
  showNotification({ content: 'routingDeleted', type: 'alert-success' })
}

// ── 子入口（listeners） ─────────────────────────────────────────
const inboundEditorOpen = ref(false)
const editingInbound = ref<InboundDraft | null>(null)

const openEditInbound = (inbound: InboundDraft) => {
  editingInbound.value = inbound
  inboundEditorOpen.value = true
}

const saveInbound = (payload: InboundDraft) => {
  upsertRoutingInbound({ ...payload, id: payload.id || generateId('inbound') })
  showNotification({ content: 'routingSaved', type: 'alert-success' })
  editingInbound.value = null
}

const confirmDeleteInbound = async (inbound: InboundDraft) => {
  const { showConfirmDialog } = await import('@/helper/confirmDialog')
  const result = await showConfirmDialog({
    message: t('inboundDeleteConfirm', { name: inbound.name }),
    confirmButtonClass: 'btn-error',
  })
  if (!result.confirmed) return
  removeRoutingInbound(inbound.id)
  showNotification({ content: 'routingDeleted', type: 'alert-success' })
}

// ── 规则集合（rule-providers） ──────────────────────────────────
const providerEditorOpen = ref(false)
const editingProvider = ref<RuleProviderDraft | null>(null)

const providerProxyOptions = computed(() => [
  { value: '', label: t('inboundDefaultProxy') },
  ...nodeNames.value.map((name) => ({ value: name, label: name, group: t('memberKindNode') })),
  ...groupNames.value.map((name) => ({ value: name, label: name, group: t('routingTargetGroup') })),
])

const openEditProvider = (provider: RuleProviderDraft) => {
  editingProvider.value = provider
  providerEditorOpen.value = true
}

const saveProvider = (payload: RuleProviderDraft, originalName?: string) => {
  upsertRuleProvider(payload, originalName)
  if (originalName) renameRuleProviderReferences(originalName, payload.name)
  showNotification({ content: 'routingSaved', type: 'alert-success' })
  editingProvider.value = null
}

const confirmDeleteProvider = async (provider: RuleProviderDraft) => {
  const { showConfirmDialog } = await import('@/helper/confirmDialog')
  const result = await showConfirmDialog({
    message: t('ruleProviderDeleteConfirm', { name: provider.name }),
    confirmButtonClass: 'btn-error',
  })
  if (!result.confirmed) return
  removeRuleProvider(provider.name)
  showNotification({ content: 'routingDeleted', type: 'alert-success' })
}

// ── 新建 ────────────────────────────────────────────────────────
const openCreate = () => {
  if (tab.value === 'rules') {
    openCreateSubRule()
  } else if (tab.value === 'ruleSets') {
    editingProvider.value = null
    providerEditorOpen.value = true
  } else {
    editingInbound.value = null
    inboundEditorOpen.value = true
  }
}
</script>

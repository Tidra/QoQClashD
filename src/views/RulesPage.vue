<template>
  <div
    class="flex h-full w-full min-w-0 flex-1 flex-col overflow-auto"
    :style="padding"
  >
    <CtrlsBar solid>
      <div class="flex min-h-12 flex-wrap items-center gap-2 p-2">
        <SegmentedControl
          v-model="tab"
          :options="tabOptions"
          class="shrink-0"
        />
        <!-- 与 NodePageHeader 同款：窄屏让搜索单独换一行，免得被压成一条几十像素的缝 -->
        <div
          class="order-last flex min-w-0 basis-full items-center gap-2 md:order-none md:flex-1 md:basis-auto"
        >
          <TextInput
            v-model="search"
            :placeholder="`${$t('search')} | Regex`"
            clearable
            class="w-full max-w-none flex-1 md:w-32 md:max-w-80"
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
          <!-- 规则集合只有表格，摆一个切换按钮就是骗人点一下没反应。 -->
          <button
            v-if="tab !== 'ruleSets'"
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
      class="base-container m-3 min-h-0 flex-1 backdrop-blur-none!"
      :class="[
        viewMode === 'card' && 'p-3 md:p-4',
        inboundsTableMode ? 'flex flex-col overflow-hidden' : 'overflow-auto',
      ]"
    >
      <!-- ── 入口（网络监听主入口 + listeners 子入口） ───────────── -->
      <template v-if="tab === 'inbounds'">
        <!-- 网络监听横幅：原设置页「网络监听」并入此处，主入口草稿是唯一数据源；
             卡片上的开关直接双写（草稿 + 已连接内核时 PATCH 生效）。 -->
        <div
          class="bg-base-200/60 border-base-300/60 mb-2 flex shrink-0 flex-col gap-2 rounded-lg border p-3"
        >
          <div class="flex min-w-0 items-center gap-2">
            <span class="font-medium">{{ $t('networkListening') }}</span>
            <span class="badge badge-warning shrink-0 text-[10px]">{{ $t('builtinBadge') }}</span>
            <span class="text-base-content/50 truncate text-xs">{{ $t('mainEntry') }}</span>
            <button
              type="button"
              class="btn btn-ghost btn-sm ml-auto shrink-0"
              :title="$t('mainEntryEditTitle')"
              @click="mainEntryEditorOpen = true"
            >
              <PencilIcon class="h-3.5 w-3.5" />
              <span>{{ $t('edit') }}</span>
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            <span
              v-for="chip in mainEntryPortChips"
              :key="chip.key"
              class="badge badge-md gap-0.5 border font-mono text-xs"
              :class="chip.port ? 'border-base-300 bg-base-100' : 'badge-ghost opacity-60'"
              :title="chip.port ? `${chip.label} :${chip.port}` : `${chip.label} —`"
            >
              {{ chip.label }} {{ chip.port ? `:${chip.port}` : '—' }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <label class="flex cursor-pointer items-center gap-2">
              <span class="text-base-content/70">{{ $t('tunMode') }}</span>
              <input
                type="checkbox"
                class="toggle toggle-sm"
                :checked="!!mainEntry.tun?.enable"
                @change="toggleMainEntryTun"
              />
              <span
                v-if="mainEntry.tun?.enable"
                class="badge badge-ghost badge-sm"
                >{{ mainEntry.tun.stack }}</span
              >
            </label>
            <label class="flex cursor-pointer items-center gap-2">
              <span class="text-base-content/70">{{ $t('allowLan') }}</span>
              <input
                type="checkbox"
                class="toggle toggle-sm"
                :checked="!!mainEntry['allow-lan']"
                @change="toggleMainEntryAllowLan"
              />
            </label>
            <span
              v-if="!kernelPatchable"
              class="text-base-content/40 ml-auto truncate"
              >{{ $t('networkListeningDraftHint') }}</span
            >
          </div>
        </div>
        <div
          v-if="viewMode === 'card'"
          class="flex flex-col gap-2"
        >
          <!-- 子入口：通宽行卡，与上方网络监听横幅同款边框/端口 chip，类型色点区分协议。
               窄屏允许折行：名称与操作钮占第一行（钮靠右），chip 组与落地出口掉到第二行；
               md 起把 order 换回「名称 / chip / 出口 / 钮」的单行顺序。 -->
          <div
            v-for="inbound in filteredInbounds"
            :key="inbound.id"
            class="bg-base-200/60 hover:bg-base-300/40 border-base-300/60 flex min-w-0 cursor-pointer flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg border px-3 py-2.5 transition-colors hover:shadow-sm"
            @click="openEditInbound(inbound)"
          >
            <div
              class="flex min-w-0 grow basis-44 items-center gap-2 md:w-56 md:shrink-0 md:grow-0 md:basis-auto"
            >
              <span
                class="h-2 w-2 shrink-0 rounded-full"
                :class="inboundTypeStyle(inbound.type).dot"
              />
              <span class="min-w-0 truncate font-medium">{{ inbound.name }}</span>
              <span
                class="badge shrink-0 border-0 text-[10px]"
                :class="inboundTypeStyle(inbound.type).badge"
                >{{ inbound.type }}</span
              >
            </div>
            <div class="order-3 flex shrink-0 flex-wrap items-center gap-1.5 md:order-2">
              <span
                class="badge badge-md border-base-300 bg-base-100 font-mono text-xs"
                :title="`${$t('port')} :${inbound.port || '—'}`"
                >:{{ inbound.port || '—' }}</span
              >
              <span
                class="badge badge-md badge-ghost text-[10px]"
                :title="$t('inboundListen')"
                >{{ inbound.listen || '0.0.0.0' }}</span
              >
              <span
                v-if="inbound.udp"
                class="badge badge-md badge-ghost text-[10px]"
                >UDP</span
              >
            </div>
            <div
              v-if="inbound.proxy || inbound.rule"
              class="text-base-content/60 order-4 min-w-0 grow basis-24 truncate text-right text-xs md:order-3 md:flex-1 md:basis-0"
            >
              {{ inbound.proxy || ruleLabel(inbound.rule) }}
            </div>
            <div class="relative z-10 order-2 flex shrink-0 gap-0.5 md:order-4 md:ml-auto">
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
                class="btn btn-ghost text-error h-6 min-h-6 w-6 p-0"
                :title="$t('delete')"
                @click.stop="confirmDeleteInbound(inbound)"
              >
                <TrashIcon class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div
            v-if="!filteredInbounds.length"
            class="text-base-content/60 py-6 text-center text-sm"
          >
            {{ $t('inboundEmpty') }}
          </div>
        </div>
        <div
          v-else
          class="table-glass min-h-0 min-w-0 flex-1 overflow-auto pb-6"
        >
          <table class="table-sm table">
            <thead
              class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!"
            >
              <tr>
                <th class="w-40">{{ $t('name') }}</th>
                <th
                  v-if="inboundColumns.includes('type')"
                  class="w-24 whitespace-nowrap"
                >
                  {{ $t('type') }}
                </th>
                <th
                  v-if="inboundColumns.includes('port')"
                  class="w-20 whitespace-nowrap"
                >
                  {{ $t('port') }}
                </th>
                <th
                  v-if="inboundColumns.includes('listen')"
                  class="w-24"
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
                  class="min-w-0"
                >
                  {{ $t('inboundSubRule') }}
                </th>
                <th
                  v-if="inboundColumns.includes('proxy')"
                  class="min-w-0"
                >
                  {{ $t('inboundFixedProxy') }}
                </th>
                <th
                  v-if="inboundColumns.includes('tun')"
                  class="w-20 whitespace-nowrap"
                >
                  {{ $t('tunSettings') }}
                </th>
                <th class="bg-base-100 sticky right-0 z-40 w-20 text-right whitespace-nowrap">
                  {{ $t('actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
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
                  <span class="flex min-w-0 items-center gap-1.5">
                    <span
                      class="h-1.5 w-1.5 shrink-0 rounded-full"
                      :class="inboundTypeStyle(inbound.type).dot"
                    />
                    <span class="truncate">{{ inbound.name }}</span>
                  </span>
                </td>
                <td
                  v-if="inboundColumns.includes('type')"
                  class="whitespace-nowrap"
                >
                  <span
                    class="badge badge-xs border-0"
                    :class="inboundTypeStyle(inbound.type).badge"
                    >{{ inbound.type }}</span
                  >
                </td>
                <td
                  v-if="inboundColumns.includes('port')"
                  class="font-mono whitespace-nowrap"
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
            class="text-base-content/60 col-span-full py-6 text-center text-sm"
          >
            {{ $t('subRuleEmpty') }}
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
        <!-- 规则集合只有表格：卡片模式下每条集合就是一行元数据，摆成卡片反而看不全 url。 -->
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
                    v-if="isProviderDownloadable(provider)"
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    :title="$t('ruleProviderUpdate')"
                    :disabled="!!updatingProvider"
                    @click.stop="updateProviderFile(provider)"
                  >
                    <span
                      v-if="updatingProvider === provider.name"
                      class="loading loading-spinner loading-xs"
                    ></span>
                    <ArrowDownTrayIcon
                      v-else
                      class="h-3.5 w-3.5"
                    />
                  </button>
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
            <div
              v-if="tab !== 'ruleSets'"
              class="setting-item"
            >
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
  ArrowDownTrayIcon,
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
import { can } from '@/assembly/backend'
import { reloadConfigsAPI, updateConfigs } from '@/assembly/config'
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
import { useColumnPicker, type ColumnOption } from '@/composables/useColumnPicker'
import { useControlApi } from '@/composables/useControlApi'
import { confirmDanger } from '@/helper/confirmDialog'
import { showNotification } from '@/helper/notification'
import { notifyRequestError } from '@/helper/requestError'
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
// 卡片/表格模式按 tab 各自记，切一个不该带着另一个。旧的全局键 'routingViewMode'
// 由「主规则」tab 继承，免得在 KV 里留一个没人读的孤儿键；「规则集合」只有表格，不参与。
const rulesViewMode = useStorage<'card' | 'table'>('routingViewMode', 'card')
const inboundsViewMode = useStorage<'card' | 'table'>('routingViewMode-inbounds', 'card')
const viewMode = computed<'card' | 'table'>({
  get: () =>
    tab.value === 'inbounds'
      ? inboundsViewMode.value
      : tab.value === 'rules'
        ? rulesViewMode.value
        : 'table',
  set: (value) => {
    if (tab.value === 'inbounds') inboundsViewMode.value = value
    else if (tab.value === 'rules') rulesViewMode.value = value
  },
})
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

const columnOptions = computed<ColumnOption[]>(() => {
  if (tab.value === 'rules') {
    return [
      { key: 'count', label: t('ruleCount') },
      { key: 'terminal', label: t('subRuleRulesLabel') },
      { key: 'references', label: t('subRuleReferencesColumn') },
    ]
  }
  if (tab.value === 'ruleSets') {
    return [
      { key: 'type', label: t('type') },
      { key: 'behavior', label: t('ruleProviderBehavior') },
      { key: 'url', label: t('ruleProviderUrl') },
      { key: 'interval', label: t('ruleProviderInterval') },
      { key: 'references', label: t('subRuleReferencesColumn') },
    ]
  }
  return [
    { key: 'type', label: t('type') },
    { key: 'port', label: t('port') },
    { key: 'listen', label: t('inboundListen') },
    { key: 'udp', label: t('inboundUdp') },
    { key: 'rule', label: t('inboundSubRule') },
    { key: 'proxy', label: t('inboundFixedProxy') },
    { key: 'tun', label: t('tunSettings') },
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

const {
  available: availableColumns,
  labelOf: getColumnLabel,
  add: addColumn,
  remove: removeColumn,
} = useColumnPicker(activeColumns, columnOptions)

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

// ── 主入口（网络监听：顶层端口 + allow-lan + TUN） ─────────────
const mainEntry = computed(() => routingMainEntry.value as MainEntryDraft)
const mainEntryEditorOpen = ref(false)

// 内核已连接且支持 PATCH /configs 时才即时生效；否则改动只进草稿，启动时生效
const kernelPatchable = computed(() => can('configPatch'))

// 入口 tab 的表格模式：横幅固定、仅表格区域滚动（横向溢出也不带走横幅）
const inboundsTableMode = computed(() => tab.value === 'inbounds' && viewMode.value === 'table')

const MAIN_PORT_KEYS = ['mixed-port', 'port', 'socks-port', 'redir-port', 'tproxy-port'] as const

const PORT_LABEL_KEYS: Record<(typeof MAIN_PORT_KEYS)[number], string> = {
  'mixed-port': 'portMixed',
  port: 'portHttp',
  'socks-port': 'portSocks',
  'redir-port': 'portRedir',
  'tproxy-port': 'portTproxy',
}

const mainEntryPortChips = computed(() =>
  MAIN_PORT_KEYS.map((key) => {
    const value = mainEntry.value[key]
    return {
      key,
      label: t(PORT_LABEL_KEYS[key]),
      port: typeof value === 'number' && value > 0 ? value : undefined,
    }
  }),
)

// 主题里 secondary/accent 是灰色，这里只用有区分度的语义色
const INBOUND_TYPE_STYLES: Record<string, { dot: string; badge: string }> = {
  mixed: { dot: 'bg-success', badge: 'badge-success' },
  http: { dot: 'bg-warning', badge: 'badge-warning' },
  socks: { dot: 'bg-info', badge: 'badge-info' },
  redirect: { dot: 'bg-error', badge: 'badge-error' },
  tproxy: { dot: 'bg-primary', badge: 'badge-primary' },
}
const inboundTypeStyle = (type: string) =>
  INBOUND_TYPE_STYLES[type] ?? { dot: 'bg-base-content/40', badge: 'badge-ghost' }

const patchMainEntryRuntime = async (entry: MainEntryDraft) => {
  if (!kernelPatchable.value) return
  const body: Record<string, string | boolean | object | number> = {}
  for (const key of MAIN_PORT_KEYS) {
    const value = entry[key]
    if (typeof value === 'number') body[key] = value
  }
  if (typeof entry['allow-lan'] === 'boolean') body['allow-lan'] = entry['allow-lan']
  if (entry.tun) body.tun = entry.tun
  try {
    await updateConfigs(body)
  } catch (error) {
    notifyRequestError(error)
  }
}

const toggleMainEntryTun = async (event: Event) => {
  const enable = (event.target as HTMLInputElement).checked
  const next: MainEntryDraft = { ...mainEntry.value, tun: { ...mainEntry.value.tun, enable } }
  upsertRoutingMainEntry(next)
  if (kernelPatchable.value) {
    try {
      await updateConfigs({ tun: { enable } })
    } catch (error) {
      notifyRequestError(error)
    }
  }
}

const toggleMainEntryAllowLan = async (event: Event) => {
  const allowLan = (event.target as HTMLInputElement).checked
  const next: MainEntryDraft = { ...mainEntry.value, 'allow-lan': allowLan }
  upsertRoutingMainEntry(next)
  if (kernelPatchable.value) {
    try {
      await updateConfigs({ 'allow-lan': allowLan })
    } catch (error) {
      notifyRequestError(error)
    }
  }
}

const saveMainEntry = async (payload: MainEntryDraft) => {
  upsertRoutingMainEntry(payload)
  await patchMainEntryRuntime(payload)
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

const confirmDeleteSubRule = (sub: SubRuleDraft) =>
  confirmDanger(t('subRuleDeleteConfirm', { name: sub.name }), () => {
    removeSubRule(sub.name)
    showNotification({ content: 'routingDeleted', type: 'alert-success' })
  })

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

const confirmDeleteInbound = (inbound: InboundDraft) =>
  confirmDanger(t('inboundDeleteConfirm', { name: inbound.name }), () => {
    removeRoutingInbound(inbound.id)
    showNotification({ content: 'routingDeleted', type: 'alert-success' })
  })

// ── 规则集合（rule-providers） ──────────────────────────────────
const providerEditorOpen = ref(false)
const editingProvider = ref<RuleProviderDraft | null>(null)
// 正在下载中的集合名：一次只让一行转圈，两个下载同时跑只会让提示互相盖。
const updatingProvider = ref('')

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

const confirmDeleteProvider = (provider: RuleProviderDraft) =>
  confirmDanger(t('ruleProviderDeleteConfirm', { name: provider.name }), () => {
    removeRuleProvider(provider.name)
    showNotification({ content: 'routingDeleted', type: 'alert-success' })
  })

/** 只有填了 url 与本地 path 的 http 集合才谈得上「自己下一份文件」 */
const isProviderDownloadable = (provider: RuleProviderDraft) =>
  provider.type === 'http' && !!provider.url?.trim() && !!provider.path?.trim()

// 手动更新：agent 按草稿里的 url 直接覆盖 path，全程不叫内核动手，所以内核停着也能更。
const updateProviderFile = async (provider: RuleProviderDraft) => {
  if (updatingProvider.value) return
  updatingProvider.value = provider.name
  try {
    const result = await useControlApi().updateRuleSet(provider.name)
    if (!result.ok) throw new Error(result.error || 'rule-set update failed')
    // 文件是新的了，跑着的内核手里还是内存那份 —— 连着内核就热重载一次。
    if (can('reloadConfigs')) await reloadConfigsAPI()
    showNotification({
      content: 'ruleProviderUpdated',
      params: { name: provider.name },
      type: 'alert-success',
    })
  } catch (error) {
    notifyRequestError(error)
  } finally {
    updatingProvider.value = ''
  }
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

<template>
  <div
    class="flex h-full w-full min-w-0 flex-1 flex-col overflow-auto"
    :style="padding"
  >
    <NodePageHeader>
      <template #search>
        <TextInput
          v-if="props.view === 'nodes'"
          v-model="nodeSearch"
          :placeholder="`${$t('search')} | Regex`"
          clearable
          class="w-32 max-w-none flex-1 md:max-w-80"
        />
        <TextInput
          v-else
          v-model="poolSearch"
          :placeholder="`${$t('search')} | Regex`"
          clearable
          class="w-32 max-w-none flex-1 md:max-w-80"
        />
      </template>
      <template v-if="props.view === 'groups'">
        <button
          type="button"
          class="btn btn-circle btn-sm"
          :title="$t('displaySettings')"
          @click="groupDisplaySettingsOpen = true"
        >
          <WrenchScrewdriverIcon class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="btn btn-circle btn-sm"
          :title="groupViewMode === 'card' ? $t('tableMode') : $t('cardMode')"
          @click="groupViewMode = groupViewMode === 'card' ? 'table' : 'card'"
        >
          <TableCellsIcon
            v-if="groupViewMode === 'card'"
            class="h-4 w-4"
          />
          <Squares2X2Icon
            v-else
            class="h-4 w-4"
          />
        </button>
        <button
          type="button"
          class="btn btn-circle btn-sm"
          :disabled="isTesting || !visibleRealGroups.length"
          :title="$t('nodeTestAll')"
          @click="testAllGroupNodes"
        >
          <BoltIcon class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="openCreateGroup"
        >
          <PlusIcon class="h-4 w-4" />
          <span class="hidden sm:inline">{{ $t('proxyGroupEditorAddGroup') }}</span>
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          class="btn btn-circle btn-sm"
          :title="$t('displaySettings')"
          @click="nodeDisplaySettingsOpen = true"
        >
          <WrenchScrewdriverIcon class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="btn btn-circle btn-sm"
          :title="nodeViewMode === 'card' ? $t('tableMode') : $t('cardMode')"
          @click="nodeViewMode = nodeViewMode === 'card' ? 'table' : 'card'"
        >
          <TableCellsIcon
            v-if="nodeViewMode === 'card'"
            class="h-4 w-4"
          />
          <Squares2X2Icon
            v-else
            class="h-4 w-4"
          />
        </button>
        <button
          type="button"
          class="btn btn-circle btn-sm"
          :disabled="isTesting || !filteredNodes.length"
          :title="$t('nodeTestAll')"
          @click="testAllStandaloneNodes"
        >
          <BoltIcon class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="openCreateNodeFromHeader"
        >
          <PlusIcon class="h-4 w-4" />
          <span class="hidden sm:inline">{{ $t('nodePoolAddNode') }}</span>
        </button>
      </template>
    </NodePageHeader>
    <div
      class="base-container m-3 min-h-0 flex-1 overflow-auto backdrop-blur-none!"
      :class="(props.view === 'nodes' ? nodeViewMode : groupViewMode) === 'card' && 'p-3 md:p-4'"
    >
      <template v-if="props.view === 'nodes'">
        <div
          v-if="nodePoolsLoading"
          class="text-base-content/50 flex h-full items-center justify-center"
        >
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div
          v-else-if="!allNodes.length"
          class="bg-base-100 border-base-300/60 rounded-xl border p-8 text-center"
        >
          <div class="text-base-content/60 mb-2 text-sm">{{ $t('nodePoolEmpty') }}</div>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="openCreateNodeFromHeader"
          >
            <PlusIcon class="h-4 w-4" /> {{ $t('nodePoolAddNode') }}
          </button>
        </div>
        <template v-else>
          <!-- 批量操作条：勾选节点后出现 -->
          <div
            v-if="selectedNodeIds.size"
            class="bg-base-100/70 border-base-300/60 mb-2 flex flex-wrap items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
          >
            <span class="text-base-content/70">{{
              $t('nodeSelectedCount', { count: selectedNodeIds.size })
            }}</span>
            <button
              type="button"
              class="btn btn-error btn-sm"
              @click="bulkDeleteSelectedNodes"
            >
              <TrashIcon class="h-3.5 w-3.5" />
              {{ $t('nodeBulkDelete') }}
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              @click="selectedNodeIds = new Set()"
            >
              {{ $t('nodeClearSelection') }}
            </button>
          </div>
          <div
            v-if="nodeViewMode === 'card'"
            class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2"
          >
            <div
              v-for="node in filteredNodes"
              :key="node.id"
              class="bg-base-200 hover:bg-base-300/50 relative flex min-w-0 flex-col items-start gap-2 overflow-hidden rounded-md p-2 transition-colors hover:shadow-sm"
              :class="selectedNodeIds.has(node.id) && 'ring-primary/60 ring-1'"
            >
              <div class="flex w-full min-w-0 items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate font-medium">{{ node.name }}</div>
                  <div class="text-base-content/60 mt-1 truncate text-xs">
                    {{ node.type }} · {{ node.server }}:{{ node.port }}
                  </div>
                </div>
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs mt-0.5 shrink-0"
                  :checked="selectedNodeIds.has(node.id)"
                  @change="toggleNodeSelection(node.id)"
                />
              </div>
              <div class="flex w-full items-center justify-between gap-2">
                <div class="relative z-10 flex shrink-0 gap-0.5">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    @click.stop="editStandaloneNode(node)"
                  >
                    <PencilIcon class="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                    @click.stop="removeStandaloneNode(node)"
                  >
                    <TrashIcon class="h-3.5 w-3.5" />
                  </button>
                </div>
                <div class="flex shrink-0 items-center gap-1">
                  <span
                    v-if="latencyMap[node.name] !== undefined"
                    class="text-[10px]"
                    :class="latencyDisplayClass(node.name)"
                    >{{ latencyDisplayText(node.name) }}</span
                  >
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    :disabled="isNodeTesting(node.name)"
                    :title="$t('nodeTestLatency')"
                    @click.stop="testNode(node.name)"
                  >
                    <span
                      v-if="isNodeTesting(node.name)"
                      class="loading loading-spinner loading-xs"
                    ></span>
                    <BoltIcon
                      v-else
                      class="h-3.5 w-3.5"
                    />
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
                  <th class="w-8">
                    <input
                      type="checkbox"
                      class="checkbox checkbox-xs"
                      :checked="allFilteredSelected"
                      :indeterminate="someFilteredSelected && !allFilteredSelected"
                      :title="$t('nodeSelectAll')"
                      @change="toggleSelectAllFiltered"
                    />
                  </th>
                  <th class="min-w-28">{{ $t('nodeName') }}</th>
                  <th
                    v-if="nodeTableColumns.includes('type')"
                    class="w-20 whitespace-nowrap"
                  >
                    {{ $t('nodeType') }}
                  </th>
                  <th
                    v-if="nodeTableColumns.includes('server')"
                    class="min-w-32"
                  >
                    {{ $t('nodeServer') }}
                  </th>
                  <th
                    v-if="nodeTableColumns.includes('port')"
                    class="w-16 whitespace-nowrap"
                  >
                    {{ $t('nodePort') }}
                  </th>
                  <th
                    v-if="nodeTableColumns.includes('cipher')"
                    class="w-28 whitespace-nowrap"
                  >
                    {{ $t('nodeCipher') }}
                  </th>
                  <th
                    v-if="nodeTableColumns.includes('sni')"
                    class="min-w-28"
                  >
                    {{ $t('nodeSni') }}
                  </th>
                  <th
                    v-if="nodeTableColumns.includes('latency')"
                    class="w-20 whitespace-nowrap"
                  >
                    {{ $t('nodeLatency') }}
                  </th>
                  <th class="bg-base-100 sticky right-0 z-40 w-28 text-right whitespace-nowrap">
                    {{ $t('actions') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!filteredNodes.length">
                  <td
                    :colspan="nodeTableColumns.length + 3"
                    class="text-base-content/50 h-90"
                  >
                    <div
                      class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
                    >
                      <BoltIcon class="h-10 w-10 opacity-60" />
                      <!-- filteredNodes 空可能是筛选空了，不一定是真没有节点。 -->
                      <div class="text-base">
                        {{ allNodes.length ? $t('noData') : $t('nodePoolEmpty') }}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="(node, nodeIndex) in filteredNodes"
                  :key="node.id"
                  class="hover group cursor-pointer"
                  :class="nodeIndex % 2 === 0 && 'table-row-stripe'"
                  @click="editStandaloneNode(node)"
                >
                  <td @click.stop>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-xs"
                      :checked="selectedNodeIds.has(node.id)"
                      @change="toggleNodeSelection(node.id)"
                    />
                  </td>
                  <td
                    class="max-w-44 truncate"
                    :title="node.name"
                  >
                    {{ node.name }}
                  </td>
                  <td
                    v-if="nodeTableColumns.includes('type')"
                    class="whitespace-nowrap"
                  >
                    {{ node.type }}
                  </td>
                  <td
                    v-if="nodeTableColumns.includes('server')"
                    class="max-w-40 truncate"
                    :title="node.server"
                  >
                    {{ node.server }}
                  </td>
                  <td
                    v-if="nodeTableColumns.includes('port')"
                    class="whitespace-nowrap"
                  >
                    {{ node.port }}
                  </td>
                  <td
                    v-if="nodeTableColumns.includes('cipher')"
                    class="max-w-28 truncate"
                  >
                    {{ node.cipher || '—' }}
                  </td>
                  <td
                    v-if="nodeTableColumns.includes('sni')"
                    class="max-w-40 truncate"
                    :title="node.sni"
                  >
                    {{ node.sni || '—' }}
                  </td>
                  <td
                    v-if="nodeTableColumns.includes('latency')"
                    class="whitespace-nowrap"
                    :class="latencyDisplayClass(node.name)"
                  >
                    <span
                      v-if="isNodeTesting(node.name)"
                      class="loading loading-spinner loading-xs"
                    ></span>
                    <template v-else>{{ latencyDisplayText(node.name) }}</template>
                  </td>
                  <td
                    class="pinned-td sticky right-0 z-10 text-right whitespace-nowrap"
                    @click.stop
                  >
                    <button
                      type="button"
                      class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                      :disabled="isNodeTesting(node.name)"
                      :title="$t('nodeTestLatency')"
                      @click="testNode(node.name)"
                    >
                      <span
                        v-if="isNodeTesting(node.name)"
                        class="loading loading-spinner loading-xs"
                      ></span>
                      <BoltIcon
                        v-else
                        class="h-3.5 w-3.5"
                      />
                    </button>
                    <button
                      type="button"
                      class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                      :title="$t('edit')"
                      @click="editStandaloneNode(node)"
                    >
                      <PencilIcon class="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                      :title="$t('delete')"
                      @click="removeStandaloneNode(node)"
                    >
                      <TrashIcon class="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else>
        <!-- 空状态 -->
        <div
          v-if="!realGroups.length"
          class="bg-base-100 border-base-300/60 rounded-xl border p-8 text-center"
        >
          <div class="text-base-content/60 mb-2 text-sm">{{ $t('proxyGroupEditorNoGroups') }}</div>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="openCreateGroup"
          >
            <PlusIcon class="h-4 w-4" />
            {{ $t('proxyGroupEditorAddGroup') }}
          </button>
        </div>

        <!-- 代理组卡片 -->
        <div
          v-else-if="groupViewMode === 'card'"
          class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2"
        >
          <div
            v-for="group in visibleRealGroups"
            :key="group.name"
            class="bg-base-200 hover:bg-base-300/50 flex flex-col gap-2 rounded-md p-2 transition-colors hover:shadow-sm"
          >
            <div class="flex min-w-0 items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="truncate font-medium">{{ group.name }}</span>
                  <span class="badge badge-info shrink-0 text-[10px]">{{
                    groupTypeLabel(group.type)
                  }}</span>
                </div>
                <div class="text-base-content/60 mt-1 truncate text-xs">
                  {{ groupMemberTotal(group) }} {{ $t('proxyGroupEditorMembers') }}
                  <template v-if="isSelectableGroup(group)">
                    · {{ $t('proxyGroupEditorCurrentSelected') }}:
                    <span
                      :class="
                        group['default-selected'] ? 'text-base-content' : 'text-base-content/40'
                      "
                    >
                      {{ group['default-selected'] || '—' }}
                    </span>
                  </template>
                </div>
              </div>
              <div class="relative z-10 flex shrink-0 gap-0.5">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :disabled="isTesting || !groupNodeMembers(group).length"
                  :title="$t('nodeTestAll')"
                  @click.stop="testGroupNodes(group)"
                >
                  <BoltIcon class="h-3.5 w-3.5" />
                </button>
                <!-- 内置组（全部节点）成员由节点列表托管，不可编辑/删除，直接隐藏图标 -->
                <button
                  v-if="!isProtectedGroup(group.name)"
                  type="button"
                  class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                  :title="$t('edit')"
                  @click.stop="openEditGroup(group)"
                >
                  <PencilIcon class="h-3.5 w-3.5" />
                </button>
                <button
                  v-if="!isProtectedGroup(group.name)"
                  type="button"
                  class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                  :title="$t('proxyGroupEditorDeleteGroup')"
                  @click.stop="deleteRealGroup(group)"
                >
                  <TrashIcon class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <TextInput
              v-model="groupMemberSearchMap[group.name]"
              :placeholder="$t('proxyGroupEditorMemberFilter')"
              clearable
              class="input-sm min-w-0"
            />

            <div
              v-if="!filterGroupMembers(group).length"
              class="text-base-content/60 py-1 text-xs"
            >
              {{ $t('proxyGroupEditorNoMembers') }}
            </div>
            <div
              v-else
              :ref="(el) => measureGroupMembers(group.name, el)"
              class="flex flex-wrap content-start gap-1"
              :class="!groupExpandedMap[group.name] && 'max-h-13 overflow-hidden'"
            >
              <div
                v-for="member in filterGroupMembers(group)"
                :key="member"
                class="flex max-w-full items-center gap-1 rounded-md px-1.5 py-0.5 text-xs transition-colors"
                :class="memberChipClass(group, member)"
                :title="memberTitle(group, member)"
              >
                <button
                  type="button"
                  class="flex min-w-0 items-center gap-1"
                  :disabled="!isSelectableGroup(group)"
                  @click="selectGroupMember(group, member)"
                >
                  <span
                    class="h-1.5 w-1.5 shrink-0 rounded-full"
                    :class="
                      memberKind(member) === 'group'
                        ? 'bg-warning'
                        : memberKind(member) === 'node'
                          ? 'bg-info'
                          : 'bg-error'
                    "
                  ></span>
                  <span
                    class="min-w-0 truncate"
                    :class="{ 'line-through': memberKind(member) === 'missing' }"
                    >{{ member }}</span
                  >
                  <CheckIcon
                    v-if="group['default-selected'] === member"
                    class="h-3 w-3 shrink-0"
                  />
                </button>
                <!-- 对齐源代码：有延迟时延迟文本替代测速图标，点击可重新测速 -->
                <button
                  v-if="memberKind(member) === 'node'"
                  type="button"
                  class="shrink-0 opacity-70 transition-opacity hover:opacity-100 disabled:opacity-30"
                  :disabled="isNodeTesting(member)"
                  :title="$t('nodeTestLatency')"
                  @click.stop="testNode(member)"
                >
                  <span
                    v-if="isNodeTesting(member)"
                    class="loading loading-spinner loading-xs"
                  ></span>
                  <span
                    v-else-if="latencyMap[member] !== undefined"
                    class="text-[10px] leading-none"
                    :class="latencyDisplayClass(member)"
                    >{{ latencyDisplayText(member) }}</span
                  >
                  <BoltIcon
                    v-else
                    class="h-3 w-3"
                  />
                </button>
              </div>
            </div>
            <button
              v-if="groupExpandedMap[group.name] || groupMembersOverflowMap[group.name]"
              type="button"
              class="btn btn-ghost btn-xs self-start text-xs"
              @click.stop="groupExpandedMap[group.name] = !groupExpandedMap[group.name]"
            >
              {{
                groupExpandedMap[group.name]
                  ? $t('proxyGroupEditorShowLess')
                  : $t('proxyGroupEditorShowAll', { count: filterGroupMembers(group).length })
              }}
            </button>
          </div>
        </div>

        <!-- 代理组表格 -->
        <div
          v-else
          class="table-glass min-h-full min-w-min pb-6"
        >
          <table class="table-sm table">
            <thead
              class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!"
            >
              <tr>
                <th class="min-w-32">{{ $t('proxyGroupEditorGroup') }}</th>
                <th
                  v-if="groupTableColumns.includes('type')"
                  class="w-24 whitespace-nowrap"
                >
                  {{ $t('proxyGroupEditorGroupType') }}
                </th>
                <th
                  v-if="groupTableColumns.includes('members')"
                  class="w-20 whitespace-nowrap"
                >
                  {{ $t('proxyGroupEditorMembers') }}
                </th>
                <th
                  v-if="groupTableColumns.includes('currentSelected')"
                  class="w-44 whitespace-nowrap"
                >
                  {{ $t('proxyGroupEditorCurrentSelected') }}
                </th>
                <th
                  v-if="groupTableColumns.includes('url')"
                  class="min-w-32"
                >
                  {{ $t('proxyGroupEditorUrl') }}
                </th>
                <th
                  v-if="groupTableColumns.includes('interval')"
                  class="w-24 whitespace-nowrap"
                >
                  {{ $t('proxyGroupEditorInterval') }} (s)
                </th>
                <th
                  v-if="groupTableColumns.includes('timeout')"
                  class="w-24 whitespace-nowrap"
                >
                  {{ $t('proxyGroupEditorTimeout') }} (ms)
                </th>
                <th
                  v-if="groupTableColumns.includes('tolerance')"
                  class="w-20 whitespace-nowrap"
                >
                  {{ $t('proxyGroupEditorTolerance') }} (ms)
                </th>
                <th
                  v-if="groupTableColumns.includes('filter')"
                  class="min-w-28"
                >
                  {{ $t('proxyGroupEditorFilter') }}
                </th>
                <th
                  v-if="groupTableColumns.includes('excludeFilter')"
                  class="min-w-28"
                >
                  {{ $t('proxyGroupEditorExcludeFilter') }}
                </th>
                <th class="bg-base-100 sticky right-0 z-40 w-24 text-right whitespace-nowrap">
                  {{ $t('actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!visibleRealGroups.length">
                <td
                  :colspan="groupTableColumns.length + 2"
                  class="text-base-content/50 h-90"
                >
                  <div
                    class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
                  >
                    <BoltIcon class="h-10 w-10 opacity-60" />
                    <div class="text-base">{{ $t('proxyGroupEditorNoGroups') }}</div>
                  </div>
                </td>
              </tr>
              <tr
                v-for="(group, groupIndex) in visibleRealGroups"
                :key="group.name"
                class="hover group"
                :class="groupIndex % 2 === 0 && 'table-row-stripe'"
              >
                <td
                  class="max-w-44 truncate"
                  :title="group.name"
                >
                  {{ group.name }}
                </td>
                <td
                  v-if="groupTableColumns.includes('type')"
                  class="whitespace-nowrap"
                >
                  <span class="badge badge-info badge-xs">{{ groupTypeLabel(group.type) }}</span>
                </td>
                <td
                  v-if="groupTableColumns.includes('members')"
                  class="whitespace-nowrap"
                >
                  {{ groupMemberTotal(group) }}
                </td>
                <td v-if="groupTableColumns.includes('currentSelected')">
                  <SelectInput
                    v-if="isSelectableGroup(group)"
                    :model-value="group['default-selected'] ?? ''"
                    :options="selectedMemberOptions(group)"
                    searchable
                    :search-placeholder="$t('proxyGroupEditorSearchOption')"
                    :no-results-text="$t('proxyGroupEditorNoMatch')"
                    class="select select-xs max-w-40 min-w-0"
                    @change="setGroupSelected(group, $event)"
                  />
                  <span
                    v-else
                    class="text-base-content/40"
                    >—</span
                  >
                </td>
                <td
                  v-if="groupTableColumns.includes('url')"
                  class="max-w-52 truncate"
                  :title="group.url"
                >
                  {{ groupCellValue(group.url) }}
                </td>
                <td
                  v-if="groupTableColumns.includes('interval')"
                  class="whitespace-nowrap"
                >
                  {{ groupCellValue(group.interval) }}
                </td>
                <td
                  v-if="groupTableColumns.includes('timeout')"
                  class="whitespace-nowrap"
                >
                  {{ groupCellValue(group.timeout) }}
                </td>
                <td
                  v-if="groupTableColumns.includes('tolerance')"
                  class="whitespace-nowrap"
                >
                  {{ groupCellValue(group.tolerance) }}
                </td>
                <td
                  v-if="groupTableColumns.includes('filter')"
                  class="max-w-32 truncate"
                  :title="group.filter"
                >
                  {{ groupCellValue(group.filter) }}
                </td>
                <td
                  v-if="groupTableColumns.includes('excludeFilter')"
                  class="max-w-32 truncate"
                  :title="group['exclude-filter']"
                >
                  {{ groupCellValue(group['exclude-filter']) }}
                </td>
                <td class="pinned-td sticky right-0 z-10 text-right whitespace-nowrap">
                  <button
                    v-if="!isProtectedGroup(group.name)"
                    type="button"
                    class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0"
                    :title="$t('edit')"
                    @click="openEditGroup(group)"
                  >
                    <PencilIcon class="h-3.5 w-3.5" />
                  </button>
                  <button
                    v-if="!isProtectedGroup(group.name)"
                    type="button"
                    class="btn btn-ghost btn-xs text-error h-6 min-h-6 w-6 p-0"
                    :title="$t('proxyGroupEditorDeleteGroup')"
                    @click="deleteRealGroup(group)"
                  >
                    <TrashIcon class="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- 代理组 编辑/新建 弹窗 -->
      <ProxyGroupEditor
        v-model="groupEditorOpen"
        :member-options="groupMemberOptions"
        :initial="editingGroup ?? undefined"
        @save="saveRealGroup"
      />
      <!-- 节点池 编辑/新建 弹窗（已移除，改用 ProxyGroupEditor） -->
      <DialogWrapper
        v-model="nodeDisplaySettingsOpen"
        :title="$t('displaySettings')"
        box-class="max-w-lg"
      >
        <div class="flex flex-col gap-3 text-sm">
          <div class="settings-grid">
            <div class="setting-item">
              <div class="setting-item-label shrink-0!">{{ $t('displayStyle') }}</div>
              <SelectInput
                v-model="nodeViewMode"
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
                    <span class="badge badge-ghost badge-sm">{{ nodeTableColumns.length }}</span>
                  </div>
                  <Draggable
                    class="bg-base-200 flex min-h-24 flex-col gap-2 rounded-lg p-2"
                    v-model="nodeTableColumns"
                    group="node-list"
                    :animation="150"
                    ghost-class="ghost"
                    :item-key="(id: string) => id"
                  >
                    <template #item="{ element }">
                      <div
                        class="btn btn-sm bg-base-100 flex-nowrap justify-between gap-1 shadow-sm"
                        :title="getNodeColumnLabel(element)"
                      >
                        <Bars2Icon class="h-4 w-4 shrink-0 cursor-move opacity-40" />
                        <span class="truncate">{{ getNodeColumnLabel(element) }}</span>
                        <button
                          class="opacity-50 transition-opacity hover:opacity-100"
                          @click.stop="removeNodeColumn(element)"
                        >
                          <XMarkIcon class="h-4 w-4 shrink-0" />
                        </button>
                      </div>
                    </template>
                    <template #footer>
                      <div
                        v-if="!nodeTableColumns.length"
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
                    <span class="badge badge-ghost badge-sm">{{ restOfNodeColumns.length }}</span>
                  </div>
                  <Draggable
                    class="border-base-300 flex min-h-24 flex-col gap-2 rounded-lg border border-dashed p-2"
                    v-model="restOfNodeColumns"
                    group="node-list"
                    :animation="150"
                    ghost-class="ghost"
                    :item-key="(id: string) => id"
                  >
                    <template #item="{ element }">
                      <button
                        class="btn btn-sm btn-ghost border-base-300/60 flex-nowrap justify-between gap-1"
                        :title="getNodeColumnLabel(element)"
                        @click="addNodeColumn(element)"
                      >
                        <span class="truncate">{{ getNodeColumnLabel(element) }}</span>
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
      <DialogWrapper
        v-model="groupDisplaySettingsOpen"
        :title="$t('displaySettings')"
        box-class="max-w-lg"
      >
        <div class="flex flex-col gap-3 text-sm">
          <div class="settings-grid">
            <div class="setting-item">
              <div class="setting-item-label shrink-0!">{{ $t('displayStyle') }}</div>
              <SelectInput
                v-model="groupViewMode"
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
                    <span class="badge badge-ghost badge-sm">{{ groupTableColumns.length }}</span>
                  </div>
                  <Draggable
                    class="bg-base-200 flex min-h-24 flex-col gap-2 rounded-lg p-2"
                    v-model="groupTableColumns"
                    group="group-list"
                    :animation="150"
                    ghost-class="ghost"
                    :item-key="(id: string) => id"
                  >
                    <template #item="{ element }">
                      <div
                        class="btn btn-sm bg-base-100 flex-nowrap justify-between gap-1 shadow-sm"
                        :title="getGroupColumnLabel(element)"
                      >
                        <Bars2Icon class="h-4 w-4 shrink-0 cursor-move opacity-40" />
                        <span class="truncate">{{ getGroupColumnLabel(element) }}</span>
                        <button
                          class="opacity-50 transition-opacity hover:opacity-100"
                          @click.stop="removeGroupColumn(element)"
                        >
                          <XMarkIcon class="h-4 w-4 shrink-0" />
                        </button>
                      </div>
                    </template>
                    <template #footer>
                      <div
                        v-if="!groupTableColumns.length"
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
                    <span class="badge badge-ghost badge-sm">{{ restOfGroupColumns.length }}</span>
                  </div>
                  <Draggable
                    class="border-base-300 flex min-h-24 flex-col gap-2 rounded-lg border border-dashed p-2"
                    v-model="restOfGroupColumns"
                    group="group-list"
                    :animation="150"
                    ghost-class="ghost"
                    :item-key="(id: string) => id"
                  >
                    <template #item="{ element }">
                      <button
                        class="btn btn-sm btn-ghost border-base-300/60 flex-nowrap justify-between gap-1"
                        :title="getGroupColumnLabel(element)"
                        @click="addGroupColumn(element)"
                      >
                        <span class="truncate">{{ getGroupColumnLabel(element) }}</span>
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

      <!-- 节点 编辑/新建 弹窗：与连接/日志配置弹窗同款 DialogWrapper -->
      <DialogWrapper
        v-model="nodeDialogOpen"
        :title="editingNodeId ? $t('nodeEditTitle') : $t('nodeAddTitle')"
        :box-class="'max-w-xl'"
        :show-close-button="false"
      >
        <template #title-right>
          <SegmentedControl
            :model-value="nodeInputMode"
            :options="nodeInputModeOptions"
            @update:model-value="switchNodeInputMode($event as 'form' | 'yaml')"
          />
        </template>
        <!-- 内容区随 DialogWrapper content-box 滚动（与节点/连接/日志配置弹窗一致） -->
        <div
          v-if="nodeInputMode === 'yaml'"
          class="flex min-h-[420px] flex-col"
        >
          <textarea
            v-model="nodeYaml"
            class="textarea textarea-bordered border-base-300 bg-base-100 h-[420px] w-full resize-none font-mono text-xs"
            spellcheck="false"
          ></textarea>
        </div>
        <div
          v-else
          class="settings-grid node-form-grid"
        >
          <div class="setting-item node-span-2">
            <div class="setting-item-label shrink-0!">{{ $t('nodeName') }}</div>
            <input
              v-model="nodeForm.name"
              type="text"
              class="input input-sm node-long-input"
              :placeholder="$t('nodeNamePlaceholder')"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('nodeType') }}</div>
            <SelectInput
              v-model="nodeForm.type"
              class="select select-sm min-w-24"
              :options="NODE_TYPES.map((t) => ({ value: t, label: t }))"
            />
          </div>
          <div class="setting-item">
            <div class="setting-item-label shrink-0!">{{ $t('nodePort') }}</div>
            <!-- 留空 = 使用默认端口（灰字占位），保存时回落到 443 -->
            <input
              v-model.number="nodeForm.port"
              type="number"
              min="1"
              max="65535"
              class="input input-sm w-24"
              :placeholder="String(NODE_DEFAULTS.port)"
            />
          </div>
          <div class="setting-item node-span-2">
            <div class="setting-item-label shrink-0!">{{ $t('nodeServer') }}</div>
            <!-- 连接地址框：尾部 X 一键清空 -->
            <TextInput
              v-model="nodeForm.server"
              clearable
              placeholder="1.2.3.4"
              class="node-long-input"
            />
          </div>
          <div
            v-if="hasNodeField('cipher')"
            class="setting-item node-span-2"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeCipher') }}</div>
            <input
              v-model="nodeForm.cipher"
              type="text"
              class="input input-sm node-long-input"
              placeholder="chacha20-poly1305"
            />
          </div>
          <div
            v-if="hasNodeField('password')"
            class="setting-item node-span-2"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodePassword') }}</div>
            <input
              v-model="nodeForm.password"
              type="text"
              class="input input-sm node-long-input"
            />
          </div>
          <div
            v-if="hasNodeField('sni')"
            class="setting-item node-span-2"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeSni') }}</div>
            <input
              v-model="nodeForm.sni"
              type="text"
              class="input input-sm node-long-input"
              placeholder="example.com"
            />
          </div>
          <div
            v-if="hasNodeField('wsPath')"
            class="setting-item node-span-2"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeWsPath') }}</div>
            <input
              v-model="nodeForm.wsPath"
              type="text"
              class="input input-sm node-long-input"
              placeholder="/ws"
            />
          </div>
          <div
            v-if="hasNodeField('grpcServiceName')"
            class="setting-item node-span-2"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeGrpcServiceName') }}</div>
            <input
              v-model="nodeForm.grpcServiceName"
              type="text"
              class="input input-sm node-long-input"
            />
          </div>
          <div
            v-if="hasNodeField('alpn')"
            class="setting-item node-span-2"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeAlpn') }}</div>
            <input
              v-model="nodeForm.alpnStr"
              type="text"
              class="input input-sm node-long-input"
              placeholder="h2,http/1.1"
            />
          </div>
          <!-- 短控件集中在尾部成对排布，落单项只会出现在表单末尾 -->
          <div
            v-if="hasNodeField('alterId')"
            class="setting-item"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeAlterId') }}</div>
            <!-- 留空 = 默认 0 -->
            <input
              v-model.number="nodeForm.alterId"
              type="number"
              min="0"
              class="input input-sm w-24"
              :placeholder="String(NODE_DEFAULTS.alterId)"
            />
          </div>
          <div
            v-if="hasNodeField('tls')"
            class="setting-item"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeTlsEnabled') }}</div>
            <input
              v-model="nodeForm.tls"
              type="checkbox"
              class="toggle"
            />
          </div>
          <div
            v-if="hasNodeField('fingerprint')"
            class="setting-item"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeFingerprint') }}</div>
            <SelectInput
              v-model="nodeForm.fingerprint"
              class="select select-sm min-w-24"
              :placeholder="$t('nodeFingerprint')"
              :options="[
                { value: '', label: $t('nodeFingerprint') },
                { value: 'chrome', label: 'chrome' },
                { value: 'firefox', label: 'firefox' },
                { value: 'safari', label: 'safari' },
                { value: 'ios', label: 'ios' },
                { value: 'android', label: 'android' },
                { value: 'edge', label: 'edge' },
                { value: 'random', label: 'random' },
              ]"
            />
          </div>
          <div
            v-if="hasNodeField('skipCert')"
            class="setting-item"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeSkipCert') }}</div>
            <input
              v-model="nodeForm.skipCertVerification"
              type="checkbox"
              class="toggle"
            />
          </div>
          <div
            v-if="hasNodeField('tfo')"
            class="setting-item"
          >
            <div class="setting-item-label shrink-0!">{{ $t('nodeTfo') }}</div>
            <input
              v-model="nodeForm.tfo"
              type="checkbox"
              class="toggle"
            />
          </div>
        </div>
        <!-- 操作行 -->
        <div class="border-base-300/60 flex items-center justify-end gap-2 border-t p-4 pt-3">
          <button
            type="button"
            class="btn btn-sm btn-ghost"
            @click="closeNodeDialog"
          >
            {{ $t('cancel') }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-primary"
            :disabled="
              nodeInputMode === 'yaml'
                ? !nodeYaml.trim()
                : !nodeForm.name.trim() || !nodeForm.server.trim()
            "
            @click="saveNode"
          >
            {{ $t('save') }}
          </button>
        </div>
      </DialogWrapper>
    </div>
  </div>
</template>

<style scoped>
.ghost {
  opacity: 0.4;
}
</style>

<script setup lang="ts">
const props = withDefaults(defineProps<{ view?: 'groups' | 'nodes' }>(), { view: 'groups' })
import { usePaddingForViews } from '@/composables/paddingViews'
import { handlerProxySelect } from '@/assembly/proxies'
import { confirmDanger } from '@/helper/confirmDialog'
import { showNotification } from '@/helper/notification'
import {
  addNode,
  addNodePool,
  nodePools,
  removeNode,
  removeNodes,
  updateNode,
  buildMergedNodeList,
} from '@/store/nodePool'
import type { CustomNode, NodePool } from '@/store/nodePool'
import { getColorForLatency } from '@/helper'
import { useColumnPicker } from '@/composables/useColumnPicker'
import { useLatency } from '@/composables/useLatency'
import {
  Bars2Icon,
  BoltIcon,
  CheckIcon,
  PencilIcon,
  PlusIcon,
  Squares2X2Icon,
  TableCellsIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import Draggable from 'vuedraggable'
import NodePageHeader from '@/components/proxies/NodePageHeader.vue'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import SegmentedControl, { type SegmentOption } from '@/components/common/SegmentedControl.vue'
import SelectInput from '@/components/common/SelectInput.vue'
import TextInput from '@/components/common/TextInput.vue'
import ProxyGroupEditor from '@/components/proxies/ProxyGroupEditor.vue'
import { computed, nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  groupTableColumns,
  groupViewMode,
  nodeTableColumns,
  nodeViewMode,
} from '@/store/nodePoolDisplay'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import {
  isProtectedGroup,
  normalizeGroupType,
  proxyGroups,
  removeProxyGroup,
  resolveGroupMembers,
  setProxyGroupDefaultSelected,
  upsertProxyGroup,
} from '@/store/proxyGroups'
import type { ProxyGroupDraft, ProxyGroupMemberOption } from '@/types'

const { t } = useI18n()
const { padding } = usePaddingForViews({ offsetTop: 0, offsetBottom: 0 })
const { latencyMap, isTesting, isNodeTesting, testNodeLatency } = useLatency()

const NODE_TYPES = ['vmess', 'vless', 'trojan', 'hysteria2', 'shadowsocks', 'ss', 'ssr'] as const

// 各协议在弹窗表单中显示的可选字段（核心字段 名称/类型/服务器/端口 恒显示）
type NodeFieldKey =
  | 'cipher'
  | 'password'
  | 'alterId'
  | 'sni'
  | 'tls'
  | 'fingerprint'
  | 'wsPath'
  | 'grpcServiceName'
  | 'alpn'
  | 'tfo'
  | 'skipCert'
const NODE_TYPE_FIELDS: Record<string, NodeFieldKey[]> = {
  vmess: [
    'cipher',
    'password',
    'alterId',
    'sni',
    'tls',
    'fingerprint',
    'wsPath',
    'alpn',
    'tfo',
    'skipCert',
  ],
  vless: ['password', 'sni', 'tls', 'fingerprint', 'wsPath', 'grpcServiceName', 'alpn', 'skipCert'],
  trojan: [
    'password',
    'sni',
    'tls',
    'fingerprint',
    'wsPath',
    'grpcServiceName',
    'alpn',
    'skipCert',
  ],
  hysteria2: ['password', 'sni', 'alpn', 'skipCert'],
  shadowsocks: ['cipher', 'password'],
  ss: ['cipher', 'password'],
  ssr: ['cipher', 'password', 'sni'],
}
const hasNodeField = (key: NodeFieldKey) =>
  NODE_TYPE_FIELDS[nodeForm.value.type]?.includes(key) ?? false

// 切换节点类型时，清理该类型不支持的字段，避免残留值被写入
const pruneNodeFormForType = () => {
  const allowed = NODE_TYPE_FIELDS[nodeForm.value.type] ?? []
  const f = nodeForm.value
  if (!allowed.includes('cipher')) f.cipher = ''
  if (!allowed.includes('password')) f.password = ''
  if (!allowed.includes('alterId')) f.alterId = undefined
  if (!allowed.includes('sni')) f.sni = ''
  if (!allowed.includes('tls')) f.tls = false
  if (!allowed.includes('fingerprint')) f.fingerprint = ''
  if (!allowed.includes('wsPath')) f.wsPath = ''
  if (!allowed.includes('grpcServiceName')) f.grpcServiceName = ''
  if (!allowed.includes('alpn')) f.alpnStr = ''
  if (!allowed.includes('tfo')) f.tfo = false
  if (!allowed.includes('skipCert')) f.skipCertVerification = false
}

const pools = computed(() => nodePools.value)
const nodePoolsLoading = computed(() => !!(nodePools as unknown as { loading?: boolean }).loading)
const poolSearch = ref('')

// 代理组草稿保存在面板数据库，应用配置时再由配置应用流程生成核心 YAML。

const realGroups = computed(() => proxyGroups.value)

// 代理组编辑弹窗
const groupEditorOpen = ref(false)
const editingGroup = ref<ProxyGroupDraft | null>(null)

const openCreateGroup = () => {
  editingGroup.value = null
  groupEditorOpen.value = true
}

const openEditGroup = (g: ProxyGroupDraft) => {
  editingGroup.value = g
  groupEditorOpen.value = true
}

const closeGroupEditor = () => {
  groupEditorOpen.value = false
  editingGroup.value = null
}

const saveRealGroup = async (payload: ProxyGroupDraft) => {
  const originalName = editingGroup.value?.name
  upsertProxyGroup({ ...payload, type: normalizeGroupType(payload.type) }, originalName)
  closeGroupEditor()
  showNotification({ content: 'proxyGroupEditorApplied', type: 'alert-success' })
}

const deleteRealGroup = async (g: ProxyGroupDraft) => {
  if (isProtectedGroup(g.name)) return
  await confirmDanger(t('proxyGroupEditorDeleteConfirm', { name: g.name }), () => {
    removeProxyGroup(g.name)
    showNotification({ content: 'proxyGroupEditorDeleteApplied', type: 'alert-success' })
  })
}

// 过滤后的真实代理组(供 groups 视图渲染)
const visibleRealGroups = computed(() => {
  const keyword = poolSearch.value.trim().toLowerCase()
  if (!keyword) return realGroups.value
  return realGroups.value.filter((g) => g.name.toLowerCase().includes(keyword))
})

// 每个组的成员过滤关键字(用 ref 对象避免直接 v-model 到 computed)
const groupMemberSearchMap = reactive<Record<string, string>>({})
const filterGroupMembers = (group: ProxyGroupDraft): string[] => {
  const members = resolveGroupMembers(
    group,
    allNodes.value.map((node) => node.name),
  )
  const keyword = (groupMemberSearchMap[group.name] || '').trim().toLowerCase()
  if (!keyword) return members
  return members.filter((m) => m.toLowerCase().includes(keyword))
}

// 卡片成员折叠：收起时容器限高两行，实测溢出才显示「展开全部」
const groupExpandedMap = reactive<Record<string, boolean>>({})
const groupMembersOverflowMap = reactive<Record<string, boolean>>({})
const memberObservers = new Map<string, ResizeObserver>()
const measureGroupMembers = (name: string, el: unknown) => {
  const div = el as HTMLElement | null
  if (!div) {
    memberObservers.get(name)?.disconnect()
    memberObservers.delete(name)
    return
  }
  const check = () => {
    const overflow = div.scrollHeight > div.clientHeight + 1
    if (groupMembersOverflowMap[name] !== overflow) {
      groupMembersOverflowMap[name] = overflow
    }
  }
  // 页面过渡 out-in 挂载时元素可能还没布局（高度全 0），一次性测量会永远拿到 false；
  // ResizeObserver 在元素真正获得尺寸后再测，卸载（el 变 null）时断开
  memberObservers.get(name)?.disconnect()
  const observer = new ResizeObserver(check)
  observer.observe(div)
  memberObservers.set(name, observer)
  void nextTick(check)
}
onUnmounted(() => {
  for (const observer of memberObservers.values()) observer.disconnect()
  memberObservers.clear()
})

// 分组类型标签
const groupTypeLabel = (type: string) => {
  switch (normalizeGroupType(type)) {
    case 'select':
      return t('proxyGroupEditorGroupTypeSelect')
    case 'url-test':
      return t('proxyGroupEditorGroupTypeUrlTest')
    case 'fallback':
      return t('proxyGroupEditorGroupTypeFallback')
    case 'load-balance':
      return t('proxyGroupEditorGroupTypeLoadBalance')
    default:
      return type
  }
}

// 成员来源：节点 / 其他代理组 / 已失效（引用名不存在）
const memberKind = (name: string): 'node' | 'group' | 'missing' => {
  if (nodeNameSet.value.has(name)) return 'node'
  if (realGroups.value.some((group) => group.name === name)) return 'group'
  return 'missing'
}
const nodeNameSet = computed(() => new Set(allNodes.value.map((node) => node.name)))
const isSelectableGroup = (group: ProxyGroupDraft) => normalizeGroupType(group.type) === 'select'
// 选择组的「当前节点」是运行时状态：组已经在内核里就跑 PUT /proxies/{组}，流量立刻改道；
// 只有组还没下发过（内核里查不到）时才退回到「记进草稿，等下次下发」。
const applyGroupSelection = async (group: ProxyGroupDraft, member: string | undefined) => {
  setProxyGroupDefaultSelected(group.name, member)
  if (!member) {
    showNotification({ content: 'proxyGroupEditorDeselectedMember', type: 'alert-success' })
    return
  }
  const live = await handlerProxySelect(group.name, member)
  showNotification({
    content: live ? 'proxyGroupEditorSelectedLive' : 'proxyGroupEditorSelectedDraft',
    params: { name: member },
    type: live ? 'alert-success' : 'alert-info',
  })
}
const selectGroupMember = (group: ProxyGroupDraft, member: string) => {
  if (!isSelectableGroup(group) || memberKind(member) === 'missing') return
  void applyGroupSelection(group, group['default-selected'] === member ? undefined : member)
}
// 表格成员数/当前选择下拉：筛选条件展开后与显式成员合并计数
const groupMemberTotal = (group: ProxyGroupDraft) =>
  resolveGroupMembers(group, [...nodeNameSet.value]).length
/**
 * 可选字段的单元格：没配过就是破折号。健康检查组那几项（测速地址/间隔/超时）由编辑器
 * 在保存时按类型补齐或置空，所以这里不用再判类型。
 */
const groupCellValue = (value: string | number | undefined) =>
  value === undefined || value === '' ? '—' : String(value)
const selectedMemberOptions = (group: ProxyGroupDraft) => [
  { value: '', label: '--' },
  ...resolveGroupMembers(group, [...nodeNameSet.value]).map((name) => ({
    value: name,
    label: name,
  })),
]
const setGroupSelected = (group: ProxyGroupDraft, member: string) => {
  if (member === (group['default-selected'] ?? '')) return
  void applyGroupSelection(group, member || undefined)
}
const memberChipClass = (group: ProxyGroupDraft, member: string) => {
  if (memberKind(member) === 'missing') return 'bg-base-100/70 text-error cursor-not-allowed'
  if (!isSelectableGroup(group)) return 'bg-base-100/70'
  if (group['default-selected'] === member)
    return 'bg-primary/15 text-primary ring-primary/40 ring-1 hover:bg-primary/25'
  return 'bg-base-100/70 hover:bg-base-100 cursor-pointer'
}
const memberTitle = (group: ProxyGroupDraft, member: string) => {
  const kind = memberKind(member)
  const kindLabel =
    kind === 'group'
      ? t('memberKindGroup')
      : kind === 'node'
        ? t('memberKindNode')
        : t('memberKindMissing')
  if (kind === 'missing') return kindLabel
  if (isSelectableGroup(group)) {
    return group['default-selected'] === member
      ? t('proxyGroupEditorClickToDeselect')
      : t('proxyGroupEditorClickToSelect')
  }
  return kindLabel
}
const groupMemberOptions = computed<ProxyGroupMemberOption[]>(() => {
  const options: ProxyGroupMemberOption[] = [...nodeNameSet.value].map((name) => ({
    name,
    kind: 'node' as const,
  }))
  for (const group of realGroups.value) {
    if (!nodeNameSet.value.has(group.name)) options.push({ name: group.name, kind: 'group' })
  }
  return options
})
const nodeSearch = ref('')
const allNodes = computed(() => buildMergedNodeList())
const nodeDisplaySettingsOpen = ref(false)
const groupDisplaySettingsOpen = ref(false)
const nodeTableColumnOptions = [
  { key: 'type', label: t('nodeType') },
  { key: 'server', label: t('nodeServer') },
  { key: 'port', label: t('nodePort') },
  { key: 'cipher', label: t('nodeCipher') },
  { key: 'sni', label: t('nodeSni') },
  { key: 'latency', label: t('nodeLatency') },
]

const {
  available: restOfNodeColumns,
  labelOf: getNodeColumnLabel,
  add: addNodeColumn,
  remove: removeNodeColumn,
} = useColumnPicker(nodeTableColumns, nodeTableColumnOptions)

const groupTableColumnOptions = [
  { key: 'type', label: t('proxyGroupEditorGroupType') },
  { key: 'members', label: t('proxyGroupEditorMembers') },
  { key: 'currentSelected', label: t('proxyGroupEditorCurrentSelected') },
  { key: 'url', label: t('proxyGroupEditorUrl') },
  { key: 'interval', label: t('proxyGroupEditorInterval') },
  { key: 'timeout', label: t('proxyGroupEditorTimeout') },
  { key: 'tolerance', label: t('proxyGroupEditorTolerance') },
  { key: 'filter', label: t('proxyGroupEditorFilter') },
  { key: 'excludeFilter', label: t('proxyGroupEditorExcludeFilter') },
]
const {
  available: restOfGroupColumns,
  labelOf: getGroupColumnLabel,
  add: addGroupColumn,
  remove: removeGroupColumn,
} = useColumnPicker(groupTableColumns, groupTableColumnOptions)
const filteredNodes = computed(() => {
  const keyword = nodeSearch.value.trim().toLowerCase()
  if (!keyword) return allNodes.value
  return allNodes.value.filter((node) =>
    [node.name, node.server, node.type].some((value) => value.toLowerCase().includes(keyword)),
  )
})

// ── 批量选择 / 批量删除 ─────────────────────────────────────────
const selectedNodeIds = ref<Set<string>>(new Set())
const toggleNodeSelection = (id: string) => {
  const next = new Set(selectedNodeIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedNodeIds.value = next
}
const allFilteredSelected = computed(
  () =>
    filteredNodes.value.length > 0 &&
    filteredNodes.value.every((node) => selectedNodeIds.value.has(node.id)),
)
const someFilteredSelected = computed(() =>
  filteredNodes.value.some((node) => selectedNodeIds.value.has(node.id)),
)
const toggleSelectAllFiltered = () => {
  selectedNodeIds.value = allFilteredSelected.value
    ? new Set()
    : new Set(filteredNodes.value.map((node) => node.id))
}
const bulkDeleteSelectedNodes = async () => {
  const count = selectedNodeIds.value.size
  if (!count) return
  await confirmDanger(t('nodeBulkDeleteConfirm', { count: String(count) }), () => {
    for (const pool of pools.value) {
      const nodeIds = pool.nodes
        .filter((node) => selectedNodeIds.value.has(node.id))
        .map((node) => node.id)
      if (nodeIds.length) removeNodes(pool.id, nodeIds)
    }
    selectedNodeIds.value = new Set()
    showNotification({
      content: 'nodesDeleteSuccess',
      params: { count: String(count) },
      type: 'alert-success',
    })
  })
}

// ── 延迟显示：null/0 显灰色 —，有值按设置的阈值配色 ──────────────
const latencyDisplayText = (name: string) => {
  const value = latencyMap.value[name]
  return value ? `${value}ms` : '—'
}
const latencyDisplayClass = (name: string) => {
  const value = latencyMap.value[name]
  return value ? getColorForLatency(value) : 'text-base-content/60'
}

const openCreateNodeFromHeader = () => {
  const pool =
    pools.value[0] ||
    addNodePool({
      name: t('nodePoolName'),
      enabled: true,
      dedupe: true,
      nodes: [],
    })
  openCreateNodeDialog(pool)
}

const editStandaloneNode = (node: CustomNode) => {
  const pool = pools.value.find((item) => item.nodes.some((candidate) => candidate.id === node.id))
  if (pool) openEditNodeDialog(pool, node)
}

const removeStandaloneNode = (node: CustomNode) => {
  const pool = pools.value.find((item) => item.nodes.some((candidate) => candidate.id === node.id))
  if (pool) void removeNodeById(pool.id, node.id)
}

// ── 节点 弹窗 ───────────────────────────────────────────────────
const nodeDialogOpen = ref(false)
const activePoolId = ref<string | null>(null)
const editingNodeId = ref<string | null>(null)

// 表单留空的默认值：以灰色 placeholder 展示，保存/生成 YAML 时回落
const NODE_DEFAULTS = { port: 443, alterId: 0 }

type NodeFormData = Omit<CustomNode, 'id' | 'port'> & { port?: number; alpnStr: string }

const emptyNodeForm = (): NodeFormData => ({
  name: '',
  type: 'vmess',
  server: '',
  cipher: '',
  password: '',
  alterId: undefined,
  sni: '',
  tls: false,
  fingerprint: '',
  alpnStr: '',
  wsPath: '',
  grpcServiceName: '',
  tfo: false,
  skipCertVerification: false,
})

const nodeInputModeOptions = computed<SegmentOption[]>(() => [
  { value: 'form', label: t('formMode') },
  { value: 'yaml', label: t('dualModeYaml') },
])
const nodeForm = ref<NodeFormData>(emptyNodeForm())
const nodeInputMode = ref<'form' | 'yaml'>('form')
const nodeYaml = ref('')

// 切换节点类型时，清理该类型不支持的字段，避免残留值被写入
watch(() => nodeForm.value.type, pruneNodeFormForType)

const openCreateNodeDialog = (pool: NodePool) => {
  activePoolId.value = pool.id
  editingNodeId.value = null
  nodeForm.value = emptyNodeForm()
  nodeInputMode.value = 'form'
  nodeYaml.value = ''
  nodeDialogOpen.value = true
}

const openEditNodeDialog = (pool: NodePool, node: CustomNode) => {
  activePoolId.value = pool.id
  editingNodeId.value = node.id
  nodeForm.value = {
    name: node.name,
    type: node.type,
    server: node.server,
    // 与默认值相同的字段回填为空，让灰字占位代替，用户填写即覆盖
    port: node.port === NODE_DEFAULTS.port ? undefined : node.port,
    cipher: node.cipher ?? '',
    password: node.password ?? '',
    alterId: node.alterId || undefined,
    sni: node.sni ?? '',
    tls: node.tls ?? false,
    fingerprint: node.fingerprint ?? '',
    alpnStr: (node.alpn ?? []).join(','),
    wsPath: node.wsPath ?? '',
    grpcServiceName: node.grpcServiceName ?? '',
    tfo: node.tfo ?? false,
    skipCertVerification: node.skipCertVerification ?? false,
  }
  nodeInputMode.value = 'form'
  // 预生成 YAML，切到 YAML 标签即可见当前节点数据（可选空字段不输出）
  nodeYaml.value = stringifyYaml(pruneEmptyNodeForm(nodeForm.value), { indent: 2 })
  nodeDialogOpen.value = true
}

// 剔除未填写的可选字段，YAML 中就不输出这些键（而不是输出空值）
const pruneEmptyNodeForm = (form: NodeFormData): Record<string, unknown> => {
  const out: Record<string, unknown> = { ...form }
  out.port = form.port || NODE_DEFAULTS.port
  delete out.alpnStr
  for (const key of [
    'cipher',
    'password',
    'sni',
    'fingerprint',
    'wsPath',
    'grpcServiceName',
  ] as const) {
    if (!out[key]) delete out[key]
  }
  if (!(out.alpn as unknown[] | undefined)?.length) delete out.alpn
  if (!out.alterId) delete out.alterId
  if (!out.tls) delete out.tls
  if (!out.tfo) delete out.tfo
  if (!out.skipCertVerification) delete out.skipCertVerification
  return out
}

const switchNodeInputMode = (mode: 'form' | 'yaml') => {
  if (mode === 'yaml') {
    nodeYaml.value = stringifyYaml(pruneEmptyNodeForm(nodeForm.value), { indent: 2 })
  } else {
    try {
      const parsed = parseYaml(nodeYaml.value) as Partial<NodeFormData>
      nodeForm.value = {
        ...emptyNodeForm(),
        ...parsed,
        alpnStr: Array.isArray(parsed.alpn) ? parsed.alpn.join(',') : (parsed.alpnStr ?? ''),
      }
    } catch {
      showNotification({ content: 'invalidURL', type: 'alert-error' })
      return
    }
  }
  nodeInputMode.value = mode
}

const closeNodeDialog = () => {
  nodeDialogOpen.value = false
}

const saveNode = () => {
  if (!activePoolId.value) return
  if (nodeInputMode.value === 'yaml') {
    try {
      const parsed = parseYaml(nodeYaml.value) as Partial<NodeFormData>
      nodeForm.value = {
        ...emptyNodeForm(),
        ...parsed,
        alpnStr: Array.isArray(parsed.alpn) ? parsed.alpn.join(',') : (parsed.alpnStr ?? ''),
      }
    } catch {
      showNotification({ content: 'invalidURL', type: 'alert-error' })
      return
    }
  }
  const { alpnStr, ...rest } = nodeForm.value
  // 可选字段留空则不写入（undefined 在序列化/合并时会被忽略）
  const patch: Omit<CustomNode, 'id'> = {
    name: rest.name.trim(),
    type: rest.type,
    server: rest.server.trim(),
    port: rest.port || NODE_DEFAULTS.port,
    ...(rest.cipher ? { cipher: rest.cipher } : {}),
    ...(rest.password ? { password: rest.password } : {}),
    ...(rest.type === 'vmess' && rest.alterId ? { alterId: rest.alterId } : {}),
    ...(rest.sni ? { sni: rest.sni } : {}),
    ...(rest.tls ? { tls: true } : {}),
    ...(rest.fingerprint ? { fingerprint: rest.fingerprint } : {}),
    ...(alpnStr
      ? {
          alpn: alpnStr
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }
      : {}),
    ...(rest.wsPath ? { wsPath: rest.wsPath } : {}),
    ...(rest.grpcServiceName ? { grpcServiceName: rest.grpcServiceName } : {}),
    ...(rest.tfo ? { tfo: true } : {}),
    ...(rest.skipCertVerification ? { skipCertVerification: true } : {}),
  }
  if (editingNodeId.value) {
    updateNode(activePoolId.value, editingNodeId.value, patch)
  } else {
    addNode(activePoolId.value, patch)
  }
  showNotification({ content: 'nodeSaveSuccess', type: 'alert-success' })
  closeNodeDialog()
}

const removeNodeById = (poolId: string, nodeId: string) =>
  confirmDanger(t('nodeDeleteConfirm'), () => {
    removeNode(poolId, nodeId)
    const next = new Set(selectedNodeIds.value)
    next.delete(nodeId)
    selectedNodeIds.value = next
    showNotification({ content: 'nodeDeleteSuccess', type: 'alert-success' })
  })

// ── 延迟测试 ─────────────────────────────────────────────────────
const testNode = async (nodeName: string) => {
  await testNodeLatency(nodeName)
}

// 批量并发测速：各节点独立进行，互不阻塞
const testNodesConcurrently = (names: Iterable<string>) => {
  void Promise.allSettled([...names].map((name) => testNodeLatency(name)))
}

const testAllStandaloneNodes = () => {
  const targets = selectedNodeIds.value.size
    ? filteredNodes.value.filter((node) => selectedNodeIds.value.has(node.id))
    : filteredNodes.value
  testNodesConcurrently(targets.map((node) => node.name))
}

// 代理组里可测速的节点成员（排除子代理组/失效名）
const groupNodeMembers = (group: ProxyGroupDraft): string[] =>
  resolveGroupMembers(group, [...nodeNameSet.value]).filter((name) => nodeNameSet.value.has(name))

const testGroupNodes = (group: ProxyGroupDraft) => {
  testNodesConcurrently(groupNodeMembers(group))
}

const testAllGroupNodes = () => {
  const names = new Set<string>()
  for (const group of visibleRealGroups.value) {
    for (const name of groupNodeMembers(group)) names.add(name)
  }
  testNodesConcurrently(names)
}
</script>

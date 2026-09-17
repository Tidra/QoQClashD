<template>
  <div class="flex h-full min-w-0 w-full flex-1 flex-col overflow-auto" :style="padding">
    <NodePageHeader>
      <template #search>
        <TextInput
          v-if="props.view === 'nodes'"
          v-model="nodeSearch"
          :placeholder="`${$t('search')} | Regex`"
          clearable
          class="w-32 max-w-80 flex-1"
        />
        <TextInput
          v-else
          v-model="poolSearch"
          :placeholder="`${$t('search')} | Regex`"
          clearable
          class="w-32 max-w-80 flex-1"
        />
      </template>
      <template v-if="props.view === 'groups'">
        <button type="button" class="btn btn-circle btn-sm" :title="$t('displaySettings')" @click="groupDisplaySettingsOpen = true">
          <WrenchScrewdriverIcon class="h-4 w-4" />
        </button>
        <button type="button" class="btn btn-primary btn-sm" @click="openCreatePoolDialog">
          <PlusIcon class="h-4 w-4" />
          {{ $t('nodePoolAdd') }}
        </button>
      </template>
      <template v-else>
        <button type="button" class="btn btn-circle btn-sm" :title="$t('displaySettings')" @click="nodeDisplaySettingsOpen = true">
          <WrenchScrewdriverIcon class="h-4 w-4" />
        </button>
        <button type="button" class="btn btn-circle btn-sm" :title="nodeViewMode === 'card' ? $t('tableMode') : $t('cardMode')" @click="nodeViewMode = nodeViewMode === 'card' ? 'table' : 'card'">
          <TableCellsIcon v-if="nodeViewMode === 'card'" class="h-4 w-4" />
          <Squares2X2Icon v-else class="h-4 w-4" />
        </button>
        <button type="button" class="btn btn-circle btn-sm" :disabled="isTesting || !filteredNodes.length" :title="$t('nodeTestAll')" @click="testAllStandaloneNodes">
          <BoltIcon class="h-4 w-4" />
        </button>
        <button type="button" class="btn btn-primary btn-sm" @click="openCreateNodeFromHeader">
          <PlusIcon class="h-4 w-4" />
          <span class="hidden sm:inline">{{ $t('nodePoolAddNode') }}</span>
        </button>
      </template>
    </NodePageHeader>
    <div
      class="base-container m-3 min-h-0 flex-1"
      :class="((props.view === 'nodes' ? nodeViewMode : groupViewMode) === 'card') && 'p-3 md:p-4'"
    >
      <template v-if="props.view === 'nodes'">
        <div v-if="nodePoolsLoading" class="flex h-full items-center justify-center text-base-content/50">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div v-else-if="!allNodes.length" class="bg-base-100 border-base-300/60 rounded-xl border p-8 text-center">
          <div class="text-base-content/60 mb-2 text-sm">{{ $t('nodePoolEmpty') }}</div>
          <button type="button" class="btn btn-primary btn-sm" @click="openCreateNodeFromHeader">
            <PlusIcon class="h-4 w-4" /> {{ $t('nodePoolAddNode') }}
          </button>
        </div>
        <div v-else-if="nodeViewMode === 'card'" class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
          <div v-for="node in filteredNodes" :key="node.id" class="bg-base-200 hover:bg-base-300/50 relative flex flex-col items-start gap-2 rounded-md p-2 transition-colors hover:shadow-sm">
            <div class="flex min-w-0 items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate font-medium">{{ node.name }}</div>
                <div class="text-base-content/60 mt-1 truncate text-xs">{{ node.type }} · {{ node.server }}:{{ node.port }}</div>
              </div>
            </div>
            <div class="flex w-full items-center justify-between gap-2">
              <div class="relative z-10 flex shrink-0 gap-0.5">
                <button type="button" class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0" @click.stop="editStandaloneNode(node)"><PencilIcon class="h-3.5 w-3.5" /></button>
                <button type="button" class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0 text-error" @click.stop="removeStandaloneNode(node)"><TrashIcon class="h-3.5 w-3.5" /></button>
              </div>
              <button type="button" class="badge badge-ghost h-5 min-h-5 shrink-0 cursor-pointer px-1.5 text-[10px]" :disabled="isTesting" @click.stop="testNode(node.name)">
                <span v-if="latencyMap[node.name] !== undefined">{{ latencyMap[node.name] ?? '—' }}ms</span>
                <template v-else><BoltIcon class="h-3 w-3" /> {{ $t('nodeTestLatency') }}</template>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="table-glass min-h-full min-w-min overflow-x-auto pb-6">
            <table class="table table-sm">
            <thead class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!">
              <tr>
                <th>{{ $t('nodeName') }}</th>
                <th v-if="nodeTableColumns.includes('type')">{{ $t('nodeType') }}</th>
                <th v-if="nodeTableColumns.includes('server')">{{ $t('nodeServer') }}</th>
                <th v-if="nodeTableColumns.includes('port')">{{ $t('nodePort') }}</th>
                <th v-if="nodeTableColumns.includes('cipher')">{{ $t('nodeCipher') }}</th>
                <th v-if="nodeTableColumns.includes('sni')">{{ $t('nodeSni') }}</th>
                <th v-if="nodeTableColumns.includes('latency')">{{ $t('nodeLatency') }}</th>
                <th class="text-right">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredNodes.length">
                <td :colspan="nodeTableColumns.length + 2" class="text-base-content/50 h-90">
                  <div class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                    <BoltIcon class="h-10 w-10 opacity-60" />
                    <div class="text-base">{{ $t('nodePoolEmpty') }}</div>
                  </div>
                </td>
              </tr>
              <tr v-for="node in filteredNodes" :key="node.id" class="hover cursor-pointer" @click="editStandaloneNode(node)">
                <td>{{ node.name }}</td>
                <td v-if="nodeTableColumns.includes('type')">{{ node.type }}</td>
                <td v-if="nodeTableColumns.includes('server')">{{ node.server }}</td>
                <td v-if="nodeTableColumns.includes('port')">{{ node.port }}</td>
                <td v-if="nodeTableColumns.includes('cipher')">{{ node.cipher || '—' }}</td>
                <td v-if="nodeTableColumns.includes('sni')">{{ node.sni || '—' }}</td>
                <td v-if="nodeTableColumns.includes('latency')">{{ latencyMap[node.name] ?? '—' }}<span v-if="latencyMap[node.name] !== undefined">ms</span></td>
                <td class="text-right" @click.stop>
                  <button type="button" class="btn btn-ghost btn-xs" @click="editStandaloneNode(node)"><PencilIcon class="h-3.5 w-3.5" /></button>
                  <button type="button" class="btn btn-ghost btn-xs text-error" @click="removeStandaloneNode(node)"><TrashIcon class="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            </tbody>
            </table>
        </div>
      </template>
      <template v-else>
      <!-- 加载中 -->
      <div v-if="nodePoolsLoading" class="flex h-full items-center justify-center text-base-content/50">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <!-- 空状态 -->
      <div
        v-else-if="!pools.length"
        class="bg-base-100 border-base-300/60 rounded-xl border p-8 text-center"
      >
        <div class="text-base-content/60 mb-2 text-sm">{{ $t('nodePoolEmpty') }}</div>
        <button type="button" class="btn btn-primary btn-sm" @click="openCreatePoolDialog">
          <PlusIcon class="h-4 w-4" />
          {{ $t('nodePoolAdd') }}
        </button>
      </div>

      <!-- 节点池列表 -->
      <div v-else-if="groupViewMode === 'card'" class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div
          v-for="pool in visiblePools"
          :key="pool.id"
          class="bg-base-200 hover:bg-base-300/50 rounded-md p-3 transition-colors hover:shadow-sm"
        >
          <!-- 池标题 -->
          <div class="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="truncate text-base font-medium">{{ pool.name || $t('proxyGroup') }}</h2>
              <span class="badge" :class="pool.enabled ? 'badge-success' : 'badge-ghost'">
                {{ pool.enabled ? $t('activeLabel') : $t('offline') }}
              </span>
              <span class="badge badge-ghost text-xs">{{ pool.nodes.length }} {{ $t('nodePoolNodes') }}</span>
              <span v-if="pool.dedupe" class="badge badge-ghost text-xs">{{ $t('nodePoolDedupe') }}</span>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <button type="button" class="btn btn-ghost btn-sm" @click="togglePool(pool.id)">
                {{ pool.enabled ? $t('offline') : $t('online') }}
              </button>
              <button type="button" class="btn btn-ghost btn-sm" @click="openEditPoolDialog(pool)">
                <PencilIcon class="h-4 w-4" />
                {{ $t('edit') }}
              </button>
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                @click="removePoolById(pool.id)"
              >
                <TrashIcon class="h-4 w-4" />
                {{ $t('nodePoolRemove') }}
              </button>
            </div>
          </div>

          <!-- 节点搜索 -->
          <div class="mb-2 flex items-center gap-2">
            <input
              v-model="searchMap[pool.id]"
              type="text"
              class="input input-sm input-bordered flex-1"
              :placeholder="$t('nodeSearchPlaceholder')"
            />
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              :disabled="isTesting"
              @click="testPoolLatency(pool)"
            >
              <BoltIcon v-if="!isTesting" class="h-4 w-4" />
              <span v-else class="loading loading-spinner loading-xs"></span>
              {{ isTesting ? $t('latencyTesting') : $t('nodeTestAll') }}
            </button>
          </div>

          <!-- 节点列表 -->
          <div v-if="!getFilteredNodes(pool).length" class="text-base-content/60 py-2 text-sm">
            {{ $t('nodePoolEmpty') }}
          </div>
          <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
            <div
              v-for="node in getFilteredNodes(pool)"
              :key="node.id"
              class="bg-base-100/70 hover:bg-base-100 relative flex flex-col items-start gap-2 rounded-md p-2 transition-colors hover:shadow-sm"
            >
              <div class="min-w-0">
                <div class="truncate text-sm font-medium">{{ node.name }}</div>
                <div class="text-base-content/60 mt-1 truncate text-xs">{{ node.type }} · {{ node.server }}:{{ node.port }}</div>
              </div>
              <div class="flex w-full items-center justify-between gap-2">
                <div class="flex shrink-0 gap-0.5">
                  <button type="button" class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0" @click.stop="openEditNodeDialog(pool, node)">
                    <PencilIcon class="h-3.5 w-3.5" />
                  </button>
                  <button type="button" class="btn btn-ghost btn-xs h-6 min-h-6 w-6 p-0 text-error" @click.stop="removeNodeById(pool.id, node.id)">
                    <TrashIcon class="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  class="badge badge-ghost h-5 min-h-5 shrink-0 cursor-pointer px-1.5 text-[10px]"
                  :disabled="isTesting"
                  @click.stop="testNode(node.name)"
                >
                  <span v-if="latencyMap[node.name] !== undefined">{{ latencyMap[node.name] ?? '—' }}ms</span>
                  <template v-else><BoltIcon class="h-3 w-3" /> {{ $t('nodeTestLatency') }}</template>
                </button>
              </div>
            </div>
          </div>

          <!-- 添加节点按钮 -->
          <button
            type="button"
            class="btn btn-ghost btn-sm mt-3"
            @click="openCreateNodeDialog(pool)"
          >
            <PlusIcon class="h-4 w-4" />
            {{ $t('nodePoolAddNode') }}
          </button>
        </div>
      </div>
      <div v-else class="table-glass min-h-full min-w-min overflow-x-auto pb-6">
        <table class="table table-sm">
          <thead class="bg-base-100 border-base-300/60 sticky top-0 z-30 border-b backdrop-blur-none!"><tr><th>{{ $t('nodePoolName') }}</th><th>{{ $t('nodePoolNodes') }}</th><th>{{ $t('nodePoolEnabled') }}</th><th class="text-right">{{ $t('actions') }}</th></tr></thead>
          <tbody>
            <tr v-if="!visiblePools.length">
              <td colspan="4" class="text-base-content/50 h-90">
                <div class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <BoltIcon class="h-10 w-10 opacity-60" />
                  <div class="text-base">{{ $t('nodePoolEmpty') }}</div>
                </div>
              </td>
            </tr>
            <tr v-for="pool in visiblePools" :key="pool.id" class="hover">
              <td>{{ pool.name }}</td><td>{{ pool.nodes.length }}</td><td>{{ pool.enabled ? $t('online') : $t('offline') }}</td>
              <td class="text-right"><button type="button" class="btn btn-ghost btn-xs" @click="openEditPoolDialog(pool)"><PencilIcon class="h-3.5 w-3.5" /></button><button type="button" class="btn btn-ghost btn-xs text-error" @click="removePoolById(pool.id)"><TrashIcon class="h-3.5 w-3.5" /></button></td>
            </tr>
          </tbody>
        </table>
      </div>
      </template>
      <!-- 节点池 编辑/新建 弹窗 -->
      <dialog ref="poolDialogRef" class="modal">
        <div class="modal-box max-w-lg">
          <h3 class="text-lg font-semibold">
            {{ editingPoolId ? $t('nodePoolEditTitle') : $t('nodePoolAddTitle') }}
          </h3>
          <div class="mt-4 space-y-4">
            <label class="form-control w-full">
              <span class="label-text mb-1">{{ $t('nodePoolName') }}</span>
              <input
                v-model="poolForm.name"
                type="text"
                class="input input-bordered w-full"
                :placeholder="$t('nodePoolName')"
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text mb-1">{{ $t('nodeType') }}</span>
              <select
                v-model="poolForm.dedupeStr"
                class="select select-bordered w-full"
                @change="poolForm.dedupe = poolForm.dedupeStr === 'dedupe'"
              >
                <option value="dedupe">{{ $t('nodePoolDedupe') }}</option>
                <option value="noDedupe">{{ $t('nodePoolDedupe') ? 'No dedup' : 'No dedup' }}</option>
              </select>
            </label>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="poolForm.enabled" type="checkbox" class="checkbox" />
              <span class="label-text">{{ $t('nodePoolEnabled') }}</span>
            </label>
          </div>
          <div class="modal-action">
            <button type="button" class="btn btn-ghost" @click="closePoolDialog">{{ $t('cancel') }}</button>
            <button type="button" class="btn btn-primary" @click="savePool">{{ $t('save') }}</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="closePoolDialog">close</button>
        </form>
      </dialog>
      <DialogWrapper v-model="nodeDisplaySettingsOpen" :title="$t('displaySettings')" box-class="max-w-lg">
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
                      <div class="btn btn-sm bg-base-100 flex-nowrap justify-between gap-1 shadow-sm" :title="getNodeColumnLabel(element)">
                        <Bars2Icon class="h-4 w-4 shrink-0 cursor-move opacity-40" />
                        <span class="truncate">{{ getNodeColumnLabel(element) }}</span>
                        <button class="opacity-50 transition-opacity hover:opacity-100" @click.stop="removeNodeColumn(element)">
                          <XMarkIcon class="h-4 w-4 shrink-0" />
                        </button>
                      </div>
                    </template>
                    <template #footer>
                      <div v-if="!nodeTableColumns.length" class="text-base-content/40 flex h-16 items-center justify-center px-2 text-center text-xs">
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
                      <button class="btn btn-sm btn-ghost border-base-300/60 flex-nowrap justify-between gap-1" :title="getNodeColumnLabel(element)" @click="addNodeColumn(element)">
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
      <DialogWrapper v-model="groupDisplaySettingsOpen" :title="$t('displaySettings')" box-class="max-w-lg">
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
          </div>
        </div>
      </DialogWrapper>

      <!-- 节点 编辑/新建 弹窗 -->
      <dialog ref="nodeDialogRef" class="modal">
        <div class="modal-box max-w-xl h-[560px] flex flex-col overflow-hidden">
          <!-- 标题行 + 表单/YAML 切换 -->
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-lg font-semibold">{{ editingNodeId ? $t('nodeEditTitle') : $t('nodeAddTitle') }}</h3>
            <div class="join">
              <button type="button" class="btn btn-sm join-item" :class="nodeInputMode === 'form' ? 'btn-primary' : 'btn-ghost'" @click="nodeInputMode = 'form'">{{ $t('formMode') }}</button>
              <button type="button" class="btn btn-sm join-item" :class="nodeInputMode === 'yaml' ? 'btn-primary' : 'btn-ghost'" @click="switchNodeInputMode('yaml')">{{ $t('dualModeYaml') }}</button>
            </div>
          </div>
          <!-- 内容区：固定高度、内部滚动，切换表单/YAML 时整体尺寸不变 -->
          <div class="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
            <div v-if="nodeInputMode === 'yaml'" class="h-full">
              <textarea v-model="nodeYaml" class="textarea textarea-bordered h-full min-h-[380px] w-full font-mono text-xs" spellcheck="false"></textarea>
            </div>
            <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeName') }}</span>
                <input v-model="nodeForm.name" type="text" class="input input-sm input-bordered w-full" />
              </label>
              <label class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeType') }}</span>
                <select v-model="nodeForm.type" class="select select-sm select-bordered w-full">
                  <option v-for="t in NODE_TYPES" :key="t" :value="t">{{ t }}</option>
                </select>
              </label>
              <label class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeServer') }}</span>
                <input v-model="nodeForm.server" type="text" class="input input-sm input-bordered w-full" placeholder="1.2.3.4" />
              </label>
              <label class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodePort') }}</span>
                <input
                  v-model.number="nodeForm.port"
                  type="number"
                  min="1"
                  max="65535"
                  class="input input-sm input-bordered w-full"
                />
              </label>
              <label v-if="hasNodeField('cipher')" class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeCipher') }}</span>
                <input v-model="nodeForm.cipher" type="text" class="input input-sm input-bordered w-full" placeholder="chacha20-poly1305" />
              </label>
              <label v-if="hasNodeField('password')" class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodePassword') }}</span>
                <input v-model="nodeForm.password" type="text" class="input input-sm input-bordered w-full" />
              </label>
              <label v-if="hasNodeField('sni')" class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeSni') }}</span>
                <input v-model="nodeForm.sni" type="text" class="input input-sm input-bordered w-full" />
              </label>
              <label v-if="hasNodeField('fingerprint')" class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeFingerprint') }}</span>
                <select v-model="nodeForm.fingerprint" class="select select-sm select-bordered w-full">
                  <option value="">{{ $t('nodeFingerprint') }}</option>
                  <option value="chrome">chrome</option>
                  <option value="firefox">firefox</option>
                  <option value="safari">safari</option>
                  <option value="ios">ios</option>
                  <option value="android">android</option>
                  <option value="edge">edge</option>
                  <option value="random">random</option>
                </select>
              </label>
              <label v-if="hasNodeField('wsPath')" class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeWsPath') }}</span>
                <input v-model="nodeForm.wsPath" type="text" class="input input-sm input-bordered w-full" placeholder="/ws" />
              </label>
              <label v-if="hasNodeField('grpcServiceName')" class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeGrpcServiceName') }}</span>
                <input v-model="nodeForm.grpcServiceName" type="text" class="input input-sm input-bordered w-full" />
              </label>
              <label v-if="hasNodeField('alpn')" class="form-control w-full">
                <span class="label-text mb-1">{{ $t('nodeAlpn') }}</span>
                <input
                  v-model="nodeForm.alpnStr"
                  type="text"
                  class="input input-sm input-bordered w-full"
                  :placeholder="'h2,http/1.1'"
                />
              </label>
              <label v-if="hasNodeField('tfo')" class="label cursor-pointer justify-start gap-3">
                <input v-model="nodeForm.tfo" type="checkbox" class="checkbox checkbox-sm" />
                <span class="label-text">{{ $t('nodeTfo') }}</span>
              </label>
              <label v-if="hasNodeField('skipCert')" class="label cursor-pointer justify-start gap-3">
                <input v-model="nodeForm.skipCertVerification" type="checkbox" class="checkbox checkbox-sm" />
                <span class="label-text">{{ $t('nodeSkipCert') }}</span>
              </label>
            </div>
          </div>
          <!-- 操作行：固定不随内容滚动 -->
          <div class="mt-3 flex shrink-0 items-center justify-end gap-2 border-t border-base-300/60 pt-3">
            <button type="button" class="btn btn-sm btn-ghost" @click="closeNodeDialog">{{ $t('cancel') }}</button>
            <button
              type="button"
              class="btn btn-sm btn-primary"
              :disabled="!nodeForm.name.trim() || !nodeForm.server.trim() || !nodeForm.port"
              @click="saveNode"
            >
              {{ $t('save') }}
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="closeNodeDialog">close</button>
        </form>
      </dialog>
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
import { showNotification } from '@/helper/notification'
import {
  addNode,
  addNodePool,
  nodePools,
  removeNode,
  removeNodePool,
  toggleNodePool,
  updateNode,
  updateNodePool,
  buildMergedNodeList,
} from '@/store/nodePool'
import type { CustomNode, NodePool } from '@/store/nodePool'
import { useLatency } from '@/composables/useLatency'
import { Bars2Icon, BoltIcon, PencilIcon, PlusIcon, Squares2X2Icon, TableCellsIcon, TrashIcon, WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Draggable from 'vuedraggable'
import NodePageHeader from '@/components/proxies/NodePageHeader.vue'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import SelectInput from '@/components/common/SelectInput.vue'
import TextInput from '@/components/common/TextInput.vue'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

const { t } = useI18n()
const { padding } = usePaddingForViews({ offsetTop: 0, offsetBottom: 0 })
const { latencyMap, isTesting, testNodeLatency } = useLatency()

const NODE_TYPES = [
  'vmess', 'vless', 'trojan', 'hysteria2', 'shadowsocks', 'ss', 'ssr',
] as const

// 各协议在弹窗表单中显示的可选字段（核心字段 名称/类型/服务器/端口 恒显示）
type NodeFieldKey = 'cipher' | 'password' | 'sni' | 'fingerprint' | 'wsPath' | 'grpcServiceName' | 'alpn' | 'tfo' | 'skipCert'
const NODE_TYPE_FIELDS: Record<string, NodeFieldKey[]> = {
  vmess: ['cipher', 'sni', 'fingerprint', 'wsPath', 'alpn', 'tfo', 'skipCert'],
  vless: ['sni', 'fingerprint', 'wsPath', 'grpcServiceName', 'alpn', 'skipCert'],
  trojan: ['password', 'sni', 'fingerprint', 'wsPath', 'grpcServiceName', 'alpn', 'skipCert'],
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
  if (!allowed.includes('sni')) f.sni = ''
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
const visiblePools = computed(() => {
  const keyword = poolSearch.value.trim().toLowerCase()
  if (!keyword) return pools.value
  return pools.value.filter((pool) => pool.name.toLowerCase().includes(keyword))
})
const allNodes = computed(() => buildMergedNodeList())
const nodeSearch = ref('')
const nodeViewMode = useStorage<'card' | 'table'>('nodeViewMode', 'card')
const groupViewMode = useStorage<'card' | 'table'>('groupViewMode', 'card')
const nodeDisplaySettingsOpen = ref(false)
const groupDisplaySettingsOpen = ref(false)
const nodeTableColumns = useStorage<string[]>('nodeTableColumns', ['type', 'server', 'port', 'cipher', 'sni', 'latency'])
const nodeTableColumnOptions = [
  { key: 'type', label: t('nodeType') },
  { key: 'server', label: t('nodeServer') },
  { key: 'port', label: t('nodePort') },
  { key: 'cipher', label: t('nodeCipher') },
  { key: 'sni', label: t('nodeSni') },
  { key: 'latency', label: t('nodeLatency') },
]

const restOfNodeColumns = computed({
  get() {
    return nodeTableColumnOptions.filter((opt) => !nodeTableColumns.value.includes(opt.key)).map((opt) => opt.key)
  },
  set() {
    // Draggable set is not strictly needed if we only drag from/to, but we define it to avoid warnings
  }
})

const getNodeColumnLabel = (key: string) => {
  return nodeTableColumnOptions.find((opt) => opt.key === key)?.label || key
}

const removeNodeColumn = (key: string) => {
  nodeTableColumns.value = nodeTableColumns.value.filter((col) => col !== key)
}

const addNodeColumn = (key: string) => {
  if (!nodeTableColumns.value.includes(key)) {
    nodeTableColumns.value = [...nodeTableColumns.value, key]
  }
}
const filteredNodes = computed(() => {
  const keyword = nodeSearch.value.trim().toLowerCase()
  if (!keyword) return allNodes.value
  return allNodes.value.filter((node) =>
    [node.name, node.server, node.type].some((value) => value.toLowerCase().includes(keyword)),
  )
})

// 每个池的搜索关键字（用 ref 对象避免直接 v-model 到 computed）
const searchMap = reactive<Record<string, string>>({})

const getFilteredNodes = (pool: NodePool): CustomNode[] => {
  const keyword = (searchMap[pool.id] || '').trim().toLowerCase()
  if (!keyword) return pool.nodes
  return pool.nodes.filter(
    (n) =>
      n.name.toLowerCase().includes(keyword) ||
      n.server.includes(keyword) ||
      n.type.toLowerCase().includes(keyword),
  )
}

const openCreateNodeFromHeader = () => {
  const pool = pools.value[0] || addNodePool({
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

// ── 节点池 弹窗 ──────────────────────────────────────────────────
const poolDialogRef = ref<HTMLDialogElement | null>(null)
const editingPoolId = ref<string | null>(null)
const poolForm = ref({
  name: '',
  enabled: true,
  dedupe: true,
  dedupeStr: 'dedupe',
})

const openCreatePoolDialog = () => {
  editingPoolId.value = null
  poolForm.value = { name: '', enabled: true, dedupe: true, dedupeStr: 'dedupe' }
  poolDialogRef.value?.showModal()
}

const openEditPoolDialog = (pool: NodePool) => {
  editingPoolId.value = pool.id
  poolForm.value = {
    name: pool.name,
    enabled: pool.enabled,
    dedupe: pool.dedupe,
    dedupeStr: pool.dedupe ? 'dedupe' : 'noDedupe',
  }
  poolDialogRef.value?.showModal()
}

const closePoolDialog = () => poolDialogRef.value?.close()

const savePool = () => {
  const name = poolForm.value.name.trim()
  if (!name) {
    showNotification({ content: 'invalidURL', type: 'alert-error' })
    return
  }
  if (editingPoolId.value) {
    updateNodePool(editingPoolId.value, {
      name,
      enabled: poolForm.value.enabled,
      dedupe: poolForm.value.dedupe,
    })
  } else {
    addNodePool({
      name,
      enabled: poolForm.value.enabled,
      dedupe: poolForm.value.dedupe,
      nodes: [],
    })
  }
  showNotification({ content: 'poolSaveSuccess', type: 'alert-success' })
  closePoolDialog()
}

const togglePool = (id: string) => toggleNodePool(id)

const removePoolById = async (id: string) => {
  const { showConfirmDialog } = await import('@/helper/confirmDialog')
  const result = await showConfirmDialog({
    message: t('nodePoolDeleteConfirm'),
    confirmButtonClass: 'btn-error',
  })
  if (result.confirmed) {
    removeNodePool(id)
    showNotification({ content: 'poolDeleteSuccess', type: 'alert-success' })
  }
}

// ── 节点 弹窗 ───────────────────────────────────────────────────
const nodeDialogRef = ref<HTMLDialogElement | null>(null)
const activePoolId = ref<string | null>(null)
const editingNodeId = ref<string | null>(null)

type NodeFormData = Omit<CustomNode, 'id'> & { alpnStr: string }

const emptyNodeForm = (): NodeFormData => ({
  name: '',
  type: 'vmess',
  server: '',
  port: 443,
  cipher: '',
  password: '',
  sni: '',
  fingerprint: '',
  alpnStr: '',
  wsPath: '',
  grpcServiceName: '',
  tfo: false,
  skipCertVerification: false,
})

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
  nodeDialogRef.value?.showModal()
}

const openEditNodeDialog = (pool: NodePool, node: CustomNode) => {
  activePoolId.value = pool.id
  editingNodeId.value = node.id
  nodeForm.value = {
    name: node.name,
    type: node.type,
    server: node.server,
    port: node.port,
    cipher: node.cipher ?? '',
    password: node.password ?? '',
    sni: node.sni ?? '',
    fingerprint: node.fingerprint ?? '',
    alpnStr: (node.alpn ?? []).join(','),
    wsPath: node.wsPath ?? '',
    grpcServiceName: node.grpcServiceName ?? '',
    tfo: node.tfo ?? false,
    skipCertVerification: node.skipCertVerification ?? false,
  }
  nodeInputMode.value = 'form'
  nodeYaml.value = ''
  nodeDialogRef.value?.showModal()
}

// 剔除未填写的可选字段，YAML 中就不输出这些键（而不是输出空值）
const pruneEmptyNodeForm = (form: NodeFormData): Record<string, unknown> => {
  const out: Record<string, unknown> = { ...form }
  delete out.alpnStr
  for (const key of ['cipher', 'password', 'sni', 'fingerprint', 'wsPath', 'grpcServiceName'] as const) {
    if (!out[key]) delete out[key]
  }
  if (!out.alpn?.length) delete out.alpn
  if (!out.tfo) delete out.tfo
  if (!out.skipCertVerification) delete out.skipCertVerification
  return out
}

const switchNodeInputMode = (mode: 'form' | 'yaml') => {
  if (mode === 'yaml') {
    nodeYaml.value = stringifyYaml(pruneEmptyNodeForm(nodeForm.value), { indent: 2 })
  }
  else {
    try {
      const parsed = parseYaml(nodeYaml.value) as Partial<NodeFormData>
      nodeForm.value = { ...emptyNodeForm(), ...parsed, alpnStr: Array.isArray(parsed.alpn) ? parsed.alpn.join(',') : parsed.alpnStr ?? '' }
    } catch {
      showNotification({ content: 'invalidURL', type: 'alert-error' })
      return
    }
  }
  nodeInputMode.value = mode
}

const closeNodeDialog = () => nodeDialogRef.value?.close()

const saveNode = () => {
  if (!activePoolId.value) return
  if (nodeInputMode.value === 'yaml') {
    try {
      const parsed = parseYaml(nodeYaml.value) as Partial<NodeFormData>
      nodeForm.value = { ...emptyNodeForm(), ...parsed, alpnStr: Array.isArray(parsed.alpn) ? parsed.alpn.join(',') : parsed.alpnStr ?? '' }
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
    port: rest.port,
    ...(rest.cipher ? { cipher: rest.cipher } : {}),
    ...(rest.password ? { password: rest.password } : {}),
    ...(rest.sni ? { sni: rest.sni } : {}),
    ...(rest.fingerprint ? { fingerprint: rest.fingerprint } : {}),
    ...(alpnStr ? { alpn: alpnStr.split(',').map((s) => s.trim()).filter(Boolean) } : {}),
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

const removeNodeById = async (poolId: string, nodeId: string) => {
  const { showConfirmDialog } = await import('@/helper/confirmDialog')
  const result = await showConfirmDialog({
    message: t('nodeDeleteConfirm'),
    confirmButtonClass: 'btn-error',
  })
  if (result.confirmed) {
    removeNode(poolId, nodeId)
    showNotification({ content: 'nodeDeleteSuccess', type: 'alert-success' })
  }
}

// ── 延迟测试 ─────────────────────────────────────────────────────
const testNode = async (nodeName: string) => {
  await testNodeLatency(nodeName)
}

const testPoolLatency = async (pool: NodePool) => {
  const poolNodes = pool.nodes.map((n) => n.name)
  const nodes = poolNodes.filter(Boolean)
  // 通过 useLatency 的 testNodeLatency 逐个测（无批量 API 时降级为串行）
  for (const name of nodes) {
    await testNodeLatency(name)
  }
}

const testAllStandaloneNodes = async () => {
  for (const node of filteredNodes.value) await testNode(node.name)
}
</script>

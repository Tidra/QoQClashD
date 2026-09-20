// 存储层的水合门控：KV 读写必须等面板会话建立之后再发。
//
// 各 store 在模块导入阶段就创建 useStorage，若此时就打后端，未登录的首屏会产生上百个
// 401，更糟的是「读取失败」会被种子逻辑当成「服务器没有这条数据」，登录成功那一刻再用
// 默认值整片覆盖真实数据。这里刻意做成零依赖的叶子模块：helper/storage 不能反向
// import panelSession，否则又形成 ESM 循环。
let resolveGate: () => void

const gateReady = new Promise<void>((resolve) => {
  resolveGate = resolve
})

export const whenSessionReady = () => gateReady

/** 会话确认有效后调用；单向闩，重复调用无副作用。 */
export const openSessionGate = () => resolveGate()

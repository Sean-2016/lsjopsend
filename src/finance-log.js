function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, n) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + n);
  return next;
}

function defaultAssetLogRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = addDays(today, -1);
  const start = addDays(end, -6);
  return { start: ymd(start), end: ymd(end) };
}

const defaultLogRange = defaultAssetLogRange();

const financeLogState = {
  start: defaultLogRange.start,
  end: defaultLogRange.end,
  asset: "",
  direction: "",
  records: [
    { date: "2026-09-09", asset: "coin", qty: 1200, direction: "add", operator: "运营小王" },
    { date: "2026-09-09", asset: "point", qty: 300, direction: "add", operator: "运营小王" },
    { date: "2026-09-08", asset: "vip", qty: 30, direction: "add", operator: "产品阿陈" },
    { date: "2026-09-08", asset: "coin", qty: 80, direction: "cut", operator: "运营小王" },
    { date: "2026-09-07", asset: "coin", qty: 500, direction: "add", operator: "运营小王" },
    { date: "2026-09-06", asset: "point", qty: 120, direction: "add", operator: "产品阿陈" },
    { date: "2026-09-06", asset: "vip", qty: 7, direction: "add", operator: "运营小王" },
    { date: "2026-09-05", asset: "point", qty: 40, direction: "cut", operator: "运营小王" },
    { date: "2026-09-04", asset: "coin", qty: 2000, direction: "add", operator: "产品阿陈" },
    { date: "2026-09-03", asset: "vip", qty: 15, direction: "add", operator: "运营小王" },
    { date: "2026-09-02", asset: "coin", qty: 100, direction: "add", operator: "运营小王" },
    { date: "2026-09-01", asset: "point", qty: 50, direction: "add", operator: "运营小王" },
  ],
};

function assetLogLabel(asset) {
  if (asset === "coin") return "金币";
  if (asset === "point") return "积分";
  return "会员";
}

function assetLogUnit(asset) {
  return asset === "vip" ? "天" : "个";
}

function filteredAssetLogs() {
  return financeLogState.records.filter((row) => {
    if (financeLogState.start && row.date < financeLogState.start) return false;
    if (financeLogState.end && row.date > financeLogState.end) return false;
    if (financeLogState.asset && row.asset !== financeLogState.asset) return false;
    if (financeLogState.direction && row.direction !== financeLogState.direction) return false;
    return true;
  });
}

function assetLogOverview(rows) {
  const sum = { coin: 0, point: 0, vip: 0 };
  rows.forEach((row) => {
    if (row.direction !== "add") return;
    if (sum[row.asset] != null) sum[row.asset] += row.qty;
  });
  return sum;
}

function renderFinanceLogPage() {
  const rows = filteredAssetLogs().slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const overview = assetLogOverview(rows);
  const table = rows.length
    ? `<table class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>资产类型</th>
            <th>数量</th>
            <th>去向类型</th>
            <th>操作人</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
            <tr>
              <td>${row.date}</td>
              <td>${assetLogLabel(row.asset)}</td>
              <td>${row.qty} ${assetLogUnit(row.asset)}</td>
              <td>${row.direction === "add" ? "增加" : "扣减"}</td>
              <td>${escapeHtml(row.operator)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      <div class="pager">共 ${rows.length} 条</div>`
    : `<div class="empty">所选条件下暂无操作记录</div>`;

  return `
    <header class="topbar">
      <div class="crumb">
        <span>财务管理</span>
        <span class="sep">/</span>
        <span class="current">虚拟资产操作记录</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="info-bar">记录所有有后台操作权限的用户对虚拟资产的操作记录，且各项操作会在对应明细中展示。切勿将该页面上的数据与明细中的数据相加。</div>
      <section class="finance-card">
        <h2>数据速览</h2>
        <div class="finance-overview">
          <div class="metric on">
            <div class="muted">赠送金币数</div>
            <b>${overview.coin.toLocaleString()} 个</b>
          </div>
          <div class="metric on">
            <div class="muted">赠送积分数</div>
            <b>${overview.point.toLocaleString()} 个</b>
          </div>
          <div class="metric on">
            <div class="muted">赠送会员天数</div>
            <b>${overview.vip.toLocaleString()} 天</b>
          </div>
        </div>
      </section>
      <section class="finance-card">
        <h2>查询条件</h2>
        <div class="finance-log-filters">
          <label>日期
            <div class="finance-date-range">
              <input class="input" type="date" data-log-filter="start" value="${financeLogState.start}" />
              <span>至</span>
              <input class="input" type="date" data-log-filter="end" value="${financeLogState.end}" />
            </div>
            <span class="field-hint">默认近 7 天（不含当天）</span>
          </label>
          <label>资产类型
            <select class="input" data-log-filter="asset">
              <option value="">全部</option>
              <option value="coin" ${financeLogState.asset === "coin" ? "selected" : ""}>金币</option>
              <option value="point" ${financeLogState.asset === "point" ? "selected" : ""}>积分</option>
              <option value="vip" ${financeLogState.asset === "vip" ? "selected" : ""}>会员</option>
            </select>
          </label>
          <label>去向类型
            <select class="input" data-log-filter="direction">
              <option value="">全部</option>
              <option value="add" ${financeLogState.direction === "add" ? "selected" : ""}>增加</option>
              <option value="cut" ${financeLogState.direction === "cut" ? "selected" : ""}>扣减</option>
            </select>
          </label>
        </div>
        <div class="finance-actions">
          <button type="button" class="btn" data-log-act="reset">重置</button>
          <button type="button" class="btn btn-primary" data-log-act="search">查询</button>
        </div>
      </section>
      <div class="table-card">${table}</div>
    </div>
  `;
}

function onFinanceLogClick(e) {
  const btn = e.target.closest("[data-log-act]");
  if (!btn) return;
  if (btn.dataset.logAct === "reset") {
    const range = defaultAssetLogRange();
    financeLogState.start = range.start;
    financeLogState.end = range.end;
    financeLogState.asset = "";
    financeLogState.direction = "";
    renderApp();
  } else if (btn.dataset.logAct === "search") {
    renderApp();
  }
}

function mountFinanceLogPage(main) {
  if (!main.dataset.logBound) {
    main.dataset.logBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "virtual-asset-log") return;
      onFinanceLogClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "virtual-asset-log") return;
      const field = e.target.closest("[data-log-filter]");
      if (!field) return;
      financeLogState[field.dataset.logFilter] = field.value;
    });
  }
  main.innerHTML = renderFinanceLogPage();
}

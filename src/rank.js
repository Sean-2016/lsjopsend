const RANK_TARGETS = [
  { key: "video", label: "视频" },
  { key: "novel", label: "小说" },
  { key: "comic", label: "漫画" },
  { key: "community", label: "社区" },
];

const RANK_METRICS = [
  { key: "surge", label: "飙升" },
  { key: "sales", label: "畅销" },
];

const RANK_LAYOUTS = [{ key: "single", label: "单列" }];

const rankState = {
  filterDraft: { q: "", target: "", metric: "" },
  filters: { q: "", target: "", metric: "" },
  modal: null,
  ranks: [
    {
      id: "6aabc2291e0cade76a740979",
      name: "新品小说榜",
      target: "novel",
      layout: "single",
      maxCount: 50,
      desc: "",
      metric: "surge",
    },
    {
      id: "6aabb9a1e0cade76a740920",
      name: "新品视频速递",
      target: "video",
      layout: "single",
      maxCount: 50,
      desc: "",
      metric: "surge",
    },
  ],
};

function isRankDirty() {
  return Boolean(rankState.modal && rankState.modal.dirty);
}

function rankTargetLabel(key) {
  const found = RANK_TARGETS.find((item) => item.key === key);
  return found ? found.label : key;
}

function rankMetricLabel(key) {
  const found = RANK_METRICS.find((item) => item.key === key);
  return found ? found.label : key;
}

function rankTargetPill(key) {
  if (key === "novel") return "purple";
  if (key === "video") return "blue";
  if (key === "comic") return "red";
  return "green";
}

function blankRankForm() {
  return {
    name: "",
    target: "",
    layout: "single",
    maxCount: "50",
    desc: "",
    metric: "surge",
  };
}

function formFromRank(rank) {
  return {
    name: rank.name,
    target: rank.target,
    layout: rank.layout || "single",
    maxCount: String(rank.maxCount || 50),
    desc: rank.desc || "",
    metric: rank.metric,
  };
}

function filteredRanks() {
  const f = rankState.filters;
  const q = (f.q || "").trim().toLowerCase();
  return rankState.ranks.filter((item) => {
    if (q && !item.name.toLowerCase().includes(q) && !item.id.toLowerCase().includes(q)) return false;
    if (f.target && item.target !== f.target) return false;
    if (f.metric && item.metric !== f.metric) return false;
    return true;
  });
}

function renderRankPage() {
  const d = rankState.filterDraft;
  const rows = filteredRanks();
  const table = rows.length
    ? `<table class="data-table">
        <thead>
          <tr>
            <th>榜单名称</th>
            <th>榜单编码</th>
            <th>排行对象</th>
            <th>内容数</th>
            <th>排序指标</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td><code class="cell-code" style="margin:0">${item.id}</code></td>
              <td><span class="pill ${rankTargetPill(item.target)}">${rankTargetLabel(item.target)}</span></td>
              <td>${item.maxCount}</td>
              <td>${rankMetricLabel(item.metric)}</td>
              <td class="ops">
                <button type="button" class="link" data-rank-act="edit" data-id="${item.id}">编辑</button>
                <button type="button" class="link danger" data-rank-act="delete" data-id="${item.id}">删除</button>
              </td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
      <div class="pager">共 ${rows.length} 条</div>`
    : `<div class="empty">暂无榜单</div>`;

  return `
    <header class="topbar">
      <div class="crumb">
        <span>大前端配置</span>
        <span class="sep">/</span>
        <span class="current">榜单管理</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="info-bar rank-help">
        <div class="rank-help-title">页面说明</div>
        <ol>
          <li>可以被「功能页面管理」中创建功能页面时使用。</li>
          <li>【榜单名称】允许重复。</li>
          <li>飙升榜规则：日阅读量 ≥ 10 后，(今日阅读量 − 昨日阅读量) / 昨日阅读量 × 100%。</li>
          <li>畅销榜规则：根据近 7 日的阅读次数。</li>
          <li>每日 0 点自动刷新榜单。</li>
        </ol>
      </div>
      <div class="filter-bar">
        <label class="task-filter">榜单名称/编码
          <input class="input" data-rank-filter="q" value="${escapeHtml(d.q)}" placeholder="输入关键字搜索..." />
        </label>
        <label class="task-filter">排行对象
          <select class="input" data-rank-filter="target">
            <option value="">全部对象</option>
            ${RANK_TARGETS.map(
              (item) =>
                `<option value="${item.key}" ${d.target === item.key ? "selected" : ""}>${item.label}</option>`,
            ).join("")}
          </select>
        </label>
        <label class="task-filter">排序指标
          <select class="input" data-rank-filter="metric">
            <option value="">全部指标</option>
            ${RANK_METRICS.map(
              (item) =>
                `<option value="${item.key}" ${d.metric === item.key ? "selected" : ""}>${item.label}</option>`,
            ).join("")}
          </select>
        </label>
        <button type="button" class="btn" data-rank-act="reset">重置</button>
        <button type="button" class="btn btn-primary" data-rank-act="search">查询</button>
        <span class="task-toolbar-spacer"></span>
        <button type="button" class="btn btn-primary" data-rank-act="create">+ 新增榜单</button>
      </div>
      <div class="table-card">${table}</div>
    </div>
  `;
}

function renderRankModal() {
  const modal = rankState.modal;
  if (!modal) return "";
  const form = modal.form;
  const isEdit = modal.mode === "edit";
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">${isEdit ? "编辑榜单配置" : "新增榜单配置"}<button type="button" class="icon-x" data-rank-act="close-modal">×</button></div>
        <div class="dialog-body">
          <div class="rank-sec-title">基础信息</div>
          <label>
            <span class="field-title"><span class="req">*</span>榜单名称</span>
            <input class="input" data-rank-form="name" maxlength="30" value="${escapeHtml(form.name)}" placeholder="例如：年度热门短视频" />
            <span class="rank-count">${(form.name || "").length} / 30</span>
          </label>
          <div class="field-block">
            <span class="field-title"><span class="req">*</span>排行对象</span>
            <div class="radios">
              ${RANK_TARGETS.map(
                (item) =>
                  `<label><input type="radio" name="rankTarget" data-rank-form="target" value="${item.key}" ${form.target === item.key ? "checked" : ""} /> ${item.label}</label>`,
              ).join("")}
            </div>
          </div>
          <div class="form-grid">
            <label>
              <span class="field-title"><span class="req">*</span>展示结构</span>
              <select class="input" data-rank-form="layout">
                ${RANK_LAYOUTS.map(
                  (item) =>
                    `<option value="${item.key}" ${form.layout === item.key ? "selected" : ""}>${item.label}</option>`,
                ).join("")}
              </select>
            </label>
            <label>
              <span class="field-title"><span class="req">*</span>榜单最大内容数</span>
              <input class="input" data-rank-form="maxCount" value="${escapeHtml(form.maxCount)}" />
            </label>
          </div>
          <label>
            <span>榜单描述</span>
            <textarea class="input" rows="3" data-rank-form="desc" maxlength="200" placeholder="简要描述该榜单的统计范围和逻辑...">${escapeHtml(form.desc)}</textarea>
            <span class="rank-count">${(form.desc || "").length} / 200</span>
          </label>
          <div class="rank-sec-title">排名规则</div>
          <div class="field-block">
            <span class="field-title"><span class="req">*</span>排序指标</span>
            <div class="rank-metric-picks">
              ${RANK_METRICS.map(
                (item) =>
                  `<button type="button" class="rank-metric${form.metric === item.key ? " on" : ""}" data-rank-act="metric" data-id="${item.key}">${item.label}</button>`,
              ).join("")}
            </div>
          </div>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-rank-act="close-modal">取消</button>
          <button type="button" class="btn btn-primary" data-rank-act="save">${isEdit ? "保存" : "确认添加"}</button>
        </div>
      </div>
    </div>
  `;
}

function closeRankModal(force) {
  if (!force && isRankDirty()) {
    confirmLeaveIfDirty(() => {
      rankState.modal = null;
      renderApp();
    });
    return;
  }
  rankState.modal = null;
  renderApp();
}

function saveRank() {
  const modal = rankState.modal;
  if (!modal) return;
  const form = modal.form;
  const maxCount = Number(form.maxCount);
  if (!(form.name || "").trim() || !form.target || !form.layout || !form.metric || !Number.isInteger(maxCount) || maxCount < 1) {
    showToast("请完善必填项，最大内容数须为正整数", "error");
    return;
  }
  if (modal.mode === "create") {
    rankState.ranks.unshift({
      id: Math.random().toString(16).slice(2, 26),
      name: form.name.trim(),
      target: form.target,
      layout: form.layout,
      maxCount,
      desc: form.desc.trim(),
      metric: form.metric,
    });
    showToast("已添加榜单");
  } else {
    Object.assign(modal.rank, {
      name: form.name.trim(),
      target: form.target,
      layout: form.layout,
      maxCount,
      desc: form.desc.trim(),
      metric: form.metric,
    });
    showToast("已保存榜单");
  }
  rankState.modal = null;
  renderApp();
}

function onRankClick(e) {
  const btn = e.target.closest("[data-rank-act]");
  if (!btn) return;
  const act = btn.dataset.rankAct;
  const id = btn.dataset.id;
  if (act === "reset") {
    rankState.filterDraft = { q: "", target: "", metric: "" };
    rankState.filters = { q: "", target: "", metric: "" };
    renderApp();
  } else if (act === "search") {
    rankState.filters = clone(rankState.filterDraft);
    renderApp();
  } else if (act === "create") {
    rankState.modal = { mode: "create", form: blankRankForm(), dirty: false };
    renderApp();
  } else if (act === "edit") {
    const rank = rankState.ranks.find((item) => item.id === id);
    rankState.modal = { mode: "edit", rank, form: formFromRank(rank), dirty: false };
    renderApp();
  } else if (act === "delete") {
    showConfirm({
      title: "删除榜单",
      text: "确认删除该榜单？删除后不可恢复。",
      okText: "删除",
      danger: true,
      onOk: () => {
        rankState.ranks = rankState.ranks.filter((item) => item.id !== id);
        showToast("已删除榜单");
        renderApp();
      },
    });
  }
}

function onRankOverlayClick(e) {
  if (e.target.classList && e.target.classList.contains("mask") && !e.target.closest(".dialog")) {
    closeRankModal();
    return;
  }
  const btn = e.target.closest("[data-rank-act]");
  if (!btn) return;
  const act = btn.dataset.rankAct;
  if (act === "close-modal") closeRankModal();
  else if (act === "save") saveRank();
  else if (act === "metric") {
    rankState.modal.form.metric = btn.dataset.id;
    rankState.modal.dirty = true;
    renderApp();
  }
}

function bindRankOverlays() {
  const overlay = document.getElementById("overlay-root");
  overlay.innerHTML = renderRankModal();
  const hasOverlay = Boolean(overlay.querySelector(".mask") || document.getElementById("confirm-modal"));
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.rankBound) {
    overlay.dataset.rankBound = "1";
    overlay.addEventListener("click", onRankOverlayClick);
  }
  overlay.querySelectorAll("[data-rank-form]").forEach((el) => {
    const sync = () => {
      if (!rankState.modal) return;
      rankState.modal.form[el.dataset.rankForm] = el.value;
      rankState.modal.dirty = true;
      if (el.dataset.rankForm === "name" || el.dataset.rankForm === "desc") renderApp();
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
}

function mountRankPage(main) {
  if (!main.dataset.rankBound) {
    main.dataset.rankBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "rank") return;
      onRankClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "rank") return;
      const filter = e.target.closest("[data-rank-filter]");
      if (filter) rankState.filterDraft[filter.dataset.rankFilter] = filter.value;
    });
    main.addEventListener("input", (e) => {
      if (activeKey !== "rank") return;
      const filter = e.target.closest("[data-rank-filter]");
      if (filter) rankState.filterDraft[filter.dataset.rankFilter] = filter.value;
    });
  }
  main.innerHTML = renderRankPage();
  bindRankOverlays();
}

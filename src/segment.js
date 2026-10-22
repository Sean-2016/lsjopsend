const segmentState = {
  tags: createInitialTags(),
  packs: createInitialPacks(),
  tagFilters: { q: "", status: "" },
  highlightTagId: "",
  drawer: null,
  refsDrawer: null,
  selectedPackId: "pack_unpaid",
  packDirty: false,
  packSearch: "",
  picker: null,
  templatePick: "",
  countryQuery: "",
  countryOpen: false,
  createPack: null,
  packGuide: false,
  estimateOpen: false,
  tagPanels: {},
  growthScopes: ["account", "device"],
  growthScopeOpen: false,
  createNameFocused: false,
  detailPackId: null,
  packStatus: "",
  packCreator: "",
};

function showToast(message, type) {
  const el = document.createElement("div");
  el.className = `toast ${type || ""}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function showConfirm({ title, text, okText, danger, onOk }) {
  const old = document.getElementById("confirm-modal");
  if (old) old.remove();
  const wrap = document.createElement("div");
  wrap.id = "confirm-modal";
  wrap.className = "mask";
  wrap.innerHTML = `
    <div class="dialog">
      <div class="dialog-title">${title}</div>
      <div class="dialog-body">${text}</div>
      <div class="dialog-foot">
        <button type="button" class="btn" data-act="cancel">取消</button>
        <button type="button" class="btn ${danger ? "btn-danger" : "btn-primary"}" data-act="ok">${okText || "确认"}</button>
      </div>
    </div>
  `;
  wrap.addEventListener("click", (e) => {
    if (e.target === wrap || e.target.dataset.act === "cancel") wrap.remove();
    if (e.target.dataset.act === "ok") {
      wrap.remove();
      onOk();
    }
  });
  document.body.appendChild(wrap);
}

function createPackHasInput() {
  const form = segmentState.createPack;
  if (!form) return false;
  return Boolean(
    (form.name || "").trim() ||
      (form.desc || "").trim() ||
      form.enabled ||
      (form.includes && form.includes.length) ||
      (form.excludes && form.excludes.length) ||
      (form.countries && form.countries.length) ||
      (Array.isArray(form.devices) && !devicesMatch(form.devices, allDeviceIds())),
  );
}

function isSegmentDirty() {
  return Boolean(
    segmentState.packDirty ||
      createPackHasInput() ||
      (segmentState.drawer && segmentState.drawer.dirty) ||
      (typeof isCoinDirty === "function" && isCoinDirty()) ||
      (typeof isUserDirty === "function" && isUserDirty()) ||
      (typeof isTaskDirty === "function" && isTaskDirty()) ||
      (typeof isVideoDirty === "function" && isVideoDirty()) ||
      (typeof isRankDirty === "function" && isRankDirty()) ||
      (typeof isCategoryDirty === "function" && isCategoryDirty()) ||
      (typeof isFeaturePageDirty === "function" && isFeaturePageDirty()) ||
      (typeof isTabbarDirty === "function" && isTabbarDirty()),
  );
}

function confirmLeaveIfDirty(next) {
  if (!isSegmentDirty()) {
    segmentState.createPack = null;
    next();
    return;
  }
  showConfirm({
    title: "未保存的更改",
    text: "当前页有未保存内容，离开后将丢失。确认离开？",
    okText: "离开",
    danger: true,
    onOk: () => {
      segmentState.packDirty = false;
      segmentState.createPack = null;
      if (segmentState.drawer) segmentState.drawer.dirty = false;
      segmentState.drawer = null;
      if (typeof coinState !== "undefined") {
        coinState.drawer = null;
        coinState.packPicker = false;
        coinState.valueModal = false;
        coinState.valueDraft = null;
      }
      if (typeof userState !== "undefined") {
        userState.modal = null;
        userState.tagPicker = false;
        userState.more = null;
      }
      if (typeof taskState !== "undefined") {
        taskState.modal = null;
        taskState.prizePicker = false;
        taskState.packPicker = false;
      }
      if (typeof videoState !== "undefined") {
        videoState.drawer = null;
        videoState.feeModal = null;
        videoState.feePackPicker = false;
      }
      if (typeof rankState !== "undefined") rankState.modal = null;
      if (typeof categoryState !== "undefined") {
        categoryState.modal = null;
        categoryState.batchModal = false;
      }
      if (typeof featurePageState !== "undefined") {
        featurePageState.editor = null;
        featurePageState.view = "list";
      }
      if (typeof resetTabbarDraft === "function") resetTabbarDraft();
      next();
    },
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tagById(id) {
  return segmentState.tags.find((item) => item.id === id);
}

function packById(id) {
  return segmentState.packs.find((item) => item.id === id);
}

function packsUsingTag(tagId) {
  return segmentState.packs.filter((pack) =>
    (pack.includes || []).concat(pack.excludes || []).some((item) => condTagId(item) === tagId),
  );
}

function statusLabel(status) {
  if (status === "enabled") return "启用";
  if (status === "draft") return "草稿";
  return "停用";
}

function enabledTags() {
  return segmentState.tags.filter((tag) => tag.status === "enabled");
}

function renderTopbar(pageName) {
  return `
    <header class="topbar">
      <div class="crumb">
        <span>用户中心</span>
        <span class="sep">/</span>
        <span>用户标签管理</span>
        <span class="sep">/</span>
        <span class="current">${pageName}</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
  `;
}

function filteredTags() {
  const { q, status } = segmentState.tagFilters;
  const keyword = q.trim().toLowerCase();
  return segmentState.tags.filter((tag) => {
    if (status && tag.status !== status) return false;
    if (!keyword) return true;
    return [tag.name, tag.code, tag.description].some((text) =>
      String(text).toLowerCase().includes(keyword),
    );
  });
}

function renderTagLibraryPage() {
  const tags = filteredTags();
  const f = segmentState.tagFilters;
  const rows = tags
    .map((tag) => {
      const desc = tag.description || "";
      const summary = desc.length > 40 ? `${desc.slice(0, 40)}…` : desc;
      const used = packsUsingTag(tag.id);
      const refText = used.length ? String(used.length) : "未被引用";
      const highlight = tag.id === segmentState.highlightTagId ? " highlight" : "";
      const toggleLabel = tag.status === "enabled" ? "停用" : "启用";
      return `
        <tr class="data-row${highlight}" data-id="${tag.id}">
          <td>
            <div class="cell-title">${escapeHtml(tag.name)}</div>
            <code class="cell-code">${escapeHtml(tag.code)}</code>
          </td>
          <td><span class="truncate" title="${escapeHtml(desc)}">${escapeHtml(summary) || "—"}</span></td>
          <td>${statusLabel(tag.status)}</td>
          <td><button type="button" class="link" data-act="refs" data-id="${tag.id}">${refText}</button></td>
          <td>${tag.updatedAt} · ${tag.updatedBy}</td>
          <td class="ops">
            <button type="button" class="link" data-act="edit" data-id="${tag.id}">编辑</button>
            <button type="button" class="link" data-act="toggle-btn" data-id="${tag.id}" data-to="${tag.status === "enabled" ? "disabled" : "enabled"}">${toggleLabel}</button>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    ${renderTopbar("标签库")}
    <div class="page">
      <div class="page-head">
        <div>
          <h1>标签库</h1>
          <p>第一期 16 条。天数、金额和窗口在用户圈选里填，不在这里改。</p>
        </div>
      </div>
      <div class="filter-bar">
        <input class="input" data-filter="q" value="${escapeHtml(f.q)}" placeholder="搜索名称 / code / 描述" />
        <select class="input" data-filter="status">
          <option value="">全部状态</option>
          <option value="draft" ${f.status === "draft" ? "selected" : ""}>草稿</option>
          <option value="enabled" ${f.status === "enabled" ? "selected" : ""}>启用</option>
          <option value="disabled" ${f.status === "disabled" ? "selected" : ""}>停用</option>
        </select>
        <button type="button" class="btn-text" data-act="reset">重置</button>
      </div>
      <div class="table-card">
        ${
          tags.length
            ? `<table class="data-table">
                <thead>
                  <tr>
                    <th>名称</th><th>准确描述</th><th>状态</th>
                    <th>人群包引用</th><th>更新</th><th>操作</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
              <div class="pager">共 ${tags.length} 条</div>`
            : `<div class="empty">
                <div class="empty-art"></div>
                <div>还没有标签</div>
              </div>`
        }
      </div>
    </div>
  `;
}

function formFromTag(tag) {
  return {
    name: tag.name,
    code: tag.code,
    description: tag.description,
    status: tag.status,
    params: clone(tag.params || {}),
    system: tag.system,
  };
}

function renderTagDrawer() {
  const drawer = segmentState.drawer;
  if (!drawer) return "";
  const form = drawer.form;
  const descEmpty = !(form.description || "").trim();
  const saveDisabled = descEmpty || !form.name.trim() || !form.code.trim();
  const nameLocked = form.system;
  const meta = drawer.tag || {};
  const metaLine = meta.shape
    ? `<div class="field-hint">形态：${escapeHtml(meta.shape)} · 许可：${escapeHtml(meta.permit || "—")}${meta.subject ? " · 主体：" + escapeHtml(meta.subject) : ""}</div>`
    : "";

  return `
    <div class="mask drawer-mask">
      <aside class="drawer">
        <div class="drawer-head">
          <h3>编辑标签</h3>
          <button type="button" class="icon-x" data-act="close-drawer">×</button>
        </div>
        <div class="drawer-body">
          <div class="info-bar">名称和 code 不可改。天数、金额、窗口到用户圈选里填。</div>
          ${metaLine}
          <label>展示名称 *
            <input class="input" data-form="name" value="${escapeHtml(form.name)}" ${nameLocked ? "readonly" : ""} placeholder="注册时间" />
          </label>
          <label>内部 code *
            <input class="input" data-form="code" value="${escapeHtml(form.code)}" readonly />
            <span class="field-hint">需向大数据同学要口径对应的 code，保存后不可改</span>
          </label>
          <label>准确描述 *
            <textarea class="input" rows="4" data-form="description" placeholder="写清判定口径，例如：注册成功的时间，圈选时用当前时间相减得到注册时长">${escapeHtml(form.description)}</textarea>
            ${descEmpty ? '<span class="field-error">描述不能为空</span>' : '<span class="field-hint">写清怎么判定，便于验收</span>'}
          </label>
        </div>
        <div class="drawer-foot">
          <button type="button" class="btn" data-act="close-drawer">取消</button>
          <button type="button" class="btn btn-primary" data-act="save-tag" ${saveDisabled ? "disabled" : ""}>保存</button>
        </div>
      </aside>
    </div>
  `;
}

function renderRefsDrawer() {
  const tagId = segmentState.refsDrawer;
  if (!tagId) return "";
  const tag = tagById(tagId);
  const packs = packsUsingTag(tagId);
  const list = packs.length
    ? packs
        .map(
          (pack) => `
        <button type="button" class="ref-item" data-act="goto-pack" data-id="${pack.id}">
          <div>${escapeHtml(pack.name)}</div>
          <div class="muted">${pack.enabled ? "已启用" : "已停用"}</div>
        </button>
      `,
        )
        .join("")
    : '<div class="empty-inline">尚未被任何人群包使用</div>';
  return `
    <div class="mask drawer-mask">
      <aside class="drawer slim">
        <div class="drawer-head">
          <h3>被哪些人群包使用 · ${escapeHtml(tag.name)}</h3>
          <button type="button" class="icon-x" data-act="close-refs">×</button>
        </div>
        <div class="drawer-body">${list}</div>
      </aside>
    </div>
  `;
}

function saveTag() {
  const drawer = segmentState.drawer;
  const form = drawer.form;
  if (!(form.description || "").trim() || !form.name.trim() || !form.code.trim()) {
    showToast("描述不能为空", "error");
    return;
  }
  if (!drawer.tag) return;
  Object.assign(drawer.tag, {
    name: form.system ? drawer.tag.name : form.name,
    params: form.params,
    description: form.description,
    updatedAt: "09-08 18:30",
    updatedBy: "运营小王",
  });
  segmentState.drawer = null;
  showToast("保存成功");
  renderApp();
}

function toggleTagStatus(id, nextStatus) {
  const tag = tagById(id);
  if (!tag) return;
  if (!nextStatus) nextStatus = tag.status === "enabled" ? "disabled" : "enabled";
  if (tag.status === nextStatus) return;
  const used = packsUsingTag(id);
  if (nextStatus === "disabled" && used.length) {
    showConfirm({
      title: "停用已被引用的标签",
      text: `圈选里仍引用该标签（${used.map((p) => p.name).join("、")}），停用后该条件失效，确认停用？`,
      okText: "停用",
      danger: true,
      onOk: () => {
        tag.status = "disabled";
        showToast("已停用");
        renderApp();
      },
    });
    return;
  }
  tag.status = nextStatus;
  showToast(nextStatus === "enabled" ? "已启用" : "已停用");
  renderApp();
}

function onTagLibClick(e) {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const act = btn.dataset.act;
  const id = btn.dataset.id;
  if (act === "reset") {
    segmentState.tagFilters = { q: "", status: "" };
    renderApp();
  } else if (act === "edit") {
    const tag = tagById(id);
    segmentState.drawer = {
      mode: "edit",
      tag,
      form: formFromTag(tag),
      dirty: false,
    };
    renderApp();
  } else if (act === "refs") {
    segmentState.refsDrawer = id;
    renderApp();
  } else if (act === "toggle-btn") {
    toggleTagStatus(id, btn.dataset.to);
  }
}

function onTagLibChange(e) {
  const el = e.target.closest("[data-filter]");
  if (!el) return;
  segmentState.tagFilters[el.dataset.filter] = el.value;
  renderApp();
}

function onTagLibKeydown(e) {
  const el = e.target.closest("[data-filter]");
  if (!el || el.dataset.filter !== "q" || e.key !== "Enter") return;
  segmentState.tagFilters.q = el.value;
  renderApp();
}

function packCreators() {
  const names = [];
  segmentState.packs.forEach((pack) => {
    if (pack.createdBy && !names.includes(pack.createdBy)) names.push(pack.createdBy);
  });
  return names;
}

function nextPackNo() {
  const nums = segmentState.packs.map((pack) => Number(String(pack.no || "").replace(/\D/g, "")) || 0);
  const next = Math.max(0, ...nums) + 1;
  return `QP${String(next).padStart(4, "0")}`;
}

function filteredPacks() {
  const q = segmentState.packSearch.trim().toLowerCase();
  return segmentState.packs.filter((pack) => {
    if (segmentState.packStatus === "enabled" && !pack.enabled) return false;
    if (segmentState.packStatus === "disabled" && pack.enabled) return false;
    if (segmentState.packCreator && pack.createdBy !== segmentState.packCreator) return false;
    if (!q) return true;
    return [pack.name, pack.code, pack.no, pack.desc].some((text) => String(text || "").toLowerCase().includes(q));
  });
}

function selectedPack() {
  return packById(segmentState.selectedPackId);
}

function blankCreatePack() {
  return {
    name: "",
    desc: "",
    enabled: false,
    includeMode: "and",
    includes: [],
    excludes: [],
    countries: [],
    devices: allDeviceIds(),
    templatePick: "",
    estimate: { include: 0, afterExclude: 0, total: 0 },
  };
}

function packFromEvent(e) {
  if (e && e.target && e.target.closest && e.target.closest("[data-pack-surface='create']")) {
    return segmentState.createPack;
  }
  return selectedPack();
}

function pickerPack() {
  const picker = segmentState.picker;
  if (picker && picker.surface === "create") return segmentState.createPack;
  return selectedPack();
}

function touchPack(pack) {
  if (!pack || pack === segmentState.createPack) return;
  segmentState.packDirty = true;
}

function fakeEstimate(pack) {
  const includeN = Math.max(pack.includes.length, 0);
  const base = 8000 + includeN * 18000;
  const orBoost = pack.includeMode === "or" ? 1 : Math.max(0.35, 1 - includeN * 0.2);
  const include = Math.round(base * orBoost);
  const cut = pack.excludes.length * 1200;
  const after = Math.max(0, include - cut);
  pack.estimate = { include, afterExclude: after, total: after };
}

function ensurePackExtras(pack) {
  if (!pack.countries) pack.countries = [];
  if (!Array.isArray(pack.devices)) pack.devices = allDeviceIds();
  if (!Array.isArray(pack.includes)) pack.includes = [];
  if (!Array.isArray(pack.excludes)) pack.excludes = [];
}

function condSelect(name, value, options, kind, index, field) {
  return `<select class="input" data-cond="${field}" data-kind="${kind}" data-index="${index}">
    ${options
      .map((item) => `<option value="${item.value}" ${value === item.value ? "selected" : ""}>${item.label}</option>`)
      .join("")}
  </select>`;
}

function renderCondFields(tag, cond, kind, index, surface) {
  if (!tag || !cond) return "";
  const compareDays = [
    { value: "lte", label: "不超过" },
    { value: "gt", label: "超过" },
  ];
  const compareNum = [
    { value: "gt", label: "大于" },
    { value: "gte", label: "大于等于" },
    { value: "lt", label: "小于" },
    { value: "lte", label: "小于等于" },
    { value: "eq", label: "等于" },
    { value: "between", label: "区间" },
  ];
  const windows = [
    { value: "24h", label: "近 24 小时" },
    { value: "7d", label: "近 7 日" },
    { value: "30d", label: "近 30 日" },
    { value: "all", label: "累计" },
    { value: "nd", label: "最近 N 日" },
  ];
  if (tag.kind === "enum") {
    return `<div class="cond-params"><span>等于</span>${condSelect("value", cond.value, tag.options || [], kind, index, "value")}</div>`;
  }
  if (tag.kind === "latch") {
    return `<div class="cond-params">
      <label class="fee-radio"><input type="radio" name="latch-${surface || "edit"}-${kind}-${index}" data-cond="latch" data-kind="${kind}" data-index="${index}" value="yes" ${cond.latch !== "no" ? "checked" : ""} /> 明确是</label>
      <label class="fee-radio"><input type="radio" name="latch-${surface || "edit"}-${kind}-${index}" data-cond="latch" data-kind="${kind}" data-index="${index}" value="no" ${cond.latch === "no" ? "checked" : ""} /> 明确否</label>
      <span class="field-hint">未知不能当成否</span>
    </div>`;
  }
  if (tag.kind === "time") {
    return `<div class="cond-params">
      <span>${escapeHtml(tag.prompt || "距今")}</span>
      ${condSelect("compare", cond.compare || "lte", compareDays, kind, index, "compare")}
      <input class="input narrow" data-cond="amount" data-kind="${kind}" data-index="${index}" value="${escapeHtml(cond.amount)}" />
      <span>日</span>
    </div>`;
  }
  if (tag.kind === "balance") {
    const between = cond.compare === "between";
    return `<div class="cond-params">
      ${condSelect("compare", cond.compare || "gte", compareNum, kind, index, "compare")}
      <input class="input narrow" data-cond="amount" data-kind="${kind}" data-index="${index}" value="${escapeHtml(cond.amount)}" />
      ${between ? `<span>至</span><input class="input narrow" data-cond="amount2" data-kind="${kind}" data-index="${index}" value="${escapeHtml(cond.amount2)}" />` : ""}
      <span>个</span>
    </div>`;
  }
  if (tag.kind === "watch" || tag.kind === "pay") {
    const between = cond.compare === "between";
    const scope =
      tag.kind === "watch"
        ? condSelect(
            "scope",
            cond.scope,
            [
              { value: "", label: "统计范围" },
              { value: "trial", label: "试看" },
              { value: "full", label: "正片" },
              { value: "all", label: "全部" },
            ],
            kind,
            index,
            "scope",
          )
        : condSelect(
            "product",
            cond.product,
            [
              { value: "", label: "产品线（必选）" },
              { value: "sub", label: "仅订阅" },
              { value: "coin", label: "仅金币" },
              { value: "both", label: "订阅与金币合计" },
            ],
            kind,
            index,
            "product",
          );
    return `<div class="cond-params">
      ${scope}
      ${condSelect("window", cond.window || "all", windows, kind, index, "window")}
      ${cond.window === "nd" ? `<input class="input narrow" data-cond="windowDays" data-kind="${kind}" data-index="${index}" value="${escapeHtml(cond.windowDays)}" placeholder="N" /><span>日，最多 180</span>` : ""}
      ${condSelect("compare", cond.compare || "gt", compareNum, kind, index, "compare")}
      <input class="input narrow" data-cond="amount" data-kind="${kind}" data-index="${index}" value="${escapeHtml(cond.amount)}" />
      ${between ? `<span>至</span><input class="input narrow" data-cond="amount2" data-kind="${kind}" data-index="${index}" value="${escapeHtml(cond.amount2)}" />` : ""}
      <span>${tag.kind === "watch" ? "秒" : "元"}</span>
    </div>`;
  }
  return "";
}

function renderTagRow(kind, item, index, surface) {
  const id = condTagId(item);
  const tag = tagById(id);
  const missing = !tag || tag.status !== "enabled";
  const label = tag ? tag.name : "标签已失效";
  const cond = item && typeof item === "object" ? item : { tagId: id };
  return `
    <div class="seg-filter-row">
      <button type="button" class="seg-filter-name ${missing ? "bad" : ""}" data-act="open-picker" data-kind="${kind}" data-index="${index}" title="${escapeHtml(tag ? tag.description : "")}">
        ${escapeHtml(label)}
      </button>
      <div class="seg-filter-control">
        ${tag ? renderCondFields(tag, cond, kind, index, surface) : '<span class="field-hint">标签已失效</span>'}
        ${tag ? `<button type="button" class="link" data-act="open-tag" data-id="${tag.id}">查看</button>` : ""}
      </div>
      <button type="button" class="seg-trash" data-act="del-cond" data-kind="${kind}" data-index="${index}" aria-label="删除条件">×</button>
    </div>
  `;
}

function renderCountryOptions(query, selected) {
  const picked = new Set((selected || []).map((code) => code.toUpperCase()));
  const list = filterCountries(query).filter((item) => !picked.has(item.code));
  if (!list.length) {
    const typed = String(query || "").trim().toUpperCase();
    if (/^[A-Z]{2}$/.test(typed) && !picked.has(typed)) {
      return `<button type="button" class="country-item" data-act="pick-country" data-code="${typed}">使用代码 ${typed}</button>`;
    }
    return '<div class="empty-inline">没有匹配的国家</div>';
  }
  return list
    .map(
      (item) =>
        `<button type="button" class="country-item" data-act="pick-country" data-code="${item.code}"><b>${item.code}</b><span>${escapeHtml(item.name)}</span></button>`,
    )
    .join("");
}

function renderCountryField(pack) {
  const selected = pack.countries || [];
  const chips = selected
    .map((code) => {
      const item = countryByCode(code);
      return `<span class="country-chip">${item.code} ${escapeHtml(item.name)}<button type="button" data-act="remove-country" data-code="${item.code}">×</button></span>`;
    })
    .join("");
  return `
    <div class="seg-inline-row is-top">
      <div class="seg-inline-name">当次请求地区</div>
      <div class="seg-inline-fields seg-stack">
        <div class="country-box">
          <div class="country-chips">${chips || ""}</div>
          <input class="input" data-country-q placeholder="输入 US / 美国 后回车或点选" value="${escapeHtml(segmentState.countryQuery)}" autocomplete="off" />
          <div class="country-drop${segmentState.countryOpen ? " open" : ""}">${renderCountryOptions(segmentState.countryQuery, selected)}</div>
        </div>
        <p class="filter-hint">不选表示不限地区。选出的地区表示当次请求需在这些地区可售。</p>
      </div>
    </div>
  `;
}

const DEVICE_OPTIONS = [
  { id: "android", label: "安卓" },
  { id: "ios", label: "苹果" },
  { id: "web", label: "Web" },
  { id: "h5", label: "H5" },
];

function allDeviceIds() {
  return DEVICE_OPTIONS.map((item) => item.id);
}

function devicesMatch(devices, expected) {
  const selected = devices || [];
  return selected.length === expected.length && expected.every((id) => selected.includes(id));
}

function renderDeviceField(pack) {
  const selected = new Set(pack.devices || []);
  const options = DEVICE_OPTIONS.map(
    (item) => `
      <label>
        <input type="checkbox" data-device="${item.id}" ${selected.has(item.id) ? "checked" : ""} />
        ${item.label}
      </label>`,
  ).join("");
  return `
    <div class="seg-inline-row is-top">
      <div class="seg-inline-name">用户设备</div>
      <div class="seg-inline-fields seg-stack">
        <div class="device-options">${options}</div>
        <p class="filter-hint">默认全选，可取消一项或多项。当次请求须来自仍选中的端。</p>
      </div>
    </div>
  `;
}

function pickerOccupiedIds() {
  const picker = segmentState.picker;
  const occupied = new Set((picker && picker.selected) || []);
  const pack = pickerPack();
  if (pack && picker && picker.kind) {
    (pack[picker.kind] || []).forEach((item, index) => {
      if (picker.index >= 0 && index === picker.index) return;
      occupied.add(condTagId(item));
    });
  }
  return [...occupied];
}

function pickerLockReason(tag) {
  const picker = segmentState.picker;
  const selected = (picker && picker.selected) || [];
  if (selected.includes(tag.id)) return "";
  const occupiedIds = pickerOccupiedIds();
  if (occupiedIds.includes(tag.id)) return "该标签已在条件中";
  return "";
}

function pickerOptionHtml(tag) {
  const selected = (segmentState.picker && segmentState.picker.selected) || [];
  const checked = selected.includes(tag.id);
  const reason = pickerLockReason(tag);
  const locked = Boolean(reason);
  return `
    <label class="tag-option${locked ? " is-locked" : ""}" data-act="toggle-pick" data-id="${tag.id}" ${locked ? 'data-locked="1"' : ""}>
      <input type="checkbox" ${checked ? "checked" : ""} ${locked ? "disabled" : ""} />
      <span>${escapeHtml(tag.name)}</span>
      <span class="tag-bubble">${escapeHtml(reason || tag.description)}</span>
    </label>
  `;
}

function filteredPickerTags() {
  const picker = segmentState.picker;
  const q = (picker.q || "").trim().toLowerCase();
  return enabledTags().filter((tag) => {
    if (!q) return true;
    return [tag.name, tag.code, tag.description].join(" ").toLowerCase().includes(q);
  });
}

function renderPickerOptionsHtml() {
  const tags = filteredPickerTags();
  if (!tags.length) return '<div class="empty-inline">没有可选项，请先到标签库启用标签</div>';
  const groups = [];
  tags.forEach((tag) => {
    const name = tag.group || "其他";
    let group = groups.find((item) => item.name === name);
    if (!group) {
      group = { name, tags: [] };
      groups.push(group);
    }
    group.tags.push(tag);
  });
  return groups
    .map(
      (group) => `
        <section class="picker-group">
          <div class="picker-group-title">${escapeHtml(group.name)}</div>
          <div class="picker-group-grid">${group.tags.map((tag) => pickerOptionHtml(tag)).join("")}</div>
        </section>`,
    )
    .join("");
}

function refreshPickerList(root) {
  const list = (root || document).querySelector(".add-list");
  if (list) list.innerHTML = renderPickerOptionsHtml();
}

const TAG_PAGE_GROUPS = [
  { id: "base", title: "用户基础属性", tags: ["identity_type", "register_at"] },
  {
    id: "growth",
    title: "用户增长标签",
    account: [
      "subscription_status",
      "subscription_expire_at",
      "ever_subscription_paid",
      "first_subscription_pay_at",
      "ever_coin_paid",
      "first_coin_pay_at",
      "coin_balance",
    ],
    device: ["device_redeemed_intro_subscription", "device_redeemed_intro_coin"],
  },
  { id: "active", title: "活跃度行为", tags: ["last_active_at"] },
  { id: "consume", title: "内容消费行为", tags: ["watch_duration", "pay_amount"] },
  { id: "risk", title: "风险与异常", tags: ["account_status", "age_verify_status"] },
];

function tagPanelOpen(id) {
  const panels = segmentState.tagPanels || {};
  return Boolean(panels[id]);
}

function renderInlineTag(pack, tagId, surface) {
  const tag = tagById(tagId);
  if (!tag) return "";
  const index = (pack.includes || []).findIndex((row) => condTagId(row) === tagId);
  const excluded = (pack.excludes || []).some((row) => condTagId(row) === tagId);
  const on = index >= 0;
  const fields = excluded
    ? `<span class="field-hint">这个标签已在排除条件里</span>`
    : on
      ? renderCondFields(tag, pack.includes[index], "includes", index, surface)
      : `<span class="field-hint">勾选后填写这个标签</span>`;
  return `
    <div class="seg-inline-row">
      <label class="seg-inline-name"><input type="checkbox" data-inline-tag="${tag.id}" ${on ? "checked" : ""} ${excluded ? "disabled" : ""} />${escapeHtml(tag.name)}</label>
      <div class="seg-inline-fields">${fields}</div>
    </div>
  `;
}

function selectedGrowthScopes() {
  const scopes = Array.isArray(segmentState.growthScopes) ? segmentState.growthScopes : ["account", "device"];
  return ["account", "device"].filter((id) => scopes.includes(id));
}

function renderGrowthDimension(pack, group) {
  const scopes = selectedGrowthScopes();
  const open = Boolean(segmentState.growthScopeOpen);
  const labels = { account: "账号维度", device: "设备维度" };
  const summary = scopes.length ? scopes.map((id) => labels[id]).join("、") : "请选择圈选维度";
  const options = ["account", "device"]
    .map(
      (id) => `
        <label class="seg-scope-option">
          <input type="checkbox" data-growth-scope="${id}" ${scopes.includes(id) ? "checked" : ""} />
          ${labels[id]}
        </label>`,
    )
    .join("");
  const hidden = ["account", "device"]
    .filter((id) => !scopes.includes(id))
    .map((id) => {
      const count = group[id].filter((tagId) => (pack.includes || []).some((row) => condTagId(row) === tagId)).length;
      return count ? `<p class="filter-hint">${labels[id]}还有 ${count} 个已选标签，勾选该维度后可查看</p>` : "";
    })
    .join("");
  return `
    <div class="seg-inline-row is-top">
      <div class="seg-inline-name">圈选维度</div>
      <div class="seg-inline-fields seg-stack">
        <div class="seg-scope${open ? " open" : ""}">
          <button type="button" class="input seg-scope-trigger${scopes.length ? "" : " is-empty"}" data-act="toggle-growth-scope">${escapeHtml(summary)}</button>
          <div class="seg-scope-menu">${options}</div>
        </div>
        ${hidden}
      </div>
    </div>
  `;
}

function renderGrowthRows(pack, surface, group) {
  const labels = { account: "账号维度", device: "设备维度" };
  return selectedGrowthScopes()
    .map((scope) => {
      const rows = group[scope].map((id) => renderInlineTag(pack, id, surface)).join("");
      return `<div class="seg-scope-block"><div class="seg-scope-title">${labels[scope]}</div>${rows}</div>`;
    })
    .join("");
}

function renderInlineTagGroups(pack, surface) {
  return TAG_PAGE_GROUPS.map((group) => {
    const open = tagPanelOpen(group.id);
    const rows = open ? (group.id === "growth" ? renderGrowthRows(pack, surface, group) : group.tags.map((id) => renderInlineTag(pack, id, surface)).join("")) : "";
    const dimension = group.id === "growth" && open ? renderGrowthDimension(pack, group) : "";
    const basics = group.id === "base" && open ? renderCountryField(pack) + renderDeviceField(pack) : "";
    return `
      <section class="seg-panel${open ? " open" : ""}">
        <button type="button" class="seg-panel-head" data-act="toggle-tag-panel" data-id="${group.id}">
          <span>${group.title}</span>
          <i>${open ? "⌃" : "⌄"}</i>
        </button>
        ${open ? `<div class="seg-panel-body">${basics}${dimension}${rows}</div>` : ""}
      </section>
    `;
  }).join("");
}

function renderPackSections(pack, surface) {
  ensurePackExtras(pack);
  const templatePick = surface === "create" ? pack.templatePick || "" : segmentState.templatePick;
  const excludeRows = pack.excludes.map((id, index) => renderTagRow("excludes", id, index, surface)).join("");
  return `
    <section class="seg-filter-card">
      <div class="form-grid">
        <label class="span-2">人群包名称 *
          <input class="input" data-pack="name" value="${escapeHtml(pack.name)}" placeholder="例如：未付费新人" />
        </label>
        <label class="span-2">说明
          <textarea class="input" rows="2" data-pack="desc" placeholder="这个人群包用来圈选谁">${escapeHtml(pack.desc)}</textarea>
        </label>
      </div>
      <div class="seg-template">
        <select class="input" data-template-pick>
          <option value="">选择圈选模板</option>
          ${listSegmentTemplates()
            .map((item) => `<option value="${item.key}" ${templatePick === item.key ? "selected" : ""}>${escapeHtml(item.label)}</option>`)
            .join("")}
        </select>
        <button type="button" class="btn" data-act="apply-template">套用模板</button>
      </div>
      <div class="seg-block-label">行为标签圈选</div>
      <div class="radios">
        <label><input type="radio" name="includeMode-${surface}" data-pack="includeMode" value="or" ${pack.includeMode === "or" ? "checked" : ""} /> 满足任意</label>
        <label><input type="radio" name="includeMode-${surface}" data-pack="includeMode" value="and" ${pack.includeMode === "and" ? "checked" : ""} /> 同时满足</label>
      </div>
      <p class="filter-hint">按分类直接勾选。未勾选的标签不进入这个人群包。</p>
      <div class="seg-panels">${renderInlineTagGroups(pack, surface)}</div>
      <div class="seg-block-label">排除条件</div>
      <p class="filter-hint">命中排除中任一标签的用户不进包</p>
      <div class="seg-filter-list">
        ${excludeRows || '<div class="empty-inline">无排除标签</div>'}
      </div>
      <button type="button" class="seg-add" data-act="add-cond" data-kind="excludes">+ 添加排除标签</button>
    </section>
  `;
}

function compareLabel(kind, value) {
  if (kind === "time") return value === "gt" ? "超过" : "不超过";
  const map = {
    gt: "大于",
    gte: "大于等于",
    lt: "小于",
    lte: "小于等于",
    eq: "等于",
    between: "区间",
  };
  return map[value] || "—";
}

function windowLabel(item) {
  const map = {
    "24h": "近 24 小时",
    "7d": "近 7 日",
    "30d": "近 30 日",
    all: "累计",
  };
  if (item.window === "nd") return `最近 ${item.windowDays || "N"} 日`;
  return map[item.window] || "—";
}

function condSummary(item) {
  const tag = tagById(condTagId(item));
  if (!tag || !item || typeof item !== "object") return "标签已失效";
  if (tag.kind === "enum") {
    const opt = (tag.options || []).find((option) => option.value === item.value);
    return `等于 ${opt ? opt.label : item.value || "—"}`;
  }
  if (tag.kind === "latch") return item.latch === "no" ? "明确否" : "明确是";
  if (tag.kind === "time") return `${tag.prompt || "距今"} ${compareLabel("time", item.compare)} ${item.amount || "—"} 日`;
  if (tag.kind === "balance") {
    if (item.compare === "between") return `区间 ${item.amount || "—"} 至 ${item.amount2 || "—"} 个`;
    return `${compareLabel("balance", item.compare)} ${item.amount || "—"} 个`;
  }
  if (tag.kind === "watch" || tag.kind === "pay") {
    const head =
      tag.kind === "watch"
        ? { trial: "试看", full: "正片", all: "全部" }[item.scope] || "未选范围"
        : { sub: "仅订阅", coin: "仅金币", both: "订阅与金币合计" }[item.product] || "未选产品线";
    const unit = tag.kind === "watch" ? "秒" : "元";
    const amount = item.compare === "between" ? `${item.amount || "—"} 至 ${item.amount2 || "—"}` : item.amount || "—";
    return `${head}，${windowLabel(item)}，${compareLabel(tag.kind, item.compare)} ${amount} ${unit}`;
  }
  return "—";
}

function renderCondSummaryList(list) {
  if (!list || !list.length) return '<div class="empty-inline">无</div>';
  return list
    .map((item) => {
      const tag = tagById(condTagId(item));
      return `
        <div class="cond-block">
          <div class="cell-title">${escapeHtml(tag ? tag.name : "标签已失效")}</div>
          <div class="cond-summary">${escapeHtml(condSummary(item))}</div>
        </div>
      `;
    })
    .join("");
}

function renderPackDetailDialog() {
  const pack = packById(segmentState.detailPackId);
  if (!pack) return "";
  ensurePackExtras(pack);
  const countries = (pack.countries || []).map((code) => {
    const item = countryByCode(code);
    return `${item.code} ${item.name}`;
  });
  const devices = DEVICE_OPTIONS.filter((item) => (pack.devices || []).includes(item.id)).map((item) => item.label);
  const est = pack.estimate || { total: 0 };
  return `
    <div class="mask">
      <div class="dialog create-pack-dialog">
        <div class="dialog-title">人群包详情</div>
        <div class="dialog-body">
          <div class="detail-kv">
            <span>名称</span><b>${escapeHtml(pack.name)}</b>
            <span>code</span><b>${escapeHtml(pack.code || "—")}</b>
            <span>编号</span><b>${escapeHtml(pack.no || "—")}</b>
            <span>状态</span><b>${pack.enabled ? "已启用" : "已停用"}</b>
            <span>创建者</span><b>${escapeHtml(pack.createdBy || "—")}</b>
            <span>引用</span><b>${pack.bindCount > 0 ? pack.bindCount : "未被绑定"}</b>
            <span>更新</span><b>${escapeHtml(pack.updatedAt || "—")}</b>
            <span>说明</span><b>${escapeHtml(pack.desc || "—")}</b>
          </div>
          <h4>包含区 · ${pack.includeMode === "or" ? "满足任意" : "同时满足"}</h4>
          ${pack.includes.length ? renderCondSummaryList(pack.includes) : '<div class="empty-inline">无标签条件</div>'}
          <h4>当次请求地区</h4>
          <p>${countries.length ? escapeHtml(countries.join("、")) : "不限地区"}</p>
          <h4>用户设备</h4>
          <p>${devices.length ? escapeHtml(devices.join("、")) : "未选择设备"}</p>
          <h4>排除区</h4>
          ${renderCondSummaryList(pack.excludes)}
          <h4>预估</h4>
          <p>符合条件用户数 ${Number(est.total || 0).toLocaleString()}</p>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-act="close-detail">关闭</button>
          <button type="button" class="btn btn-primary" data-act="detail-to-edit">编辑</button>
        </div>
      </div>
    </div>
  `;
}

function openPackEditor(id) {
  const pack = packById(id);
  if (!pack) return;
  const draft = clone(pack);
  draft.editingId = pack.id;
  draft.templatePick = "";
  ensurePackExtras(draft);
  segmentState.countryQuery = "";
  segmentState.countryOpen = false;
  segmentState.detailPackId = null;
  segmentState.createPack = draft;
  segmentState.tagPanels = {};
  segmentState.growthScopes = ["account", "device"];
  segmentState.growthScopeOpen = false;
  segmentState.createNameFocused = false;
  renderApp();
}

function renderCreatePackDialog() {
  const pack = segmentState.createPack;
  if (!pack || !Array.isArray(pack.includes)) return "";
  const name = (pack.name || "").trim();
  const editing = Boolean(pack.editingId);
  const est = pack.estimate || { include: 0, afterExclude: 0, total: 0 };
  const detail = segmentState.estimateOpen
    ? `<div class="seg-est-detail">
        <span>包含区 ${Number(est.include || 0).toLocaleString()}</span>
        <span>排除后 ${Number(est.afterExclude || 0).toLocaleString()}</span>
        <button type="button" class="btn" data-act="refresh-est">刷新预估</button>
        <button type="button" class="btn" data-act="download-users">用户列表下载</button>
      </div>`
    : "";
  return `
    <div class="mask">
      <div class="dialog create-pack-dialog seg-create" data-pack-surface="create">
        <div class="dialog-title">
          <span>${editing ? "编辑分群 · 设定筛选条件" : "创建分群 · 设定筛选条件"}</span>
          <button type="button" class="btn" data-act="open-pack-guide">新手必读</button>
        </div>
        <div class="dialog-body create-pack-form">
          <label class="enable-switch ${pack.enabled ? "on" : ""}">
            <input type="checkbox" data-pack="enabled" ${pack.enabled ? "checked" : ""} />
            <span class="enable-track"></span>
            <span class="enable-text">${pack.enabled ? "已启用" : "未启用"}</span>
          </label>
          ${renderPackSections(pack, "create")}
        </div>
        <div class="seg-est-foot">
          <div class="seg-est-num">
            <b>${Number(est.total || 0).toLocaleString()}</b>
            <span>预估人群规模</span>
          </div>
          <div class="seg-est-actions">
            <button type="button" class="btn" data-act="toggle-est-detail">${segmentState.estimateOpen ? "收起明细" : "查看明细"}</button>
            <button type="button" class="btn" data-act="close-create-pack">取消</button>
            <button type="button" class="btn seg-save" data-act="confirm-create-pack" ${name ? "" : "disabled"}>${editing ? "保存修改" : "保存为新分群"}</button>
          </div>
        </div>
        ${detail}
      </div>
    </div>
  `;
}

function renderPackGuide() {
  if (!segmentState.packGuide) return "";
  return `
    <div class="mask">
      <div class="dialog pack-guide-dialog">
        <div class="dialog-title">
          <span>新手必读</span>
          <button type="button" class="icon-x" data-act="close-pack-guide" aria-label="关闭">×</button>
        </div>
        <div class="dialog-body">
          <p class="filter-hint">下面是创建人群包时要注意的事。</p>
          <ol class="pack-guide-list">
            <li>点保存才会进入列表。取消或关闭后，这次填写不会留下。</li>
            <li>名称必填。编号和创建者在保存时生成，之后不能改。</li>
            <li>标签可以不选。只选当次请求地区，或只选用户设备，也可以保存。</li>
            <li>天数、金额、秒数和窗口写在这个人群包的标签上。</li>
            <li>模板是系统准备的 5 个。先在下拉里选中，再点套用。套用会换掉包含区、清空排除区，并改成同时满足。名称、地区和设备保持不动。包含区或排除区已经有标签时，会先确认。套用完还要点保存。</li>
            <li>地区留空表示不限地区。设备默认四个都选中，取消后只匹配剩下的端；四个都取消，就没有设备能命中。</li>
            <li>年龄验证要通过、账号要正常、当次请求地区要可售。这三条每次判定都会检查。</li>
            <li>要覆盖全部用户，引用已有的「全部用户」。</li>
            <li>停用后，已经引用的业务可以继续用，新业务不能再选。有引用时不能删除。</li>
          </ol>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn btn-primary" data-act="close-pack-guide">知道了</button>
        </div>
      </div>
    </div>
  `;
}

function commitCreatePack() {
  const draft = segmentState.createPack;
  if (!draft) return;
  const name = (draft.name || "").trim();
  if (!name) {
    showToast("请填写人群包名称", "error");
    return;
  }
  ensurePackExtras(draft);
  if (draft.editingId) {
    const current = packById(draft.editingId);
    if (!current) return;
    current.name = name;
    current.desc = (draft.desc || "").trim();
    current.enabled = Boolean(draft.enabled);
    current.includeMode = draft.includeMode || "and";
    current.includes = draft.includes;
    current.excludes = draft.excludes;
    current.countries = draft.countries || [];
    current.devices = draft.devices || [];
    current.estimate = draft.estimate || current.estimate;
    current.updatedAt = "刚刚";
    segmentState.createPack = null;
    segmentState.packDirty = false;
    segmentState.countryOpen = false;
    segmentState.countryQuery = "";
    segmentState.estimateOpen = false;
    showToast("已保存");
    renderApp();
    return;
  }
  const saved = {
    id: `pack_${Date.now()}`,
    no: nextPackNo(),
    name,
    code: `seg_${Date.now().toString(36)}`,
    createdBy: "运营小王",
    desc: (draft.desc || "").trim(),
    enabled: Boolean(draft.enabled),
    includeMode: draft.includeMode || "and",
    includes: draft.includes,
    excludes: draft.excludes,
    countries: draft.countries || [],
    devices: draft.devices || [],
    bindCount: 0,
    updatedAt: "刚刚",
    estimate: draft.estimate || { include: 0, afterExclude: 0, total: 0 },
  };
  const go = () => {
    segmentState.packs.unshift(saved);
    segmentState.selectedPackId = saved.id;
    segmentState.packDirty = false;
    segmentState.createPack = null;
    segmentState.countryOpen = false;
    segmentState.countryQuery = "";
    segmentState.estimateOpen = false;
    showToast("已保存");
    renderApp();
  };
  if (segmentState.packDirty) confirmLeaveIfDirty(go);
  else go();
}

function renderPicker() {
  const picker = segmentState.picker;
  if (!picker) return "";
  return `
    <div class="mask">
      <div class="dialog picker-dialog">
        <div class="dialog-title">选择标签</div>
        <div class="dialog-body">
          <input class="input" data-picker-q placeholder="搜索名称 / 描述" value="${escapeHtml(picker.q || "")}" />
          <div class="add-list">${renderPickerOptionsHtml()}</div>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-act="close-picker">取消</button>
          <button type="button" class="btn btn-primary" data-act="confirm-pick">确定</button>
        </div>
      </div>
    </div>
  `;
}

function renderAudiencePage() {
  const packs = filteredPacks();
  const rows = packs
    .map((item) => {
      const desc = item.desc || "";
      const summary = desc.length > 40 ? `${desc.slice(0, 40)}…` : desc;
      const bind = item.bindCount > 0 ? String(item.bindCount) : "未被绑定";
      const toggleLabel = item.enabled ? "停用" : "启用";
      const status = item.enabled ? "已启用" : '<span class="pill red">已停用</span>';
      return `
        <tr class="data-row">
          <td>${escapeHtml(item.no || "—")}</td>
          <td>
            <div class="cell-title">${escapeHtml(item.name)}</div>
            <code class="cell-code">${escapeHtml(item.code || "")}</code>
          </td>
          <td><span class="truncate" title="${escapeHtml(desc)}">${escapeHtml(summary) || "—"}</span></td>
          <td>${status}</td>
          <td>${escapeHtml(item.createdBy || "—")}</td>
          <td>${bind}</td>
          <td>${escapeHtml(item.updatedAt || "—")}</td>
          <td class="ops">
            <button type="button" class="link" data-act="open-detail" data-id="${item.id}">详情</button>
            <button type="button" class="link" data-act="edit-pack" data-id="${item.id}">编辑</button>
            <button type="button" class="link" data-act="toggle-pack" data-id="${item.id}">${toggleLabel}</button>
            <button type="button" class="link danger" data-act="delete-pack" data-id="${item.id}">删除</button>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    ${renderTopbar("用户圈选")}
    <div class="page">
      <div class="page-head">
        <div>
          <h1>用户圈选</h1>
          <p>已保存的人群包。点详情查看配置。</p>
        </div>
        <div class="page-head-actions">
          <button type="button" class="btn btn-primary" data-act="create-pack">新建人群包</button>
        </div>
      </div>
      <div class="filter-bar">
        <input class="input" data-pack-search placeholder="搜索名称 / code / 说明" value="${escapeHtml(segmentState.packSearch)}" />
        <select class="input" data-pack-status>
          <option value="">全部状态</option>
          <option value="enabled" ${segmentState.packStatus === "enabled" ? "selected" : ""}>已启用</option>
          <option value="disabled" ${segmentState.packStatus === "disabled" ? "selected" : ""}>已停用</option>
        </select>
        <select class="input" data-pack-creator>
          <option value="">全部创建者</option>
          ${packCreators()
            .map((name) => `<option value="${escapeHtml(name)}" ${segmentState.packCreator === name ? "selected" : ""}>${escapeHtml(name)}</option>`)
            .join("")}
        </select>
        <button type="button" class="btn-text" data-act="reset-packs">重置</button>
      </div>
      <div class="table-card">
        ${
          packs.length
            ? `<table class="data-table">
                <thead>
                  <tr>
                    <th>编号</th><th>人群包</th><th>说明</th><th>状态</th>
                    <th>创建者</th><th>引用</th><th>更新</th><th>操作</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
              <div class="pager">共 ${packs.length} 条</div>`
            : `<div class="empty">
                <div class="empty-art"></div>
                <div>还没有人群包</div>
              </div>`
        }
      </div>
    </div>
  `;
}

function addCountry(code, pack) {
  if (!pack) pack = selectedPack();
  if (!pack) return;
  ensurePackExtras(pack);
  const upper = String(code || "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) {
    showToast("请输入两位 ISO 国家代码，如 US", "error");
    return;
  }
  if (!pack.countries.includes(upper)) pack.countries.push(upper);
  segmentState.countryQuery = "";
  segmentState.countryOpen = false;
  touchPack(pack);
  renderApp();
}

function onAudienceClick(e) {
  if (!e.target.closest(".country-box") && segmentState.countryOpen) {
    segmentState.countryOpen = false;
    document.querySelectorAll(".country-drop").forEach((drop) => drop.classList.remove("open"));
  }
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const act = btn.dataset.act;
  if (act === "select-pack") {
    const next = () => {
      segmentState.selectedPackId = btn.dataset.id;
      segmentState.packDirty = false;
      renderApp();
    };
    if (segmentState.packDirty) confirmLeaveIfDirty(next);
    else next();
  } else if (act === "open-detail") {
    segmentState.detailPackId = btn.dataset.id;
    renderApp();
  } else if (act === "edit-pack") {
    openPackEditor(btn.dataset.id);
  } else if (act === "toggle-pack") {
    const pack = packById(btn.dataset.id);
    if (!pack) return;
    pack.enabled = !pack.enabled;
    pack.updatedAt = "刚刚";
    showToast(pack.enabled ? "已启用" : "已停用");
    renderApp();
  } else if (act === "reset-packs") {
    segmentState.packSearch = "";
    segmentState.packStatus = "";
    segmentState.packCreator = "";
    renderApp();
  } else if (act === "create-pack") {
    segmentState.countryQuery = "";
    segmentState.countryOpen = false;
    segmentState.createPack = blankCreatePack();
    segmentState.tagPanels = {};
    segmentState.growthScopes = ["account", "device"];
    segmentState.growthScopeOpen = false;
    segmentState.createNameFocused = false;
    renderApp();
  } else if (act === "add-cond") {
    segmentState.picker = {
      kind: btn.dataset.kind,
      index: -1,
      q: "",
      selected: [],
      surface: e.target.closest("[data-pack-surface='create']") ? "create" : "edit",
    };
    renderApp();
  } else if (act === "open-picker") {
    const pack = packFromEvent(e);
    const current = pack ? pack[btn.dataset.kind][Number(btn.dataset.index)] : "";
    segmentState.picker = {
      kind: btn.dataset.kind,
      index: Number(btn.dataset.index),
      q: "",
      selected: current ? [condTagId(current)] : [],
      surface: e.target.closest("[data-pack-surface='create']") ? "create" : "edit",
    };
    renderApp();
  } else if (act === "del-cond") {
    const pack = packFromEvent(e);
    pack[btn.dataset.kind].splice(Number(btn.dataset.index), 1);
    fakeEstimate(pack);
    touchPack(pack);
    renderApp();
  } else if (act === "apply-template") {
    const pack = packFromEvent(e);
    const key = pack === segmentState.createPack ? pack.templatePick : segmentState.templatePick;
    const tpl = listSegmentTemplates().find((item) => item.key === key);
    if (!pack || !tpl) {
      showToast("请先选择圈选模板", "error");
      return;
    }
    const apply = () => {
      pack.includeMode = "and";
      pack.includes = clone(tpl.includes);
      pack.excludes = [];
      if (!pack.desc) pack.desc = tpl.desc;
      fakeEstimate(pack);
      touchPack(pack);
      showToast(`已套用「${tpl.label}」`);
      renderApp();
    };
    if (pack.includes.length || pack.excludes.length) {
      showConfirm({
        title: "套用模板",
        text: `将用「${tpl.label}」覆盖当前包含和排除条件。`,
        okText: "覆盖",
        danger: true,
        onOk: apply,
      });
      return;
    }
    apply();
  } else if (act === "pick-country") {
    addCountry(btn.dataset.code, packFromEvent(e));
  } else if (act === "remove-country") {
    const pack = packFromEvent(e);
    ensurePackExtras(pack);
    pack.countries = pack.countries.filter((code) => code !== btn.dataset.code);
    touchPack(pack);
    renderApp();
  } else if (act === "open-tag") {
    navigateTo("user-tag-library", { tagId: btn.dataset.id, openDrawer: true });
  } else if (act === "refresh-est") {
    const pack = packFromEvent(e);
    fakeEstimate(pack);
    pack.estimate.total += Math.floor(Math.random() * 80 - 40);
    pack.estimate.afterExclude = pack.estimate.total;
    touchPack(pack);
    showToast("已刷新预估");
    renderApp();
  } else if (act === "download-users") {
    const pack = packFromEvent(e);
    const count = pack.estimate.total;
    if (!count) {
      showToast("当前预估人数为 0，没有可下载用户", "error");
      return;
    }
    const rows = ["uid"];
    const sample = Math.min(50, count);
    for (let i = 0; i < sample; i += 1) {
      rows.push(`u_${String(100000 + i).slice(1)}****${String(10 + (i % 90)).padStart(2, "0")}`);
    }
    const blob = new Blob([`${rows.join("\n")}\n`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pack.name || "segment"}_users.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("已开始下载用户列表");
  } else if (act === "save-pack") {
    const pack = selectedPack();
    if (!pack.name.trim() || pack.name === "未命名人群包") {
      showToast("请填写人群包名称", "error");
      return;
    }
    pack.updatedAt = "刚刚";
    segmentState.packDirty = false;
    showToast("保存成功");
    renderApp();
  } else if (act === "delete-pack") {
    const pack = packById(btn.dataset.id) || selectedPack();
    if (!pack) return;
    if (pack.bindCount > 0) {
      showToast("有业务已绑定该包，不能删，先去业务侧解绑", "error");
      return;
    }
    showConfirm({
      title: "删除人群包",
      text: `确认删除「${pack.name}」？`,
      okText: "删除",
      danger: true,
      onOk: () => {
        segmentState.packs = segmentState.packs.filter((item) => item.id !== pack.id);
        if (segmentState.selectedPackId === pack.id) {
          segmentState.selectedPackId = segmentState.packs[0] ? segmentState.packs[0].id : null;
        }
        if (segmentState.detailPackId === pack.id) segmentState.detailPackId = null;
        segmentState.packDirty = false;
        renderApp();
      },
    });
  }
}

function syncCondField(el) {
  const pack = el.closest("[data-pack-surface='create']") ? segmentState.createPack : selectedPack();
  if (!pack || !el.dataset.cond) return;
  const list = pack[el.dataset.kind];
  const condItem = list && list[Number(el.dataset.index)];
  if (!condItem || typeof condItem !== "object") return;
  condItem[el.dataset.cond] = el.value;
  touchPack(pack);
}

function onAudienceChange(e) {
  const inline = e.target.closest("[data-inline-tag]");
  if (inline) {
    const pack = packFromEvent(e);
    if (!pack) return;
    const id = inline.dataset.inlineTag;
    const index = (pack.includes || []).findIndex((row) => condTagId(row) === id);
    const excluded = (pack.excludes || []).some((row) => condTagId(row) === id);
    if (inline.checked && excluded) {
      inline.checked = false;
      showToast("这个标签已在排除条件里", "error");
      return;
    }
    if (inline.checked && index < 0) pack.includes.push(cond(id));
    if (!inline.checked && index >= 0) pack.includes.splice(index, 1);
    fakeEstimate(pack);
    touchPack(pack);
    renderApp();
    return;
  }
  const growthScope = e.target.closest("[data-growth-scope]");
  if (growthScope) {
    const id = growthScope.dataset.growthScope === "device" ? "device" : "account";
    const set = new Set(selectedGrowthScopes());
    if (growthScope.checked) set.add(id);
    else set.delete(id);
    segmentState.growthScopes = ["account", "device"].filter((item) => set.has(item));
    segmentState.growthScopeOpen = true;
    renderApp();
    return;
  }
  const device = e.target.closest("[data-device]");
  if (device) {
    const pack = packFromEvent(e);
    if (!pack) return;
    ensurePackExtras(pack);
    const id = device.dataset.device;
    const set = new Set(pack.devices || []);
    if (device.checked) set.add(id);
    else set.delete(id);
    pack.devices = DEVICE_OPTIONS.map((item) => item.id).filter((item) => set.has(item));
    touchPack(pack);
    return;
  }
  const packStatus = e.target.closest("[data-pack-status]");
  if (packStatus) {
    segmentState.packStatus = packStatus.value;
    renderApp();
    return;
  }
  const packCreator = e.target.closest("[data-pack-creator]");
  if (packCreator) {
    segmentState.packCreator = packCreator.value;
    renderApp();
    return;
  }
  const templatePick = e.target.closest("[data-template-pick]");
  if (templatePick) {
    const pack = packFromEvent(e);
    if (pack === segmentState.createPack) pack.templatePick = templatePick.value;
    else segmentState.templatePick = templatePick.value;
    return;
  }
  const condField = e.target.closest("[data-cond]");
  if (condField) {
    syncCondField(condField);
    if (condField.tagName === "SELECT" || condField.type === "radio") renderApp();
    return;
  }
  const search = e.target.closest("[data-pack-search]");
  if (search) {
    segmentState.packSearch = search.value;
    renderApp();
    return;
  }
  const el = e.target.closest("[data-pack]");
  if (!el) return;
  const pack = packFromEvent(e);
  if (!pack) return;
  const key = el.dataset.pack;
  if (key === "enabled") {
    pack.enabled = el.checked;
    touchPack(pack);
    renderApp();
    return;
  }
  pack[key] = el.type === "radio" ? el.value : el.value;
  touchPack(pack);
  if (key === "includeMode") {
    fakeEstimate(pack);
    renderApp();
  }
}

function onAudienceKeydown(e) {
  const countryInput = e.target.closest("[data-country-q]");
  if (countryInput) {
    if (e.key === "Enter") {
      e.preventDefault();
      const typed = countryInput.value.trim();
      const matches = filterCountries(typed);
      if (/^[A-Za-z]{2}$/.test(typed)) addCountry(typed, packFromEvent(e));
      else if (matches.length === 1) addCountry(matches[0].code, packFromEvent(e));
      else showToast("请选择列表中的国家，或输入两位 ISO 代码", "error");
    }
    if (e.key === "Escape") {
      segmentState.countryOpen = false;
      document.querySelectorAll(".country-drop").forEach((drop) => drop.classList.remove("open"));
    }
    return;
  }
  const search = e.target.closest("[data-pack-search]");
  if (!search || e.key !== "Enter") return;
  segmentState.packSearch = search.value;
  renderApp();
}

function onAudienceInput(e) {
  const countryInput = e.target.closest("[data-country-q]");
  if (countryInput) {
    const pack = packFromEvent(e);
    segmentState.countryQuery = countryInput.value;
    segmentState.countryOpen = true;
    const drop = countryInput.parentElement.querySelector(".country-drop");
    if (drop && pack) {
      drop.classList.add("open");
      drop.innerHTML = renderCountryOptions(countryInput.value, pack.countries || []);
    }
    return;
  }
  const condField = e.target.closest("[data-cond]");
  if (condField && condField.tagName !== "SELECT" && condField.type !== "radio") {
    syncCondField(condField);
    return;
  }
  const el = e.target.closest("[data-pack]");
  if (!el || el.dataset.pack === "includeMode") return;
  const pack = packFromEvent(e);
  if (!pack) return;
  const key = el.dataset.pack;
  if (key === "enabled") pack.enabled = el.checked;
  else pack[key] = el.value;
  touchPack(pack);
  if (pack === segmentState.createPack && key === "name") {
    const saveBtn = document.querySelector("[data-pack-surface='create'] [data-act='confirm-create-pack']");
    if (saveBtn) saveBtn.disabled = !(pack.name || "").trim();
  }
}

function onOverlayClick(e) {
  if (segmentState.growthScopeOpen && !e.target.closest(".seg-scope")) {
    segmentState.growthScopeOpen = false;
    const willRerender = Boolean(e.target.closest("[data-act], [data-inline-tag], [data-device], [data-cond], [data-pack]"));
    if (!willRerender) {
      renderApp();
      return;
    }
  }
  const btn = e.target.closest("[data-act]");
  const mask = e.target.classList && e.target.classList.contains("mask") ? e.target : null;
  if (mask && !e.target.closest(".drawer, .dialog")) {
    if (segmentState.packGuide) {
      segmentState.packGuide = false;
      renderApp();
      return;
    }
    if (segmentState.picker) {
      segmentState.picker = null;
      renderApp();
      return;
    }
    if (segmentState.detailPackId && !segmentState.createPack) {
      segmentState.detailPackId = null;
      renderApp();
      return;
    }
    if (segmentState.createPack) {
      segmentState.createPack = null;
      segmentState.countryOpen = false;
      renderApp();
      return;
    }
    if (segmentState.drawer && segmentState.drawer.dirty) {
      confirmLeaveIfDirty(() => {
        closeOverlays();
        renderApp();
      });
      return;
    }
    closeOverlays();
    renderApp();
    return;
  }
  if (!btn) return;
  const act = btn.dataset.act;
  if (act === "toggle-growth-scope") {
    segmentState.growthScopeOpen = !segmentState.growthScopeOpen;
    renderApp();
    return;
  }
  if (act === "toggle-tag-panel") {
    const id = btn.dataset.id;
    const panels = Object.assign({}, segmentState.tagPanels);
    panels[id] = !panels[id];
    segmentState.tagPanels = panels;
    renderApp();
    return;
  }
  const createEditorActs = [
    "add-cond",
    "open-picker",
    "del-cond",
    "apply-template",
    "pick-country",
    "remove-country",
    "open-tag",
    "refresh-est",
    "download-users",
  ];
  if (e.target.closest("[data-pack-surface='create']") && createEditorActs.includes(act)) {
    onAudienceClick(e);
    return;
  }
  if (act === "close-drawer") {
    if (segmentState.drawer && segmentState.drawer.dirty) {
      confirmLeaveIfDirty(() => {
        segmentState.drawer = null;
        renderApp();
      });
    } else {
      segmentState.drawer = null;
      renderApp();
    }
  }
  if (act === "save-tag") saveTag();
  if (act === "close-refs") {
    segmentState.refsDrawer = null;
    renderApp();
  }
  if (act === "goto-pack") {
    closeOverlays();
    navigateTo("user-tag-segment", { packId: btn.dataset.id });
  }
  if (act === "close-detail") {
    segmentState.detailPackId = null;
    renderApp();
  }
  if (act === "detail-to-edit") openPackEditor(segmentState.detailPackId);
  if (act === "open-pack-guide") {
    segmentState.packGuide = true;
    renderApp();
  }
  if (act === "close-pack-guide") {
    segmentState.packGuide = false;
    renderApp();
  }
  if (act === "close-create-pack") {
    segmentState.createPack = null;
    segmentState.packGuide = false;
    segmentState.estimateOpen = false;
    renderApp();
  }
  if (act === "toggle-est-detail") {
    segmentState.estimateOpen = !segmentState.estimateOpen;
    renderApp();
  }
  if (act === "confirm-create-pack") commitCreatePack();
  if (act === "close-picker") {
    segmentState.picker = null;
    renderApp();
  }
  if (act === "toggle-pick") {
    e.preventDefault();
    const picker = segmentState.picker;
    if (!picker) return;
    if (btn.dataset.locked === "1") return;
    const id = btn.dataset.id;
    const tag = tagById(id);
    if (tag && pickerLockReason(tag)) return;
    const selected = new Set(picker.selected || []);
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    picker.selected = [...selected];
    refreshPickerList(document.getElementById("overlay-root"));
    return;
  }
  if (act === "confirm-pick") {
    const pack = pickerPack();
    const picker = segmentState.picker;
    const chosen = ((picker && picker.selected) || []).filter((id) => {
      const tag = tagById(id);
      return tag && !pickerLockReason(tag);
    });
    if (!chosen.length) {
      showToast("请先勾选标签", "error");
      return;
    }
    if (pack && picker) {
      const list = pack[picker.kind];
      const fresh = chosen.map((id) => cond(id));
      if (picker.index < 0) {
        fresh.forEach((item) => {
          if (!list.some((row) => condTagId(row) === item.tagId)) list.push(item);
        });
      } else {
        const [first, ...rest] = fresh;
        list[picker.index] = first;
        rest.forEach((item) => {
          if (!list.some((row) => condTagId(row) === item.tagId)) list.push(item);
        });
      }
      fakeEstimate(pack);
      touchPack(pack);
    }
    segmentState.picker = null;
    renderApp();
  }
}

function closeOverlays() {
  segmentState.drawer = null;
  segmentState.refsDrawer = null;
  segmentState.picker = null;
  segmentState.createPack = null;
  segmentState.packGuide = false;
  segmentState.detailPackId = null;
}

function bindOverlays() {
  const overlay = document.getElementById("overlay-root");
  const previousForm = overlay.querySelector(".create-pack-form");
  const formScroll = previousForm ? previousForm.scrollTop : 0;
  overlay.innerHTML =
    renderTagDrawer() +
    renderRefsDrawer() +
    renderPackDetailDialog() +
    renderCreatePackDialog() +
    renderPackGuide() +
    renderPicker();
  const hasOverlay = Boolean(
    overlay.querySelector(".mask") || document.getElementById("confirm-modal"),
  );
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.bound) {
    overlay.dataset.bound = "1";
    overlay.addEventListener("click", onOverlayClick);
    overlay.addEventListener("change", (e) => {
      if (e.target.closest("[data-pack-surface='create']")) onAudienceChange(e);
    });
    overlay.addEventListener("input", (e) => {
      if (e.target.closest("[data-pack-surface='create']")) onAudienceInput(e);
    });
    overlay.addEventListener("keydown", (e) => {
      if (e.target.closest("[data-pack-surface='create']")) onAudienceKeydown(e);
    });
    overlay.addEventListener("focusin", (e) => {
      if (!e.target.closest("[data-pack-surface='create']")) return;
      const countryInput = e.target.closest("[data-country-q]");
      if (!countryInput) return;
      const pack = segmentState.createPack;
      segmentState.countryOpen = true;
      const drop = countryInput.parentElement.querySelector(".country-drop");
      if (drop && pack) {
        drop.classList.add("open");
        drop.innerHTML = renderCountryOptions(countryInput.value, pack.countries || []);
      }
    });
    overlay.addEventListener(
      "wheel",
      (e) => {
        const scroller = e.target.closest(".add-list, .drawer-body, .dialog-body");
        if (!scroller) {
          e.preventDefault();
          return;
        }
        const goingUp = e.deltaY < 0;
        const atTop = scroller.scrollTop <= 0;
        const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
        if ((goingUp && atTop) || (!goingUp && atBottom)) e.preventDefault();
      },
      { passive: false },
    );
  }
  overlay.querySelectorAll("[data-form]").forEach((el) => {
    const sync = () => {
      const form = segmentState.drawer && segmentState.drawer.form;
      if (!form) return;
      const key = el.dataset.form;
      if (key === "duration") form.params.duration = Number(el.value);
      else if (el.type === "checkbox") form[key] = el.checked;
      else form[key] = el.value;
      segmentState.drawer.dirty = true;
      if (key === "description" || key === "name" || key === "code") {
        const saveBtn = overlay.querySelector('[data-act="save-tag"]');
        if (saveBtn) {
          saveBtn.disabled = !(form.description || "").trim() || !form.name.trim() || !form.code.trim();
        }
      }
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
  const createName = overlay.querySelector("[data-pack-surface='create'] [data-pack='name']");
  const createForm = segmentState.createPack;
  const nextForm = overlay.querySelector(".create-pack-form");
  const focusName =
    createName &&
    createForm &&
    !segmentState.packGuide &&
    !segmentState.createNameFocused &&
    !(createForm.name || createForm.desc || createForm.enabled || (createForm.includes && createForm.includes.length));
  if (focusName) {
    segmentState.createNameFocused = true;
    createName.focus();
  } else if (nextForm) {
    nextForm.scrollTop = formScroll;
  }
  const pickerInput = overlay.querySelector("[data-picker-q]");
  if (pickerInput) {
    pickerInput.addEventListener("input", () => {
      segmentState.picker.q = pickerInput.value;
      const list = overlay.querySelector(".add-list");
      if (!list) return;
      list.innerHTML = renderPickerOptionsHtml();
    });
  }
}

function mountSegmentPage(main, key) {
  if (!main.dataset.segBound) {
    main.dataset.segBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey === "user-tag-library") onTagLibClick(e);
      else if (activeKey === "user-tag-segment") onAudienceClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey === "user-tag-library") onTagLibChange(e);
      else if (activeKey === "user-tag-segment") onAudienceChange(e);
    });
    main.addEventListener("input", (e) => {
      if (activeKey === "user-tag-segment") onAudienceInput(e);
    });
    main.addEventListener("focusin", (e) => {
      if (activeKey !== "user-tag-segment") return;
      const countryInput = e.target.closest("[data-country-q]");
      if (!countryInput) return;
      const pack = selectedPack();
      segmentState.countryOpen = true;
      const drop = countryInput.parentElement.querySelector(".country-drop");
      if (drop && pack) {
        drop.classList.add("open");
        drop.innerHTML = renderCountryOptions(countryInput.value, pack.countries || []);
      }
    });
  }
  if (key === "user-tag-library") main.innerHTML = renderTagLibraryPage();
  else main.innerHTML = renderAudiencePage();
  bindOverlays();
}

function navigateTo(key, extra) {
  extra = extra || {};
  const go = () => {
    openPage(key);
    if (extra.packId) {
      segmentState.selectedPackId = extra.packId;
      segmentState.detailPackId = extra.packId;
    }
    if (extra.tagId) segmentState.highlightTagId = extra.tagId;
    if (extra.openDrawer && extra.tagId) {
      const tag = tagById(extra.tagId);
      segmentState.drawer = {
        mode: "edit",
        tag,
        form: formFromTag(tag),
        dirty: false,
      };
    }
    renderApp();
  };
  confirmLeaveIfDirty(go);
}

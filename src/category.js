const CATEGORY_FORMS = [
  { key: "all", label: "全部" },
  { key: "video", label: "视频" },
  { key: "novel", label: "小说" },
  { key: "comic", label: "漫画" },
  { key: "community", label: "社区" },
];

const categoryState = {
  filterCollapsed: true,
  filterDraft: blankCategoryFilters(),
  filters: blankCategoryFilters(),
  selected: [],
  modal: null,
  batchModal: false,
  batchForm: "video",
  items: [
    {
      id: "c1",
      code: "tongyong",
      name: "通用",
      form: "all",
      related: 0,
      enabled: true,
      createdAt: "2026-09-17 16:45:59",
    },
    {
      id: "c2",
      code: "Tycoonrecommand",
      name: "推荐",
      form: "video",
      related: 0,
      enabled: true,
      createdAt: "2026-09-17 16:43:07",
    },
    {
      id: "c3",
      code: "video",
      name: "video",
      form: "video",
      related: 17,
      enabled: true,
      createdAt: "2026-09-17 12:12:59",
    },
  ],
};

function blankCategoryFilters() {
  return { code: "", name: "", form: "", status: "", start: "", end: "" };
}

function isCategoryDirty() {
  return Boolean(categoryState.modal && categoryState.modal.dirty);
}

function categoryFormLabel(key) {
  const found = CATEGORY_FORMS.find((item) => item.key === key);
  return found ? found.label : key;
}

function blankCategoryForm() {
  return { code: "", name: "", form: "video" };
}

function formFromCategory(item) {
  return { code: item.code, name: item.name, form: item.form };
}

function filteredCategories() {
  const f = categoryState.filters;
  return categoryState.items.filter((item) => {
    if (f.code && !item.code.toLowerCase().includes(f.code.trim().toLowerCase())) return false;
    if (f.name && !item.name.toLowerCase().includes(f.name.trim().toLowerCase())) return false;
    if (f.form && item.form !== f.form) return false;
    if (f.status === "on" && !item.enabled) return false;
    if (f.status === "off" && item.enabled) return false;
    return true;
  });
}

function renderCategoryPage() {
  const d = categoryState.filterDraft;
  const rows = filteredCategories();
  const hasSel = categoryState.selected.length > 0;
  const extra = categoryState.filterCollapsed
    ? ""
    : `
          <label>创建时间
            <div class="video-range">
              <input class="input" data-cat-filter="start" placeholder="创建时间" value="${escapeHtml(d.start)}" />
              <span>→</span>
              <input class="input" data-cat-filter="end" placeholder="创建时间" value="${escapeHtml(d.end)}" />
            </div>
          </label>`;
  const table = rows.length
    ? `<table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" data-cat-act="toggle-all" ${rows.length && rows.every((item) => categoryState.selected.includes(item.id)) ? "checked" : ""} /></th>
            <th>内容分类编码</th>
            <th>内容分类名称</th>
            <th>内容形式</th>
            <th>关联内容数</th>
            <th>状态</th>
            <th>创建时间</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (item) => `
            <tr>
              <td><input type="checkbox" data-cat-act="toggle-one" data-id="${item.id}" ${categoryState.selected.includes(item.id) ? "checked" : ""} /></td>
              <td><button type="button" class="link" data-cat-act="edit" data-id="${item.id}">${escapeHtml(item.code)}</button></td>
              <td>${escapeHtml(item.name)}</td>
              <td>${categoryFormLabel(item.form)}</td>
              <td>${item.related}</td>
              <td>
                <label class="enable-switch ${item.enabled ? "on" : ""}">
                  <input type="checkbox" data-cat-act="toggle" data-id="${item.id}" ${item.enabled ? "checked" : ""} />
                  <span class="enable-track"></span>
                </label>
              </td>
              <td>${escapeHtml(item.createdAt)}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
      <div class="pager">共 ${rows.length} 条</div>`
    : `<div class="empty">暂无内容分类</div>`;

  return `
    <header class="topbar">
      <div class="crumb">
        <span>大前端配置</span>
        <span class="sep">/</span>
        <span class="current">内容分类管理</span>
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
          <li>必须配置名称为「通用」的分类。</li>
          <li>被「功能页面管理」中创建部分功能页面时使用。</li>
        </ol>
      </div>
      <div class="user-filter-card">
        <div class="user-filter-grid">
          <label>内容分类编码
            <input class="input" data-cat-filter="code" value="${escapeHtml(d.code)}" placeholder="请填写内容分类编码，建议使用内容英文标识" />
          </label>
          <label>内容分类名称
            <input class="input" data-cat-filter="name" value="${escapeHtml(d.name)}" placeholder="请输入内容分类名称" />
          </label>
          <label>内容形式
            <select class="input" data-cat-filter="form">
              <option value="">不限</option>
              ${CATEGORY_FORMS.map(
                (item) =>
                  `<option value="${item.key}" ${d.form === item.key ? "selected" : ""}>${item.label}</option>`,
              ).join("")}
            </select>
          </label>
          <label>状态
            <select class="input" data-cat-filter="status">
              <option value="">全部</option>
              <option value="on" ${d.status === "on" ? "selected" : ""}>启用</option>
              <option value="off" ${d.status === "off" ? "selected" : ""}>停用</option>
            </select>
          </label>
          ${extra}
        </div>
        <div class="user-filter-actions">
          <button type="button" class="btn" data-cat-act="reset">重置</button>
          <button type="button" class="btn btn-primary" data-cat-act="search">搜索</button>
          <button type="button" class="btn-text" data-cat-act="toggle-filter">${categoryState.filterCollapsed ? "展开" : "收起"}</button>
        </div>
      </div>
      <div class="video-toolbar">
        <span></span>
        <div class="video-toolbar-right">
          <button type="button" class="btn" data-cat-act="batch-form" ${hasSel ? "" : "disabled"}>批量更新内容形式</button>
          <button type="button" class="btn btn-primary" data-cat-act="create">创建内容分类</button>
        </div>
      </div>
      <div class="table-card">${table}</div>
    </div>
  `;
}

function renderCategoryModal() {
  const modal = categoryState.modal;
  if (!modal) return "";
  const form = modal.form;
  const isEdit = modal.mode === "edit";
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">${isEdit ? "编辑内容分类" : "创建内容分类"}<button type="button" class="icon-x" data-cat-act="close-modal">×</button></div>
        <div class="dialog-body">
          <label>
            <span class="field-title"><span class="req">*</span>内容分类编码</span>
            <input class="input" data-cat-form="code" value="${escapeHtml(form.code)}" placeholder="请填写内容分类编码，建议使用内容英文标识" ${isEdit ? "readonly" : ""} />
          </label>
          <label>
            <span class="field-title"><span class="req">*</span>内容分类名称</span>
            <input class="input" data-cat-form="name" value="${escapeHtml(form.name)}" placeholder="请输入内容分类名称" />
          </label>
          <label>
            <span class="field-title"><span class="req">*</span>内容形式</span>
            <select class="input" data-cat-form="form">
              ${CATEGORY_FORMS.map(
                (item) =>
                  `<option value="${item.key}" ${form.form === item.key ? "selected" : ""}>${item.label}</option>`,
              ).join("")}
            </select>
          </label>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-cat-act="close-modal">取消</button>
          <button type="button" class="btn btn-primary" data-cat-act="save">${isEdit ? "保存" : "创建"}</button>
        </div>
      </div>
    </div>
  `;
}

function renderCategoryBatchModal() {
  if (!categoryState.batchModal) return "";
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">批量更新内容形式<button type="button" class="icon-x" data-cat-act="close-batch">×</button></div>
        <div class="dialog-body">
          <p class="filter-hint">将作用于已勾选的 ${categoryState.selected.length} 条分类。</p>
          <label>内容形式
            <select class="input" data-cat-batch="form">
              ${CATEGORY_FORMS.map(
                (item) =>
                  `<option value="${item.key}" ${categoryState.batchForm === item.key ? "selected" : ""}>${item.label}</option>`,
              ).join("")}
            </select>
          </label>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-cat-act="close-batch">取消</button>
          <button type="button" class="btn btn-primary" data-cat-act="batch-ok">确定</button>
        </div>
      </div>
    </div>
  `;
}

function closeCategoryModal(force) {
  if (!force && isCategoryDirty()) {
    confirmLeaveIfDirty(() => {
      categoryState.modal = null;
      renderApp();
    });
    return;
  }
  categoryState.modal = null;
  renderApp();
}

function saveCategory() {
  const modal = categoryState.modal;
  if (!modal) return;
  const form = modal.form;
  if (!(form.code || "").trim() || !(form.name || "").trim() || !form.form) {
    showToast("请完善必填项", "error");
    return;
  }
  const code = form.code.trim();
  if (modal.mode === "create") {
    if (categoryState.items.some((item) => item.code.toLowerCase() === code.toLowerCase())) {
      showToast("内容分类编码已存在", "error");
      return;
    }
    categoryState.items.unshift({
      id: Math.random().toString(16).slice(2, 10),
      code,
      name: form.name.trim(),
      form: form.form,
      related: 0,
      enabled: true,
      createdAt: "刚刚",
    });
    showToast("已创建内容分类");
  } else {
    Object.assign(modal.item, {
      name: form.name.trim(),
      form: form.form,
    });
    showToast("已保存内容分类");
  }
  categoryState.modal = null;
  renderApp();
}

function onCategoryClick(e) {
  const btn = e.target.closest("[data-cat-act]");
  if (!btn) return;
  const act = btn.dataset.catAct;
  if ((act === "toggle-all" || act === "toggle-one" || act === "toggle") && e.type !== "change") return;
  if (act === "reset") {
    categoryState.filterDraft = blankCategoryFilters();
    categoryState.filters = blankCategoryFilters();
    renderApp();
  } else if (act === "search") {
    categoryState.filters = clone(categoryState.filterDraft);
    renderApp();
  } else if (act === "toggle-filter") {
    categoryState.filterCollapsed = !categoryState.filterCollapsed;
    renderApp();
  } else if (act === "toggle-all") {
    const rows = filteredCategories();
    categoryState.selected = btn.checked ? rows.map((item) => item.id) : [];
    renderApp();
  } else if (act === "toggle-one") {
    const set = new Set(categoryState.selected);
    if (btn.checked) set.add(btn.dataset.id);
    else set.delete(btn.dataset.id);
    categoryState.selected = [...set];
  } else if (act === "toggle") {
    const item = categoryState.items.find((row) => row.id === btn.dataset.id);
    if (item) item.enabled = btn.checked;
    renderApp();
  } else if (act === "create") {
    categoryState.modal = { mode: "create", form: blankCategoryForm(), dirty: false };
    renderApp();
  } else if (act === "edit") {
    const item = categoryState.items.find((row) => row.id === btn.dataset.id);
    categoryState.modal = { mode: "edit", item, form: formFromCategory(item), dirty: false };
    renderApp();
  } else if (act === "batch-form") {
    if (!categoryState.selected.length) {
      showToast("请先勾选分类", "error");
      return;
    }
    categoryState.batchModal = true;
    renderApp();
  }
}

function onCategoryOverlayClick(e) {
  if (e.target.classList && e.target.classList.contains("mask") && !e.target.closest(".dialog")) {
    if (categoryState.batchModal) {
      categoryState.batchModal = false;
      renderApp();
    } else closeCategoryModal();
    return;
  }
  const btn = e.target.closest("[data-cat-act]");
  if (!btn) return;
  const act = btn.dataset.catAct;
  if (act === "close-modal") closeCategoryModal();
  else if (act === "save") saveCategory();
  else if (act === "close-batch") {
    categoryState.batchModal = false;
    renderApp();
  } else if (act === "batch-ok") {
    categoryState.items.forEach((item) => {
      if (categoryState.selected.includes(item.id)) item.form = categoryState.batchForm;
    });
    categoryState.batchModal = false;
    showToast("已批量更新内容形式");
    renderApp();
  }
}

function bindCategoryOverlays() {
  const overlay = document.getElementById("overlay-root");
  overlay.innerHTML = renderCategoryModal() + renderCategoryBatchModal();
  const hasOverlay = Boolean(overlay.querySelector(".mask") || document.getElementById("confirm-modal"));
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.catBound) {
    overlay.dataset.catBound = "1";
    overlay.addEventListener("click", onCategoryOverlayClick);
    overlay.addEventListener("change", (e) => {
      const batch = e.target.closest("[data-cat-batch]");
      if (batch) categoryState.batchForm = e.target.value;
    });
  }
  overlay.querySelectorAll("[data-cat-form]").forEach((el) => {
    const sync = () => {
      if (!categoryState.modal) return;
      categoryState.modal.form[el.dataset.catForm] = el.value;
      categoryState.modal.dirty = true;
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
}

function mountCategoryPage(main) {
  if (!main.dataset.catBound) {
    main.dataset.catBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "content-category") return;
      onCategoryClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "content-category") return;
      const filter = e.target.closest("[data-cat-filter]");
      if (filter) categoryState.filterDraft[filter.dataset.catFilter] = filter.value;
      const act = e.target.closest("[data-cat-act]");
      if (act) onCategoryClick(e);
    });
  }
  main.innerHTML = renderCategoryPage();
  bindCategoryOverlays();
}

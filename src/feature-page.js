const FP_TYPES = [
  { key: "detail", label: "详情页" },
  { key: "search", label: "搜索" },
  { key: "mine", label: "个人中心" },
  { key: "tag", label: "标签页" },
  { key: "task", label: "任务页" },
  { key: "feed", label: "抖音视频流" },
  { key: "rank", label: "榜单页" },
  { key: "info", label: "信息展示页" },
  { key: "recommend", label: "推荐页" },
];

const FP_LAYOUTS = [{ key: "free", label: "自由组件" }];

const FP_WIDGETS = [
  { key: "album1", name: "专辑信息样式1" },
  { key: "album2", name: "专辑信息样式2" },
  { key: "grid", name: "三列多行" },
  { key: "ep", name: "详情页-切全集" },
];

const FP_NEED_CATEGORY = new Set(["detail", "search", "tag", "rank", "recommend"]);

const featurePageState = {
  view: "list",
  filterCollapsed: false,
  filterDraft: blankFeaturePageFilters(),
  filters: blankFeaturePageFilters(),
  editor: null,
  dragWidget: "",
  pages: [
    sampleFeaturePage({
      id: "fp1",
      name: "拌料",
      type: "tag",
      categoryName: "通用",
      categoryId: "6aaba8c786461a3155341d9d",
      pageNo: "6aacafcfd5f61690bcb61269",
      online: true,
      creator: "管理员",
      createdAt: "2026-09-18 11:28:15",
      updater: "管理员",
      updatedAt: "2026-09-18 11:28:15",
    }),
    sampleFeaturePage({
      id: "fp2",
      name: "新版视频速递",
      type: "rank",
      categoryName: "通用",
      categoryId: "6aaba8c786461a3155341d9d",
      pageNo: "6aabbcc1e0cadef8a40943",
      online: true,
      creator: "管理员",
      createdAt: "2026-09-17 18:07:08",
      updater: "管理员",
      updatedAt: "2026-09-17 18:07:59",
    }),
    sampleFeaturePage({
      id: "fp3",
      name: "uii",
      type: "tag",
      categoryName: "通用",
      categoryId: "6aaba8c786461a3155341d9d",
      pageNo: "6aabb39bcd169c00da6d7bc",
      online: false,
      creator: "管理员",
      createdAt: "2026-09-17 17:32:11",
      updater: "",
      updatedAt: "2026-09-17 17:32:11",
    }),
    sampleFeaturePage({
      id: "fp4",
      name: "12345",
      type: "detail",
      categoryName: "通用",
      categoryId: "6aaba8c786461a3155341d9d",
      pageNo: "6aabb326ad169c0b06a501b8",
      online: false,
      creator: "管理员",
      createdAt: "2026-09-17 17:30:14",
      updater: "",
      updatedAt: "2026-09-17 17:30:14",
      widgets: [{ key: "album1", title: "专辑信息" }],
    }),
    sampleFeaturePage({
      id: "fp5",
      name: "任务详情02",
      type: "task",
      categoryName: "-",
      categoryId: "867487719828995232",
      pageNo: "6a82ace91f6be5b572a261c1",
      online: true,
      creator: "小家",
      createdAt: "2026-08-17 14:40:41",
      updater: "管理员",
      updatedAt: "2026-08-19 16:40:25",
    }),
  ],
};

function blankFeaturePageFilters() {
  return {
    name: "",
    category: "",
    status: "",
    createdStart: "",
    createdEnd: "",
    updatedStart: "",
    updatedEnd: "",
    type: "",
    pageNo: "",
    layout: "",
  };
}

function sampleFeaturePage(extra) {
  return Object.assign(
    {
      bg: "无",
      layout: "free",
      template: "-",
      floatBall: false,
      widgets: [],
    },
    extra,
  );
}

function isFeaturePageDirty() {
  return Boolean(featurePageState.editor && featurePageState.editor.dirty);
}

function fpTypeLabel(key) {
  const found = FP_TYPES.find((item) => item.key === key);
  return found ? found.label : key;
}

function fpLayoutLabel(key) {
  const found = FP_LAYOUTS.find((item) => item.key === key);
  return found ? found.label : key || "自由组件";
}

function fpNewId() {
  return "6a" + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2, 8);
}

function featurePageCategories() {
  if (typeof categoryState !== "undefined" && Array.isArray(categoryState.items)) {
    return categoryState.items
      .filter((item) => item.enabled)
      .map((item) => ({
        name: item.name,
        id: item.id.length > 8 ? item.id : "6aaba8c786461a3155341d9d",
      }));
  }
  return [
    { name: "通用", id: "6aaba8c786461a3155341d9d" },
    { name: "推荐", id: "6aabbcc1e0cadef8a40943" },
    { name: "video", id: "867487719828995232" },
  ];
}

function blankFeaturePageForm() {
  return {
    name: "",
    type: "detail",
    categoryName: "",
    layout: "free",
    floatBall: false,
    widgets: [],
    selectedWidget: -1,
  };
}

function formFromFeaturePage(page) {
  return {
    name: page.name,
    type: page.type,
    categoryName: page.categoryName === "-" ? "" : page.categoryName,
    layout: page.layout || "free",
    floatBall: Boolean(page.floatBall),
    widgets: clone(page.widgets || []),
    selectedWidget: (page.widgets || []).length ? 0 : -1,
  };
}

function filteredFeaturePages() {
  const f = featurePageState.filters;
  return featurePageState.pages.filter((item) => {
    if (f.name && !item.name.toLowerCase().includes(f.name.trim().toLowerCase())) return false;
    if (f.category && item.categoryName !== f.category) return false;
    if (f.status === "on" && !item.online) return false;
    if (f.status === "off" && item.online) return false;
    if (f.type && item.type !== f.type) return false;
    if (f.pageNo && !item.pageNo.toLowerCase().includes(f.pageNo.trim().toLowerCase())) return false;
    if (f.layout && item.layout !== f.layout) return false;
    return true;
  });
}

function renderFeaturePageList() {
  const d = featurePageState.filterDraft;
  const rows = filteredFeaturePages();
  const cats = [...new Set(featurePageState.pages.map((item) => item.categoryName).filter(Boolean))];
  const extra = featurePageState.filterCollapsed
    ? ""
    : `
          <label>更新时间
            <div class="video-range">
              <input class="input" data-fp-filter="updatedStart" placeholder="更新时间" value="${escapeHtml(d.updatedStart)}" />
              <span>→</span>
              <input class="input" data-fp-filter="updatedEnd" placeholder="更新时间" value="${escapeHtml(d.updatedEnd)}" />
            </div>
          </label>
          <label>页面类型
            <select class="input" data-fp-filter="type">
              <option value="">全部</option>
              ${FP_TYPES.map(
                (item) =>
                  `<option value="${item.key}" ${d.type === item.key ? "selected" : ""}>${item.label}</option>`,
              ).join("")}
            </select>
          </label>
          <label>功能页面编号
            <input class="input" data-fp-filter="pageNo" value="${escapeHtml(d.pageNo)}" placeholder="功能页面编号" />
          </label>
          <label>页面配置方式
            <select class="input" data-fp-filter="layout">
              <option value="">全部</option>
              ${FP_LAYOUTS.map(
                (item) =>
                  `<option value="${item.key}" ${d.layout === item.key ? "selected" : ""}>${item.label}</option>`,
              ).join("")}
            </select>
          </label>`;
  const table = rows.length
    ? `<table class="data-table video-table">
        <thead>
          <tr>
            <th>页面名称</th>
            <th>内容分类</th>
            <th>状态</th>
            <th>是否上线</th>
            <th>页面类型</th>
            <th>内容分类Id</th>
            <th>功能页面编号</th>
            <th>背景图</th>
            <th>页面配置方式</th>
            <th>模板名称</th>
            <th>创建人</th>
            <th>创建时间</th>
            <th>修改人</th>
            <th>修改时间</th>
            <th>操作栏</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((item) => {
              const ops = item.online
                ? `<button type="button" class="link" data-fp-act="view" data-id="${item.id}">查看</button>
                <button type="button" class="link" data-fp-act="copy" data-id="${item.id}">复制</button>
                <button type="button" class="link danger" data-fp-act="delete" data-id="${item.id}">删除</button>`
                : `<button type="button" class="link" data-fp-act="edit" data-id="${item.id}">编辑</button>
                <button type="button" class="link" data-fp-act="copy" data-id="${item.id}">复制</button>
                <button type="button" class="link danger" data-fp-act="delete" data-id="${item.id}">删除</button>`;
              return `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.categoryName)}</td>
              <td><span class="pill ${item.online ? "green" : "gray"}">${item.online ? "上线" : "下线"}</span></td>
              <td>
                <label class="enable-switch ${item.online ? "on" : ""}">
                  <input type="checkbox" data-fp-act="toggle" data-id="${item.id}" ${item.online ? "checked" : ""} />
                  <span class="enable-track"></span>
                </label>
              </td>
              <td>${fpTypeLabel(item.type)}</td>
              <td class="fp-id">${escapeHtml(item.categoryId || "-")}</td>
              <td class="fp-id">${escapeHtml(item.pageNo)}</td>
              <td>${escapeHtml(item.bg)}</td>
              <td>${fpLayoutLabel(item.layout)}</td>
              <td>${escapeHtml(item.template)}</td>
              <td>${escapeHtml(item.creator)}</td>
              <td>${escapeHtml(item.createdAt)}</td>
              <td>${escapeHtml(item.updater || "-")}</td>
              <td>${escapeHtml(item.updatedAt || "-")}</td>
              <td class="sticky-ops">${ops}</td>
            </tr>`;
            })
            .join("")}
        </tbody>
      </table>
      <div class="pager">共 ${rows.length} 条</div>`
    : `<div class="empty">暂无功能页面</div>`;

  return `
    <header class="topbar">
      <div class="crumb">
        <span>大前端配置</span>
        <span class="sep">/</span>
        <span class="current">功能页面管理</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="user-filter-card">
        <div class="user-filter-grid">
          <label>页面名称
            <input class="input" data-fp-filter="name" value="${escapeHtml(d.name)}" placeholder="页面名称" />
          </label>
          <label>内容分类
            <select class="input" data-fp-filter="category">
              <option value="">全部</option>
              ${cats
                .map(
                  (name) =>
                    `<option value="${escapeHtml(name)}" ${d.category === name ? "selected" : ""}>${escapeHtml(name)}</option>`,
                )
                .join("")}
            </select>
          </label>
          <label>状态
            <select class="input" data-fp-filter="status">
              <option value="">全部</option>
              <option value="on" ${d.status === "on" ? "selected" : ""}>上线</option>
              <option value="off" ${d.status === "off" ? "selected" : ""}>下线</option>
            </select>
          </label>
          <label>创建时间
            <div class="video-range">
              <input class="input" data-fp-filter="createdStart" placeholder="创建时间" value="${escapeHtml(d.createdStart)}" />
              <span>→</span>
              <input class="input" data-fp-filter="createdEnd" placeholder="创建时间" value="${escapeHtml(d.createdEnd)}" />
            </div>
          </label>
          ${extra}
        </div>
        <div class="user-filter-actions">
          <button type="button" class="btn" data-fp-act="reset">重置</button>
          <button type="button" class="btn btn-primary" data-fp-act="search">搜索</button>
          <button type="button" class="btn-text" data-fp-act="toggle-filter">${featurePageState.filterCollapsed ? "展开" : "收起"}</button>
        </div>
      </div>
      <div class="video-toolbar">
        <span></span>
        <div class="video-toolbar-right">
          <button type="button" class="btn btn-primary" data-fp-act="create">创建功能页面</button>
        </div>
      </div>
      <div class="table-card">${table}</div>
    </div>
  `;
}

function renderFeaturePhone(form) {
  const widgets = form.widgets || [];
  const type = form.type;
  let stage = "";
  if (type === "detail") {
    stage = `
      <div class="fp-player">
        <div class="fp-player-art">全屏吸血版</div>
        <div class="fp-player-bar">
          <span>▶</span>
          <span>00:03/10:00</span>
          <span>倍速</span>
          <span>自动(360p)</span>
        </div>
        <div class="fp-player-qs">
          <span>720p</span><span>360p</span><span>自动(360p)</span>
        </div>
      </div>`;
  } else if (type === "search") {
    stage = `<div class="fp-fake-search">搜索内容、作者、标签</div>`;
  } else if (type === "mine") {
    stage = `<div class="fp-fake-mine"><div class="fp-avatar"></div><div>用户昵称</div></div>`;
  } else if (type === "tag") {
    stage = `<div class="fp-fake-tags"><span>热门</span><span>推荐</span><span>最新</span></div>`;
  } else if (type === "task") {
    stage = `<div class="fp-fake-list"><div>每日签到</div><div>观看视频</div><div>邀请好友</div></div>`;
  } else if (type === "feed") {
    stage = `<div class="fp-player fp-feed"><div class="fp-player-art">推荐视频流</div></div>`;
  } else if (type === "rank") {
    stage = `<div class="fp-fake-list"><div>1. 热门短剧</div><div>2. 新番推荐</div><div>3. 本周飙升</div></div>`;
  } else if (type === "info") {
    stage = `<div class="fp-fake-info">活动说明与图文内容</div>`;
  } else {
    stage = `<div class="fp-fake-cards"><div></div><div></div><div></div></div>`;
  }
  const mods = widgets
    .map(
      (w, i) =>
        `<div class="fp-phone-mod${form.selectedWidget === i ? " on" : ""}" data-fp-act="select-widget" data-id="${i}">${escapeHtml(w.title || ((FP_WIDGETS.find((x) => x.key === w.key) || {}).name) || w.key)}</div>`,
    )
    .join("");
  return `
    <div class="fp-phone" data-fp-drop="canvas">
      ${stage}
      ${mods}
    </div>`;
}

function renderFeatureEditor() {
  const editor = featurePageState.editor;
  const form = editor.form;
  const readonly = editor.mode === "view";
  const isCreate = editor.mode === "create";
  const cats = featurePageCategories();
  const title = isCreate ? "创建功能页面" : editor.mode === "view" ? "查看功能页面" : "编辑功能页面";
  const widgets = form.widgets || [];
  const selected = widgets[form.selectedWidget];
  const config = selected
    ? `<label>模块标题
            <input class="input" data-fp-widget="title" value="${escapeHtml(selected.title || "")}" ${readonly ? "readonly" : ""} placeholder="展示在组件上的标题" />
          </label>
          <p class="filter-hint">当前模块：${escapeHtml((FP_WIDGETS.find((x) => x.key === selected.key) || {}).name || selected.key)}</p>
          <button type="button" class="btn" data-fp-act="remove-widget" ${readonly ? "disabled" : ""}>移除模块</button>`
    : `<p class="filter-hint">从左侧选择组件，点击或拖到中间预览区。</p>`;

  return `
    <header class="topbar">
      <div class="crumb">
        <span>大前端配置</span>
        <span class="sep">/</span>
        <button type="button" class="link" data-fp-act="close">功能页面管理</button>
        <span class="sep">/</span>
        <span class="current">${title}</span>
      </div>
      <div class="topbar-right fp-editor-actions">
        ${readonly ? "" : `<button type="button" class="btn" data-fp-act="copy-editor">复制</button>
        <button type="button" class="btn btn-primary" data-fp-act="save">保存</button>`}
        <button type="button" class="btn" data-fp-act="close">关闭</button>
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="fp-card">
        <div class="fp-sec-title">${title}</div>
        ${isCreate ? `<p class="fp-tip">创建成功，自动生成功能页面ID</p>` : `<p class="fp-tip">功能页面编号 ${escapeHtml(editor.page ? editor.page.pageNo : "")}</p>`}
        <div class="fp-form-row">
          <span>页面类型</span>
          <div class="fp-type-picks">
            ${FP_TYPES.map(
              (item) =>
                `<button type="button" class="fp-type${form.type === item.key ? " on" : ""}" data-fp-act="type" data-id="${item.key}" ${readonly ? "disabled" : ""}>${item.label}</button>`,
            ).join("")}
          </div>
        </div>
        <div class="fp-form-row">
          <span>功能页面名称</span>
          <input class="input" data-fp-form="name" value="${escapeHtml(form.name)}" placeholder="请输入功能页面名称" ${readonly ? "readonly" : ""} />
        </div>
        <div class="fp-form-row">
          <span>针对内容分类</span>
          <select class="input" data-fp-form="categoryName" ${readonly ? "disabled" : ""}>
            <option value="">请选择内容分类</option>
            ${cats
              .map(
                (item) =>
                  `<option value="${escapeHtml(item.name)}" ${form.categoryName === item.name ? "selected" : ""}>${escapeHtml(item.name)}</option>`,
              )
              .join("")}
          </select>
        </div>
        <div class="fp-form-row">
          <span>页面配置方式</span>
          <input class="input" value="${fpLayoutLabel(form.layout)}" readonly />
        </div>
      </div>
      <div class="fp-card">
        <div class="fp-editor-head">
          <div class="fp-sec-title">编辑功能页面</div>
          <div class="fp-editor-head-right">
            <span>开启悬浮球</span>
            <label class="enable-switch ${form.floatBall ? "on" : ""}">
              <input type="checkbox" data-fp-act="float" ${form.floatBall ? "checked" : ""} ${readonly ? "disabled" : ""} />
              <span class="enable-track"></span>
            </label>
            <span class="fp-switch-text">${form.floatBall ? "ON" : "OFF"}</span>
            <button type="button" class="btn btn-primary" data-fp-act="visual">可视化编辑</button>
          </div>
        </div>
        <div class="fp-canvas">
          <div class="fp-palette">
            <div class="fp-palette-title">组件模板</div>
            <p class="filter-hint">点击选择下方模块，拖动到中间的预览区中</p>
            <div class="fp-palette-sec">内容组件</div>
            <div class="fp-widget-grid">
              ${FP_WIDGETS.map(
                (item) => `
                <button type="button" class="fp-widget" draggable="${readonly ? "false" : "true"}" data-fp-act="add-widget" data-id="${item.key}" ${readonly ? "disabled" : ""}>
                  <span class="fp-widget-thumb ${item.key}"></span>
                  <span>${item.name}</span>
                </button>`,
              ).join("")}
            </div>
          </div>
          <div class="fp-preview">
            ${renderFeaturePhone(form)}
          </div>
          <div class="fp-config">
            <div class="fp-palette-title">组件模块内容配置</div>
            ${config}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFeaturePagePage() {
  if (featurePageState.view === "editor" && featurePageState.editor) return renderFeatureEditor();
  return renderFeaturePageList();
}

function openFeatureEditor(mode, page) {
  featurePageState.view = "editor";
  featurePageState.editor = {
    mode,
    page: page || null,
    form: page ? formFromFeaturePage(page) : blankFeaturePageForm(),
    dirty: false,
  };
  renderApp();
}

function closeFeatureEditor(force) {
  if (!force && isFeaturePageDirty()) {
    confirmLeaveIfDirty(() => {
      featurePageState.editor = null;
      featurePageState.view = "list";
      renderApp();
    });
    return;
  }
  featurePageState.editor = null;
  featurePageState.view = "list";
  renderApp();
}

function addFeatureWidget(key) {
  const editor = featurePageState.editor;
  if (!editor || editor.mode === "view") return;
  const meta = FP_WIDGETS.find((item) => item.key === key);
  if (!meta) return;
  editor.form.widgets.push({ key, title: meta.name });
  editor.form.selectedWidget = editor.form.widgets.length - 1;
  editor.dirty = true;
  renderApp();
}

function saveFeaturePage() {
  const editor = featurePageState.editor;
  if (!editor || editor.mode === "view") return;
  const form = editor.form;
  if (!(form.name || "").trim()) {
    showToast("请输入功能页面名称", "error");
    return;
  }
  if (FP_NEED_CATEGORY.has(form.type) && !(form.categoryName || "").trim()) {
    showToast("请选择内容分类", "error");
    return;
  }
  const cats = featurePageCategories();
  const cat = cats.find((item) => item.name === form.categoryName);
  const payload = {
    name: form.name.trim(),
    type: form.type,
    categoryName: form.categoryName || "-",
    categoryId: cat ? cat.id : (editor.page && editor.page.categoryId) || "-",
    layout: form.layout || "free",
    floatBall: Boolean(form.floatBall),
    widgets: clone(form.widgets || []),
    bg: "无",
    template: "-",
    updater: "运营小王",
    updatedAt: "刚刚",
  };
  if (editor.mode === "create") {
    const page = sampleFeaturePage(
      Object.assign(
        {
          id: fpNewId(),
          pageNo: fpNewId(),
          online: false,
          creator: "运营小王",
          createdAt: "刚刚",
        },
        payload,
      ),
    );
    featurePageState.pages.unshift(page);
    editor.mode = "edit";
    editor.page = page;
    editor.dirty = false;
    showToast("已创建功能页面，编号已自动生成");
  } else {
    Object.assign(editor.page, payload);
    editor.dirty = false;
    showToast("已保存功能页面");
  }
  renderApp();
}

function copyFeaturePage(page) {
  const copy = sampleFeaturePage(
    Object.assign(clone(page), {
      id: fpNewId(),
      pageNo: fpNewId(),
      name: page.name + "_副本",
      online: false,
      creator: "运营小王",
      createdAt: "刚刚",
      updater: "",
      updatedAt: "刚刚",
    }),
  );
  featurePageState.pages.unshift(copy);
  showToast("已复制为下线页面");
  return copy;
}

function onFeaturePageClick(e) {
  const btn = e.target.closest("[data-fp-act]");
  if (!btn) return;
  const act = btn.dataset.fpAct;
  const id = btn.dataset.id;
  if ((act === "toggle" || act === "float") && e.type !== "change") return;

  if (act === "reset") {
    featurePageState.filterDraft = blankFeaturePageFilters();
    featurePageState.filters = blankFeaturePageFilters();
    renderApp();
  } else if (act === "search") {
    featurePageState.filters = clone(featurePageState.filterDraft);
    renderApp();
  } else if (act === "toggle-filter") {
    featurePageState.filterCollapsed = !featurePageState.filterCollapsed;
    renderApp();
  } else if (act === "create") {
    openFeatureEditor("create");
  } else if (act === "edit") {
    const page = featurePageState.pages.find((item) => item.id === id);
    if (page) openFeatureEditor("edit", page);
  } else if (act === "view") {
    const page = featurePageState.pages.find((item) => item.id === id);
    if (page) openFeatureEditor("view", page);
  } else if (act === "copy") {
    const page = featurePageState.pages.find((item) => item.id === id);
    if (page) {
      copyFeaturePage(page);
      renderApp();
    }
  } else if (act === "delete") {
    showConfirm({
      title: "删除功能页面",
      text: "删除后不可恢复，确认删除？",
      okText: "删除",
      danger: true,
      onOk: () => {
        featurePageState.pages = featurePageState.pages.filter((item) => item.id !== id);
        showToast("已删除");
        renderApp();
      },
    });
  } else if (act === "toggle") {
    const page = featurePageState.pages.find((item) => item.id === id);
    if (page) {
      page.online = btn.checked;
      page.updater = "运营小王";
      page.updatedAt = "刚刚";
      showToast(page.online ? "已上线" : "已下线");
      renderApp();
    }
  } else if (act === "close") {
    closeFeatureEditor();
  } else if (act === "save") {
    saveFeaturePage();
  } else if (act === "copy-editor") {
    const editor = featurePageState.editor;
    if (!editor) return;
    if (editor.mode === "create" && !editor.page) {
      showToast("请先保存再复制", "error");
      return;
    }
    const source = editor.page || featurePageState.pages[0];
    const copy = copyFeaturePage(source);
    openFeatureEditor("edit", copy);
  } else if (act === "type") {
    if (!featurePageState.editor || featurePageState.editor.mode === "view") return;
    featurePageState.editor.form.type = id;
    featurePageState.editor.dirty = true;
    renderApp();
  } else if (act === "float") {
    if (!featurePageState.editor || featurePageState.editor.mode === "view") return;
    featurePageState.editor.form.floatBall = btn.checked;
    featurePageState.editor.dirty = true;
    renderApp();
  } else if (act === "visual") {
    showToast("已进入可视化编辑");
  } else if (act === "add-widget") {
    addFeatureWidget(id);
  } else if (act === "select-widget") {
    if (!featurePageState.editor) return;
    featurePageState.editor.form.selectedWidget = Number(id);
    renderApp();
  } else if (act === "remove-widget") {
    const editor = featurePageState.editor;
    if (!editor || editor.mode === "view") return;
    const i = editor.form.selectedWidget;
    if (i < 0) return;
    editor.form.widgets.splice(i, 1);
    editor.form.selectedWidget = editor.form.widgets.length ? Math.max(0, i - 1) : -1;
    editor.dirty = true;
    renderApp();
  }
}

function bindFeaturePageDnD(main) {
  main.querySelectorAll(".fp-widget[draggable='true']").forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      featurePageState.dragWidget = el.dataset.id;
      e.dataTransfer.effectAllowed = "copy";
    });
  });
  const phone = main.querySelector("[data-fp-drop='canvas']");
  if (!phone) return;
  phone.addEventListener("dragover", (e) => {
    e.preventDefault();
    phone.classList.add("drop-on");
  });
  phone.addEventListener("dragleave", () => phone.classList.remove("drop-on"));
  phone.addEventListener("drop", (e) => {
    e.preventDefault();
    phone.classList.remove("drop-on");
    if (featurePageState.dragWidget) addFeatureWidget(featurePageState.dragWidget);
    featurePageState.dragWidget = "";
  });
}

function mountFeaturePage(main) {
  if (!main.dataset.fpBound) {
    main.dataset.fpBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "feature-page") return;
      onFeaturePageClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "feature-page") return;
      const filter = e.target.closest("[data-fp-filter]");
      if (filter) featurePageState.filterDraft[filter.dataset.fpFilter] = filter.value;
      const form = e.target.closest("[data-fp-form]");
      if (form && featurePageState.editor) {
        featurePageState.editor.form[form.dataset.fpForm] = form.value;
        featurePageState.editor.dirty = true;
      }
      const widget = e.target.closest("[data-fp-widget]");
      if (widget && featurePageState.editor) {
        const selected = featurePageState.editor.form.widgets[featurePageState.editor.form.selectedWidget];
        if (selected) {
          selected[widget.dataset.fpWidget] = widget.value;
          featurePageState.editor.dirty = true;
        }
      }
      const act = e.target.closest("[data-fp-act]");
      if (act) onFeaturePageClick(e);
    });
    main.addEventListener("input", (e) => {
      if (activeKey !== "feature-page") return;
      const filter = e.target.closest("[data-fp-filter]");
      if (filter) featurePageState.filterDraft[filter.dataset.fpFilter] = filter.value;
      const form = e.target.closest("[data-fp-form]");
      if (form && featurePageState.editor) {
        featurePageState.editor.form[form.dataset.fpForm] = form.value;
        featurePageState.editor.dirty = true;
      }
      const widget = e.target.closest("[data-fp-widget]");
      if (widget && featurePageState.editor) {
        const selected = featurePageState.editor.form.widgets[featurePageState.editor.form.selectedWidget];
        if (selected) {
          selected[widget.dataset.fpWidget] = widget.value;
          featurePageState.editor.dirty = true;
        }
      }
    });
  }
  main.innerHTML = renderFeaturePagePage();
  const overlay = document.getElementById("overlay-root");
  if (overlay) overlay.innerHTML = "";
  document.documentElement.classList.remove("overlay-open");
  bindFeaturePageDnD(main);
}

const TABBAR_MIN = 2;
const TABBAR_MAX = 7;
const TABBAR_NAME_MAX = 6;
const TABBAR_ICON_MAX = 50 * 1024;

const TABBAR_FEATURE_KINDS = [
  { key: "search", label: "搜索" },
  { key: "mine", label: "个人中心" },
  { key: "tag", label: "标签页" },
  { key: "message", label: "消息中心" },
  { key: "link", label: "跳转链接" },
  { key: "task", label: "任务页" },
  { key: "feed", label: "抖音视频流" },
  { key: "recommend", label: "推荐页" },
];

const TABBAR_WIDGETS = [
  {
    group: "顶部功能",
    items: [
      { key: "top1", name: "顶部功能样式1", tier: "base" },
      { key: "top2", name: "顶部功能样式2", tier: "base" },
      { key: "top3", name: "顶部功能样式3", tier: "adv" },
      { key: "top4", name: "顶部功能样式4", tier: "adv" },
    ],
  },
  {
    group: "内容组件",
    items: [
      { key: "marquee", name: "跑马灯", tier: "base" },
      { key: "falls", name: "瀑布流", tier: "adv" },
      { key: "grid", name: "三列多行", tier: "base" },
      { key: "icons", name: "图标广告", tier: "base" },
    ],
  },
];

function blankTabbarChannel(name) {
  return { id: `ch_${Math.random().toString(16).slice(2, 10)}`, name: name || "" };
}

function blankTabbarEntry() {
  return {
    id: `tb_${Math.random().toString(16).slice(2, 10)}`,
    name: "",
    showName: true,
    domainId: "",
    icon: "",
    iconOn: "",
    type: "product",
    featureKind: "tag",
    featureDataId: "",
    featureLink: "",
    floatBall: false,
    channelId: "",
    channels: [],
  };
}

function initialTabbarConfig() {
  const names = ["Hot", "Dendam", "Aksi", "Preman", "Topeng", "Tajir", "Dewa", "用户社区"];
  const home = blankTabbarEntry();
  home.name = "Home";
  home.domainId = "home";
  home.channels = names.map((name) => blankTabbarChannel(name));
  home.channelId = home.channels[0].id;
  const second = blankTabbarEntry();
  second.name = "Discover";
  second.domainId = "discover";
  const third = blankTabbarEntry();
  third.name = "Mine";
  third.domainId = "mine";
  third.type = "feature";
  third.featureKind = "mine";
  const fourth = blankTabbarEntry();
  fourth.name = "Task";
  fourth.domainId = "task";
  fourth.type = "feature";
  fourth.featureKind = "task";
  return { entries: [home, second, third, fourth] };
}

const tabbarState = {
  publishedAt: "2026/09/29 08:51:20",
  published: null,
  saved: null,
  draft: null,
  selectedId: "",
  dirty: false,
  canPublish: false,
  preview: false,
  dialog: "",
  templateName: "",
  templates: [],
  pickedWidget: "",
  widgetCount: "5",
  widgetSlot: "",
};
tabbarState.published = initialTabbarConfig();
tabbarState.saved = clone(tabbarState.published);
tabbarState.draft = clone(tabbarState.saved);
tabbarState.selectedId = tabbarState.draft.entries[0].id;

function isTabbarDirty() {
  return Boolean(tabbarState.dirty);
}

function resetTabbarDraft() {
  tabbarState.draft = clone(tabbarState.saved);
  tabbarState.selectedId = tabbarState.draft.entries[0] ? tabbarState.draft.entries[0].id : "";
  tabbarState.dirty = false;
  tabbarState.preview = false;
  tabbarState.dialog = "";
  tabbarState.pickedWidget = "";
}

function tabbarGraphemes(text) {
  return Array.from(String(text || ""));
}

function tabbarHasEmoji(text) {
  return /\p{Extended_Pictographic}/u.test(String(text || ""));
}

function selectedTabbarEntry() {
  return tabbarState.draft.entries.find((item) => item.id === tabbarState.selectedId) || tabbarState.draft.entries[0];
}

function tabbarWidgetName(key) {
  for (let i = 0; i < TABBAR_WIDGETS.length; i += 1) {
    const found = TABBAR_WIDGETS[i].items.find((item) => item.key === key);
    if (found) return found.name;
  }
  return "";
}

function tabbarFeatureOptions(kind) {
  if (typeof featurePageState === "undefined") return [];
  return featurePageState.pages.filter((item) => item.online && item.type === kind);
}

function markTabbarDirty() {
  tabbarState.dirty = true;
  tabbarState.canPublish = false;
}

function renderTabbarPage() {
  const entry = selectedTabbarEntry();
  const chips = tabbarState.draft.entries
    .map((item, index) => {
      const on = item.id === entry.id;
      return `<button type="button" class="tabbar-slot${on ? " on" : ""}" data-tabbar-act="select" data-id="${item.id}">入口${String(index + 1).padStart(2, "0")}</button>`;
    })
    .join("");
  return `
    <header class="topbar">
      <div class="crumb">
        <span>大前端配置</span>
        <span class="sep">/</span>
        <span class="current">底部导航管理</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page tabbar-page">
      <div class="tabbar-top">
        <div class="tabbar-top-title">
          <h1>底部导航设置</h1>
          <div>上一次发布时间：<b>${escapeHtml(tabbarState.publishedAt)}</b></div>
        </div>
        <div class="tabbar-top-actions">
          <button type="button" class="btn" data-tabbar-act="restore">恢复至上一个发布版本</button>
          <button type="button" class="btn" data-tabbar-act="open-templates">模版库</button>
          <button type="button" class="btn" data-tabbar-act="open-save-template">存入模版库</button>
          <button type="button" class="btn" data-tabbar-act="open-guide">操作指引</button>
          <button type="button" class="btn" data-tabbar-act="preview">预览</button>
          <button type="button" class="btn btn-primary" data-tabbar-act="save">保存</button>
          <button type="button" class="btn" data-tabbar-act="publish" ${tabbarState.canPublish ? "" : "disabled"}>发布</button>
        </div>
      </div>
      <p class="tabbar-notice">注意：编辑完成后请先保存，再点击发布，APP 才会展示最新配置</p>
      <section class="tabbar-card">
        <div class="tabbar-slot-row">
          <span>底部导航入口数：</span>
          ${chips}
          <button type="button" class="tabbar-text" data-tabbar-act="add" ${tabbarState.draft.entries.length >= TABBAR_MAX ? "disabled" : ""}>+ 新增导航入口</button>
          <button type="button" class="tabbar-text danger" data-tabbar-act="delete" ${tabbarState.draft.entries.length <= TABBAR_MIN ? "disabled" : ""}>删除当前入口</button>
          <span class="field-hint">注最少2个，最多7个，自动居中</span>
        </div>
        ${entry ? renderTabbarEntryForm(entry) : ""}
      </section>
      ${entry && entry.type === "product" ? renderTabbarStudio(entry) : ""}
      ${entry && entry.type === "feature" ? "" : ""}
    </div>
  `;
}

function renderTabbarEntryForm(entry) {
  return `
    <div class="tabbar-form">
      <div class="tabbar-form-grid">
        <label>导航入口名称 *
          <span class="tabbar-count-wrap">
            <input class="input" data-tabbar-field="name" maxlength="12" value="${escapeHtml(entry.name)}" placeholder="请输入名称" />
            <em data-tabbar-count>${tabbarGraphemes(entry.name).length} / ${TABBAR_NAME_MAX}</em>
          </span>
        </label>
        <label>导航入口域名ID *
          <input class="input" data-tabbar-field="domainId" value="${escapeHtml(entry.domainId)}" placeholder="例如 home" />
          <span class="field-hint">稳定路由标识，仅支持英文、数字和下划线；修改已有值会影响路由及关联配置</span>
        </label>
        <label class="tabbar-show-name">导航入口名称显示
          <button type="button" class="tabbar-switch${entry.showName ? " on" : ""}" data-tabbar-act="show-name" aria-pressed="${entry.showName ? "true" : "false"}">${entry.showName ? "ON" : "OFF"}</button>
        </label>
        ${renderTabbarUpload(entry, "icon", "入口外显默认图标")}
        ${renderTabbarUpload(entry, "iconOn", "入口外显选中图标")}
      </div>
      <div class="tabbar-type-row">
        <span>配置类型：</span>
        <div class="tabbar-seg">
          <button type="button" class="${entry.type === "product" ? "on" : ""}" data-tabbar-act="type" data-id="product">产品页面</button>
          <button type="button" class="${entry.type === "feature" ? "on" : ""}" data-tabbar-act="type" data-id="feature">功能页面</button>
        </div>
        <button type="button" class="tabbar-help" data-tabbar-act="type-help" title="产品页面配置频道和组件。功能页面选择一种页面类型后再选数据。">?</button>
      </div>
      ${entry.type === "feature" ? renderTabbarFeature(entry) : ""}
    </div>
  `;
}

function renderTabbarUpload(entry, slot, label) {
  const src = entry[slot];
  return `
    <div class="tabbar-upload">
      <span>${label}</span>
      <button type="button" class="tabbar-upload-box" data-tabbar-act="pick-icon" data-slot="${slot}">
        ${src ? `<img src="${src}" alt="" />` : "<b>↓</b>"}
      </button>
      <input type="file" accept="image/png" hidden data-tabbar-file="${slot}" />
      <span class="field-hint">支持格式png，50KB，尺寸建议：88*88</span>
    </div>
  `;
}

function renderTabbarFeature(entry) {
  const kinds = TABBAR_FEATURE_KINDS.map(
    (item) => `<button type="button" class="tabbar-kind${entry.featureKind === item.key ? " on" : ""}" data-tabbar-act="feature-kind" data-id="${item.key}">${item.label}</button>`,
  ).join("");
  const pages = tabbarFeatureOptions(entry.featureKind);
  const options = pages
    .map((item) => `<option value="${item.id}" ${item.id === entry.featureDataId ? "selected" : ""}>${escapeHtml(item.name)}</option>`)
    .join("");
  const dataField =
    entry.featureKind === "link"
      ? `<input class="input" data-tabbar-field="featureLink" value="${escapeHtml(entry.featureLink)}" placeholder="请输入跳转链接" />`
      : `<select class="input" data-tabbar-field="featureDataId">
          <option value="">请选择</option>
          ${options || '<option value="" disabled>暂无已上线数据</option>'}
        </select>`;
  return `
    <div class="tabbar-feature-block">
      <div class="tabbar-kind-row"><span>功能页面类型：</span>${kinds}</div>
      <label class="tabbar-data">选择数据 ${dataField}</label>
    </div>
  `;
}

function renderTabbarStudio(entry) {
  const channel = entry.channels.find((item) => item.id === entry.channelId) || entry.channels[0];
  const channelOptions = entry.channels
    .map((item) => `<option value="${item.id}" ${channel && item.id === channel.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`)
    .join("");
  const palette = TABBAR_WIDGETS.map((group) => {
    const cards = group.items
      .map((item) => {
        const on = tabbarState.pickedWidget === item.key;
        return `
          <button type="button" class="tabbar-widget${on ? " on" : ""}" data-tabbar-act="pick-widget" data-id="${item.key}">
            <span class="tabbar-widget-thumb"></span>
            <span class="tabbar-tier ${item.tier}">${item.tier === "adv" ? "进阶件" : "基配件"}</span>
            <span>${item.name}</span>
          </button>`;
      })
      .join("");
    return `<div class="tabbar-widget-group"><h5>${group.group}</h5><div class="tabbar-widget-grid">${cards}</div></div>`;
  }).join("");
  const channelButtons = entry.channels
    .map(
      (item) =>
        `<button type="button" class="${channel && item.id === channel.id ? "on" : ""}" data-tabbar-act="channel" data-id="${item.id}">${escapeHtml(item.name)}</button>`,
    )
    .join("");
  const channelNames = entry.channels.map((item) => `<span class="${channel && item.id === channel.id ? "on" : ""}">${escapeHtml(item.name)}</span>`).join("");
  return `
    <section class="tabbar-studio">
      <div class="tabbar-studio-bar">
        <h2>编辑频道</h2>
        <label>当前频道：
          <select class="input" data-tabbar-field="channelId">
            ${channelOptions || '<option value="">暂无频道</option>'}
          </select>
        </label>
        <span class="field-hint">注：请先在中间画板中配置「频道」组件，并添加频道数据</span>
        <label class="tabbar-float">开启悬浮球
          <button type="button" class="tabbar-switch${entry.floatBall ? " on" : ""}" data-tabbar-act="float-ball">${entry.floatBall ? "ON" : "OFF"}</button>
        </label>
        <button type="button" class="btn btn-primary" data-tabbar-act="visual">可视化组建</button>
      </div>
      <div class="tabbar-studio-body">
        <aside class="tabbar-palette">
          <h3>组件模板</h3>
          <p>点击选择下方模块，拖动至中间预览页面中</p>
          ${palette}
        </aside>
        <div class="tabbar-canvas">
          <div class="tabbar-device">
            <div class="tabbar-device-search">请输入搜索关键字</div>
            <div class="tabbar-device-channels">${channelNames || "<span>暂无频道</span>"}</div>
            <button type="button" class="tabbar-device-block" data-tabbar-act="pick-widget" data-id="top1">顶部功能</button>
            <button type="button" class="tabbar-device-hero" data-tabbar-act="pick-widget" data-id="falls">内容区</button>
            <button type="button" class="tabbar-device-banner" data-tabbar-act="pick-widget" data-id="marquee">Banner 广告</button>
            <button type="button" class="tabbar-device-grid" data-tabbar-act="pick-widget" data-id="icons">
              <i></i><i></i><i></i><i></i><i></i>
            </button>
            <div class="tabbar-device-tabs"><span>热门推荐</span><span>最新上架</span><span>最多收藏</span></div>
          </div>
        </div>
        <aside class="tabbar-side">
          <h3>切换频道</h3>
          <div class="tabbar-side-channels">${channelButtons || '<p class="field-hint">还没有频道</p>'}</div>
          <h3>组件模块内容配置</h3>
          ${renderTabbarWidgetForm()}
        </aside>
      </div>
    </section>
  `;
}

function renderTabbarWidgetForm() {
  const name = tabbarWidgetName(tabbarState.pickedWidget);
  if (!name) return '<div class="tabbar-config-empty">请先点击画布内组件</div>';
  return `
    <div class="tabbar-config">
      <h4>${escapeHtml(name)}</h4>
      <label>展示数量 *
        <select class="input" data-tabbar-field="widgetCount">
          ${["1", "3", "5", "无限"]
            .map((item) => `<option value="${item}" ${tabbarState.widgetCount === item ? "selected" : ""}>${item === "无限" ? "无限" : `${item}个展示位`}</option>`)
            .join("")}
        </select>
      </label>
      <label>广告位标识 *
        <input class="input" data-tabbar-field="widgetSlot" value="${escapeHtml(tabbarState.widgetSlot)}" placeholder="请输入标识" />
      </label>
    </div>
  `;
}

function renderTabbarDialog() {
  if (tabbarState.dialog === "guide") {
    return tabbarDialog(
      "操作指引",
      `<ol class="pack-guide-list">
        <li>先改入口，再点保存。保存后才能发布。</li>
        <li>入口最少 2 个，最多 7 个。</li>
        <li>产品页面在下方画板里配频道和组件。功能页面先选类型，再选数据。</li>
        <li>发布后，APP 才展示这次配置。恢复会回到上一次发布的内容。</li>
      </ol>`,
    );
  }
  if (tabbarState.dialog === "templates") {
    const list = tabbarState.templates.length
      ? tabbarState.templates.map((item) => `<div class="tabbar-template-row"><b>${escapeHtml(item.name)}</b><span>${escapeHtml(item.time)}</span></div>`).join("")
      : '<div class="tabbar-config-empty">还没有模版</div>';
    return tabbarDialog("模版库", list);
  }
  if (tabbarState.dialog === "save-template") {
    return tabbarDialog(
      "存入模版库",
      `<label>模版名称<input class="input" data-tabbar-field="templateName" value="${escapeHtml(tabbarState.templateName)}" placeholder="请输入模版名称" /></label>`,
      `<button type="button" class="btn btn-primary" data-tabbar-act="confirm-template">存入</button>`,
    );
  }
  if (!tabbarState.preview) return "";
  const entry = selectedTabbarEntry();
  const items = tabbarState.draft.entries
    .map((item, index) => {
      const on = entry && item.id === entry.id;
      const label = item.showName ? escapeHtml(item.name || `入口${index + 1}`) : "";
      return `<button type="button" class="tabbar-phone-item${on ? " on" : ""}" data-tabbar-act="preview-entry" data-id="${item.id}"><b>${escapeHtml(tabbarGraphemes(item.name)[0] || String(index + 1))}</b>${label ? `<span>${label}</span>` : ""}</button>`;
    })
    .join("");
  return tabbarDialog("预览", `<div class="tabbar-preview-phone"><div class="tabbar-preview-screen">${escapeHtml(entry ? entry.name || "入口" : "")}</div><div class="tabbar-phone-bar">${items}</div></div>`);
}

function tabbarDialog(title, body, ok) {
  return `
    <div class="mask">
      <div class="dialog tabbar-dialog">
        <div class="dialog-title"><span>${title}</span><button type="button" class="icon-x" data-tabbar-act="close-dialog" aria-label="关闭">×</button></div>
        <div class="dialog-body">${body}</div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-tabbar-act="close-dialog">关闭</button>
          ${ok || ""}
        </div>
      </div>
    </div>
  `;
}

function addTabbarEntry() {
  if (tabbarState.draft.entries.length >= TABBAR_MAX) {
    showToast("最多 7 个导航入口", "error");
    return;
  }
  const entry = blankTabbarEntry();
  tabbarState.draft.entries.push(entry);
  tabbarState.selectedId = entry.id;
  tabbarState.pickedWidget = "";
  markTabbarDirty();
  renderApp();
}

function deleteTabbarEntry() {
  const entries = tabbarState.draft.entries;
  if (entries.length <= TABBAR_MIN) {
    showToast("至少保留 2 个导航入口", "error");
    return;
  }
  const entry = selectedTabbarEntry();
  const index = entries.findIndex((item) => item.id === entry.id);
  entries.splice(index, 1);
  const next = entries[index] || entries[index - 1];
  tabbarState.selectedId = next.id;
  tabbarState.pickedWidget = "";
  markTabbarDirty();
  renderApp();
}

function saveTabbar() {
  const draft = tabbarState.draft;
  const domains = new Set();
  for (let i = 0; i < draft.entries.length; i += 1) {
    const entry = draft.entries[i];
    const name = String(entry.name || "").trim();
    if (!name) {
      tabbarState.selectedId = entry.id;
      showToast("请填写导航入口名称", "error");
      renderApp();
      return;
    }
    if (tabbarHasEmoji(name) || tabbarGraphemes(name).length > TABBAR_NAME_MAX) {
      tabbarState.selectedId = entry.id;
      showToast(tabbarHasEmoji(name) ? "导航入口名称不支持 Emoji" : `导航入口名称最多 ${TABBAR_NAME_MAX} 个字`, "error");
      renderApp();
      return;
    }
    const domain = String(entry.domainId || "").trim();
    if (!/^[A-Za-z0-9_]+$/.test(domain)) {
      tabbarState.selectedId = entry.id;
      showToast("域名 ID 仅支持英文、数字和下划线", "error");
      renderApp();
      return;
    }
    const key = domain.toLowerCase();
    if (domains.has(key)) {
      tabbarState.selectedId = entry.id;
      showToast("导航入口域名 ID 不能重复", "error");
      renderApp();
      return;
    }
    domains.add(key);
    entry.name = name;
    entry.domainId = domain;
  }
  tabbarState.saved = clone(draft);
  tabbarState.dirty = false;
  tabbarState.canPublish = true;
  showToast("已保存，请再点击发布");
  renderApp();
}

function publishTabbar() {
  if (!tabbarState.canPublish) return;
  tabbarState.published = clone(tabbarState.saved);
  tabbarState.canPublish = false;
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  tabbarState.publishedAt = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  showToast("已发布");
  renderApp();
}

function readTabbarIcon(file, slot) {
  const entry = selectedTabbarEntry();
  if (!file || !entry) return;
  if (file.type !== "image/png" || file.size > TABBAR_ICON_MAX) {
    showToast("图标需为 png，且不超过 50KB", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      entry[slot] = reader.result;
      markTabbarDirty();
      renderApp();
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function onTabbarField(el) {
  const field = el.dataset.tabbarField;
  const entry = selectedTabbarEntry();
  if (!field) return;
  if (field === "templateName") {
    tabbarState.templateName = el.value;
    return;
  }
  if (!entry) return;
  if (field === "name") {
    const clean = tabbarGraphemes(el.value)
      .filter((char) => !tabbarHasEmoji(char))
      .slice(0, TABBAR_NAME_MAX)
      .join("");
    if (el.value !== clean) el.value = clean;
    entry.name = clean;
    const count = el.parentElement && el.parentElement.querySelector("[data-tabbar-count]");
    if (count) count.textContent = `${tabbarGraphemes(clean).length} / ${TABBAR_NAME_MAX}`;
  } else if (field === "domainId") {
    const clean = el.value.replace(/[^A-Za-z0-9_]/g, "");
    if (el.value !== clean) el.value = clean;
    entry.domainId = clean;
  } else if (field === "featureDataId") entry.featureDataId = el.value;
  else if (field === "featureLink") entry.featureLink = el.value;
  else if (field === "channelId") {
    entry.channelId = el.value;
    renderApp();
  } else if (field === "widgetCount") tabbarState.widgetCount = el.value;
  else if (field === "widgetSlot") tabbarState.widgetSlot = el.value;
  if (field !== "channelId") markTabbarDirty();
}

function onTabbarClick(e) {
  const btn = e.target.closest("[data-tabbar-act]");
  if (!btn || btn.disabled) return;
  const act = btn.dataset.tabbarAct;
  const entry = selectedTabbarEntry();
  if (act === "select") {
    tabbarState.selectedId = btn.dataset.id;
    tabbarState.pickedWidget = "";
    renderApp();
  } else if (act === "add") addTabbarEntry();
  else if (act === "delete") deleteTabbarEntry();
  else if (act === "show-name") {
    entry.showName = !entry.showName;
    markTabbarDirty();
    renderApp();
  } else if (act === "float-ball") {
    entry.floatBall = !entry.floatBall;
    markTabbarDirty();
    renderApp();
  } else if (act === "type") {
    entry.type = btn.dataset.id;
    if (entry.type === "product" && !entry.channels.length) {
      entry.channels = [blankTabbarChannel("Hot")];
      entry.channelId = entry.channels[0].id;
    }
    markTabbarDirty();
    renderApp();
  } else if (act === "type-help") {
    showToast("产品页面配置频道和组件。功能页面先选类型，再选数据。");
  } else if (act === "feature-kind") {
    entry.featureKind = btn.dataset.id;
    entry.featureDataId = "";
    markTabbarDirty();
    renderApp();
  } else if (act === "channel") {
    entry.channelId = btn.dataset.id;
    renderApp();
  } else if (act === "pick-widget") {
    tabbarState.pickedWidget = btn.dataset.id;
    renderApp();
  } else if (act === "pick-icon") {
    const input = document.querySelector(`[data-tabbar-file="${btn.dataset.slot}"]`);
    if (input) {
      input.value = "";
      input.click();
    }
  } else if (act === "visual") {
    showToast("当前已是可视化组建");
  } else if (act === "preview") {
    tabbarState.preview = true;
    tabbarState.dialog = "";
    renderApp();
  } else if (act === "open-guide") {
    tabbarState.dialog = "guide";
    tabbarState.preview = false;
    renderApp();
  } else if (act === "open-templates") {
    tabbarState.dialog = "templates";
    tabbarState.preview = false;
    renderApp();
  } else if (act === "open-save-template") {
    tabbarState.dialog = "save-template";
    tabbarState.templateName = entry && entry.name ? entry.name : "";
    tabbarState.preview = false;
    renderApp();
  } else if (act === "save") saveTabbar();
  else if (act === "publish") publishTabbar();
  else if (act === "restore") {
    showConfirm({
      title: "恢复至上一个发布版本",
      text: `上一个版本时间 ${tabbarState.publishedAt}，确定恢复后当前编辑数据将清空。`,
      okText: "确定恢复",
      danger: true,
      onOk: () => {
        tabbarState.saved = clone(tabbarState.published);
        tabbarState.draft = clone(tabbarState.published);
        tabbarState.selectedId = tabbarState.draft.entries[0].id;
        tabbarState.dirty = false;
        tabbarState.canPublish = false;
        tabbarState.pickedWidget = "";
        showToast("已恢复至上一个发布版本");
        renderApp();
      },
    });
  }
}

function onTabbarOverlayClick(e) {
  if (e.target.classList && e.target.classList.contains("mask") && !e.target.closest(".dialog")) {
    tabbarState.preview = false;
    tabbarState.dialog = "";
    renderApp();
    return;
  }
  const btn = e.target.closest("[data-tabbar-act]");
  if (!btn) return;
  const act = btn.dataset.tabbarAct;
  if (act === "close-dialog") {
    tabbarState.preview = false;
    tabbarState.dialog = "";
    renderApp();
  } else if (act === "preview-entry") {
    tabbarState.selectedId = btn.dataset.id;
    renderApp();
  } else if (act === "confirm-template") {
    const name = String(tabbarState.templateName || "").trim();
    if (!name) {
      showToast("请填写模版名称", "error");
      return;
    }
    tabbarState.templates.unshift({ name: name, time: tabbarState.publishedAt });
    tabbarState.dialog = "templates";
    showToast("已存入模版库");
    renderApp();
  }
}

function bindTabbarOverlays() {
  const overlay = document.getElementById("overlay-root");
  if (!overlay) return;
  overlay.innerHTML = renderTabbarDialog();
  const hasOverlay = Boolean(overlay.querySelector(".mask") || document.getElementById("confirm-modal"));
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.tabbarBound) {
    overlay.dataset.tabbarBound = "1";
    overlay.addEventListener("click", (e) => {
      if (activeKey !== "tabbar") return;
      onTabbarOverlayClick(e);
    });
    overlay.addEventListener("input", (e) => {
      if (activeKey !== "tabbar") return;
      const field = e.target.closest("[data-tabbar-field]");
      if (field) onTabbarField(field);
    });
  }
}

function mountTabbarPage(main) {
  if (!main.dataset.tabbarBound) {
    main.dataset.tabbarBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "tabbar") return;
      onTabbarClick(e);
    });
    main.addEventListener("input", (e) => {
      if (activeKey !== "tabbar") return;
      const field = e.target.closest("[data-tabbar-field]");
      if (field && field.type !== "radio" && field.type !== "checkbox" && field.tagName !== "SELECT") onTabbarField(field);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "tabbar") return;
      const file = e.target.closest("[data-tabbar-file]");
      if (file && file.files && file.files[0]) readTabbarIcon(file.files[0], file.dataset.tabbarFile);
      const field = e.target.closest("[data-tabbar-field]");
      if (field && field.tagName === "SELECT") onTabbarField(field);
    });
  }
  main.innerHTML = renderTabbarPage();
  bindTabbarOverlays();
}

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
    group: "广告组件",
    items: [
      { key: "banner", name: "Banner 广告", tier: "base" },
      { key: "icons", name: "图标广告", tier: "base" },
      { key: "textad", name: "文字广告", tier: "base" },
      { key: "mrec", name: "MREC 广告", tier: "base" },
      { key: "native", name: "原生广告", tier: "base" },
    ],
  },
  {
    group: "金刚组件",
    items: [
      { key: "kingkong", name: "金刚区", tier: "base" },
      { key: "ranknav", name: "排行榜导航", tier: "adv" },
    ],
  },
  {
    group: "活动组件",
    items: [{ key: "activity", name: "活动组件", tier: "adv" }],
  },
];

function blankTabbarChannel(name) {
  return { id: `ch_${Math.random().toString(16).slice(2, 10)}`, name: name || "", widgets: [] };
}

const TABBAR_AD_TYPE = {
  banner: "bannerAd",
  icons: "iconAd",
  textad: "textAd",
  mrec: "mrecAd",
  native: "nativeAd",
};

const TABBAR_INT_FIELDS = new Set(["sizeWidth", "sizeHeight", "itemSpacing", "maxCount", "columns", "spacing", "iconSize", "maxLines"]);

function defaultTabbarWidgetConfig(key) {
  if (key === "banner") return { componentType: "bannerAd", adSlotKey: "", format: "banner", sizeWidth: "", sizeHeight: "", itemSpacing: "12" };
  if (key === "icons") return { componentType: "iconAd", adSlotKey: "", layout: "auto", maxCountMode: "unlimited", maxCount: "0", columns: "5", spacing: "8", iconSize: "" };
  if (key === "textad") return { componentType: "textAd", adSlotKey: "", layout: "cell", maxCountMode: "unlimited", maxCount: "0", columns: "3", spacing: "8", maxLines: "2" };
  if (key === "mrec") return { componentType: "mrecAd", adSlotKey: "", sizeWidth: "300", sizeHeight: "250" };
  if (key === "native") return { componentType: "nativeAd", adSlotKey: "", layout: "bannerList", columns: "" };
  if (key === "kingkong") return { cols: "5", names: "追剧,排行,福利,社区,分类" };
  if (key === "ranknav") return { tabs: "热门推荐,最新上架,最多收藏" };
  if (key === "activity") return { title: "限时活动", desc: "点击进入活动页" };
  return {};
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

function currentTabbarChannel(entry) {
  const current = entry || selectedTabbarEntry();
  if (!current) return null;
  return current.channels.find((item) => item.id === current.channelId) || current.channels[0] || null;
}

function selectedTabbarWidget() {
  const channel = currentTabbarChannel();
  if (!channel || !tabbarState.pickedWidget) return null;
  return (channel.widgets || []).find((item) => item.id === tabbarState.pickedWidget) || null;
}

function tabbarMaxCountMode(config) {
  if (config.maxCountMode === "limit" || config.maxCountMode === "unlimited") return config.maxCountMode;
  return Number(config.maxCount) > 0 ? "limit" : "unlimited";
}

function tabbarIconVisibility(layout) {
  if (layout === "image") return { maxCount: false, columns: false, spacing: false };
  if (layout === "horizontal") return { maxCount: true, columns: false, spacing: true };
  if (layout === "carousel") return { maxCount: true, columns: false, spacing: false };
  return { maxCount: true, columns: true, spacing: true };
}

function renderCanvasWidget(widget) {
  const on = widget.id === tabbarState.pickedWidget ? " on" : "";
  const config = widget.config || {};
  const open = `<button type="button" class="`;
  const close = `" data-tabbar-act="select-widget" data-id="${widget.id}">`;
  if (widget.key === "banner") {
    const large = config.format === "bannerLarge";
    return `${open}tw tw-banner${large ? " large" : ""}${on}${close}<span>广告</span><b>${large ? "大 Banner" : "普通 Banner"}</b></button>`;
  }
  if (widget.key === "icons") {
    const layout = config.layout || "auto";
    const visible = tabbarIconVisibility(layout);
    const columns = Math.max(1, Math.min(10, Number(config.columns) || 5));
    const spacingText = String(config.spacing == null ? "" : config.spacing).trim();
    const spacing = spacingText === "" ? 8 : Math.max(0, Math.min(24, Number(spacingText) || 0));
    const countText = String(config.maxCount == null ? "" : config.maxCount).trim();
    const maxCount = /^[1-9]\d*$/.test(countText) ? Math.min(Number(countText), 30) : 0;
    const single = layout === "image" || layout === "carousel";
    const titled = layout === "auto" || layout === "grid" || layout === "horizontal";
    let count = 1;
    let cols = 1;
    let gap = 0;
    if (layout === "horizontal") {
      count = Math.max(1, maxCount || 5);
      gap = spacing;
    } else if (!single) {
      cols = columns;
      count = Math.max(1, maxCount || columns);
      gap = visible.spacing ? spacing : 6;
    }
    const cells = Array.from({ length: count }, () => `<i>${titled ? "<b></b>标题" : ""}</i>`).join("");
    const layoutStyle = layout === "horizontal" ? "display:flex;overflow:hidden;" : `grid-template-columns:repeat(${cols},minmax(0,1fr));`;
    return `${open}tw tw-icons layout-${layout}${on}${close.slice(0, -1)} style="${layoutStyle}gap:${gap}px">${cells}</button>`;
  }
  if (widget.key === "textad") {
    const layout = config.layout || "cell";
    if (layout === "marquee") {
      return `${open}tw tw-textad layout-marquee${on}${close}<span>广告</span><b>文字广告</b></button>`;
    }
    if (layout === "grid") {
      const columns = Math.max(1, Math.min(4, Number(config.columns) || 3));
      const limited = tabbarMaxCountMode(config) === "limit" ? Number(config.maxCount) : 0;
      const count = limited > 0 ? Math.min(limited, columns) : columns;
      const cells = Array.from({ length: Math.max(1, count) }, () => "<i><b>标题</b><span>描述</span></i>").join("");
      return `${open}tw tw-textad layout-grid${on}${close.slice(0, -1)} style="grid-template-columns:repeat(${columns},minmax(0,1fr))">${cells}</button>`;
    }
    return `${open}tw tw-textad${on}${close}<span>广告</span><b>文字广告</b><em>描述</em></button>`;
  }
  if (widget.key === "mrec") {
    const width = config.sizeWidth || "300";
    const height = config.sizeHeight || "250";
    return `${open}tw tw-mrec${on}${close}<span>广告</span><b>MREC</b><em>${escapeHtml(String(width))}×${escapeHtml(String(height))}</em></button>`;
  }
  if (widget.key === "native") {
    const layout = config.layout === "grid" ? "grid" : "list";
    const columns = layout === "grid" ? Math.max(1, Math.min(4, Number(config.columns) || 2)) : 1;
    const count = layout === "grid" ? columns : 2;
    const cards = Array.from({ length: count }, () => "<i><b>标题</b><span>描述</span><em>按钮</em></i>").join("");
    const style = layout === "grid" ? ` style="grid-template-columns:repeat(${columns},minmax(0,1fr))"` : "";
    return `${open}tw tw-native layout-${layout}${on}${close.slice(0, -1)}${style}>${cards}</button>`;
  }
  if (widget.key === "kingkong") {
    const names = String(config.names || "")
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean);
    const cols = config.cols === "4" ? 4 : 5;
    const cells = (names.length ? names : ["金刚"]).map((item) => `<i><b></b>${escapeHtml(item)}</i>`).join("");
    return `<button type="button" class="tw tw-kingkong cols-${cols}${on}" data-tabbar-act="select-widget" data-id="${widget.id}">${cells}</button>`;
  }
  if (widget.key === "ranknav") {
    const tabs = String(config.tabs || "")
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean);
    const labels = (tabs.length ? tabs : ["热门推荐"]).map((item, index) => `<span class="${index === 0 ? "on" : ""}">${escapeHtml(item)}</span>`).join("");
    return `<button type="button" class="tw tw-ranknav${on}" data-tabbar-act="select-widget" data-id="${widget.id}">${labels}</button>`;
  }
  if (widget.key === "activity") {
    return `<button type="button" class="tw tw-activity${on}" data-tabbar-act="select-widget" data-id="${widget.id}"><b>${escapeHtml(config.title || "活动")}</b><span>${escapeHtml(config.desc || "")}</span></button>`;
  }
  return "";
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
        const selected = selectedTabbarWidget();
        const on = selected && selected.key === item.key;
        return `
          <div class="tabbar-widget${on ? " on" : ""}" draggable="true" data-tabbar-drag="${item.key}">
            <span class="tabbar-widget-thumb"></span>
            <span class="tabbar-tier ${item.tier}">${item.tier === "adv" ? "进阶件" : "基配件"}</span>
            <span>${item.name}</span>
          </div>`;
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
          <div class="tabbar-device" data-tabbar-drop="canvas">
            <div class="tabbar-device-search">请输入搜索关键字</div>
            <div class="tabbar-device-channels">${channelNames || "<span>暂无频道</span>"}</div>
            <div class="tabbar-device-drop">
              ${(channel && channel.widgets && channel.widgets.length)
                ? channel.widgets.map((widget) => renderCanvasWidget(widget)).join("")
                : '<div class="tabbar-drop-hint">从左侧把组件拖到这里</div>'}
            </div>
          </div>
        </div>
        <aside class="tabbar-side">
          <h3>切换频道</h3>
          <h3>组件模块内容配置</h3>
          <div class="tabbar-side-channels">${channelButtons || '<p class="field-hint">还没有频道</p>'}</div>
          <div class="tabbar-side-config">${renderTabbarWidgetForm()}</div>
        </aside>
      </div>
    </section>
  `;
}

function tabbarAdSlotField(config) {
  return `<label>广告位标识 *<input class="input" data-tabbar-field="widgetConfig" data-config="adSlotKey" value="${escapeHtml(config.adSlotKey || "")}" placeholder="请输入广告平台中广告位的广告位标识字段" /></label><p class="field-hint">广告平台里该广告位的固定标识，需完全一致。两个组件填同一个值，会请求同一个广告位。</p>`;
}

function tabbarChoiceField(widget, label, configKey, options, current) {
  const name = `tb_${widget.id}_${configKey}`;
  const radios = options
    .map(([value, text, tip]) => {
      const tipAttr = tip ? ` class="tabbar-tip" data-tabbar-tip="${escapeHtml(tip)}"` : "";
      return `<label${tipAttr}><input type="radio" name="${name}" data-tabbar-field="widgetConfig" data-config="${configKey}" value="${value}" ${current === value ? "checked" : ""} />${text}</label>`;
    })
    .join("");
  return `<div class="tabbar-choice-block"><span>${label}</span><div class="tabbar-choices">${radios}</div></div>`;
}

function tabbarNumberField(label, configKey, value, placeholder) {
  const shown = value == null ? "" : String(value);
  return `<label>${label}<input class="input" inputmode="numeric" data-tabbar-field="widgetConfig" data-config="${configKey}" value="${escapeHtml(shown)}" placeholder="${escapeHtml(placeholder || "")}" /></label>`;
}

function tabbarMaxCountField(config) {
  const mode = tabbarMaxCountMode(config);
  const select = `<label>最多展示条数<select class="input" data-tabbar-field="widgetConfig" data-config="maxCountMode"><option value="unlimited" ${mode === "unlimited" ? "selected" : ""}>不限制</option><option value="limit" ${mode === "limit" ? "selected" : ""}>指定条数</option></select></label>`;
  const input = mode === "limit" ? tabbarNumberField("条数", "maxCount", config.maxCount, "非负整数") : "";
  return `${select}${input}<p class="field-hint">实际展示取广告位返回条数和这个上限中更小的一个。不限制保存为 0，表示不截断。</p>`;
}

function tabbarGridMaxCountField(config) {
  const text = String(config.maxCount == null ? "" : config.maxCount).trim();
  const shown = /^[1-9]\d*$/.test(text) ? text : "";
  return `${tabbarNumberField("最多展示条数 *", "maxCount", shown, "正整数")}<p class="field-hint">最大值不要超过列数*3</p>`;
}

function renderTabbarAdFields(widget) {
  const config = widget.config || {};
  const slot = tabbarAdSlotField(config);
  if (widget.key === "banner") {
    return `${slot}${tabbarChoiceField(widget, "广告形式 *", "format", [["banner", "普通 Banner"], ["bannerLarge", "大 Banner"]], config.format === "bannerLarge" ? "bannerLarge" : "banner")}${tabbarNumberField("展示宽度", "sizeWidth", config.sizeWidth, "正整数，可空")}${tabbarNumberField("展示高度", "sizeHeight", config.sizeHeight, "正整数，可空")}<p class="field-hint">宽度和高度成对填写。都留空时使用广告位下发的尺寸。</p>${tabbarNumberField("多条间距", "itemSpacing", config.itemSpacing, "12")}<p class="field-hint">单位 px。该广告位返回多条并纵向排列时，条与条的间距。</p>`;
  }
  if (widget.key === "icons") {
    const layout = config.layout || "auto";
    const visible = tabbarIconVisibility(layout);
    return `${slot}${tabbarChoiceField(widget, "布局 *", "layout", [
      ["auto", "自动", "广告位只返回 1 条时显示单图，返回多条时按宫格排列。"],
      ["image", "单图", "只显示第一条素材。"],
      ["grid", "宫格", "按列数排成宫格，标题使用素材标题。"],
      ["horizontal", "横向滚动", "单行横向滑动，不使用列数。"],
      ["carousel", "单图标轮播", "每页一个图标，不显示标题。可以左右滑动，约每 3 秒自动切换。"],
    ], layout)}${visible.maxCount ? (layout === "grid" ? tabbarGridMaxCountField(config) : tabbarMaxCountField(config)) : ""}${visible.columns ? tabbarNumberField("列数", "columns", config.columns, "5") : ""}${visible.spacing ? tabbarNumberField("间距", "spacing", config.spacing, "8") : ""}${tabbarNumberField("图标尺寸", "iconSize", config.iconSize, "px，可空")}<p class="field-hint">图标尺寸留空时使用 SDK 默认尺寸。关闭按钮由 SDK 绘制。</p>`;
  }
  if (widget.key === "textad") {
    const layout = config.layout || "cell";
    const grid = layout === "grid";
    const lines = layout === "cell" || layout === "grid";
    return `${slot}${tabbarChoiceField(widget, "布局 *", "layout", [["cell", "单条"], ["grid", "宫格"], ["marquee", "跑马灯"]], layout)}${grid ? tabbarMaxCountField(config) : ""}${grid ? tabbarNumberField("列数", "columns", config.columns, "3") : ""}${grid ? tabbarNumberField("间距", "spacing", config.spacing, "8") : ""}${lines ? tabbarNumberField("最大行数", "maxLines", config.maxLines, "2") : ""}${layout === "marquee" ? '<p class="field-hint">滚动速度用广告位下发的规则，这里不配置。</p>' : ""}`;
  }
  if (widget.key === "mrec") {
    return `${slot}${tabbarNumberField("展示宽度", "sizeWidth", config.sizeWidth, "300")}${tabbarNumberField("展示高度", "sizeHeight", config.sizeHeight, "250")}<p class="field-hint">默认 300×250。保存时始终带上尺寸。</p>`;
  }
  if (widget.key === "native") {
    const layout = config.layout === "grid" ? "grid" : "bannerList";
    return `${slot}${tabbarChoiceField(widget, "布局 *", "layout", [["bannerList", "列表"], ["grid", "宫格"]], layout)}${tabbarNumberField("列数", "columns", config.columns, "可空")}<p class="field-hint">留空时，列表按 1 列、宫格按 2 列。关闭按钮由广告位规则决定。</p>`;
  }
  return "";
}

function renderTabbarWidgetForm() {
  const widget = selectedTabbarWidget();
  if (!widget) return '<div class="tabbar-config-empty">请先点击画布内组件</div>';
  const config = widget.config || {};
  const name = tabbarWidgetName(widget.key);
  let fields = renderTabbarAdFields(widget);
  if (widget.key === "kingkong") {
    fields = `<label>列数<select class="input" data-tabbar-field="widgetConfig" data-config="cols"><option value="4" ${config.cols === "4" ? "selected" : ""}>4 列</option><option value="5" ${config.cols !== "4" ? "selected" : ""}>5 列</option></select></label><label>入口名称<input class="input" data-tabbar-field="widgetConfig" data-config="names" value="${escapeHtml(config.names || "")}" placeholder="用逗号分开" /></label>`;
  } else if (widget.key === "ranknav") {
    fields = `<label>榜单标签<input class="input" data-tabbar-field="widgetConfig" data-config="tabs" value="${escapeHtml(config.tabs || "")}" placeholder="用逗号分开" /></label>`;
  } else if (widget.key === "activity") {
    fields = `<label>活动标题 *<input class="input" data-tabbar-field="widgetConfig" data-config="title" value="${escapeHtml(config.title || "")}" /></label><label>活动说明<input class="input" data-tabbar-field="widgetConfig" data-config="desc" value="${escapeHtml(config.desc || "")}" /></label>`;
  }
  return `
    <div class="tabbar-config">
      <h4>${escapeHtml(name)}</h4>
      ${fields}
      <button type="button" class="btn" data-tabbar-act="remove-widget" data-id="${widget.id}">从画布移除</button>
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

function tabbarNonNeg(value, fallback) {
  const text = String(value == null ? "" : value).trim();
  if (!text) return { value: fallback };
  if (!/^(0|[1-9]\d*)$/.test(text)) return { error: true };
  return { value: Number(text) };
}

function tabbarPositive(value, fallback) {
  const text = String(value == null ? "" : value).trim();
  if (!text) return { value: fallback, empty: true };
  if (!/^[1-9]\d*$/.test(text)) return { error: true };
  return { value: Number(text) };
}

function tabbarSavedMaxCount(config) {
  if (tabbarMaxCountMode(config) !== "limit") return { value: 0 };
  const text = String(config.maxCount == null ? "" : config.maxCount).trim();
  if (!text) return { error: "请填写最多展示条数" };
  if (!/^(0|[1-9]\d*)$/.test(text)) return { error: "最多展示条数需为非负整数" };
  return { value: Number(text) };
}

function normalizeTabbarAd(widget) {
  const config = widget.config || {};
  const name = tabbarWidgetName(widget.key);
  const adSlotKey = String(config.adSlotKey || "").trim();
  if (!adSlotKey) return `${name}：请填写广告位标识`;
  const next = { componentType: TABBAR_AD_TYPE[widget.key], adSlotKey };
  if (widget.key === "banner") {
    const width = String(config.sizeWidth || "").trim();
    const height = String(config.sizeHeight || "").trim();
    if ((width && !height) || (!width && height)) return "Banner 广告：展示宽度和高度需要同时填写";
    if (width && !/^[1-9]\d*$/.test(width)) return "Banner 广告：展示宽度需为正整数";
    if (height && !/^[1-9]\d*$/.test(height)) return "Banner 广告：展示高度需为正整数";
    const spacing = tabbarNonNeg(config.itemSpacing, 12);
    if (spacing.error) return "Banner 广告：多条间距需为非负整数";
    next.format = config.format === "bannerLarge" ? "bannerLarge" : "banner";
    next.itemSpacing = spacing.value;
    if (width && height) {
      next.sizeWidth = Number(width);
      next.sizeHeight = Number(height);
    }
  } else if (widget.key === "icons") {
    const layout = ["auto", "image", "grid", "horizontal", "carousel"].includes(config.layout) ? config.layout : "auto";
    const visible = tabbarIconVisibility(layout);
    next.layout = layout;
    if (layout === "image") next.maxCount = 1;
    else if (layout === "grid") {
      const columns = tabbarPositive(config.columns, 5);
      if (columns.error) return "图标广告：列数需为正整数";
      const text = String(config.maxCount == null ? "" : config.maxCount).trim();
      if (!/^[1-9]\d*$/.test(text)) return "图标广告：请填写最多展示条数";
      if (Number(text) > columns.value * 3) return "图标广告：最多展示条数不要超过列数的 3 倍";
      next.maxCount = Number(text);
      next.columns = columns.value;
    } else if (visible.maxCount) {
      const count = tabbarSavedMaxCount(config);
      if (count.error) return `图标广告：${count.error}`;
      next.maxCount = count.value;
    }
    if (visible.columns && layout !== "grid") {
      const columns = tabbarPositive(config.columns, 5);
      if (columns.error) return "图标广告：列数需为正整数";
      next.columns = columns.value;
    }
    if (visible.spacing) {
      const spacing = tabbarNonNeg(config.spacing, 8);
      if (spacing.error) return "图标广告：间距需为非负整数";
      next.spacing = spacing.value;
    }
    const iconSize = String(config.iconSize || "").trim();
    if (iconSize && !/^[1-9]\d*$/.test(iconSize)) return "图标广告：图标尺寸需为正整数";
    next.iconSize = iconSize ? Number(iconSize) : null;
  } else if (widget.key === "textad") {
    const layout = ["cell", "grid", "marquee"].includes(config.layout) ? config.layout : "cell";
    next.layout = layout;
    if (layout === "grid") {
      const count = tabbarSavedMaxCount(config);
      if (count.error) return `文字广告：${count.error}`;
      const columns = tabbarPositive(config.columns, 3);
      if (columns.error) return "文字广告：列数需为正整数";
      const spacing = tabbarNonNeg(config.spacing, 8);
      if (spacing.error) return "文字广告：间距需为非负整数";
      next.maxCount = count.value;
      next.columns = columns.value;
      next.spacing = spacing.value;
    }
    if (layout === "cell" || layout === "grid") {
      const lines = tabbarPositive(config.maxLines, 2);
      if (lines.error) return "文字广告：最大行数需为正整数";
      next.maxLines = lines.value;
    }
  } else if (widget.key === "mrec") {
    const width = tabbarPositive(config.sizeWidth, 300);
    const height = tabbarPositive(config.sizeHeight, 250);
    if (width.error) return "MREC 广告：展示宽度需为正整数";
    if (height.error) return "MREC 广告：展示高度需为正整数";
    next.sizeWidth = width.value;
    next.sizeHeight = height.value;
  } else if (widget.key === "native") {
    next.layout = config.layout === "grid" ? "grid" : "bannerList";
    const columns = String(config.columns || "").trim();
    if (columns) {
      if (!/^[1-9]\d*$/.test(columns)) return "原生广告：列数需为正整数";
      next.columns = Number(columns);
    }
  }
  widget.config = next;
  return "";
}

function normalizeTabbarAds(draft) {
  for (let i = 0; i < draft.entries.length; i += 1) {
    const entry = draft.entries[i];
    const channels = entry.channels || [];
    for (let c = 0; c < channels.length; c += 1) {
      const channel = channels[c];
      const widgets = channel.widgets || [];
      for (let w = 0; w < widgets.length; w += 1) {
        const widget = widgets[w];
        if (!TABBAR_AD_TYPE[widget.key]) continue;
        const message = normalizeTabbarAd(widget);
        if (message) {
          tabbarState.selectedId = entry.id;
          if (entry.type === "product") entry.channelId = channel.id;
          tabbarState.pickedWidget = widget.id;
          return message;
        }
      }
    }
  }
  return "";
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
  const adError = normalizeTabbarAds(draft);
  if (adError) {
    showToast(adError, "error");
    renderApp();
    return;
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
    tabbarState.pickedWidget = "";
    renderApp();
  } else if (field === "widgetConfig") {
    const widget = selectedTabbarWidget();
    if (!widget) return;
    const key = el.dataset.config;
    let value = el.value;
    if (TABBAR_INT_FIELDS.has(key)) {
      value = String(value || "").replace(/[^\d]/g, "");
      if (el.value !== value) el.value = value;
    }
    widget.config[key] = value;
    if (key === "maxCountMode" && value === "unlimited") widget.config.maxCount = "0";
    if (key === "maxCountMode" && value === "limit" && String(widget.config.maxCount) === "0") widget.config.maxCount = "";
    markTabbarDirty();
    if (el.type !== "radio" && el.tagName !== "SELECT") {
      const preview = document.querySelector(`[data-tabbar-act="select-widget"][data-id="${widget.id}"]`);
      if (preview) preview.outerHTML = renderCanvasWidget(widget);
      return;
    }
    renderApp();
    return;
  }
  if (field !== "channelId" && field !== "widgetConfig") markTabbarDirty();
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
    tabbarState.pickedWidget = "";
    renderApp();
  } else if (act === "select-widget") {
    tabbarState.pickedWidget = btn.dataset.id;
    renderApp();
  } else if (act === "remove-widget") {
    const channel = currentTabbarChannel(entry);
    if (channel) channel.widgets = (channel.widgets || []).filter((item) => item.id !== btn.dataset.id);
    tabbarState.pickedWidget = "";
    markTabbarDirty();
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

function addTabbarWidget(key) {
  const channel = currentTabbarChannel();
  if (!channel || !tabbarWidgetName(key)) return;
  if (!Array.isArray(channel.widgets)) channel.widgets = [];
  const widget = {
    id: `w_${Math.random().toString(16).slice(2, 10)}`,
    key,
    config: defaultTabbarWidgetConfig(key),
  };
  channel.widgets.push(widget);
  tabbarState.pickedWidget = widget.id;
  tabbarState.dragKey = "";
  markTabbarDirty();
  renderApp();
}

function bindTabbarDrag(main) {
  main.querySelectorAll("[data-tabbar-drag]").forEach((el) => {
    el.addEventListener("dragstart", (event) => {
      tabbarState.dragKey = el.dataset.tabbarDrag;
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", el.dataset.tabbarDrag);
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => el.classList.remove("dragging"));
  });
  const canvas = main.querySelector("[data-tabbar-drop]");
  if (!canvas) return;
  canvas.addEventListener("dragover", (event) => {
    event.preventDefault();
    canvas.classList.add("drop-on");
  });
  canvas.addEventListener("dragleave", (event) => {
    if (!canvas.contains(event.relatedTarget)) canvas.classList.remove("drop-on");
  });
  canvas.addEventListener("drop", (event) => {
    event.preventDefault();
    canvas.classList.remove("drop-on");
    const key = event.dataTransfer.getData("text/plain") || tabbarState.dragKey;
    if (key) addTabbarWidget(key);
  });
}

function hideTabbarTip() {
  const bubble = document.getElementById("tabbar-tip-bubble");
  if (bubble) bubble.hidden = true;
}

function showTabbarTip(el) {
  let bubble = document.getElementById("tabbar-tip-bubble");
  if (!bubble) {
    bubble = document.createElement("div");
    bubble.id = "tabbar-tip-bubble";
    bubble.className = "tabbar-tip-bubble";
    document.body.appendChild(bubble);
  }
  bubble.textContent = el.getAttribute("data-tabbar-tip") || "";
  bubble.hidden = false;
  const rect = el.getBoundingClientRect();
  const width = bubble.offsetWidth;
  const height = bubble.offsetHeight;
  let left = rect.left + rect.width / 2 - width / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  let top = rect.top - height - 8;
  if (top < 8) top = rect.bottom + 8;
  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;
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
      if (field && (field.tagName === "SELECT" || field.type === "radio")) onTabbarField(field);
    });
    main.addEventListener("mouseover", (event) => {
      if (activeKey !== "tabbar") return;
      const tip = event.target.closest("[data-tabbar-tip]");
      if (!tip || tip.contains(event.relatedTarget)) return;
      showTabbarTip(tip);
    });
    main.addEventListener("mouseout", (event) => {
      const tip = event.target.closest("[data-tabbar-tip]");
      if (!tip || tip.contains(event.relatedTarget)) return;
      hideTabbarTip();
    });
    main.addEventListener("scroll", hideTabbarTip, true);
  }
  hideTabbarTip();
  main.innerHTML = renderTabbarPage();
  bindTabbarDrag(main);
  bindTabbarOverlays();
}

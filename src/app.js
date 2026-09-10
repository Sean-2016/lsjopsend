const ICONS = {
  chart:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 17V11"/><path d="M12 17V8"/><path d="M16 17v-5"/></svg>',
  content:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/></svg>',
  community:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M17 9h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v2l-3-2"/></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="3.2"/><path d="M5 19c1-3.2 3.4-5 7-5s6 1.8 7 5"/></svg>',
  growth:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l5-5 4 3 7-8"/><path d="M15 6h5v5"/></svg>',
  ad: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h3l5 4V6L7 10H4z"/><path d="M16.5 8.5a4.5 4.5 0 0 1 0 7"/><path d="M18.8 6.2a7.5 7.5 0 0 1 0 11.6"/></svg>',
  layout:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M10 9v11"/></svg>',
  finance:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M8 15h2"/></svg>',
  risk: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5.5 6v6.2c0 4.1 2.7 7.1 6.5 8.8 3.8-1.7 6.5-4.7 6.5-8.8V6L12 3z"/><path d="M12 8v4M12 16h.01"/></svg>',
  setting:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  chevron:
    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',
};

const MENUS = [
  {
    key: "data",
    label: "数据中心",
    icon: "chart",
    children: [
      { key: "data-overview", label: "数据概览" },
      { key: "member-lifecycle", label: "会员生命周期概览" },
      { key: "member-level-overview", label: "会员等级概览" },
      { key: "asset-dashboard", label: "资产数据看板" },
    ],
  },
  {
    key: "content",
    label: "内容中心",
    icon: "content",
    children: [
      { key: "video", label: "视频内容管理" },
      { key: "novel", label: "小说内容管理" },
      { key: "comic", label: "漫画内容管理" },
      { key: "ai-drama", label: "AI短剧内容管理" },
      { key: "content-pool", label: "内容池管理" },
      { key: "tag-group", label: "内容标签组管理" },
      { key: "tag", label: "内容标签管理" },
    ],
  },
  {
    key: "community",
    label: "社区",
    icon: "community",
    children: [
      { key: "ugc", label: "UGC内容" },
      { key: "topic", label: "话题管理" },
      { key: "super-topic", label: "超话管理" },
      { key: "comments", label: "评论管理" },
      { key: "danmaku", label: "弹幕管理" },
      { key: "contest", label: "创作大赛" },
    ],
  },
  {
    key: "user-center",
    label: "用户中心",
    icon: "user",
    children: [
      { key: "user-info", label: "用户信息管理" },
      { key: "user-points", label: "用户积分明细" },
      { key: "user-coins", label: "用户金币明细" },
      {
        key: "user-tags",
        label: "用户标签管理",
        children: [
          { key: "user-tag-library", label: "用户标签库" },
          { key: "user-tag-segment", label: "用户圈选" },
        ],
      },
      { key: "user-feedback", label: "用户反馈记录" },
      { key: "user-negative-feedback", label: "用户负反馈管理" },
    ],
  },
  {
    key: "growth",
    label: "增长运营",
    icon: "growth",
    children: [
      { key: "activity", label: "活动管理" },
      { key: "task", label: "任务管理" },
      { key: "prize-pool", label: "奖品池管理" },
      { key: "rank", label: "榜单管理" },
      { key: "ad-channel", label: "广告渠道管理" },
      { key: "search-words", label: "搜索组件推荐搜索词" },
      { key: "faq", label: "FAQ管理" },
    ],
  },
  {
    key: "commerce",
    label: "商业化",
    icon: "ad",
    children: [
      {
        key: "ads",
        label: "广告管理",
        children: [
          { key: "ad-slot", label: "广告位配置" },
          { key: "ad-strategy", label: "广告展示策略配置" },
          { key: "ad-source", label: "广告数据源" },
        ],
      },
      { key: "member-sku", label: "会员商品管理" },
      { key: "coin-sku", label: "金币包商品管理" },
      { key: "orders", label: "商品订单" },
    ],
  },
  {
    key: "finance",
    label: "财务管理",
    icon: "finance",
    children: [
      { key: "coin-point-adjust", label: "金币&积分赠扣" },
      { key: "virtual-asset-log", label: "虚拟资产操作记录" },
    ],
  },
  {
    key: "frontend",
    label: "大前端配置",
    icon: "layout",
    children: [
      { key: "version", label: "版本管理" },
      { key: "version-guide", label: "版本更新引导" },
      { key: "feature-page", label: "功能页面管理" },
      { key: "tabbar", label: "底部导航管理" },
      { key: "badge", label: "角标物料管理" },
      { key: "seo", label: "seo参数管理" },
      { key: "web-config", label: "前端动态配置" },
    ],
  },
  {
    key: "risk",
    label: "风控",
    icon: "risk",
    children: [
      { key: "age-gate", label: "年龄门禁" },
      { key: "safe-words", label: "文本安全关键词" },
    ],
  },
  {
    key: "system",
    label: "系统",
    icon: "setting",
    children: [
      {
        key: "staff",
        label: "人员管理",
        children: [
          { key: "staff-list", label: "用户列表" },
          { key: "staff-dept", label: "用户部门" },
          { key: "staff-role", label: "用户角色" },
        ],
      },
      { key: "permission", label: "权限管理" },
      { key: "oplog", label: "操作日志" },
      { key: "dict", label: "字典管理" },
      { key: "server-config", label: "服务端配置" },
      { key: "api-domain", label: "API域名配置" },
    ],
  },
];

const openKeys = new Set();
let activeKey = "data-overview";
let openTabs = ["data-overview"];

function collapseOtherLevel1(exceptKey) {
  MENUS.forEach((item) => {
    if (item.key !== exceptKey) openKeys.delete(item.key);
  });
}

function findMenuPath(items, key, trail) {
  trail = trail || [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const next = trail.concat(item);
    if (item.key === key) return next;
    if (item.children) {
      const found = findMenuPath(item.children, key, next);
      if (found) return found;
    }
  }
  return null;
}

function pageByKey(key) {
  const path = findMenuPath(MENUS, key);
  if (!path) return { key, label: key, crumbs: [key] };
  return {
    key,
    label: path[path.length - 1].label,
    crumbs: path.map((item) => item.label),
  };
}

function expandMenuFor(key) {
  const path = findMenuPath(MENUS, key);
  if (!path) return;
  if (path[0]) collapseOtherLevel1(path[0].key);
  path.slice(0, -1).forEach((item) => openKeys.add(item.key));
}

function openPage(key) {
  if (!openTabs.includes(key)) openTabs.push(key);
  activeKey = key;
  expandMenuFor(key);
}

function closeTab(key) {
  const index = openTabs.indexOf(key);
  if (index < 0) return;
  if (openTabs.length === 1) return;
  openTabs.splice(index, 1);
  if (activeKey === key) {
    activeKey = openTabs[index] || openTabs[index - 1];
    expandMenuFor(activeKey);
  }
}

function hasActiveDescendant(item) {
  if (!item.children) return item.key === activeKey;
  return item.children.some((child) => hasActiveDescendant(child));
}

function renderItems(items, level) {
  return items
    .map((item) => {
      const hasChildren = Boolean(item.children && item.children.length);
      const opened = openKeys.has(item.key);
      const active = item.key === activeKey;
      const activeBranch = hasChildren && hasActiveDescendant(item);
      const className = [
        level === 1 ? "nav-item" : "nav-sub",
        `level-${level}`,
        active ? "active" : "",
        activeBranch ? "active-parent" : "",
        hasChildren && opened ? "open" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const icon = item.icon
        ? `<span class="icon">${ICONS[item.icon]}</span>`
        : "";
      const arrow = hasChildren
        ? `<span class="arrow${opened ? " open" : ""}">${ICONS.chevron}</span>`
        : "";

      const button = `
        <button type="button" class="${className}" data-key="${item.key}" data-has-children="${hasChildren}">
          ${icon}
          <span class="label">${item.label}</span>
          ${arrow}
        </button>
      `;

      if (!hasChildren || !opened) return button;
      return `${button}<div class="nav-children">${renderItems(item.children, level + 1)}</div>`;
    })
    .join("");
}

function onSidebarClick(e) {
  const button = e.target.closest("button[data-key]");
  if (!button || !document.getElementById("sidebar").contains(button)) return;
  const key = button.dataset.key;
  if (button.dataset.hasChildren === "true") {
    if (openKeys.has(key)) {
      openKeys.delete(key);
    } else {
      const isLevel1 = MENUS.some((item) => item.key === key);
      if (isLevel1) collapseOtherLevel1(key);
      openKeys.add(key);
    }
    renderSidebar();
    return;
  }
  const go = () => {
    openPage(key);
    renderApp();
  };
  if (key !== activeKey && typeof confirmLeaveIfDirty === "function") confirmLeaveIfDirty(go);
  else go();
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  const prevNav = sidebar.querySelector(".nav");
  const scrollTop = prevNav ? prevNav.scrollTop : 0;
  sidebar.innerHTML = `
    <div class="brand">
      <span class="brand-mark"><span class="brand-play"></span></span>
      <span class="brand-name">Admin</span>
    </div>
    <nav class="nav">${renderItems(MENUS, 1)}</nav>
  `;
  const nav = sidebar.querySelector(".nav");
  if (nav) nav.scrollTop = scrollTop;
  if (!sidebar.dataset.bound) {
    sidebar.dataset.bound = "1";
    sidebar.addEventListener("click", onSidebarClick);
  }
}

function renderWorkTabs() {
  const el = document.getElementById("work-tabs");
  if (!el) return;
  el.innerHTML = openTabs
    .map((key) => {
      const page = pageByKey(key);
      const active = key === activeKey ? " active" : "";
      const closable = openTabs.length > 1;
      return `
        <button type="button" class="work-tab${active}" data-tab="${key}">
          <span>${page.label}</span>
          ${closable ? `<span class="work-tab-x" data-close="${key}">×</span>` : ""}
        </button>
      `;
    })
    .join("");
  if (el.dataset.bound) return;
  el.dataset.bound = "1";
  el.addEventListener("click", (e) => {
    const closer = e.target.closest("[data-close]");
    if (closer) {
      e.preventDefault();
      e.stopPropagation();
      const key = closer.dataset.close;
      const go = () => {
        closeTab(key);
        renderApp();
      };
      if (key === activeKey && typeof confirmLeaveIfDirty === "function") confirmLeaveIfDirty(go);
      else go();
      return;
    }
    const tab = e.target.closest("[data-tab]");
    if (!tab || tab.dataset.tab === activeKey) return;
    const go = () => {
      openPage(tab.dataset.tab);
      renderApp();
    };
    if (typeof confirmLeaveIfDirty === "function") confirmLeaveIfDirty(go);
    else go();
  });
}

function renderPlaceholderPage(key) {
  const page = pageByKey(key);
  const crumbs = page.crumbs
    .map((name, index) => {
      const current = index === page.crumbs.length - 1 ? ' class="current"' : "";
      const sep = index ? '<span class="sep">/</span>' : "";
      return `${sep}<span${current}>${name}</span>`;
    })
    .join("");
  return `
    <header class="topbar">
      <div class="crumb">${crumbs}</div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="page-head">
        <div>
          <h1>${page.label}</h1>
          <p>页面已打开，可从上方标签切换或关闭。本页暂为占位。</p>
        </div>
      </div>
    </div>
  `;
}

function renderApp() {
  renderSidebar();
  renderWorkTabs();
  const main = document.getElementById("main");
  if (activeKey === "user-tag-library" || activeKey === "user-tag-segment") {
    mountSegmentPage(main, activeKey);
  } else if (activeKey === "coin-sku") {
    mountCoinSkuPage(main);
  } else if (activeKey === "user-info") {
    mountUserInfoPage(main);
  } else if (activeKey === "coin-point-adjust") {
    const overlay = document.getElementById("overlay-root");
    if (overlay) overlay.innerHTML = "";
    document.documentElement.classList.remove("overlay-open");
    mountFinanceAdjustPage(main);
  } else if (activeKey === "virtual-asset-log") {
    const overlay = document.getElementById("overlay-root");
    if (overlay) overlay.innerHTML = "";
    document.documentElement.classList.remove("overlay-open");
    mountFinanceLogPage(main);
  } else if (activeKey === "task") {
    mountTaskPage(main);
  } else {
    main.innerHTML = renderPlaceholderPage(activeKey);
    const overlay = document.getElementById("overlay-root");
    if (overlay) overlay.innerHTML = "";
    document.documentElement.classList.remove("overlay-open");
  }
}

renderApp();

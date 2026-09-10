function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createInitialTags() {
  return [
    {
      id: "new",
      name: "新用户",
      code: "new",
      category: "fsm",
      status: "enabled",
      system: true,
      params: { duration: 24, unit: "hour" },
      description: "注册成功起未满 24 小时（窗口可在标签中调整）。与「老用户」互斥，不包含付费/免费判定。",
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "old",
      name: "老用户",
      code: "old",
      category: "fsm",
      status: "enabled",
      system: true,
      params: {},
      description: "已过新用户窗口。与「新用户」互斥，不包含付费/免费判定。",
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "paid",
      name: "付费用户",
      code: "paid",
      category: "fsm",
      status: "enabled",
      system: true,
      params: {},
      description: "至少 1 笔充值成功入账（不含 pending、不含赠币）。与「免费用户」互斥。",
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "free",
      name: "免费用户",
      code: "free",
      category: "fsm",
      status: "enabled",
      system: true,
      params: {},
      description: "从未成功充值（账本成功入账）。与「付费用户」互斥。",
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "returning",
      name: "回归用户",
      code: "returning",
      category: "fsm",
      status: "enabled",
      system: true,
      params: { silentDays: 30 },
      description: "连续 30 天无登录且无充值后再次打开。不与新/老、付费/免费互斥，可与其它标签组合。",
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "sub_active",
      name: "订阅中",
      code: "sub_active",
      category: "sub",
      status: "enabled",
      system: true,
      params: {},
      description: "订阅在有效期中。与「订阅失效」互斥。",
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "sub_expired",
      name: "订阅失效",
      code: "sub_expired",
      category: "sub",
      status: "enabled",
      system: true,
      params: {},
      description: "曾经订阅过，但当前已过期。与「订阅中」互斥。",
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "sub_renewed",
      name: "有续订",
      code: "sub_renewed",
      category: "sub",
      status: "enabled",
      system: true,
      params: {},
      description: "任意续订过一次。不与「订阅中 / 订阅失效」互斥。",
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "client_ios",
      name: "客户端 iOS",
      code: "client_ios",
      category: "attr",
      status: "enabled",
      system: true,
      params: {},
      description: "当前客户端为 iOS。",
      updatedAt: "09-01 11:10",
      updatedBy: "运营小王",
    },
    {
      id: "client_android",
      name: "客户端安卓",
      code: "client_android",
      category: "attr",
      status: "enabled",
      system: true,
      params: {},
      description: "当前客户端为 Android。",
      updatedAt: "09-01 11:10",
      updatedBy: "运营小王",
    },
    {
      id: "client_web",
      name: "客户端 Web",
      code: "client_web",
      category: "attr",
      status: "enabled",
      system: true,
      params: {},
      description: "当前客户端为 Web。",
      updatedAt: "09-01 11:10",
      updatedBy: "运营小王",
    },
    {
      id: "client_pwa",
      name: "客户端 PWA",
      code: "client_pwa",
      category: "attr",
      status: "enabled",
      system: true,
      params: {},
      description: "当前客户端为 PWA。",
      updatedAt: "09-01 11:10",
      updatedBy: "运营小王",
    },
    {
      id: "privacy_sfw_on",
      name: "安全模式开启",
      code: "privacy_sfw_on",
      category: "attr",
      status: "enabled",
      system: true,
      params: {},
      description: "用户已开启安全模式。",
      updatedAt: "09-01 11:12",
      updatedBy: "运营小王",
    },
  ];
}

function createInitialPacks() {
  return [
    {
      id: "pack_unpaid",
      name: "未付费可转化",
      code: "seg_unpaid_convert",
      desc: "未付费、仍有转化空间的用户，可供活动或触达自行绑定。",
      enabled: true,
      includeMode: "or",
      includes: ["free", "old", "returning"],
      excludes: [],
      countries: [],
      amountRange: {},
      returnDays: { returning: "7" },
      bindCount: 2,
      updatedAt: "09-08 16:20",
      estimate: { include: 90100, afterExclude: 90100, total: 90100 },
    },
    {
      id: "pack_new_day",
      name: "注册一天内用户",
      code: "seg_new_24h",
      desc: "注册未满一天的新用户。",
      enabled: true,
      includeMode: "and",
      includes: ["new"],
      excludes: [],
      countries: [],
      amountRange: {},
      returnDays: {},
      bindCount: 0,
      updatedAt: "09-08 15:02",
      estimate: { include: 12480, afterExclude: 12480, total: 12480 },
    },
  ];
}

const COUNTRIES = [
  { code: "US", name: "美国" },
  { code: "CN", name: "中国" },
  { code: "TW", name: "中国台湾" },
  { code: "HK", name: "中国香港" },
  { code: "MO", name: "中国澳门" },
  { code: "JP", name: "日本" },
  { code: "KR", name: "韩国" },
  { code: "SG", name: "新加坡" },
  { code: "MY", name: "马来西亚" },
  { code: "TH", name: "泰国" },
  { code: "VN", name: "越南" },
  { code: "ID", name: "印度尼西亚" },
  { code: "PH", name: "菲律宾" },
  { code: "IN", name: "印度" },
  { code: "GB", name: "英国" },
  { code: "DE", name: "德国" },
  { code: "FR", name: "法国" },
  { code: "IT", name: "意大利" },
  { code: "ES", name: "西班牙" },
  { code: "RU", name: "俄罗斯" },
  { code: "BR", name: "巴西" },
  { code: "MX", name: "墨西哥" },
  { code: "CA", name: "加拿大" },
  { code: "AU", name: "澳大利亚" },
  { code: "NZ", name: "新西兰" },
  { code: "AE", name: "阿联酋" },
  { code: "SA", name: "沙特阿拉伯" },
  { code: "TR", name: "土耳其" },
  { code: "EG", name: "埃及" },
  { code: "ZA", name: "南非" },
  { code: "NG", name: "尼日利亚" },
  { code: "AR", name: "阿根廷" },
  { code: "CL", name: "智利" },
  { code: "CO", name: "哥伦比亚" },
  { code: "PL", name: "波兰" },
  { code: "NL", name: "荷兰" },
  { code: "SE", name: "瑞典" },
  { code: "CH", name: "瑞士" },
  { code: "PT", name: "葡萄牙" },
  { code: "IE", name: "爱尔兰" },
];

function countryByCode(code) {
  const upper = String(code || "").toUpperCase();
  return COUNTRIES.find((item) => item.code === upper) || { code: upper, name: upper };
}

function filterCountries(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return COUNTRIES;
  return COUNTRIES.filter(
    (item) =>
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q),
  );
}

function isRechargeTag(tag) {
  return Boolean(tag && (tag.code === "paid" || tag.name === "付费用户"));
}

function isReturningTag(tag) {
  return Boolean(tag && (tag.code === "returning" || tag.name === "回归用户"));
}

function tagMutexGroup(tag) {
  if (!tag) return "";
  if (tag.code === "new" || tag.code === "old") return "age";
  if (tag.code === "paid" || tag.code === "free") return "pay";
  if (tag.code === "sub_active" || tag.code === "sub_expired") return "sub";
  return "";
}

function packsAvailableToPick(selectedIds) {
  const selected = new Set(selectedIds || []);
  const packs = typeof segmentState !== "undefined" ? segmentState.packs || [] : [];
  return packs.filter((pack) => pack.enabled || selected.has(pack.id));
}

const SAMPLE_UIDS = [
  { uid: "u_18****02", hit: "免费用户", exclude: "" },
  { uid: "u_33****71", hit: "回归用户", exclude: "" },
  { uid: "u_09****44", hit: "老用户", exclude: "" },
  { uid: "u_61****08", hit: "回归用户", exclude: "" },
  { uid: "u_22****93", hit: "免费用户", exclude: "" },
  { uid: "u_47****15", hit: "回归用户", exclude: "" },
  { uid: "u_12****66", hit: "老用户", exclude: "" },
  { uid: "u_88****21", hit: "回归用户", exclude: "" },
];

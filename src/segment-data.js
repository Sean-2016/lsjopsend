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
      description: "注册成功起未满 24 小时，且从未成功充值（账本成功入账，不含 pending、不含赠币）。",
      updatedAt: "09-08 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "free_old",
      name: "免费老用户",
      code: "free_old",
      category: "fsm",
      status: "enabled",
      system: true,
      params: {},
      description: "从未成功充值，且已过新用户窗口。",
      updatedAt: "09-08 18:00",
      updatedBy: "产品阿陈",
    },
    {
      id: "paid",
      name: "已充值用户",
      code: "paid",
      category: "fsm",
      status: "enabled",
      system: true,
      params: {},
      description: "至少 1 笔充值成功入账，且当前不是回归用户。",
      updatedAt: "09-08 18:00",
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
      description: "曾成功充值，连续 30 天无登录且无充值后再次打开。",
      updatedAt: "09-08 18:00",
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
      includes: ["free_old", "returning"],
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
  return Boolean(tag && (tag.code === "paid" || /充值/.test(tag.name)));
}

function isReturningTag(tag) {
  return Boolean(tag && (tag.code === "returning" || tag.name === "回归用户"));
}

function tagMutexGroup(tag) {
  if (!tag) return "";
  if (
    ["new", "free_old", "paid", "returning"].includes(tag.code) ||
    /免费|充值|新用户|回归/.test(tag.name)
  ) {
    return "lifecycle";
  }
  return "";
}

const SAMPLE_UIDS = [
  { uid: "u_18****02", hit: "免费老用户", exclude: "" },
  { uid: "u_33****71", hit: "回归用户", exclude: "" },
  { uid: "u_09****44", hit: "免费老用户", exclude: "" },
  { uid: "u_61****08", hit: "回归用户", exclude: "" },
  { uid: "u_22****93", hit: "免费老用户", exclude: "" },
  { uid: "u_47****15", hit: "回归用户", exclude: "" },
  { uid: "u_12****66", hit: "免费老用户", exclude: "" },
  { uid: "u_88****21", hit: "回归用户", exclude: "" },
];

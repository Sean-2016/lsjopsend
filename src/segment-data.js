function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function tagBase(extra) {
  return Object.assign(
    {
      status: "enabled",
      system: true,
      params: {},
      updatedAt: "09-10 18:00",
      updatedBy: "产品阿陈",
    },
    extra,
    { id: extra.code },
  );
}

function createInitialTags() {
  return [
    tagBase({
      code: "register_at",
      name: "注册时间",
      group: "账号",
      kind: "time",
      prompt: "注册时长",
      shape: "不可变",
      permit: "资格原料",
      description: "注册成功的时间，写一次不再改。圈选里显示为注册时长，天数当场填，用当前时间减去这个值。不另存一条每天加一的时长，也不建新用户、老用户。",
    }),
    tagBase({
      code: "identity_type",
      name: "身份类型",
      group: "账号",
      kind: "enum",
      shape: "覆盖",
      permit: "资格",
      options: [
        { value: "guest", label: "游客" },
        { value: "registered", label: "已注册" },
      ],
      description: "游客或已注册。游客没有注册时间。游客绑定已有账号后改为已注册，支付闩锁以该账号为准。",
    }),
    tagBase({
      code: "account_status",
      name: "账号状态",
      group: "账号",
      kind: "enum",
      shape: "覆盖，实时",
      permit: "否决",
      options: [
        { value: "normal", label: "正常" },
        { value: "banned", label: "封禁" },
        { value: "closing", label: "注销中" },
        { value: "closed", label: "已注销" },
      ],
      description: "正常、封禁、注销中、已注销。非正常则商品和推送都不出。",
    }),
    tagBase({
      code: "age_verify_status",
      name: "年龄验证",
      group: "账号",
      kind: "enum",
      shape: "覆盖，实时",
      permit: "否决",
      options: [
        { value: "unknown", label: "未知" },
        { value: "pass", label: "通过" },
        { value: "fail", label: "未通过" },
      ],
      description: "未知、通过、未通过。未知、超时、厂商失败都按未通过，成人内容不可售。",
    }),
    tagBase({
      code: "subscription_status",
      name: "订阅状态",
      group: "订阅与金币",
      kind: "enum",
      shape: "覆盖，实时",
      permit: "资格",
      options: [
        { value: "none", label: "无" },
        { value: "active", label: "在订" },
        { value: "expired", label: "过期" },
        { value: "frozen", label: "冻结" },
      ],
      description: "无、在订、过期、冻结。和支付成功、权益回收用同一事件。在订的人看这条，不看支付闩锁。",
    }),
    tagBase({
      code: "subscription_expire_at",
      name: "订阅到期时间",
      group: "订阅与金币",
      kind: "time",
      prompt: "到期距今",
      shape: "覆盖",
      permit: "资格",
      description: "当前或最近一期权益的到期时间。在订、过期都能读。圈选里填过期了几天，不另存天数。",
    }),
    tagBase({
      code: "ever_subscription_paid",
      name: "发生过成功订阅支付",
      group: "订阅与金币",
      kind: "latch",
      shape: "闩锁",
      permit: "资格",
      description: "订阅现金订单曾经成功就写成是，全额退款也不改回否。空值表示支付历史尚未回放，圈选不能当成否。赠币和花金币看视频不算。",
    }),
    tagBase({
      code: "first_subscription_pay_at",
      name: "首次订阅成功时间",
      group: "订阅与金币",
      kind: "time",
      prompt: "首次订阅距今",
      shape: "不可变",
      permit: "资格原料",
      description: "第一笔成功订阅的业务时间。后续续费不改。圈选里填距今天数。",
    }),
    tagBase({
      code: "ever_coin_paid",
      name: "发生过成功金币支付",
      group: "订阅与金币",
      kind: "latch",
      shape: "闩锁",
      permit: "资格",
      description: "购买金币的现金订单曾经成功就写成是，退款不回写。赠币、花金币看视频不计入。空值不能当成否。",
    }),
    tagBase({
      code: "first_coin_pay_at",
      name: "首次金币成功时间",
      group: "订阅与金币",
      kind: "time",
      prompt: "首次购币距今",
      shape: "不可变",
      permit: "资格原料",
      description: "第一笔成功购币的业务时间。后续购币不改。圈选里填距今天数。",
    }),
    tagBase({
      code: "coin_balance",
      name: "金币余额",
      group: "订阅与金币",
      kind: "balance",
      shape: "覆盖",
      permit: "资格",
      description: "当前可用余额。冻结、已消耗的不计入。余额和买过金币无关，花完仍可以买过。比较和数量在圈选时填。",
    }),
    tagBase({
      code: "last_active_at",
      name: "最后活跃时间",
      group: "活跃与度量",
      kind: "time",
      prompt: "最后活跃距今",
      shape: "覆盖，分钟级",
      permit: "运营",
      description: "前台会话开始，或产生有效播放，取较晚的时间。推送送达、后台挂起不更新。圈选里填距今天数。",
    }),
    tagBase({
      code: "device_redeemed_intro_subscription",
      name: "设备已核销新人订阅",
      group: "活跃与度量",
      kind: "latch",
      shape: "闩锁",
      permit: "资格",
      subject: "设备",
      description: "这台设备已经买过新人订阅档。换游客号不清除。和金币新人档分开。",
    }),
    tagBase({
      code: "device_redeemed_intro_coin",
      name: "设备已核销新人金币",
      group: "活跃与度量",
      kind: "latch",
      shape: "闩锁",
      permit: "资格",
      subject: "设备",
      description: "这台设备已经买过新人金币档。买了订阅新人档不会把这条写成是。",
    }),
    tagBase({
      code: "watch_duration",
      name: "观看时长",
      group: "活跃与度量",
      kind: "watch",
      shape: "度量",
      permit: "分发，也可作资格",
      description: "有效播放秒数。试看还是正片、哪个窗口、和多少秒比，都在圈选时填。没有有效播放时为 0，不是未知。不建「看过 10 分钟」这种布尔标签。",
    }),
    tagBase({
      code: "pay_amount",
      name: "付费金额",
      group: "活跃与度量",
      kind: "pay",
      shape: "度量",
      permit: "资格",
      subject: "支付身份",
      description: "选定产品线、选定窗口内的实付净额。产品线必选，没有默认值。退款可减到 0，对应支付闩锁仍为是。不建「付费超过 X 元」。",
    }),
  ];
}

function cond(tagId, extra) {
  const base = {
    tagId: tagId,
    value: "",
    latch: "",
    compare: "",
    amount: "",
    amount2: "",
    scope: "",
    product: "",
    window: "",
    windowDays: "",
  };
  let tag = null;
  try {
    if (typeof segmentState !== "undefined" && segmentState.tags) {
      tag = segmentState.tags.find((item) => item.id === tagId);
    }
  } catch (error) {
    tag = null;
  }
  if (tag && tag.kind === "enum" && tag.options && tag.options[0]) base.value = tag.options[0].value;
  if (tag && tag.kind === "latch") base.latch = "yes";
  if (tag && tag.kind === "time") {
    base.compare = "lte";
    base.amount = "7";
  }
  if (tag && tag.kind === "balance") {
    base.compare = "gte";
    base.amount = "0";
  }
  if (tag && tag.kind === "watch") {
    base.scope = "all";
    base.window = "all";
    base.compare = "gt";
    base.amount = "180";
  }
  if (tag && tag.kind === "pay") {
    base.window = "30d";
    base.compare = "gt";
  }
  return Object.assign(base, extra || {});
}

function vetoConds() {
  return [
    cond("age_verify_status", { value: "pass" }),
    cond("account_status", { value: "normal" }),
  ];
}

function listSegmentTemplates() {
  return [
    {
      key: "new_unpaid",
      label: "未付费新人",
      desc: "已注册，注册不超过 7 日，两条支付闩锁都为明确否。订阅档、金币档各看各的设备核销，可删掉不相关的那一条。付过任意现金、超过 7 日或设备核销过后离开。",
      includes: vetoConds().concat([
        cond("identity_type", { value: "registered" }),
        cond("register_at", { compare: "lte", amount: "7" }),
        cond("ever_subscription_paid", { latch: "no" }),
        cond("ever_coin_paid", { latch: "no" }),
        cond("device_redeemed_intro_subscription", { latch: "no" }),
        cond("device_redeemed_intro_coin", { latch: "no" }),
      ]),
    },
    {
      key: "coin_only",
      label: "只买过金币",
      desc: "金币支付闩锁为是，订阅支付闩锁为否，订阅状态为无。给购币用户的首订优惠，不是新人价。一旦订阅支付成功就离开。",
      includes: vetoConds().concat([
        cond("ever_coin_paid", { latch: "yes" }),
        cond("ever_subscription_paid", { latch: "no" }),
        cond("subscription_status", { value: "none" }),
      ]),
    },
    {
      key: "sub_only",
      label: "只订阅过",
      desc: "订阅支付闩锁为是，金币支付闩锁为否。在订和已过期可再加订阅状态拆开。一旦购币成功就离开。",
      includes: vetoConds().concat([
        cond("ever_subscription_paid", { latch: "yes" }),
        cond("ever_coin_paid", { latch: "no" }),
      ]),
    },
    {
      key: "sub_return",
      label: "订阅已过期的回归",
      desc: "订阅状态为过期，到期距今超过 7 日，最后活跃距今超过 7 日。重新订阅后立即离开。窗口内再次打开不延长 7 日。",
      includes: vetoConds().concat([
        cond("subscription_status", { value: "expired" }),
        cond("subscription_expire_at", { compare: "gt", amount: "7" }),
        cond("last_active_at", { compare: "gt", amount: "7" }),
      ]),
    },
    {
      key: "trial_deep",
      label: "试看较深仍未订阅",
      desc: "订阅状态为无，订阅支付闩锁为否，试看时长累计大于 180 秒。改成 300 秒只改这条条件，不加新标签。",
      includes: vetoConds().concat([
        cond("subscription_status", { value: "none" }),
        cond("ever_subscription_paid", { latch: "no" }),
        cond("watch_duration", { scope: "trial", window: "all", compare: "gt", amount: "180" }),
      ]),
    },
  ];
}

function packFromTemplate(id, key, extra) {
  const tpl = listSegmentTemplates().find((item) => item.key === key);
  return Object.assign(
    {
      id: id,
      name: tpl.label,
      code: "seg_" + key,
      desc: tpl.desc,
      enabled: true,
      includeMode: "and",
      includes: tpl.includes,
      excludes: [],
      countries: [],
      devices: [],
      bindCount: 0,
      updatedAt: "09-10 18:00",
      estimate: { include: 12000, afterExclude: 12000, total: 12000 },
    },
    extra || {},
  );
}

function createInitialPacks() {
  return [
    packFromTemplate("pack_unpaid", "new_unpaid", {
      no: "QP0001",
      createdBy: "产品阿陈",
      bindCount: 2,
      estimate: { include: 18600, afterExclude: 18600, total: 18600 },
    }),
    packFromTemplate("pack_new_day", "coin_only", {
      no: "QP0002",
      createdBy: "运营小王",
      estimate: { include: 9400, afterExclude: 9400, total: 9400 },
    }),
    packFromTemplate("pack_sub_only", "sub_only", {
      no: "QP0003",
      createdBy: "运营小王",
      estimate: { include: 7200, afterExclude: 7200, total: 7200 },
    }),
    packFromTemplate("pack_sub_return", "sub_return", {
      no: "QP0004",
      createdBy: "产品阿陈",
      estimate: { include: 4100, afterExclude: 4100, total: 4100 },
    }),
    packFromTemplate("pack_trial_deep", "trial_deep", {
      no: "QP0005",
      createdBy: "运营小王",
      estimate: { include: 15300, afterExclude: 15300, total: 15300 },
    }),
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

function condTagId(item) {
  if (!item) return "";
  return typeof item === "string" ? item : item.tagId || "";
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

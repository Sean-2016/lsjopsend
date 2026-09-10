const coinState = {
  items: [
    {
      id: "6a45d0231c9e4b2a",
      name: "pc金币测试",
      sort: 1,
      coins: 280,
      listPrice: "0.28",
      salePrice: "60.00",
      discount: true,
      repurchase: true,
      status: "on",
      showUntil: "2026/09/30 00:00:00",
      strategy: "packs",
      packs: ["pack_unpaid"],
      badge: "HOT",
      noBadge: false,
      createdAt: "2026/08/12 11:20:00",
      createdBy: "运营小王",
    },
    {
      id: "b81f0c4472aa90de",
      name: "New",
      sort: 2,
      coins: 500,
      listPrice: "0.50",
      salePrice: "5.00",
      discount: false,
      repurchase: true,
      status: "on",
      showUntil: "2026/09/30 00:00:00",
      strategy: "all",
      packs: [],
      badge: "",
      noBadge: true,
      createdAt: "2026/08/01 09:00:00",
      createdBy: "运营小王",
    },
    {
      id: "c02e91aa55d13f70",
      name: "发好多金币",
      sort: 3,
      coins: 99999,
      listPrice: "99.99",
      salePrice: "1.00",
      discount: true,
      repurchase: false,
      status: "on",
      showUntil: "2026/12/31 23:59:59",
      strategy: "all",
      packs: [],
      badge: "VIP",
      noBadge: false,
      createdAt: "2026/07/20 18:10:00",
      createdBy: "产品阿陈",
    },
    {
      id: "d77a12bc90ee4411",
      name: "特定金币包",
      sort: 4,
      coins: 10,
      listPrice: "0.01",
      salePrice: "59.90",
      discount: true,
      repurchase: true,
      status: "off",
      showUntil: "2026/09/30 00:00:00",
      strategy: "packs",
      packs: ["pack_new_day"],
      badge: "",
      noBadge: true,
      createdAt: "2026/06/03 14:08:00",
      createdBy: "运营小王",
    },
  ],
  filters: {
    status: "",
    id: "",
    name: "",
    salePrice: "",
    discount: "",
    repurchase: "",
  },
  selected: [],
  drawer: null,
  packPicker: false,
  valueModal: false,
  valueDraft: null,
  valueConfig: { coins: "1000", cash: "1.00", round: "floor" },
};

function isCoinDirty() {
  return Boolean(coinState.drawer && coinState.drawer.dirty);
}

function exchangeRatio() {
  const coins = Number(coinState.valueConfig.coins);
  const cash = Number(coinState.valueConfig.cash);
  if (!coins || !cash) return 0;
  return coins / cash;
}

function calcListPrice(coinAmount) {
  const ratio = exchangeRatio();
  const amount = Number(coinAmount);
  if (!ratio || !Number.isFinite(amount) || amount < 0) return "";
  const raw = amount / ratio;
  const cents = coinState.valueConfig.round === "round" ? Math.round(raw * 100) : Math.floor(raw * 100);
  return (cents / 100).toFixed(2);
}

function refreshAllListPrices() {
  coinState.items.forEach((item) => {
    item.listPrice = calcListPrice(item.coins);
  });
  if (coinState.drawer && coinState.drawer.form) {
    coinState.drawer.form.listPrice = calcListPrice(coinState.drawer.form.coins);
  }
}

function badgeLabel(item) {
  if (item.noBadge || !item.badge) return "—";
  return item.badge;
}

function nextCoinSort() {
  const max = coinState.items.reduce((n, item) => Math.max(n, Number(item.sort) || 0), 0);
  return Math.max(1, max + 1);
}

function parseSort(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return 0;
  return n;
}

function blankCoinForm() {
  return {
    name: "",
    sort: String(nextCoinSort()),
    coins: "",
    listPrice: calcListPrice(""),
    salePrice: "",
    discount: true,
    repurchase: true,
    showUntil: "2026/09/30 00:00:00",
    strategy: "all",
    packs: [],
    badge: "",
    noBadge: false,
  };
}

function formFromCoin(item) {
  return {
    name: item.name,
    sort: String(item.sort),
    coins: String(item.coins),
    listPrice: calcListPrice(item.coins),
    salePrice: String(item.salePrice),
    discount: item.discount,
    repurchase: item.repurchase,
    showUntil: item.showUntil,
    strategy: item.strategy,
    packs: clone(item.packs || []),
    badge: item.badge || "",
    noBadge: Boolean(item.noBadge),
  };
}

function coinYesNo(value) {
  return value ? "是" : "否";
}

function filteredCoins() {
  const f = coinState.filters;
  return coinState.items
    .filter((item) => {
      if (f.status && item.status !== f.status) return false;
      if (f.id && !item.id.toLowerCase().includes(f.id.trim().toLowerCase())) return false;
      if (f.name && !item.name.toLowerCase().includes(f.name.trim().toLowerCase())) return false;
      if (f.salePrice && String(item.salePrice) !== String(f.salePrice).trim()) return false;
      if (f.discount === "yes" && !item.discount) return false;
      if (f.discount === "no" && item.discount) return false;
      if (f.repurchase === "yes" && !item.repurchase) return false;
      if (f.repurchase === "no" && item.repurchase) return false;
      return true;
    })
    .slice()
    .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "zh"));
}

function renderCoinCrumbs() {
  return `
    <header class="topbar">
      <div class="crumb">
        <span>商业化</span>
        <span class="sep">/</span>
        <span class="current">金币包商品管理</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
  `;
}

function renderCoinPage() {
  const f = coinState.filters;
  const rows = filteredCoins();
  const table = rows.length
    ? `<table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" data-coin-act="toggle-all" ${rows.length && rows.every((item) => coinState.selected.includes(item.id)) ? "checked" : ""} /></th>
            <th>状态</th>
            <th>金币包ID</th>
            <th>金币包名称</th>
            <th>位序</th>
            <th>金币量</th>
            <th>展示定价</th>
            <th>实销定价</th>
            <th>金币角标</th>
            <th>是否可享会员折扣</th>
            <th>是否可复购</th>
            <th>商品展示到期时间</th>
            <th>商品展示策略</th>
            <th>操作栏</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (item) => `
            <tr>
              <td><input type="checkbox" data-coin-act="toggle-one" data-id="${item.id}" ${coinState.selected.includes(item.id) ? "checked" : ""} /></td>
              <td><span class="pill ${item.status === "on" ? "green" : "gray"}">${item.status === "on" ? "上架" : "下架"}</span></td>
              <td><code class="cell-code" style="margin:0">${item.id}</code></td>
              <td>${escapeHtml(item.name)}</td>
              <td>${item.sort}</td>
              <td>${item.coins}</td>
              <td>${calcListPrice(item.coins)}</td>
              <td>${item.salePrice}</td>
              <td>${escapeHtml(badgeLabel(item))}</td>
              <td>${coinYesNo(item.discount)}</td>
              <td>${coinYesNo(item.repurchase)}</td>
              <td>${escapeHtml(item.showUntil)}</td>
              <td>${item.strategy === "all" ? "全量" : "特定用户群"}</td>
              <td class="ops">
                <button type="button" class="link" data-coin-act="edit" data-id="${item.id}">查看编辑</button>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      <div class="pager">共 ${rows.length} 条，按位序升序</div>`
    : `<div class="empty"><div>没有匹配的金币包</div></div>`;

  return `
    ${renderCoinCrumbs()}
    <div class="page">
      <div class="filter-bar coin-filters">
        <select class="input" data-coin-filter="status">
          <option value="">全部状态</option>
          <option value="on" ${f.status === "on" ? "selected" : ""}>上架</option>
          <option value="off" ${f.status === "off" ? "selected" : ""}>下架</option>
        </select>
        <input class="input" data-coin-filter="id" value="${escapeHtml(f.id)}" placeholder="金币商品ID" />
        <input class="input" data-coin-filter="name" value="${escapeHtml(f.name)}" placeholder="金币商品名称" />
        <input class="input" data-coin-filter="salePrice" value="${escapeHtml(f.salePrice)}" placeholder="实销定价" />
        <select class="input" data-coin-filter="discount">
          <option value="">是否可享折扣</option>
          <option value="yes" ${f.discount === "yes" ? "selected" : ""}>是</option>
          <option value="no" ${f.discount === "no" ? "selected" : ""}>否</option>
        </select>
        <select class="input" data-coin-filter="repurchase">
          <option value="">是否可复购</option>
          <option value="yes" ${f.repurchase === "yes" ? "selected" : ""}>是</option>
          <option value="no" ${f.repurchase === "no" ? "selected" : ""}>否</option>
        </select>
        <button type="button" class="btn" data-coin-act="reset">重置</button>
        <button type="button" class="btn btn-primary" data-coin-act="search">搜索</button>
      </div>
      <div class="coin-toolbar">
        <div>
          <button type="button" class="btn" data-coin-act="shelf-on">上架</button>
          <button type="button" class="btn" data-coin-act="shelf-off">下架</button>
        </div>
        <div class="coin-toolbar-right">
          <button type="button" class="btn" data-coin-act="value-config">金币价值配置</button>
          <button type="button" class="btn btn-primary" data-coin-act="create">创建金币商品包</button>
        </div>
      </div>
      <div class="table-card">${table}</div>
    </div>
  `;
}

function renderCoinDrawer() {
  const drawer = coinState.drawer;
  if (!drawer) return "";
  const form = drawer.form;
  const isEdit = drawer.mode === "edit";
  const sortError = !parseSort(form.sort);
  const nameEmpty = !(form.name || "").trim();
  const coinsEmpty = !String(form.coins).trim();
  const saleEmpty = !String(form.salePrice).trim();
  const saveDisabled = sortError || nameEmpty || coinsEmpty || saleEmpty;
  const packNames = (form.packs || [])
    .map((id) => packById(id))
    .filter(Boolean)
    .map((pack) => (pack.enabled ? pack.name : `${pack.name}（已停用）`));
  return `
    <div class="mask drawer-mask">
      <aside class="drawer coin-drawer">
        <div class="drawer-head">
          <h3>${isEdit ? "查看编辑金币商品包" : "创建金币商品包"}</h3>
          <button type="button" class="icon-x" data-coin-act="close-drawer">×</button>
        </div>
        <div class="drawer-body">
          <div class="form-grid">
            <label>金币包名称 *
              <input class="input" data-coin-form="name" maxlength="10" value="${escapeHtml(form.name)}" placeholder="输入，支持中/英/数，10个字符" />
            </label>
            <label>位序 *
              <input class="input" type="number" min="1" step="1" data-coin-form="sort" value="${escapeHtml(form.sort)}" placeholder="1" />
              <span class="${sortError ? "field-error" : "field-hint"}">数字越小越靠前，最小为 1</span>
            </label>
            <label class="span-2">金币量 *
              <input class="input" data-coin-form="coins" value="${escapeHtml(form.coins)}" placeholder="输入，数字，5个字符" />
            </label>
            <label class="span-2">展示定价
              <input class="input" data-coin-form="listPrice" value="${escapeHtml(form.listPrice)}" readonly />
              <span class="field-hint">金币量 ÷ 兑换比例自动计算（当前比例 ${exchangeRatio() || "—"}）</span>
            </label>
            <label class="span-2">实销定价 *
              <input class="input" data-coin-form="salePrice" value="${escapeHtml(form.salePrice)}" placeholder="输入，数字，8个字符" />
            </label>
            <label class="span-2">金币包角标
              <select class="input" data-coin-form="badge" ${form.noBadge ? "disabled" : ""}>
                <option value="" ${!form.badge ? "selected" : ""}>请选择</option>
                <option value="HOT" ${form.badge === "HOT" ? "selected" : ""}>HOT</option>
                <option value="VIP" ${form.badge === "VIP" ? "selected" : ""}>VIP</option>
                <option value="Free" ${form.badge === "Free" ? "selected" : ""}>Free</option>
              </select>
            </label>
            <div class="switch-field">无需角标
              <label class="enable-switch ${form.noBadge ? "on" : ""}">
                <input type="checkbox" data-coin-form="noBadge" ${form.noBadge ? "checked" : ""} />
                <span class="enable-track"></span>
                <span class="enable-text">${form.noBadge ? "开" : "关"}</span>
              </label>
            </div>
          </div>
          <div class="form-sec">
            <h4>金币包配置</h4>
            <div class="form-grid">
              <div class="switch-field">是否可享受折扣
                <label class="enable-switch ${form.discount ? "on" : ""}">
                  <input type="checkbox" data-coin-form="discount" ${form.discount ? "checked" : ""} />
                  <span class="enable-track"></span>
                  <span class="enable-text">${form.discount ? "是" : "否"}</span>
                </label>
              </div>
              <div class="switch-field">是否可复购
                <label class="enable-switch ${form.repurchase ? "on" : ""}">
                  <input type="checkbox" data-coin-form="repurchase" ${form.repurchase ? "checked" : ""} />
                  <span class="enable-track"></span>
                  <span class="enable-text">${form.repurchase ? "是" : "否"}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-sec">
            <h4>金币包展示策略</h4>
            <label>商品展示到期时间 *
              <input class="input" data-coin-form="showUntil" value="${escapeHtml(form.showUntil)}" />
            </label>
            <div class="label" style="margin-top:12px">商品展示策略</div>
            <div class="radios">
              <label><input type="radio" name="coinStrategy" data-coin-form="strategy" value="all" ${form.strategy === "all" ? "checked" : ""} /> 全量</label>
              <label><input type="radio" name="coinStrategy" data-coin-form="strategy" value="packs" ${form.strategy === "packs" ? "checked" : ""} /> 特定用户群</label>
            </div>
            ${
              form.strategy === "packs"
                ? `<div class="coin-tags">
                    <div>${packNames.length ? packNames.map((name) => `<span class="chip">${escapeHtml(name)}</span>`).join("") : '<span class="muted">未选择用户群</span>'}</div>
                    <div class="coin-pack-actions">
                      <button type="button" class="btn" data-coin-act="open-packs">选择</button>
                      <button type="button" class="btn" data-coin-act="goto-segment">查看/新增用户群</button>
                    </div>
                  </div>`
                : ""
            }
          </div>
        </div>
        <div class="drawer-foot">
          <button type="button" class="btn" data-coin-act="close-drawer">取消</button>
          <button type="button" class="btn btn-primary" data-coin-act="save" ${saveDisabled ? "disabled" : ""}>${isEdit ? "保存" : "创建"}</button>
        </div>
      </aside>
    </div>
  `;
}

function renderValueModal() {
  if (!coinState.valueModal) return "";
  const cfg = coinState.valueDraft || coinState.valueConfig;
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">金币价值配置</div>
        <div class="dialog-body">
          <p class="filter-hint">配置金币与现金的换算关系，作为金币包展示定价的计算依据。</p>
          <div class="form-grid">
            <label>金币数量
              <input class="input" data-value-form="coins" value="${escapeHtml(cfg.coins)}" />
            </label>
            <label>现金金额
              <input class="input" data-value-form="cash" value="${escapeHtml(cfg.cash)}" />
            </label>
          </div>
          <div class="label" style="margin-top:12px">换算小数处理规则</div>
          <div class="radios">
            <label><input type="radio" name="coinRound" data-value-form="round" value="round" ${cfg.round === "round" ? "checked" : ""} /> 四舍五入</label>
            <label><input type="radio" name="coinRound" data-value-form="round" value="floor" ${cfg.round === "floor" ? "checked" : ""} /> 直接舍去小数</label>
          </div>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-coin-act="close-value">取消</button>
          <button type="button" class="btn btn-primary" data-coin-act="save-value">确定</button>
        </div>
      </div>
    </div>
  `;
}

function renderCoinPackPicker() {
  if (!coinState.packPicker || !coinState.drawer) return "";
  const selected = new Set(coinState.drawer.form.packs || []);
  const options = (typeof packsAvailableToPick === "function" ? packsAvailableToPick([...selected]) : segmentState.packs || [])
    .map((pack) => {
      const checked = selected.has(pack.id);
      const locked = !pack.enabled && !checked;
      return `
        <label class="tag-option${locked ? " is-locked" : ""}">
          <input type="checkbox" data-coin-act="toggle-pack" data-id="${pack.id}" ${checked ? "checked" : ""} ${locked ? "disabled" : ""} />
          <span>${escapeHtml(pack.name)}${pack.enabled ? "" : "（已停用）"}</span>
          <span class="tag-bubble">${escapeHtml(pack.desc || "")}${pack.enabled ? "" : "。已引用业务可继续使用，新业务不能再勾选。"}</span>
        </label>
      `;
    })
    .join("");
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">选择用户群</div>
        <div class="dialog-body">
          <p class="filter-hint">选项来自用户圈选中<strong>已启用</strong>的人群包。已停用但当前商品已引用的包仍会列出，可取消引用，不能再被其它新业务勾选。</p>
          <div class="add-list" style="display:block;max-height:360px">${options || '<div class="empty-inline">没有可引用的启用人群包，请先去用户圈选新建或启用</div>'}</div>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn btn-primary" data-coin-act="close-packs">完成</button>
        </div>
      </div>
    </div>
  `;
}

function saveCoin() {
  const drawer = coinState.drawer;
  if (!drawer) return;
  const form = drawer.form;
  const sort = parseSort(form.sort);
  if (!sort) {
    showToast("位序须为大于等于 1 的整数", "error");
    return;
  }
  if (!(form.name || "").trim() || !String(form.coins).trim() || !String(form.salePrice).trim()) {
    showToast("请完善必填项", "error");
    return;
  }
  const payload = {
    name: form.name.trim(),
    sort,
    coins: Number(form.coins) || 0,
    listPrice: calcListPrice(form.coins),
    salePrice: form.salePrice,
    discount: Boolean(form.discount),
    repurchase: Boolean(form.repurchase),
    showUntil: form.showUntil,
    strategy: form.strategy,
    packs: form.strategy === "packs" ? form.packs : [],
    badge: form.noBadge ? "" : form.badge,
    noBadge: Boolean(form.noBadge),
  };
  if (drawer.mode === "create") {
    coinState.items.unshift({
      id: Math.random().toString(16).slice(2, 18),
      status: "off",
      createdAt: "刚刚",
      createdBy: "运营小王",
      ...payload,
    });
    showToast("创建成功");
  } else {
    Object.assign(drawer.item, payload);
    showToast("保存成功");
  }
  coinState.drawer = null;
  coinState.packPicker = false;
  renderApp();
}

function setCoinShelf(status) {
  if (!coinState.selected.length) {
    showToast("请先勾选商品包", "error");
    return;
  }
  coinState.items.forEach((item) => {
    if (coinState.selected.includes(item.id)) item.status = status;
  });
  showToast(status === "on" ? "已上架" : "已下架");
  renderApp();
}

function onCoinClick(e) {
  const btn = e.target.closest("[data-coin-act]");
  if (!btn) return;
  const act = btn.dataset.coinAct;
  const id = btn.dataset.id;
  if (act === "toggle-all" || act === "toggle-one") {
    if (e.type !== "change") return;
  }
  if (act === "create") {
    coinState.drawer = { mode: "create", form: blankCoinForm(), dirty: false };
    renderApp();
  } else if (act === "edit") {
    const item = coinState.items.find((row) => row.id === id);
    coinState.drawer = { mode: "edit", item, form: formFromCoin(item), dirty: false };
    renderApp();
  } else if (act === "reset") {
    coinState.filters = { status: "", id: "", name: "", salePrice: "", discount: "", repurchase: "" };
    renderApp();
  } else if (act === "search") {
    renderApp();
  } else if (act === "shelf-on") setCoinShelf("on");
  else if (act === "shelf-off") setCoinShelf("off");
  else if (act === "value-config") {
    coinState.valueModal = true;
    coinState.valueDraft = clone(coinState.valueConfig);
    renderApp();
  }
  else if (act === "toggle-all") {
    const rows = filteredCoins();
    if (btn.checked) coinState.selected = rows.map((item) => item.id);
    else coinState.selected = [];
    renderApp();
  } else if (act === "toggle-one") {
    const set = new Set(coinState.selected);
    if (btn.checked) set.add(id);
    else set.delete(id);
    coinState.selected = [...set];
  }
}

function onCoinOverlayClick(e) {
  const mask = e.target.classList && e.target.classList.contains("mask") ? e.target : null;
  if (mask && !e.target.closest(".drawer, .dialog")) {
    if (coinState.valueModal) {
      coinState.valueModal = false;
      coinState.valueDraft = null;
      renderApp();
      return;
    }
    if (coinState.packPicker) {
      coinState.packPicker = false;
      renderApp();
      return;
    }
    if (coinState.drawer && coinState.drawer.dirty) {
      confirmLeaveIfDirty(() => {
        coinState.drawer = null;
        renderApp();
      });
      return;
    }
    coinState.drawer = null;
    renderApp();
    return;
  }
  const btn = e.target.closest("[data-coin-act]");
  if (!btn) return;
  const act = btn.dataset.coinAct;
  if (act === "close-drawer") {
    if (coinState.drawer && coinState.drawer.dirty) {
      confirmLeaveIfDirty(() => {
        coinState.drawer = null;
        coinState.packPicker = false;
        renderApp();
      });
    } else {
      coinState.drawer = null;
      coinState.packPicker = false;
      renderApp();
    }
  } else if (act === "save") saveCoin();
  else if (act === "close-value") {
    coinState.valueModal = false;
    coinState.valueDraft = null;
    renderApp();
  } else if (act === "save-value") {
    const draft = coinState.valueDraft || coinState.valueConfig;
    const coins = Number(draft.coins);
    const cash = Number(draft.cash);
    if (!coins || !cash || coins < 0 || cash <= 0) {
      showToast("请填写有效的金币数量和现金金额", "error");
      return;
    }
    coinState.valueConfig = clone(draft);
    coinState.valueDraft = null;
    refreshAllListPrices();
    coinState.valueModal = false;
    showToast("价值配置已更新");
    renderApp();
  } else if (act === "open-packs") {
    coinState.packPicker = true;
    renderApp();
  } else if (act === "close-packs") {
    coinState.packPicker = false;
    renderApp();
  } else if (act === "goto-segment") {
    const packs = (coinState.drawer && coinState.drawer.form && coinState.drawer.form.packs) || [];
    coinState.packPicker = false;
    openPage("user-tag-segment");
    if (packs[0]) segmentState.selectedPackId = packs[0];
    renderApp();
  } else if (act === "toggle-pack") {
    const form = coinState.drawer && coinState.drawer.form;
    if (!form) return;
    const set = new Set(form.packs || []);
    const pack = typeof packById === "function" ? packById(btn.dataset.id) : null;
    if (btn.checked && pack && !pack.enabled) {
      showToast("已停用的人群包不能被新业务引用", "error");
      btn.checked = false;
      return;
    }
    if (btn.checked) set.add(btn.dataset.id);
    else set.delete(btn.dataset.id);
    form.packs = [...set];
    form.strategy = "packs";
    coinState.drawer.dirty = true;
  }
}

function bindCoinOverlays() {
  const overlay = document.getElementById("overlay-root");
  overlay.innerHTML = renderCoinDrawer() + renderValueModal() + renderCoinPackPicker();
  const hasOverlay = Boolean(overlay.querySelector(".mask") || document.getElementById("confirm-modal"));
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.coinBound) {
    overlay.dataset.coinBound = "1";
    overlay.addEventListener("click", onCoinOverlayClick);
  }
  overlay.querySelectorAll("[data-coin-form]").forEach((el) => {
    const sync = () => {
      const form = coinState.drawer && coinState.drawer.form;
      if (!form) return;
      const key = el.dataset.coinForm;
      if (el.type === "checkbox") form[key] = el.checked;
      else form[key] = el.value;
      if (key === "coins") {
        form.listPrice = calcListPrice(form.coins);
        const priceInput = overlay.querySelector('[data-coin-form="listPrice"]');
        if (priceInput) priceInput.value = form.listPrice;
      }
      if (key === "noBadge" && form.noBadge) form.badge = "";
      coinState.drawer.dirty = true;
      const wrap = el.closest(".enable-switch");
      if (wrap && el.type === "checkbox") wrap.classList.toggle("on", el.checked);
      if (key === "noBadge") {
        const badge = overlay.querySelector('[data-coin-form="badge"]');
        if (badge) badge.disabled = form.noBadge;
      }
      const saveBtn = overlay.querySelector('[data-coin-act="save"]');
      if (saveBtn) {
        saveBtn.disabled =
          !parseSort(form.sort) ||
          !(form.name || "").trim() ||
          !String(form.coins).trim() ||
          !String(form.salePrice).trim();
      }
      if (key === "strategy") renderApp();
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
  overlay.querySelectorAll("[data-value-form]").forEach((el) => {
    const sync = () => {
      const key = el.dataset.valueForm;
      if (!coinState.valueDraft) coinState.valueDraft = clone(coinState.valueConfig);
      coinState.valueDraft[key] = el.value;
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
}

function mountCoinSkuPage(main) {
  if (!main.dataset.coinBound) {
    main.dataset.coinBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "coin-sku") return;
      onCoinClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "coin-sku") return;
      const filter = e.target.closest("[data-coin-filter]");
      if (filter) coinState.filters[filter.dataset.coinFilter] = filter.value;
      const act = e.target.closest("[data-coin-act]");
      if (act) onCoinClick(e);
    });
  }
  main.innerHTML = renderCoinPage();
  bindCoinOverlays();
}

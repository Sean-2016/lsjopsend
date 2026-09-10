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
  countryQuery: "",
  countryOpen: false,
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

function isSegmentDirty() {
  return Boolean(
    segmentState.packDirty ||
      (segmentState.drawer && segmentState.drawer.dirty) ||
      (typeof isCoinDirty === "function" && isCoinDirty()) ||
      (typeof isUserDirty === "function" && isUserDirty()) ||
      (typeof isTaskDirty === "function" && isTaskDirty()),
  );
}

function confirmLeaveIfDirty(next) {
  if (!isSegmentDirty()) {
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
  return segmentState.packs.filter(
    (pack) => pack.includes.includes(tagId) || pack.excludes.includes(tagId),
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
            <div class="cell-title">${escapeHtml(tag.name)}${tag.system ? '<span class="row-badge">系统预置</span>' : ""}</div>
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
          <p>创建标签并写清判定口径。启用后可在用户圈选里勾选。</p>
        </div>
        <div class="page-head-actions">
          <button type="button" class="btn btn-primary" data-act="create">新建标签</button>
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
                <button type="button" class="btn btn-primary" data-act="create">新建标签</button>
              </div>`
        }
      </div>
    </div>
  `;
}

function blankTagForm() {
  return {
    name: "",
    code: "",
    description: "",
    status: "enabled",
    params: {},
    system: false,
  };
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
  const isEdit = drawer.mode === "edit";
  const descEmpty = !(form.description || "").trim();
  const saveDisabled = descEmpty || !form.name.trim() || !form.code.trim();
  const nameLocked = form.system;
  const windowField =
    form.code === "new" || form.params.duration
      ? `<label>新用户窗口（小时）
          <input class="input" type="number" data-form="duration" value="${form.params.duration || 24}" />
        </label>`
      : "";

  return `
    <div class="mask drawer-mask">
      <aside class="drawer">
        <div class="drawer-head">
          <h3>${isEdit ? "编辑标签" : "新建标签"}</h3>
          <button type="button" class="icon-x" data-act="close-drawer">×</button>
        </div>
        <div class="drawer-body">
          ${form.system ? '<div class="info-bar">系统预置，名称和 code 不可改，描述和窗口参数可改。</div>' : ""}
          <label>展示名称 *
            <input class="input" data-form="name" value="${escapeHtml(form.name)}" ${nameLocked ? "readonly" : ""} placeholder="新用户" />
          </label>
          <label>内部 code *
            <input class="input" data-form="code" value="${escapeHtml(form.code)}" placeholder="向大数据技术申请标识，如 new、paid" ${isEdit || nameLocked ? "readonly" : ""} />
            <span class="field-hint">需向大数据同学要口径对应的 code，保存后不可改</span>
          </label>
          <label>准确描述 *
            <textarea class="input" rows="4" data-form="description" placeholder="写清判定口径，例如：注册成功起未满 24 小时，且从未成功充值">${escapeHtml(form.description)}</textarea>
            ${descEmpty ? '<span class="field-error">描述不能为空</span>' : '<span class="field-hint">写清怎么判定，便于验收</span>'}
          </label>
          ${windowField}
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
  if (drawer.mode === "create") {
    segmentState.tags.unshift({
      id: form.code,
      name: form.name,
      code: form.code,
      status: "enabled",
      system: false,
      params: form.params,
      description: form.description,
      updatedAt: "09-08 18:30",
      updatedBy: "运营小王",
    });
  } else {
    Object.assign(drawer.tag, {
      name: form.system ? drawer.tag.name : form.name,
      params: form.params,
      description: form.description,
      updatedAt: "09-08 18:30",
      updatedBy: "运营小王",
    });
    if (drawer.tag.id === "new" && form.params.duration) {
      drawer.tag.description = form.description.includes("小时")
        ? form.description.replace(/\d+\s*小时/, `${form.params.duration} 小时`)
        : form.description;
    }
  }
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
  } else if (act === "create") {
    segmentState.drawer = { mode: "create", form: blankTagForm(), dirty: false };
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

function filteredPacks() {
  const q = segmentState.packSearch.trim().toLowerCase();
  if (!q) return segmentState.packs;
  return segmentState.packs.filter((pack) => pack.name.toLowerCase().includes(q));
}

function selectedPack() {
  return packById(segmentState.selectedPackId);
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
  if (!pack.amountRange) pack.amountRange = {};
  if (!pack.returnDays) pack.returnDays = {};
}

function renderTagRow(kind, id, index) {
  const tag = tagById(id);
  const missing = !tag || tag.status !== "enabled";
  const label = tag ? `${tag.name}` : "标签已失效";
  const pack = selectedPack();
  const recharge = isRechargeTag(tag);
  const returning = isReturningTag(tag);
  const range = (pack && pack.amountRange && pack.amountRange[id]) || { min: "", max: "" };
  const days = (pack && pack.returnDays && pack.returnDays[id]) || "";
  const amountHtml = recharge
    ? `<div class="amount-range">
        <span class="amount-label">累计充值金额</span>
        <input class="input narrow" data-amount="min" data-tag="${id}" value="${escapeHtml(range.min)}" placeholder="最小" />
        <span class="amount-op">&lt; 累计金额 ≤</span>
        <input class="input narrow" data-amount="max" data-tag="${id}" value="${escapeHtml(range.max)}" placeholder="最大" />
        <span class="field-hint">不包含最小值，包含最大值；留空表示不限</span>
      </div>`
    : "";
  const returnHtml = returning
    ? `<div class="amount-range">
        <span class="amount-label">回归条件</span>
        <input class="input narrow" data-return-days data-tag="${id}" value="${escapeHtml(days)}" placeholder="7" />
        <span>天未活跃</span>
        <button type="button" class="btn" data-act="set-return-days" data-tag="${id}" data-days="7">7天</button>
        <button type="button" class="btn" data-act="set-return-days" data-tag="${id}" data-days="15">15天</button>
        <span class="field-hint">数字可自由填写，如 7 天未活跃、15 天未活跃</span>
      </div>`
    : "";
  return `
    <div class="cond-block">
      <div class="cond-row">
        <button type="button" class="tag-pick-btn ${missing ? "bad" : ""}" data-act="open-picker" data-kind="${kind}" data-index="${index}" title="${escapeHtml(tag ? tag.description : "")}">
          ${escapeHtml(label)}
        </button>
        ${tag ? `<button type="button" class="link" data-act="open-tag" data-id="${tag.id}">查看</button>` : ""}
        <button type="button" class="link" data-act="del-cond" data-kind="${kind}" data-index="${index}">删除</button>
      </div>
      ${amountHtml}
      ${returnHtml}
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
    <div class="label" style="margin-top:16px">国家</div>
    <p class="filter-hint">可输入 ISO 两位代码（如 US）或搜索中文名。不选表示不限国家。</p>
    <div class="country-box">
      <div class="country-chips">${chips || ""}</div>
      <input class="input" data-country-q placeholder="输入 US / 美国 后回车或点选" value="${escapeHtml(segmentState.countryQuery)}" autocomplete="off" />
      <div class="country-drop${segmentState.countryOpen ? " open" : ""}">${renderCountryOptions(segmentState.countryQuery, selected)}</div>
    </div>
  `;
}

function pickerOccupiedIds() {
  const picker = segmentState.picker;
  const occupied = new Set((picker && picker.selected) || []);
  const pack = selectedPack();
  if (pack && picker && picker.kind) {
    (pack[picker.kind] || []).forEach((id, index) => {
      if (picker.index >= 0 && index === picker.index) return;
      occupied.add(id);
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
  const group = tagMutexGroup(tag);
  if (!group) return "";
  const conflict = occupiedIds
    .map(tagById)
    .filter(Boolean)
    .find((item) => item.id !== tag.id && tagMutexGroup(item) === group);
  return conflict ? `已选择「${conflict.name}」，与当前标签互斥` : "";
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
  const options = filteredPickerTags()
    .map((tag) => pickerOptionHtml(tag))
    .join("");
  return options || '<div class="empty-inline">没有可选项，请先到标签库启用标签</div>';
}

function refreshPickerList(root) {
  const list = (root || document).querySelector(".add-list");
  if (list) list.innerHTML = renderPickerOptionsHtml();
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
  const pack = selectedPack();
  const list = packs
    .map((item) => {
      const bind = item.bindCount > 0 ? `引用 ${item.bindCount}` : "未被绑定";
      return `
        <button type="button" class="scene-item${item.id === segmentState.selectedPackId ? " active" : ""}" data-act="select-pack" data-id="${item.id}">
          <div class="scene-name">${escapeHtml(item.name)}</div>
          <div class="scene-meta">${item.enabled ? "已启用" : "已停用"} · ${bind}</div>
          <div class="scene-meta">${item.updatedAt}</div>
        </button>
      `;
    })
    .join("");

  let detail = `
    <div class="empty pack-empty">
      <div class="empty-art"></div>
      <div>选择左侧人群包，或新建</div>
    </div>
  `;

  if (pack) {
    ensurePackExtras(pack);
    const est = pack.estimate;
    detail = `
      <div class="pack-editor">
        <div class="pack-toolbar">
          <h2>${escapeHtml(pack.name)}</h2>
          <label class="enable-switch ${pack.enabled ? "on" : ""}">
            <input type="checkbox" data-pack="enabled" ${pack.enabled ? "checked" : ""} />
            <span class="enable-track"></span>
            <span class="enable-text">${pack.enabled ? "已启用" : "未启用"}</span>
          </label>
        </div>
        <section class="form-sec">
          <h4>1. 包信息</h4>
          <div class="form-grid">
            <label class="span-2">人群包名称 *
              <input class="input" data-pack="name" value="${escapeHtml(pack.name)}" />
            </label>
            <label class="span-2">说明
              <textarea class="input" rows="2" data-pack="desc">${escapeHtml(pack.desc)}</textarea>
            </label>
          </div>
        </section>
        <section class="form-sec">
          <h4>2. 圈选条件</h4>
          <div class="label">包含区</div>
          <div class="radios">
            <label><input type="radio" name="includeMode" data-pack="includeMode" value="or" ${pack.includeMode === "or" ? "checked" : ""} /> 满足任意（OR）</label>
            <label><input type="radio" name="includeMode" data-pack="includeMode" value="and" ${pack.includeMode === "and" ? "checked" : ""} /> 同时满足（AND）</label>
          </div>
          ${pack.includes.map((id, index) => renderTagRow("includes", id, index)).join("") || '<div class="empty-inline">还没有包含条件</div>'}
          <button type="button" class="btn" data-act="add-cond" data-kind="includes">添加标签</button>
          ${renderCountryField(pack)}
          <div class="label" style="margin-top:16px">排除区</div>
          <p class="filter-hint">命中排除中任一标签的用户不进包</p>
          ${pack.excludes.map((id, index) => renderTagRow("excludes", id, index)).join("") || '<div class="empty-inline">无排除标签</div>'}
          <button type="button" class="btn" data-act="add-cond" data-kind="excludes">添加排除标签</button>
        </section>
        <section class="form-sec">
          <h4>3. 预估</h4>
          <div class="estimate-bar">
            <div class="metric on">
              <div class="muted">符合条件用户数</div>
              <b>${est.total.toLocaleString()}</b>
            </div>
            <button type="button" class="btn" data-act="refresh-est">刷新预估</button>
            <button type="button" class="btn btn-primary" data-act="download-users">用户列表下载</button>
          </div>
        </section>
        <div class="pack-foot">
          ${segmentState.packDirty ? '<span class="unsaved">有未保存更改</span>' : ""}
          <button type="button" class="btn btn-danger" data-act="delete-pack">删除</button>
          <button type="button" class="btn btn-primary" data-act="save-pack">保存</button>
        </div>
      </div>
    `;
  }

  return `
    ${renderTopbar("用户圈选")}
    <div class="page scene-page">
      <aside class="scene-list" style="width:280px">
        <input class="input" data-pack-search placeholder="搜索包名" value="${escapeHtml(segmentState.packSearch)}" />
        <button type="button" class="btn btn-primary btn-block" data-act="create-pack">新建人群包</button>
        <div class="group-list">${list || '<div class="empty-inline">暂无人群包</div>'}</div>
      </aside>
      <section class="scene-detail">${detail}</section>
    </div>
  `;
}

function addCountry(code) {
  const pack = selectedPack();
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
  segmentState.packDirty = true;
  renderApp();
}

function onAudienceClick(e) {
  if (!e.target.closest(".country-box") && segmentState.countryOpen) {
    segmentState.countryOpen = false;
    const drop = document.querySelector(".country-drop");
    if (drop) drop.classList.remove("open");
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
  } else if (act === "create-pack") {
    const go = () => {
      const id = `pack_${Date.now()}`;
      segmentState.packs.unshift({
        id,
        name: "未命名人群包",
        code: `seg_${Date.now().toString(36)}`,
        desc: "",
        enabled: false,
        includeMode: "or",
          includes: [],
          excludes: [],
          countries: [],
          amountRange: {},
          returnDays: {},
          bindCount: 0,
        updatedAt: "刚刚",
        estimate: { include: 0, afterExclude: 0, total: 0 },
      });
      segmentState.selectedPackId = id;
      segmentState.packDirty = true;
      renderApp();
    };
    if (segmentState.packDirty) confirmLeaveIfDirty(go);
    else go();
  } else if (act === "add-cond") {
    segmentState.picker = { kind: btn.dataset.kind, index: -1, q: "", selected: [] };
    renderApp();
  } else if (act === "open-picker") {
    const pack = selectedPack();
    const current = pack ? pack[btn.dataset.kind][Number(btn.dataset.index)] : "";
    segmentState.picker = {
      kind: btn.dataset.kind,
      index: Number(btn.dataset.index),
      q: "",
      selected: current ? [current] : [],
    };
    renderApp();
  } else if (act === "del-cond") {
    const pack = selectedPack();
    const removed = pack[btn.dataset.kind][Number(btn.dataset.index)];
    pack[btn.dataset.kind].splice(Number(btn.dataset.index), 1);
    if (pack.amountRange) delete pack.amountRange[removed];
    if (pack.returnDays) delete pack.returnDays[removed];
    fakeEstimate(pack);
    segmentState.packDirty = true;
    renderApp();
  } else if (act === "pick-country") {
    addCountry(btn.dataset.code);
  } else if (act === "remove-country") {
    const pack = selectedPack();
    ensurePackExtras(pack);
    pack.countries = pack.countries.filter((code) => code !== btn.dataset.code);
    segmentState.packDirty = true;
    renderApp();
  } else if (act === "set-return-days") {
    const pack = selectedPack();
    ensurePackExtras(pack);
    pack.returnDays[btn.dataset.tag] = btn.dataset.days;
    segmentState.packDirty = true;
    renderApp();
  } else if (act === "open-tag") {
    navigateTo("user-tag-library", { tagId: btn.dataset.id, openDrawer: true });
  } else if (act === "refresh-est") {
    const pack = selectedPack();
    fakeEstimate(pack);
    pack.estimate.total += Math.floor(Math.random() * 80 - 40);
    pack.estimate.afterExclude = pack.estimate.total;
    showToast("已刷新预估");
    renderApp();
  } else if (act === "download-users") {
    const pack = selectedPack();
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
    const pack = selectedPack();
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
        segmentState.selectedPackId = segmentState.packs[0] ? segmentState.packs[0].id : null;
        segmentState.packDirty = false;
        renderApp();
      },
    });
  }
}

function onAudienceChange(e) {
  const search = e.target.closest("[data-pack-search]");
  if (search) {
    segmentState.packSearch = search.value;
    renderApp();
    return;
  }
  const el = e.target.closest("[data-pack]");
  if (!el) return;
  const pack = selectedPack();
  if (!pack) return;
  const key = el.dataset.pack;
  if (key === "enabled") {
    pack.enabled = el.checked;
    segmentState.packDirty = true;
    renderApp();
    return;
  }
  pack[key] = el.type === "radio" ? el.value : el.value;
  segmentState.packDirty = true;
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
      if (/^[A-Za-z]{2}$/.test(typed)) addCountry(typed);
      else if (matches.length === 1) addCountry(matches[0].code);
      else showToast("请选择列表中的国家，或输入两位 ISO 代码", "error");
    }
    if (e.key === "Escape") {
      segmentState.countryOpen = false;
      const drop = document.querySelector(".country-drop");
      if (drop) drop.classList.remove("open");
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
    const pack = selectedPack();
    segmentState.countryQuery = countryInput.value;
    segmentState.countryOpen = true;
    const drop = countryInput.parentElement.querySelector(".country-drop");
    if (drop && pack) {
      drop.classList.add("open");
      drop.innerHTML = renderCountryOptions(countryInput.value, pack.countries || []);
    }
    return;
  }
  const amount = e.target.closest("[data-amount]");
  if (amount) {
    const pack = selectedPack();
    if (!pack) return;
    ensurePackExtras(pack);
    const tagId = amount.dataset.tag;
    if (!pack.amountRange[tagId]) pack.amountRange[tagId] = { min: "", max: "" };
    pack.amountRange[tagId][amount.dataset.amount] = amount.value;
    segmentState.packDirty = true;
    return;
  }
  const returnDays = e.target.closest("[data-return-days]");
  if (returnDays) {
    const pack = selectedPack();
    if (!pack) return;
    ensurePackExtras(pack);
    pack.returnDays[returnDays.dataset.tag] = returnDays.value;
    segmentState.packDirty = true;
    return;
  }
  const el = e.target.closest("[data-pack]");
  if (!el || el.dataset.pack === "includeMode") return;
  const pack = selectedPack();
  if (!pack) return;
  const key = el.dataset.pack;
  if (key === "enabled") pack.enabled = el.checked;
  else pack[key] = el.value;
  segmentState.packDirty = true;
}

function onOverlayClick(e) {
  const btn = e.target.closest("[data-act]");
  const mask = e.target.classList && e.target.classList.contains("mask") ? e.target : null;
  if (mask && !e.target.closest(".drawer, .dialog")) {
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
    const pack = selectedPack();
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
      if (picker.index < 0) {
        chosen.forEach((id) => {
          if (!list.includes(id)) list.push(id);
        });
      } else {
        const [first, ...rest] = chosen;
        list[picker.index] = first;
        rest.forEach((id) => {
          if (!list.includes(id)) list.push(id);
        });
      }
      fakeEstimate(pack);
      segmentState.packDirty = true;
      chosen.forEach((id) => {
        const tag = tagById(id);
        if (isRechargeTag(tag)) {
          if (!pack.amountRange) pack.amountRange = {};
          if (!pack.amountRange[id]) pack.amountRange[id] = { min: "", max: "" };
        }
        if (isReturningTag(tag)) {
          if (!pack.returnDays) pack.returnDays = {};
          if (!pack.returnDays[id]) pack.returnDays[id] = "7";
        }
      });
    }
    segmentState.picker = null;
    renderApp();
  }
}

function closeOverlays() {
  segmentState.drawer = null;
  segmentState.refsDrawer = null;
  segmentState.picker = null;
}

function bindOverlays() {
  const overlay = document.getElementById("overlay-root");
  overlay.innerHTML =
    renderTagDrawer() + renderRefsDrawer() + renderPicker();
  const hasOverlay = Boolean(
    overlay.querySelector(".mask") || document.getElementById("confirm-modal"),
  );
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.bound) {
    overlay.dataset.bound = "1";
    overlay.addEventListener("click", onOverlayClick);
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
    if (extra.packId) segmentState.selectedPackId = extra.packId;
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

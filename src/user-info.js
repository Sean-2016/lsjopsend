const userState = {
  users: [
    {
      id: "6aa129ef7c6e5f5fe01a4b2c",
      displayId: "10918",
      type: "guest",
      nickname: "游客",
      email: "",
      phone: "",
      identity: "guest",
      status: "normal",
      disableNote: "",
      official: false,
      member: false,
      memberPack: "",
      tags: [],
      gender: "",
      like: "",
      dislike: "",
      intro: "",
      password: "",
      registeredAt: "",
      lastVisit: "2026-09-09 17:42:07",
      lastLogin: "",
      stats: "0/0/0/0",
      source: "",
      channel: "",
    },
    {
      id: "7bb230fa8d7f6a60f12b5c3d",
      displayId: "10917",
      type: "guest",
      nickname: "游客",
      email: "",
      phone: "",
      identity: "guest",
      status: "normal",
      disableNote: "",
      official: false,
      member: false,
      memberPack: "",
      tags: ["free_old"],
      gender: "",
      like: "",
      dislike: "",
      intro: "",
      password: "",
      registeredAt: "",
      lastVisit: "2026-09-09 16:10:22",
      lastLogin: "",
      stats: "0/0/0/0",
      source: "",
      channel: "",
    },
    {
      id: "8cc3410b9e807b71a23c6d4e",
      displayId: "10802",
      type: "normal",
      nickname: "运营体验号",
      email: "ops@example.com",
      phone: "13800138000",
      identity: "normal",
      status: "normal",
      disableNote: "",
      official: true,
      member: true,
      memberPack: "月卡",
      tags: ["paid"],
      gender: "男",
      like: "12",
      dislike: "1",
      intro: "内部体验账号",
      password: "Abcd1234",
      registeredAt: "2026-08-01 10:00:00",
      lastVisit: "2026-09-09 12:00:00",
      lastLogin: "2026-09-09 12:00:00",
      stats: "3/1/20/8",
      source: "后台创建",
      channel: "运营",
    },
  ],
  filters: {
    type: "",
    id: "",
    displayId: "",
    nickname: "",
    email: "",
    tags: "",
    status: "",
    official: "",
    member: "",
    collapsed: false,
  },
  selected: [],
  modal: null,
  tab: "basic",
  tagPicker: false,
  watchFilters: { albumId: "", albumName: "", time: "" },
  memberFilters: { status: "", code: "", name: "", date: "", price: "", method: "" },
  more: null,
};

function isUserDirty() {
  return Boolean(userState.modal && userState.modal.dirty);
}

function userTypeLabel(type) {
  if (type === "guest") return "访客";
  if (type === "virtual") return "虚拟用户";
  return "普通用户";
}

function userStatusLabel(status) {
  if (status === "disabled") return "禁用";
  return "正常";
}

function yesNo(value) {
  return value ? "是" : "否";
}

function dash(value) {
  return value === 0 || value ? escapeHtml(String(value)) : "—";
}

function blankUserForm() {
  return {
    nickname: "",
    identity: "normal",
    email: "",
    phone: "",
    tags: [],
    intro: "admin",
    password: "",
    status: "normal",
    disableNote: "",
    official: false,
    member: false,
  };
}

function formFromUser(user) {
  return {
    nickname: user.nickname,
    identity: user.identity,
    email: user.email,
    phone: user.phone,
    tags: clone(user.tags || []),
    intro: user.intro || "",
    password: "",
    status: user.status,
    disableNote: user.disableNote || "",
    official: user.official,
    member: user.member,
  };
}

function filteredUsers() {
  const f = userState.filters;
  return userState.users.filter((user) => {
    if (f.type && user.type !== f.type) return false;
    if (f.id && !user.id.toLowerCase().includes(f.id.trim().toLowerCase())) return false;
    if (f.displayId && !String(user.displayId).includes(f.displayId.trim())) return false;
    if (f.nickname && !user.nickname.toLowerCase().includes(f.nickname.trim().toLowerCase())) return false;
    if (f.email && !user.email.toLowerCase().includes(f.email.trim().toLowerCase())) return false;
    if (f.status && user.status !== f.status) return false;
    if (f.official === "yes" && !user.official) return false;
    if (f.official === "no" && user.official) return false;
    if (f.member === "yes" && !user.member) return false;
    if (f.member === "no" && user.member) return false;
    if (f.tags) {
      const names = (user.tags || [])
        .map((id) => tagById(id))
        .filter(Boolean)
        .map((tag) => tag.name)
        .join(" ");
      if (!names.toLowerCase().includes(f.tags.trim().toLowerCase())) return false;
    }
    return true;
  });
}

function userTagNames(ids) {
  return (ids || [])
    .map((id) => tagById(id))
    .filter(Boolean)
    .map((tag) => tag.name);
}

function renderUserPage() {
  const f = userState.filters;
  const rows = filteredUsers();
  const hasSel = userState.selected.length > 0;
  const table = rows.length
    ? `<table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" data-user-act="toggle-all" ${rows.length && rows.every((item) => userState.selected.includes(item.id)) ? "checked" : ""} /></th>
            <th>用户类型</th>
            <th>用户ID</th>
            <th>显示ID</th>
            <th>用户昵称</th>
            <th>用户头像</th>
            <th>邮箱</th>
            <th>用户标签</th>
            <th>用户状态</th>
            <th>是否官方</th>
            <th>是否会员</th>
            <th>会员包</th>
            <th>注册时间</th>
            <th>最近访问时间</th>
            <th>最近登录时间</th>
            <th>操作栏</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (user) => `
            <tr>
              <td><input type="checkbox" data-user-act="toggle-one" data-id="${user.id}" ${userState.selected.includes(user.id) ? "checked" : ""} /></td>
              <td>${userTypeLabel(user.type)}</td>
              <td><code class="cell-code" style="margin:0">${user.id}</code></td>
              <td>${user.displayId}</td>
              <td>${escapeHtml(user.nickname)}</td>
              <td><span class="user-avatar-sm"></span></td>
              <td>${dash(user.email)}</td>
              <td>${userTagNames(user.tags).join("、") || "—"}</td>
              <td><span class="pill ${user.status === "normal" ? "green" : "gray"}">${userStatusLabel(user.status)}</span></td>
              <td>${yesNo(user.official)}</td>
              <td>${yesNo(user.member)}</td>
              <td>${dash(user.memberPack)}</td>
              <td>${dash(user.registeredAt)}</td>
              <td>${dash(user.lastVisit)}</td>
              <td>${dash(user.lastLogin)}</td>
              <td class="ops">
                <button type="button" class="link" data-user-act="edit" data-id="${user.id}">查看编辑</button>
                <button type="button" class="link" data-user-act="more" data-id="${user.id}">更多</button>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      <div class="pager">共 ${rows.length} 条</div>`
    : `<div class="empty">暂无数据</div>`;

  return `
    <header class="topbar">
      <div class="crumb">
        <span>用户中心</span>
        <span class="sep">/</span>
        <span class="current">用户信息管理</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="user-filter-card">
        <div class="user-filter-grid">
          <label>用户类型
            <select class="input" data-user-filter="type">
              <option value="">全部</option>
              <option value="guest" ${f.type === "guest" ? "selected" : ""}>访客</option>
              <option value="normal" ${f.type === "normal" ? "selected" : ""}>普通用户</option>
              <option value="virtual" ${f.type === "virtual" ? "selected" : ""}>虚拟用户</option>
            </select>
          </label>
          <label>用户ID
            <input class="input" data-user-filter="id" value="${escapeHtml(f.id)}" placeholder="请输入用户ID" />
          </label>
          <label>显示ID
            <input class="input" data-user-filter="displayId" value="${escapeHtml(f.displayId)}" placeholder="请输入显示ID" />
          </label>
          <label>用户昵称
            <input class="input" data-user-filter="nickname" value="${escapeHtml(f.nickname)}" placeholder="请输入用户昵称" />
          </label>
          ${
            f.collapsed
              ? ""
              : `
          <label>邮箱
            <input class="input" data-user-filter="email" value="${escapeHtml(f.email)}" placeholder="请输入邮箱" />
          </label>
          <label>用户标签
            <input class="input" data-user-filter="tags" value="${escapeHtml(f.tags)}" placeholder="选择用户标签" />
          </label>
          <label>用户状态
            <select class="input" data-user-filter="status">
              <option value="">全部</option>
              <option value="normal" ${f.status === "normal" ? "selected" : ""}>正常</option>
              <option value="disabled" ${f.status === "disabled" ? "selected" : ""}>禁用</option>
            </select>
          </label>
          <label>是否官方
            <select class="input" data-user-filter="official">
              <option value="">全部</option>
              <option value="yes" ${f.official === "yes" ? "selected" : ""}>是</option>
              <option value="no" ${f.official === "no" ? "selected" : ""}>否</option>
            </select>
          </label>
          <label>是否会员
            <select class="input" data-user-filter="member">
              <option value="">全部</option>
              <option value="yes" ${f.member === "yes" ? "selected" : ""}>是</option>
              <option value="no" ${f.member === "no" ? "selected" : ""}>否</option>
            </select>
          </label>
          <label>注册时间
            <input class="input" placeholder="开始日期 至 结束日期" />
          </label>
          <label>最近访问时间
            <input class="input" placeholder="开始日期 至 结束日期" />
          </label>
          <label>最近登录时间
            <input class="input" placeholder="开始日期 至 结束日期" />
          </label>`
          }
        </div>
        <div class="user-filter-actions">
          <button type="button" class="btn" data-user-act="reset">重置</button>
          <button type="button" class="btn btn-primary" data-user-act="search">搜索</button>
          <button type="button" class="btn-text" data-user-act="toggle-filter">${f.collapsed ? "展开" : "收起"}</button>
        </div>
      </div>
      <div class="user-action-bar">
        <div class="user-action-main">
          <button type="button" class="btn btn-primary" data-user-act="create">+ 创建用户</button>
          <button type="button" class="btn btn-primary" data-user-act="toast" data-msg="批量导入为本页占位">批量导入用户</button>
          <button type="button" class="btn btn-primary" data-user-act="toast" data-msg="注册验证/访客权限设置为本页占位">注册验证/访客权限设置</button>
          <button type="button" class="btn btn-primary" data-user-act="toast" data-msg="已导出用户清单（演示）">导出用户清单</button>
          <button type="button" class="btn btn-primary" data-user-act="toast" data-msg="批量创建虚拟用户为本页占位">批量创建虚拟用户</button>
          <button type="button" class="btn" data-user-act="batch-status" data-to="normal" ${hasSel ? "" : "disabled"}>批量启用</button>
          <button type="button" class="btn" data-user-act="batch-status" data-to="disabled" ${hasSel ? "" : "disabled"}>批量禁用</button>
          <button type="button" class="btn" data-user-act="batch-official" data-to="1" ${hasSel ? "" : "disabled"}>设为官方</button>
          <button type="button" class="btn" data-user-act="batch-official" data-to="0" ${hasSel ? "" : "disabled"}>取消官方</button>
        </div>
      </div>
      <div class="table-card">${table}</div>
    </div>
  `;
}

function renderAvatarBox() {
  return `
    <div class="user-avatar-panel">
      <div class="label">上传头像</div>
      <button type="button" class="user-avatar-upload" data-user-act="toast" data-msg="头像上传为本页占位">
        <span>+</span>
        <span>上传</span>
      </button>
      <p class="field-hint">上传尺寸：200*200<br />文件格式：JPG/GIF/png<br />文件大小：500KB</p>
    </div>
  `;
}

function renderUserTagField(form) {
  const names = userTagNames(form.tags);
  return `
    <label class="span-2">用户标签
      <div class="user-tag-row">
        <div class="user-tag-box">${names.length ? names.map((name) => `<span class="chip">${escapeHtml(name)}</span>`).join("") : '<span class="muted">未选择</span>'}</div>
        <button type="button" class="btn" data-user-act="open-tags">选择</button>
      </div>
    </label>
  `;
}

function renderCreateModal() {
  const modal = userState.modal;
  if (!modal || modal.mode !== "create") return "";
  const form = modal.form;
  return `
    <div class="mask">
      <div class="dialog extra-wide user-dialog">
        <div class="dialog-title">创建用户<button type="button" class="icon-x" data-user-act="close-modal">×</button></div>
        <div class="dialog-body">
          <div class="info-bar">创建成功后自动生成用户ID，用户账号为填写的邮箱。</div>
          <div class="user-form-split">
            <div class="form-grid">
              <label class="span-2">用户昵称 *
                <input class="input" data-user-form="nickname" maxlength="10" value="${escapeHtml(form.nickname)}" placeholder="支持中/英/数，10个字符" />
              </label>
              <label class="span-2">用户身份 *
                <select class="input" data-user-form="identity">
                  <option value="normal" ${form.identity === "normal" ? "selected" : ""}>普通用户</option>
                  <option value="guest" ${form.identity === "guest" ? "selected" : ""}>访客</option>
                </select>
              </label>
              <label class="span-2">邮箱 *
                <input class="input" data-user-form="email" maxlength="40" value="${escapeHtml(form.email)}" placeholder="支持中/英/数/符号，40个字符" />
              </label>
              ${renderUserTagField(form)}
              <label class="span-2">用户介绍
                <textarea class="input" rows="3" data-user-form="intro">${escapeHtml(form.intro)}</textarea>
              </label>
              <label class="span-2">设定登录密码 *
                <input class="input" type="password" data-user-form="password" value="${escapeHtml(form.password)}" />
                <span class="field-hint">注：密码由英文+数字组成，不少于 8 个字符</span>
              </label>
            </div>
            ${renderAvatarBox()}
          </div>
        </div>
        <div class="dialog-foot" style="justify-content:flex-start">
          <button type="button" class="btn btn-primary" data-user-act="save-create">创建用户</button>
          <button type="button" class="btn" data-user-act="close-modal">关闭</button>
        </div>
      </div>
    </div>
  `;
}

function renderWatchTab() {
  const f = userState.watchFilters;
  return `
    <div class="filter-bar">
      <input class="input" data-watch-filter="albumId" value="${escapeHtml(f.albumId)}" placeholder="专辑ID" />
      <input class="input" data-watch-filter="albumName" value="${escapeHtml(f.albumName)}" placeholder="专辑名称" />
      <input class="input" data-watch-filter="time" value="${escapeHtml(f.time)}" placeholder="观看时间" />
      <button type="button" class="btn btn-primary" data-user-act="search-watch">搜索</button>
    </div>
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>观看时间</th><th>专辑ID</th><th>专辑名称</th>
            <th>分集名称</th><th>集数</th><th>观看时长 (s)</th>
          </tr>
        </thead>
      </table>
      <div class="empty">暂无数据</div>
    </div>
  `;
}

function renderMemberTab() {
  const f = userState.memberFilters;
  return `
    <div class="filter-bar">
      <select class="input" data-member-filter="status">
        <option value="">全部状态</option>
        <option value="on" ${f.status === "on" ? "selected" : ""}>生效</option>
        <option value="off" ${f.status === "off" ? "selected" : ""}>失效</option>
      </select>
      <input class="input" data-member-filter="code" value="${escapeHtml(f.code)}" placeholder="请输入商品编码" />
      <input class="input" data-member-filter="name" value="${escapeHtml(f.name)}" placeholder="请输入商品名称" />
      <input class="input" data-member-filter="date" value="${escapeHtml(f.date)}" placeholder="订购日期" />
      <input class="input" data-member-filter="price" value="${escapeHtml(f.price)}" placeholder="请输入实销价格" />
      <select class="input" data-member-filter="method">
        <option value="">全部获得方式</option>
        <option value="buy" ${f.method === "buy" ? "selected" : ""}>购买</option>
        <option value="grant" ${f.method === "grant" ? "selected" : ""}>发放</option>
      </select>
      <button type="button" class="btn btn-primary" data-user-act="search-member">搜索</button>
      <button type="button" class="btn" data-user-act="reset-member">重置</button>
    </div>
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>操作</th><th>状态</th><th>商品编码</th><th>商品名称</th>
            <th>订购时间</th><th>实销价格</th><th>权益天数</th><th>获得方式</th><th>备注</th>
          </tr>
        </thead>
      </table>
      <div class="empty">暂无数据</div>
    </div>
  `;
}

function renderEditModal() {
  const modal = userState.modal;
  if (!modal || modal.mode !== "edit") return "";
  const user = modal.user;
  const form = modal.form;
  const tab = userState.tab;
  const phoneError = form.phone && !/^\d{1,12}$/.test(form.phone);
  return `
    <div class="mask">
      <div class="dialog extra-wide user-dialog">
        <div class="dialog-title">用户信息<button type="button" class="icon-x" data-user-act="close-modal">×</button></div>
        <div class="dialog-body">
          <div class="tabs">
            <button type="button" class="tab ${tab === "basic" ? "active" : ""}" data-user-act="tab" data-tab="basic">基本信息</button>
            <button type="button" class="tab ${tab === "watch" ? "active" : ""}" data-user-act="tab" data-tab="watch">观看记录</button>
            <button type="button" class="tab ${tab === "member" ? "active" : ""}" data-user-act="tab" data-tab="member">会员记录</button>
          </div>
          ${
            tab === "basic"
              ? `
          <div class="form-grid">
            <label>用户ID
              <div class="user-copy-row">
                <input class="input" value="${user.id}" readonly />
                <button type="button" class="btn" data-user-act="copy" data-text="${user.id}">复制</button>
              </div>
            </label>
            <label>显示ID
              <div class="user-copy-row">
                <input class="input" value="${user.displayId}" readonly />
                <button type="button" class="btn" data-user-act="copy" data-text="${user.displayId}">复制</button>
              </div>
            </label>
            <label>用户状态
              <select class="input" data-user-form="status">
                <option value="normal" ${form.status === "normal" ? "selected" : ""}>启用</option>
                <option value="disabled" ${form.status === "disabled" ? "selected" : ""}>禁用</option>
              </select>
            </label>
            <label class="span-2">禁用说明
              <input class="input" data-user-form="disableNote" value="${escapeHtml(form.disableNote)}" />
            </label>
          </div>
          <div class="user-form-split" style="margin-top:12px">
            <div class="form-grid">
              <label class="span-2">用户昵称
                <input class="input" data-user-form="nickname" maxlength="10" value="${escapeHtml(form.nickname)}" />
              </label>
              <label class="span-2">邮箱
                <input class="input" data-user-form="email" value="${escapeHtml(form.email)}" />
              </label>
              <label class="span-2">手机号
                <input class="input" data-user-form="phone" value="${escapeHtml(form.phone)}" />
                ${phoneError ? '<span class="field-error">请输入 12 位以内数字手机号</span>' : ""}
              </label>
              <label class="span-2">身份
                <select class="input" data-user-form="identity">
                  <option value="guest" ${form.identity === "guest" ? "selected" : ""}>访客</option>
                  <option value="normal" ${form.identity === "normal" ? "selected" : ""}>普通用户</option>
                </select>
              </label>
              ${renderUserTagField(form)}
              <label class="span-2">用户介绍
                <textarea class="input" rows="3" data-user-form="intro">${escapeHtml(form.intro)}</textarea>
              </label>
              <label class="span-2">现用用户登录密码
                <input class="input" value="${user.password ? "已设置" : "暂无"}" readonly />
              </label>
              <label class="span-2">修改登录密码
                <input class="input" type="password" data-user-form="password" value="${escapeHtml(form.password)}" />
                <span class="field-hint">注：密码由英文+数字组成，8-12 个字符</span>
                <div class="user-tag-row" style="margin-top:8px">
                  <button type="button" class="btn btn-primary" data-user-act="change-pwd">确定修改</button>
                  <button type="button" class="btn" data-user-act="toast" data-msg="暂无修改历史">修改历史</button>
                </div>
              </label>
            </div>
            ${renderAvatarBox()}
          </div>`
              : tab === "watch"
                ? renderWatchTab()
                : renderMemberTab()
          }
        </div>
        ${
          tab === "basic"
            ? `<div class="dialog-foot" style="justify-content:flex-start">
                <button type="button" class="btn btn-primary" data-user-act="save-edit">修改用户信息</button>
                <button type="button" class="btn" data-user-act="close-modal">关闭</button>
              </div>`
            : `<div class="dialog-foot" style="justify-content:flex-start">
                <button type="button" class="btn" data-user-act="close-modal">关闭</button>
              </div>`
        }
      </div>
    </div>
  `;
}

function renderUserMoreDrawer() {
  if (!userState.more) return "";
  const user = userState.users.find((item) => item.id === userState.more.userId);
  if (!user) return "";
  const panel = userState.more.panel || "menu";
  const giftMeta = {
    coin: { title: "赠送金币", label: "金币数量", unit: "枚" },
    point: { title: "赠送积分", label: "积分数量", unit: "分" },
    vip: { title: "赠送VIP", label: "会员天数", unit: "天" },
  };
  let body = "";
  if (panel === "menu") {
    body = `
      <div class="user-more-list">
        <button type="button" data-user-act="more-panel" data-panel="info">更多信息</button>
        <button type="button" data-user-act="more-panel" data-panel="coin">赠送金币</button>
        <button type="button" data-user-act="more-panel" data-panel="point">赠送积分</button>
        <button type="button" data-user-act="more-panel" data-panel="vip">赠送VIP</button>
      </div>
    `;
  } else if (panel === "info") {
    body = `
      <div class="user-more-info">
        <p><span>用户昵称</span>${escapeHtml(user.nickname)}</p>
        <p><span>用户类型</span>${userTypeLabel(user.type)}</p>
        <p><span>显示ID</span>${escapeHtml(user.displayId)}</p>
        <p><span>性别</span>${dash(user.gender)}</p>
        <p><span>喜欢</span>${dash(user.like)}</p>
        <p><span>不喜欢</span>${dash(user.dislike)}</p>
        <p><span>帖子/视频/粉丝/点赞</span>${dash(user.stats)}</p>
        <p><span>用户来源</span>${dash(user.source)}</p>
        <p><span>来源渠道</span>${dash(user.channel)}</p>
      </div>
    `;
  } else {
    const meta = giftMeta[panel];
    body = `
      <div class="user-more-gift">
        <label>${meta.label}
          <input class="input" data-more-amount type="number" min="1" value="${escapeHtml(userState.more.amount || "")}" placeholder="请输入" />
        </label>
        <span class="field-hint">单位：${meta.unit}</span>
        <button type="button" class="btn btn-primary btn-block" data-user-act="gift-ok">${meta.title}</button>
      </div>
    `;
  }
  return `
    <div class="user-more-catch" data-user-act="close-more"></div>
    <div class="user-more-pop" style="top:${userState.more.top || 0}px;right:${userState.more.right || 8}px">
      ${
        panel === "menu"
          ? body
          : `<div class="user-more-pop-head">
              <button type="button" class="btn-text" data-user-act="more-panel" data-panel="menu">返回</button>
              <span>${panel === "info" ? "更多信息" : giftMeta[panel].title}</span>
            </div>
            <div class="user-more-pop-body">${body}</div>`
      }
    </div>
  `;
}

function renderUserTagPicker() {
  if (!userState.tagPicker || !userState.modal) return "";
  const selected = new Set(userState.modal.form.tags || []);
  const options = (typeof enabledTags === "function" ? enabledTags() : [])
    .map(
      (tag) => `
        <label class="tag-option">
          <input type="checkbox" data-user-act="toggle-tag" data-id="${tag.id}" ${selected.has(tag.id) ? "checked" : ""} />
          <span>${escapeHtml(tag.name)}</span>
        </label>
      `,
    )
    .join("");
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">选择用户标签</div>
        <div class="dialog-body">
          <div class="add-list" style="display:block;max-height:320px">${options || '<div class="empty-inline">请先到标签库启用标签</div>'}</div>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn btn-primary" data-user-act="close-tags">完成</button>
        </div>
      </div>
    </div>
  `;
}

function validPassword(value) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(value);
}

function saveCreateUser() {
  const form = userState.modal && userState.modal.form;
  if (!form) return;
  if (!(form.nickname || "").trim() || !(form.email || "").trim() || !validPassword(form.password)) {
    showToast("请完善昵称、邮箱，并设置符合规则的密码", "error");
    return;
  }
  userState.users.unshift({
    id: Math.random().toString(16).slice(2, 26),
    displayId: String(20000 + userState.users.length),
    type: form.identity === "guest" ? "guest" : "normal",
    nickname: form.nickname.trim(),
    email: form.email.trim(),
    phone: "",
    identity: form.identity,
    status: "normal",
    disableNote: "",
    official: false,
    member: false,
    memberPack: "",
    tags: form.tags || [],
    gender: "",
    like: "",
    dislike: "",
    intro: form.intro,
    password: form.password,
    registeredAt: "刚刚",
    lastVisit: "",
    lastLogin: "",
    stats: "0/0/0/0",
    source: "后台创建",
    channel: "运营",
  });
  userState.modal = null;
  showToast("创建成功");
  renderApp();
}

function saveEditUser() {
  const modal = userState.modal;
  if (!modal) return;
  const form = modal.form;
  if (form.phone && !/^\d{1,12}$/.test(form.phone)) {
    showToast("请输入 12 位以内数字手机号", "error");
    return;
  }
  Object.assign(modal.user, {
    nickname: form.nickname,
    email: form.email,
    phone: form.phone,
    identity: form.identity,
    type: form.identity === "guest" ? "guest" : modal.user.type === "virtual" ? "virtual" : "normal",
    status: form.status,
    disableNote: form.disableNote,
    tags: form.tags || [],
    intro: form.intro,
  });
  userState.modal = null;
  showToast("已修改用户信息");
  renderApp();
}

function closeUserModal(force) {
  if (!force && userState.modal && userState.modal.dirty) {
    confirmLeaveIfDirty(() => {
      userState.modal = null;
      userState.tagPicker = false;
      renderApp();
    });
    return;
  }
  userState.modal = null;
  userState.tagPicker = false;
  renderApp();
}

function onUserClick(e) {
  const btn = e.target.closest("[data-user-act]");
  if (!btn) return;
  const act = btn.dataset.userAct;
  if (act === "toggle-all" || act === "toggle-one") {
    if (e.type !== "change") return;
  }
  if (act === "create") {
    userState.modal = { mode: "create", form: blankUserForm(), dirty: false };
    userState.tab = "basic";
    renderApp();
  } else if (act === "edit") {
    const user = userState.users.find((item) => item.id === btn.dataset.id);
    userState.modal = { mode: "edit", user, form: formFromUser(user), dirty: false };
    userState.tab = "basic";
    renderApp();
  } else if (act === "reset") {
    userState.filters = {
      type: "",
      id: "",
      displayId: "",
      nickname: "",
      email: "",
      tags: "",
      status: "",
      official: "",
      member: "",
      collapsed: userState.filters.collapsed,
    };
    renderApp();
  } else if (act === "search") renderApp();
  else if (act === "toggle-filter") {
    userState.filters.collapsed = !userState.filters.collapsed;
    renderApp();
  }   else if (act === "toast") showToast(btn.dataset.msg || "操作成功");
  else if (act === "more") {
    if (userState.more && userState.more.userId === btn.dataset.id && userState.more.panel === "menu") {
      userState.more = null;
    } else {
      const rect = btn.getBoundingClientRect();
      userState.more = {
        userId: btn.dataset.id,
        panel: "menu",
        amount: "",
        top: Math.round(rect.bottom + 4),
        right: Math.round(window.innerWidth - rect.right),
      };
    }
    renderApp();
  } else if (act === "toggle-all") {
    const rows = filteredUsers();
    userState.selected = btn.checked ? rows.map((item) => item.id) : [];
    renderApp();
  } else if (act === "toggle-one") {
    const set = new Set(userState.selected);
    if (btn.checked) set.add(btn.dataset.id);
    else set.delete(btn.dataset.id);
    userState.selected = [...set];
  } else if (act === "batch-status") {
    userState.users.forEach((user) => {
      if (userState.selected.includes(user.id)) user.status = btn.dataset.to;
    });
    showToast(btn.dataset.to === "normal" ? "已批量启用" : "已批量禁用");
    renderApp();
  } else if (act === "batch-official") {
    const next = btn.dataset.to === "1";
    userState.users.forEach((user) => {
      if (userState.selected.includes(user.id)) user.official = next;
    });
    showToast(next ? "已设为官方" : "已取消官方");
    renderApp();
  }
}

function onUserOverlayClick(e) {
  const mask = e.target.classList && e.target.classList.contains("mask") ? e.target : null;
  if (mask && !e.target.closest(".dialog")) {
    if (userState.tagPicker) {
      userState.tagPicker = false;
      renderApp();
      return;
    }
    closeUserModal();
    return;
  }
  const btn = e.target.closest("[data-user-act]");
  if (!btn) return;
  const act = btn.dataset.userAct;
  if (act === "close-modal") closeUserModal();
  else if (act === "close-more") {
    userState.more = null;
    renderApp();
  } else if (act === "more-panel") {
    const panel = btn.dataset.panel;
    if (panel === "coin" || panel === "point") {
      const user = userState.users.find((item) => item.id === userState.more.userId);
      userState.more = null;
      fillFinanceAdjust(user ? user.id : "", panel);
      openPage("coin-point-adjust");
      renderApp();
      return;
    }
    userState.more.panel = panel;
    userState.more.amount = "";
    renderApp();
  } else if (act === "gift-ok") {
    const amount = Number(userState.more && userState.more.amount);
    if (!amount || amount < 1) {
      showToast("请输入大于 0 的数量", "error");
      return;
    }
    const names = { coin: "金币", point: "积分", vip: "VIP 天数" };
    showToast(`已赠送 ${amount} ${names[userState.more.panel] || ""}`);
    userState.more = null;
    renderApp();
  } else if (act === "save-create") saveCreateUser();
  else if (act === "save-edit") saveEditUser();
  else if (act === "tab") {
    userState.tab = btn.dataset.tab;
    renderApp();
  } else if (act === "open-tags") {
    userState.tagPicker = true;
    renderApp();
  } else if (act === "close-tags") {
    userState.tagPicker = false;
    renderApp();
  } else if (act === "toggle-tag") {
    const form = userState.modal && userState.modal.form;
    if (!form) return;
    const set = new Set(form.tags || []);
    if (btn.checked) set.add(btn.dataset.id);
    else set.delete(btn.dataset.id);
    form.tags = [...set];
    userState.modal.dirty = true;
  } else if (act === "copy") {
    const text = btn.dataset.text || "";
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
    showToast("已复制");
  } else if (act === "change-pwd") {
    const form = userState.modal && userState.modal.form;
    if (!form || !validPassword(form.password)) {
      showToast("密码须为英文+数字，8-12 位", "error");
      return;
    }
    userState.modal.user.password = form.password;
    form.password = "";
    showToast("密码已修改");
    renderApp();
  } else if (act === "toast") showToast(btn.dataset.msg || "操作成功");
  else if (act === "search-watch" || act === "search-member") showToast("暂无数据");
  else if (act === "reset-member") {
    userState.memberFilters = { status: "", code: "", name: "", date: "", price: "", method: "" };
    renderApp();
  }
}

function bindUserOverlays() {
  const overlay = document.getElementById("overlay-root");
  overlay.innerHTML = renderCreateModal() + renderEditModal() + renderUserTagPicker() + renderUserMoreDrawer();
  const hasOverlay = Boolean(
    overlay.querySelector(".mask, .user-more-pop") || document.getElementById("confirm-modal"),
  );
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.userBound) {
    overlay.dataset.userBound = "1";
    overlay.addEventListener("click", onUserOverlayClick);
  }
  overlay.querySelectorAll("[data-user-form]").forEach((el) => {
    const sync = () => {
      if (!userState.modal) return;
      const key = el.dataset.userForm;
      userState.modal.form[key] = el.value;
      userState.modal.dirty = true;
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
  overlay.querySelectorAll("[data-watch-filter]").forEach((el) => {
    el.addEventListener("input", () => {
      userState.watchFilters[el.dataset.watchFilter] = el.value;
    });
  });
  overlay.querySelectorAll("[data-member-filter]").forEach((el) => {
    el.addEventListener("input", () => {
      userState.memberFilters[el.dataset.memberFilter] = el.value;
    });
    el.addEventListener("change", () => {
      userState.memberFilters[el.dataset.memberFilter] = el.value;
    });
  });
  const amountInput = overlay.querySelector("[data-more-amount]");
  if (amountInput) {
    amountInput.addEventListener("input", () => {
      if (userState.more) userState.more.amount = amountInput.value;
    });
  }
}

function mountUserInfoPage(main) {
  if (!main.dataset.userBound) {
    main.dataset.userBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "user-info") return;
      onUserClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "user-info") return;
      const filter = e.target.closest("[data-user-filter]");
      if (filter) userState.filters[filter.dataset.userFilter] = filter.value;
      const act = e.target.closest("[data-user-act]");
      if (act) onUserClick(e);
    });
  }
  main.innerHTML = renderUserPage();
  bindUserOverlays();
}

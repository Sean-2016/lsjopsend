const VIDEO_LANGS = ["国语", "土耳其语", "英语", "日语"];
const VIDEO_CATS = ["橙子1", "1223", "电视剧", "短剧", "电影"];
const VIDEO_GROUPS = [
  { id: "ai", name: "ai短剧", count: 6 },
  { id: "dup", name: "测试重复标签组2", count: 0 },
  { id: "got", name: "GOT1", count: 0 },
  { id: "orange", name: "橙子", count: 0 },
  { id: "11", name: "11", count: 0 },
  { id: "niguan", name: "匿冠", count: 0 },
  { id: "anime", name: "影视动漫-中文", count: 0 },
  { id: "ugc", name: "group_ugc", count: 0 },
  { id: "short", name: "短剧", count: 0 },
];
const VIDEO_QUICK_TAGS = [
  { group: "橙子1", items: ["动作", "测试", "科幻"] },
  { group: "视频", items: ["国漫", "动漫", "古风", "历史武侠", "少年热血", "新鲜原创", "古装穿越"] },
];
const VIDEO_CAT_TREE = [
  { name: "--", items: ["喜剧", "冰球", "港台剧集"] },
  { name: "短剧", items: ["恋爱", "刑侦", "玩偶", "民国", "赘婿", "萌宝", "逆袭", "权谋"] },
  { name: "动漫", items: ["动漫", "青春", "热血", "古风", "校园"] },
  { name: "搞笑", items: ["搞笑", "段子", "沙雕"] },
  { name: "热门", items: ["国学文化", "财税知识", "经济", "乡村振兴"] },
];

const videoState = {
  filterCollapsed: false,
  filters: blankVideoFilters(),
  filterDraft: blankVideoFilters(),
  tagMode: "union",
  pickedTags: [],
  groupId: "ai",
  subFilter: "",
  selected: [],
  drawer: null,
  feeModal: null,
  albums: [
    {
      id: "7f5dbefa9ab40e8e8927cb1",
      name: "星际远征：破向星海深处",
      lang: "国语",
      fee: "free",
      feeForm: "",
      memberType: "",
      category: "橙子1",
      serial: "连载中",
      score: "85",
      totalScore: "100",
      author: "官方小编-小花",
      tags: ["科幻", "动作", "测试"],
      tagGroup: "",
      inAt: "2026-07-24 10:42:10",
      updatedAt: "2026-09-10 15:28:08",
      onAt: "2025-01-15",
      onAtFull: "2026-09-10 10:20:37",
      offAt: "",
      status: "on",
      episodes: 1,
      latest: 0,
      onBy: "管理员",
      offBy: "",
      year: "2025",
      duration: "0",
      region: "美国",
      related: "甜蜜霸总：灰姑娘的甜蜜逆袭",
      highlight: "太空冒险之旅",
      intro:
        "以星辰为罗盘，以未知为终点。人类首次跨越光年壁垒，直面宇宙深处的浩然巨物与失落文明。硬核科幻设定打造成沉浸式星海战场，每一帧都是视觉轰炸。准备好，与这支探险队一同，踏入这片从未有人抵达的禁地！",
      director: "张导演",
      producer: "李制片",
      crew: "王编剧",
      composer: "赵作曲",
      singer: "陈演唱",
      search: blankSearchRec(),
      parts: [
        {
          id: "bf6dda66fe7944e9bb401cd23",
          fee: "free",
          highlight: "未检测",
          preview: "",
          feeWay: "",
          status: "off",
          type: "正片",
        },
      ],
    },
    {
      id: "1bacefcbb20829e3e2b67a056",
      name: "甜蜜霸总：灰姑娘的甜蜜逆袭",
      lang: "土耳其语",
      fee: "free",
      feeForm: "",
      memberType: "",
      category: "1223",
      serial: "连载中",
      score: "65",
      totalScore: "100",
      author: "宝生1",
      tags: ["甜宠", "霸总"],
      tagGroup: "",
      inAt: "2026-07-24 10:42:10",
      updatedAt: "2026-09-11 15:09:45",
      onAt: "2025-05-01",
      onAtFull: "2026-09-10 10:20:37",
      offAt: "",
      status: "on",
      episodes: 5,
      latest: 1,
      onBy: "管理员",
      offBy: "",
      year: "2025",
      duration: "120",
      region: "土耳其",
      related: "",
      highlight: "甜宠逆袭",
      intro: "灰姑娘与霸总的甜蜜对决。",
      director: "",
      producer: "",
      crew: "",
      composer: "",
      singer: "",
      search: blankSearchRec(),
      parts: [{ id: "ep-b1", fee: "free", highlight: "未检测", preview: "", feeWay: "", status: "on", type: "正片" }],
    },
    {
      id: "5296de330ab544362ed7d19a",
      name: "都市青年的奋斗与爱情",
      lang: "国语",
      fee: "free",
      feeForm: "",
      memberType: "",
      category: "电视剧",
      serial: "连载中",
      score: "82",
      totalScore: "100",
      author: "宝生1",
      tags: ["都市", "情感", "生活", "更新测试"],
      tagGroup: "",
      inAt: "2026-07-24 10:42:10",
      updatedAt: "2026-09-10 11:37:11",
      onAt: "2025-03-10",
      onAtFull: "2026-09-10 11:37:11",
      offAt: "2026-09-10 11:37:11",
      status: "off",
      episodes: 3,
      latest: 1,
      onBy: "管理员",
      offBy: "管理员",
      year: "2025",
      duration: "90",
      region: "中国",
      related: "",
      highlight: "",
      intro: "都市青年在事业与爱情间的选择。",
      director: "",
      producer: "",
      crew: "",
      composer: "",
      singer: "",
      search: blankSearchRec(),
      parts: [],
    },
    {
      id: "3c000b6cc6aa817d021699a0",
      name: "重启末日：我在废土开餐厅",
      lang: "国语",
      fee: "free",
      feeForm: "",
      memberType: "",
      category: "短剧",
      serial: "连载中",
      score: "95",
      totalScore: "100",
      author: "宝生1",
      tags: ["末日重生", "异能", "废土", "爽文"],
      tagGroup: "",
      inAt: "2026-07-23 10:45:54",
      updatedAt: "2026-09-09 17:04:20",
      onAt: "2026-07-23",
      onAtFull: "2026-07-23 11:45:41",
      offAt: "",
      status: "on",
      episodes: 60,
      latest: 0,
      onBy: "管理员",
      offBy: "",
      year: "2026",
      duration: "300",
      region: "中国",
      related: "",
      highlight: "废土开餐厅",
      intro: "末日废土中开餐厅求生。",
      director: "",
      producer: "",
      crew: "",
      composer: "",
      singer: "",
      search: blankSearchRec(),
      parts: [],
    },
  ],
};

function blankVideoFilters() {
  return {
    id: "",
    name: "",
    lang: "",
    fee: "",
    feeForm: "",
    category: "",
    onStart: "",
    onEnd: "",
    serial: "",
    score: "",
    author: "",
    tag: "",
    inStart: "",
    inEnd: "",
    updStart: "",
    updEnd: "",
    offStart: "",
    offEnd: "",
    status: "",
  };
}

function blankSearchRec() {
  return {
    title: "",
    keywords: "",
    summary: "",
    index: "forbid",
    plot: "",
    geoTitle: "",
    geoKeywords: "",
    geoDesc: "",
    geoUpdated: "",
    geoType: "",
    geoGenre: "",
    geoTheme: "",
    geoFaq: "",
  };
}

function isVideoDirty() {
  return Boolean(videoState.drawer && videoState.drawer.dirty);
}

function videoAlbumById(id) {
  return videoState.albums.find((item) => item.id === id);
}

function videoFeeLabel(fee) {
  return fee === "paid" ? "付费" : "免费";
}

function videoStatusLabel(status) {
  return status === "on" ? "上架" : "下架";
}

function filteredVideoAlbums() {
  const f = videoState.filters;
  return videoState.albums.filter((item) => {
    if (f.id && !item.id.toLowerCase().includes(f.id.trim().toLowerCase())) return false;
    if (f.name && !item.name.includes(f.name.trim())) return false;
    if (f.lang && item.lang !== f.lang) return false;
    if (f.fee && item.fee !== f.fee) return false;
    if (f.category && item.category !== f.category) return false;
    if (f.serial && item.serial !== f.serial) return false;
    if (f.author && !item.author.includes(f.author.trim())) return false;
    if (f.tag && !item.tags.join(" ").includes(f.tag.trim())) return false;
    if (f.status && item.status !== f.status) return false;
    if (videoState.pickedTags.length) {
      const hit = videoState.pickedTags.filter((tag) => item.tags.includes(tag)).length;
      if (videoState.tagMode === "and" && hit !== videoState.pickedTags.length) return false;
      if (videoState.tagMode !== "and" && hit === 0) return false;
    }
    if (videoState.groupId === "ai" && videoState.subFilter === "search" && !item.tags.includes("更新测试")) return false;
    return true;
  });
}

function formFromAlbum(album) {
  return {
    name: album.name,
    lang: album.lang,
    shortTitle: album.name.slice(0, 20),
    onAt: album.onAt,
    year: album.year,
    episodes: String(album.episodes),
    duration: album.duration,
    region: album.region,
    category: album.category,
    related: album.related,
    tags: album.tags.slice(),
    score: album.score,
    totalScore: album.totalScore,
    highlight: album.highlight,
    intro: album.intro,
    author: album.author,
    director: album.director,
    producer: album.producer,
    crew: album.crew,
    composer: album.composer,
    singer: album.singer,
    search: Object.assign(blankSearchRec(), album.search || {}),
  };
}

function renderVideoPage() {
  const d = videoState.filterDraft;
  const f = videoState.filters;
  const rows = filteredVideoAlbums();
  const extra = videoState.filterCollapsed
    ? ""
    : `
          <label>资费形式
            <select class="input" data-video-filter="feeForm">
              <option value="">全部</option>
              <option value="member" ${d.feeForm === "member" ? "selected" : ""}>会员专辑</option>
            </select>
          </label>
          <label>分类
            <select class="input" data-video-filter="category">
              <option value="">全部</option>
              ${VIDEO_CATS.map((c) => `<option value="${c}" ${d.category === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </label>
          <label>上架时间
            <div class="video-range"><input class="input" data-video-filter="onStart" placeholder="上架时间" value="${escapeHtml(d.onStart)}" /><span>→</span><input class="input" data-video-filter="onEnd" placeholder="上架时间" value="${escapeHtml(d.onEnd)}" /></div>
          </label>
          <label>连载状态
            <select class="input" data-video-filter="serial">
              <option value="">全部</option>
              <option value="连载中" ${d.serial === "连载中" ? "selected" : ""}>连载中</option>
              <option value="已完结" ${d.serial === "已完结" ? "selected" : ""}>已完结</option>
            </select>
          </label>
          <label>评分
            <input class="input" data-video-filter="score" value="${escapeHtml(d.score)}" placeholder="评分" />
          </label>
          <label>作者用户
            <input class="input" data-video-filter="author" value="${escapeHtml(d.author)}" placeholder="请输入作者用户昵称" />
          </label>
          <label>标签
            <input class="input" data-video-filter="tag" value="${escapeHtml(d.tag)}" placeholder="空" />
          </label>
          <label>入库时间
            <div class="video-range"><input class="input" data-video-filter="inStart" placeholder="入库时间" value="${escapeHtml(d.inStart)}" /><span>→</span><input class="input" data-video-filter="inEnd" placeholder="入库时间" value="${escapeHtml(d.inEnd)}" /></div>
          </label>
          <label>更新时间
            <div class="video-range"><input class="input" data-video-filter="updStart" placeholder="更新时间" value="${escapeHtml(d.updStart)}" /><span>→</span><input class="input" data-video-filter="updEnd" placeholder="更新时间" value="${escapeHtml(d.updEnd)}" /></div>
          </label>
          <label>下架时间
            <div class="video-range"><input class="input" data-video-filter="offStart" placeholder="下架时间" value="${escapeHtml(d.offStart)}" /><span>→</span><input class="input" data-video-filter="offEnd" placeholder="下架时间" value="${escapeHtml(d.offEnd)}" /></div>
          </label>
          <label>状态
            <select class="input" data-video-filter="status">
              <option value="">全部</option>
              <option value="on" ${d.status === "on" ? "selected" : ""}>上架</option>
              <option value="off" ${d.status === "off" ? "selected" : ""}>下架</option>
            </select>
          </label>`;

  const table = rows.length
    ? `<table class="data-table video-table">
        <thead>
          <tr>
            <th><input type="checkbox" data-video-act="toggle-all" ${rows.length && rows.every((item) => videoState.selected.includes(item.id)) ? "checked" : ""} /></th>
            <th>专辑编码</th><th>专辑名称</th><th>语言</th><th>资费状态</th><th>资费形式</th><th>会员类型</th>
            <th>内容分类</th><th>上架时间</th><th>连载状态</th><th>评分</th><th>作者用户</th><th>标签</th><th>所属标签组</th>
            <th>横图</th><th>竖图</th><th>入库时间</th><th>更新时间</th><th>上架时间</th><th>下架时间</th>
            <th>状态</th><th>总集数</th><th>当前最新</th><th>上架人</th><th>下架人</th><th>操作栏</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (item, i) => `
            <tr>
              <td><input type="checkbox" data-video-act="toggle-one" data-id="${item.id}" ${videoState.selected.includes(item.id) ? "checked" : ""} /></td>
              <td><code class="cell-code" style="margin:0">${item.id}</code></td>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.lang)}</td>
              <td><span class="pill ${item.fee === "free" ? "green" : "gray"}">${videoFeeLabel(item.fee)}</span></td>
              <td>${dash(item.feeForm)}</td>
              <td>${dash(item.memberType)}</td>
              <td>${escapeHtml(item.category)}</td>
              <td>${escapeHtml(item.onAt)}</td>
              <td>${escapeHtml(item.serial)}</td>
              <td>${escapeHtml(item.score)}</td>
              <td>${escapeHtml(item.author)}</td>
              <td class="video-tags">${item.tags.map((t) => escapeHtml(t)).join("<br>")}</td>
              <td>${dash(item.tagGroup)}</td>
              <td><span class="video-cover landscape" style="--h:${(i * 40) % 360}"></span></td>
              <td><span class="video-cover portrait" style="--h:${(i * 40 + 20) % 360}"></span></td>
              <td>${escapeHtml(item.inAt)}</td>
              <td>${escapeHtml(item.updatedAt)}</td>
              <td>${escapeHtml(item.onAtFull)}</td>
              <td>${dash(item.offAt)}</td>
              <td><span class="pill ${item.status === "on" ? "green" : "gray"}">${videoStatusLabel(item.status)}</span></td>
              <td>${item.episodes}</td>
              <td>${item.latest}</td>
              <td>${dash(item.onBy)}</td>
              <td>${dash(item.offBy)}</td>
              <td class="ops sticky-ops"><button type="button" class="link" data-video-act="view" data-id="${item.id}">查看</button></td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>`
    : `<div class="empty">暂无内容</div>`;

  return `
    <header class="topbar">
      <div class="crumb">
        <span>内容中心</span>
        <span class="sep">/</span>
        <span class="current">视频内容管理</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="user-filter-card">
        <div class="user-filter-grid">
          <label>专辑编码
            <input class="input" data-video-filter="id" value="${escapeHtml(d.id)}" placeholder="专辑编码" />
          </label>
          <label>专辑名称
            <input class="input" data-video-filter="name" value="${escapeHtml(d.name)}" placeholder="专辑名称" />
          </label>
          <label>语言
            <select class="input" data-video-filter="lang">
              <option value="">全部</option>
              ${VIDEO_LANGS.map((lang) => `<option value="${lang}" ${d.lang === lang ? "selected" : ""}>${lang}</option>`).join("")}
            </select>
          </label>
          <label>资费状态
            <select class="input" data-video-filter="fee">
              <option value="">全部</option>
              <option value="free" ${d.fee === "free" ? "selected" : ""}>免费</option>
              <option value="paid" ${d.fee === "paid" ? "selected" : ""}>付费</option>
            </select>
          </label>
          ${extra}
        </div>
        <div class="user-filter-actions">
          <button type="button" class="btn" data-video-act="reset">重置</button>
          <button type="button" class="btn btn-primary" data-video-act="search">搜索</button>
          <button type="button" class="btn-text" data-video-act="toggle-filter">${videoState.filterCollapsed ? "展开" : "收起"}</button>
        </div>
        <div class="video-tag-filter">
          <span>标签筛选</span>
          <label class="video-radio"><input type="radio" name="videoTagMode" data-video-act="tag-mode" value="union" ${videoState.tagMode !== "and" ? "checked" : ""} /> 并集</label>
          <label class="video-radio"><input type="radio" name="videoTagMode" data-video-act="tag-mode" value="and" ${videoState.tagMode === "and" ? "checked" : ""} /> 交集</label>
          <span class="muted">已选择 ${videoState.pickedTags.length} 个标签</span>
          <button type="button" class="link" data-video-act="clear-tags">清空</button>
          <button type="button" class="btn btn-primary" data-video-act="search">筛选</button>
        </div>
        <div class="video-cat-quick">
          <div class="label">分类快速选择</div>
          ${VIDEO_CAT_TREE.map(
            (row) => `
            <div class="video-cat-row">
              <b>${row.name}</b>
              <div>${row.items
                .map(
                  (name) =>
                    `<button type="button" class="video-chip${f.category === name || d.tag === name ? " on" : ""}" data-video-act="pick-cat" data-name="${escapeHtml(name)}">${name}</button>`,
                )
                .join("")}</div>
            </div>`,
          ).join("")}
        </div>
      </div>
      <div class="video-quick">
        ${VIDEO_QUICK_TAGS.map(
          (row) => `
          <div class="video-quick-row">
            <b>${row.group}：</b>
            ${row.items
              .map(
                (name) =>
                  `<button type="button" class="video-chip${videoState.pickedTags.includes(name) ? " on" : ""}" data-video-act="pick-tag" data-name="${name}">${name}</button>`,
              )
              .join("")}
          </div>`,
        ).join("")}
        <div class="video-group-tabs">
          <span>自定义标签组</span>
          ${VIDEO_GROUPS.map(
            (g) =>
              `<button type="button" class="video-group${videoState.groupId === g.id ? " on" : ""}" data-video-act="pick-group" data-id="${g.id}">${g.name}</button>`,
          ).join("")}
        </div>
        ${
          videoState.groupId === "ai"
            ? `<div class="video-sub-tabs">
                <button type="button" class="link${videoState.subFilter === "" ? " on" : ""}" data-video-act="sub-filter" data-id="">A短剧测试 (6)</button>
                <button type="button" class="link${videoState.subFilter === "search" ? " on" : ""}" data-video-act="sub-filter" data-id="search">搜索更新测试 (2)</button>
              </div>`
            : ""
        }
      </div>
      <div class="video-toolbar">
        <div>
          <button type="button" class="btn" data-video-act="toast" data-msg="拉取内容为本页占位">拉取内容</button>
          <button type="button" class="btn" data-video-act="toast" data-msg="手动拉取历史为本页占位">手动拉取历史</button>
        </div>
        <div class="video-toolbar-right">
          <button type="button" class="btn btn-primary" data-video-act="create">创建短剧</button>
          <button type="button" class="btn" data-video-act="update-sel">更新短剧信息</button>
          <button type="button" class="btn" data-video-act="toast" data-msg="批量关联标签组更新分类为本页占位">批量关联标签组更新分类</button>
          <button type="button" class="btn" data-video-act="toast" data-msg="已提交批量生成海报（演示）">批量生成海报</button>
          <button type="button" class="btn" data-video-act="fee">资费调整</button>
          <button type="button" class="btn" data-video-act="toast" data-msg="AI短资信息填充为本页占位">AI短资信息填充</button>
          <button type="button" class="btn" data-video-act="shelf" data-to="off">下架</button>
          <button type="button" class="btn btn-primary" data-video-act="shelf" data-to="on">上架</button>
        </div>
      </div>
      <div class="table-card">${table}</div>
    </div>
  `;
}

function renderVideoDrawer() {
  const drawer = videoState.drawer;
  if (!drawer) return "";
  const album = drawer.album;
  const form = drawer.form;
  const tab = drawer.tab;
  const tabs = [
    ["info", "内容信息"],
    ["parts", "分集信息"],
    ["search", "搜索推荐参数设置"],
  ];
  return `
    <div class="mask drawer-mask">
      <aside class="drawer video-drawer">
        <div class="drawer-head video-drawer-head">
          <div class="tabs" style="margin:0;border:0;flex:1">
            ${tabs
              .map(
                ([key, label]) =>
                  `<button type="button" class="tab ${tab === key ? "active" : ""}" data-video-act="tab" data-tab="${key}">${label}</button>`,
              )
              .join("")}
          </div>
          <button type="button" class="icon-x" data-video-act="close-drawer">×</button>
        </div>
        <div class="drawer-body">
          ${tab === "info" ? renderVideoInfoTab(album, form) : ""}
          ${tab === "parts" ? renderVideoPartsTab(album) : ""}
          ${tab === "search" ? renderVideoSearchTab(form) : ""}
        </div>
        ${
          tab === "info"
            ? `<div class="drawer-foot">
                <button type="button" class="btn" data-video-act="close-drawer">关闭</button>
                <button type="button" class="btn btn-primary" data-video-act="save-info">保存</button>
              </div>`
            : tab === "parts"
              ? `<div class="drawer-foot"><button type="button" class="btn" data-video-act="close-drawer">关闭</button></div>`
              : ""
        }
      </aside>
    </div>
  `;
}

function renderVideoInfoTab(album, form) {
  return `
    <div class="form-grid">
      <label>专辑编码
        <input class="input" value="${album ? album.id : "保存后生成"}" readonly />
      </label>
      <label>专辑名称
        <input class="input" data-video-form="name" value="${escapeHtml(form.name)}" />
      </label>
      <label>语言
        <select class="input" data-video-form="lang">
          ${VIDEO_LANGS.map((lang) => `<option value="${lang}" ${form.lang === lang ? "selected" : ""}>${lang}</option>`).join("")}
        </select>
      </label>
      <label>短标题
        <input class="input" data-video-form="shortTitle" maxlength="50" value="${escapeHtml(form.shortTitle)}" />
      </label>
      <label>上线时间
        <input class="input" data-video-form="onAt" value="${escapeHtml(form.onAt)}" />
      </label>
      <label>年份
        <input class="input" data-video-form="year" maxlength="4" value="${escapeHtml(form.year)}" />
      </label>
      <label>总集数
        <input class="input" data-video-form="episodes" value="${escapeHtml(form.episodes)}" />
      </label>
      <label>总时长
        <input class="input" data-video-form="duration" value="${escapeHtml(form.duration)}" />
      </label>
      <label>地区
        <input class="input" data-video-form="region" maxlength="8" value="${escapeHtml(form.region)}" />
      </label>
      <label>内容分类
        <select class="input" data-video-form="category">
          ${VIDEO_CATS.map((c) => `<option value="${c}" ${form.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </label>
      <label>关联专辑
        <div class="task-prize-row">
          <input class="input" data-video-form="related" value="${escapeHtml(form.related)}" />
          <button type="button" class="btn" data-video-act="toast" data-msg="选择关联专辑为本页占位">选择</button>
        </div>
      </label>
      <label>标签
        <input class="input" value="${escapeHtml((form.tags || []).join("、"))}" data-video-form-tags />
      </label>
      <label>评分
        <input class="input" data-video-form="score" value="${escapeHtml(form.score)}" />
      </label>
      <label>总分
        <input class="input" data-video-form="totalScore" value="${escapeHtml(form.totalScore)}" />
      </label>
      <label class="span-2">看点
        <input class="input" data-video-form="highlight" maxlength="80" value="${escapeHtml(form.highlight)}" />
      </label>
      <label class="span-2">简介
        <textarea class="input" rows="5" data-video-form="intro" maxlength="200">${escapeHtml(form.intro)}</textarea>
      </label>
      <div>
        <div class="label">竖套图</div>
        <span class="video-cover portrait lg" style="--h:200"></span>
      </div>
      <div>
        <div class="label">横套图</div>
        <span class="video-cover landscape lg" style="--h:40"></span>
      </div>
      <label class="span-2">出品人/作者
        <div class="task-prize-row">
          <input class="input" data-video-form="author" value="${escapeHtml(form.author)}" />
          <button type="button" class="btn btn-primary" data-video-act="toast" data-msg="添加作者为本页占位">添加作者</button>
        </div>
      </label>
      <label>导演
        <input class="input" data-video-form="director" maxlength="50" value="${escapeHtml(form.director)}" />
      </label>
      <label>制片人
        <input class="input" data-video-form="producer" maxlength="50" value="${escapeHtml(form.producer)}" />
      </label>
      <label>摄制/制作人
        <input class="input" data-video-form="crew" maxlength="50" value="${escapeHtml(form.crew)}" />
      </label>
      <label>作曲
        <input class="input" data-video-form="composer" maxlength="50" value="${escapeHtml(form.composer)}" />
      </label>
      <label>演唱
        <input class="input" data-video-form="singer" maxlength="50" value="${escapeHtml(form.singer)}" />
      </label>
    </div>
  `;
}

function isEpisodeVideoFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  return type.indexOf("video/") === 0 || /\.(mp4|mov|avi|mkv|webm|m4v|flv|wmv|mpeg|mpg|ts)$/.test(name);
}

function pickBatchEpisodeVideos() {
  const drawer = videoState.drawer;
  if (!drawer || !drawer.album) {
    showToast("请先保存专辑后再上传分集", "error");
    return;
  }
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "video/*,.mp4,.mov,.avi,.mkv,.webm,.m4v,.flv,.wmv,.mpeg,.mpg,.ts";
  input.multiple = true;
  input.addEventListener("change", () => {
    const files = Array.prototype.slice.call(input.files || []).filter(isEpisodeVideoFile);
    if (!files.length) {
      showToast("请选择视频文件", "error");
      return;
    }
    if (!drawer.album.parts) drawer.album.parts = [];
    files.forEach((file) => {
      drawer.album.parts.push({
        id: Math.random().toString(16).slice(2, 18) + Date.now().toString(16).slice(-6),
        fee: "free",
        highlight: "未检测",
        preview: "",
        feeWay: "",
        status: "off",
        type: "正片",
        fileName: file.name,
      });
    });
    drawer.album.episodes = drawer.album.parts.length;
    drawer.dirty = true;
    showToast("已批量上传 " + files.length + " 个视频");
    renderApp();
  });
  input.click();
}

function renderVideoPartsTab(album) {
  if (!album) return `<div class="empty">请先保存专辑后再维护分集</div>`;
  const parts = album.parts || [];
  const sel = videoState.drawer.partSelected || [];
  return `
    <div class="video-parts-bar">
      <button type="button" class="btn" data-video-act="toast" data-msg="已提交高光检测（演示）">检测高光时刻</button>
      <button type="button" class="btn" data-video-act="toast" data-msg="分集已保存（演示）">保存</button>
      <button type="button" class="btn" data-video-act="part-shelf" data-to="off">批量下线</button>
      <button type="button" class="btn btn-primary" data-video-act="part-shelf" data-to="on">批量上线</button>
      <button type="button" class="btn" data-video-act="batch-upload">批量上传视频</button>
      <button type="button" class="btn" data-video-act="fee">资费调整</button>
      <button type="button" class="btn" data-video-act="tab" data-tab="parts">刷新</button>
    </div>
    <div class="table-card" style="overflow:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" data-video-act="part-all" ${parts.length && parts.every((p) => sel.includes(p.id)) ? "checked" : ""} /></th>
            <th>操作</th><th>资费状态</th><th>高光检测</th><th>试看时长 (s)</th><th>资费方式</th>
            <th>状态</th><th>分集横图</th><th>分集竖图</th><th>分集类型</th><th>分集编码</th>
          </tr>
        </thead>
        <tbody>
          ${
            parts.length
              ? parts
                  .map(
                    (p) => `
            <tr>
              <td><input type="checkbox" data-video-act="part-one" data-id="${p.id}" ${sel.includes(p.id) ? "checked" : ""} /></td>
              <td class="ops">
                <button type="button" class="link" data-video-act="toast" data-msg="预览为本页占位">预览</button>
                <button type="button" class="link" data-video-act="part-one-shelf" data-id="${p.id}">${p.status === "on" ? "下线" : "上线"}</button>
              </td>
              <td><span class="pill green">${videoFeeLabel(p.fee)}</span></td>
              <td>${escapeHtml(p.highlight)}</td>
              <td>${dash(p.preview)}</td>
              <td>${dash(p.feeWay)}</td>
              <td><span class="pill ${p.status === "on" ? "green" : "gray"}">${p.status === "on" ? "上线" : "下线"}</span></td>
              <td><button type="button" class="link" data-video-act="toast" data-msg="上传横图为本页占位">上传</button></td>
              <td><button type="button" class="link" data-video-act="toast" data-msg="上传竖图为本页占位">上传</button></td>
              <td>${escapeHtml(p.type)}</td>
              <td><code class="cell-code" style="margin:0">${p.id}</code></td>
            </tr>`,
                  )
                  .join("")
              : `<tr><td colspan="11"><div class="empty">暂无分集</div></td></tr>`
          }
        </tbody>
      </table>
      <div class="pager">共 ${parts.length} 条</div>
    </div>
  `;
}

function renderVideoSearchTab(form) {
  const s = form.search;
  const pane = videoState.drawer.searchPane || "basic";
  const album = videoState.drawer.album;
  return `
    <div class="video-search-head">
      <div>
        <h3 style="margin:0 0 4px">搜索推荐参数设置</h3>
        <p class="filter-hint" style="margin:0">根据当前内容信息生成标题、关键字和描述，支持一键填充后手动调整</p>
      </div>
      <div class="video-search-switch">
        <button type="button" class="btn${pane === "basic" ? " btn-primary" : ""}" data-video-act="search-pane" data-id="basic">基础设置</button>
        <button type="button" class="btn${pane === "adv" ? " btn-primary" : ""}" data-video-act="search-pane" data-id="adv">高级设置</button>
      </div>
    </div>
    <div class="form-sec">
      <div class="video-sec-title">一键填充 <button type="button" class="btn" data-video-act="fill-basic">一键填充</button></div>
      <label>标题 *
        <input class="input" data-video-search="title" maxlength="50" value="${escapeHtml(s.title)}" placeholder="请输入标题" />
      </label>
      <label>关键字 *
        <input class="input" data-video-search="keywords" maxlength="100" value="${escapeHtml(s.keywords)}" placeholder="请输入关键字" />
      </label>
      <label>概述 *
        <textarea class="input" rows="4" data-video-search="summary" maxlength="150" placeholder="请输入概述">${escapeHtml(s.summary)}</textarea>
      </label>
      ${
        pane === "basic"
          ? `
      <label class="span-2">剧情摘要
        <div class="task-prize-row">
          <textarea class="input" rows="2" data-video-search="plot">${escapeHtml(s.plot)}</textarea>
          <button type="button" class="btn" data-video-act="fill-plot">一键填充</button>
        </div>
      </label>
      <div>
        <div class="label">景点解析</div>
        <div class="muted" style="margin-bottom:6px">点击当前专辑标签可快速添加：${(form.tags || []).map((t) => `<button type="button" class="video-chip" data-video-act="add-kw" data-name="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join(" ")}</div>
      </div>
      <div>
        <div class="label">集数信息</div>
        <p class="filter-hint">根据专辑集数、免费集数和连载状态自动生成，不支持手动修改</p>
        <div class="video-metrics">
          <div class="metric on"><div class="muted">总集数</div><b>${album ? album.episodes : form.episodes || 0}</b></div>
          <div class="metric on"><div class="muted">免费集</div><b>1</b></div>
          <div class="metric on"><div class="muted">当前状态</div><b>${album ? album.serial : "连载中"}</b></div>
        </div>
      </div>`
          : ""
      }
      <div class="field-block">
        <span class="field-title"><span class="req">*</span>是否收录</span>
        <div class="radios">
          <label><input type="radio" name="videoIndex" data-video-search="index" value="forbid" ${s.index !== "allow" ? "checked" : ""} /> 禁止</label>
          <label><input type="radio" name="videoIndex" data-video-search="index" value="allow" ${s.index === "allow" ? "checked" : ""} /> 允许</label>
        </div>
      </div>
      <div class="drawer-foot" style="border:0;padding:12px 0">
        <button type="button" class="btn" data-video-act="close-drawer">取消</button>
        <button type="button" class="btn btn-primary" data-video-act="save-search">提交</button>
      </div>
    </div>
    <div class="form-sec">
      <div class="video-sec-title">GEO参数设置 <button type="button" class="btn" data-video-act="fill-geo">一键生成</button></div>
      <p class="filter-hint">常见问题无法系统补充，需人手创建。针对该视频常见问题的直接答案，便于AI快速提取</p>
      <label>标题 *
        <input class="input" data-video-search="geoTitle" maxlength="50" value="${escapeHtml(s.geoTitle)}" placeholder="核心关键词的标题（如电影名、主演、类型）" />
      </label>
      <label>关键字 *
        <input class="input" data-video-search="geoKeywords" maxlength="100" value="${escapeHtml(s.geoKeywords)}" placeholder="核心关键词和实体列表，包括演员、导演、角色、奖项…" />
      </label>
      <label>描述 *
        <textarea class="input" rows="3" data-video-search="geoDesc" maxlength="150" placeholder="详细描述视频内容，包含关键实体、情节要点、主题、背景信息，便于AI抽取答案">${escapeHtml(s.geoDesc)}</textarea>
      </label>
      <label>内容更新时间
        <input class="input" data-video-search="geoUpdated" value="${escapeHtml(s.geoUpdated)}" placeholder="内容最后更新时间，AI能判断内容时效" />
      </label>
      <label>内容类型 *
        <input class="input" data-video-search="geoType" maxlength="50" value="${escapeHtml(s.geoType)}" placeholder="内容类型（电影/电视剧/综艺/动漫），帮助AI分类" />
      </label>
      <label>内容题材
        <input class="input" data-video-search="geoGenre" value="${escapeHtml(s.geoGenre)}" placeholder="输入内容题材后按回车，支持英文或中文逗号分隔" />
      </label>
      <label>内容主题
        <input class="input" data-video-search="geoTheme" value="${escapeHtml(s.geoTheme)}" placeholder="输入内容主题后按回车，支持英文或中文逗号分隔" />
      </label>
      <label class="span-2">常见问题
        <div class="task-prize-row">
          <textarea class="input" rows="2" data-video-search="geoFaq" placeholder="常见问题无法系统补充，需人手创建。针对该视频常见问题的直接答案">${escapeHtml(s.geoFaq)}</textarea>
          <button type="button" class="btn" data-video-act="toast" data-msg="添加常见问题为本页占位">添加常见问题</button>
        </div>
      </label>
      <div class="drawer-foot" style="border:0;padding:12px 0">
        <button type="button" class="btn" data-video-act="close-drawer">取消</button>
        <button type="button" class="btn btn-primary" data-video-act="save-search">提交</button>
      </div>
    </div>
  `;
}

function renderVideoFeeModal() {
  const modal = videoState.feeModal;
  if (!modal) return "";
  const paid = modal.type === "paid";
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">资费调整<button type="button" class="icon-x" data-video-act="close-fee">×</button></div>
        <div class="dialog-body">
          <div class="video-fee-picks">
            <button type="button" class="video-fee-pick${modal.type === "free" ? " on" : ""}" data-video-act="fee-type" data-id="free">免费</button>
            <button type="button" class="video-fee-pick${paid ? " on" : ""}" data-video-act="fee-type" data-id="paid">付费</button>
          </div>
          ${
            paid
              ? `
            <div class="label" style="margin-top:12px">免费试看设置</div>
            <div class="video-range" style="margin:8px 0">
              前 <input class="input narrow" data-video-fee="freeEps" value="${escapeHtml(modal.freeEps)}" /> 集免费试看，付费起始第
              <input class="input narrow" data-video-fee="previewSec" value="${escapeHtml(modal.previewSec)}" /> 秒试看
            </div>
            <label>资费形式
              <select class="input" data-video-fee="form">
                <option value="member" ${modal.form === "member" ? "selected" : ""}>会员专辑</option>
                <option value="all" ${modal.form === "all" ? "selected" : ""}>全部会员</option>
              </select>
            </label>
            <label>支持会员类型
              <select class="input" data-video-fee="member">
                <option value="all" ${modal.member === "all" ? "selected" : ""}>全部会员</option>
                <option value="list" ${modal.member === "list" ? "selected" : ""}>指定会员包列表</option>
              </select>
            </label>`
              : ""
          }
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-video-act="close-fee">取消</button>
          <button type="button" class="btn btn-primary" data-video-act="fee-ok">确定</button>
        </div>
      </div>
    </div>
  `;
}

function openVideoDrawer(album, tab) {
  videoState.drawer = {
    album,
    tab: tab || "info",
    form: album
      ? formFromAlbum(album)
      : {
          name: "",
          lang: "国语",
          shortTitle: "",
          onAt: "",
          year: "",
          episodes: "1",
          duration: "0",
          region: "",
          category: "短剧",
          related: "",
          tags: [],
          score: "",
          totalScore: "100",
          highlight: "",
          intro: "",
          author: "",
          director: "",
          producer: "",
          crew: "",
          composer: "",
          singer: "",
          search: blankSearchRec(),
        },
    dirty: false,
    partSelected: [],
    searchPane: "basic",
  };
}

function closeVideoDrawer(force) {
  if (!force && isVideoDirty()) {
    confirmLeaveIfDirty(() => {
      videoState.drawer = null;
      renderApp();
    });
    return;
  }
  videoState.drawer = null;
  renderApp();
}

function saveVideoInfo() {
  const drawer = videoState.drawer;
  if (!drawer) return;
  const form = drawer.form;
  if (!(form.name || "").trim()) {
    showToast("请填写专辑名称", "error");
    return;
  }
  if (!drawer.album) {
    const album = {
      id: Math.random().toString(16).slice(2, 26),
      name: form.name.trim(),
      lang: form.lang,
      fee: "free",
      feeForm: "",
      memberType: "",
      category: form.category,
      serial: "连载中",
      score: form.score || "0",
      totalScore: form.totalScore || "100",
      author: form.author,
      tags: form.tags || [],
      tagGroup: "",
      inAt: "刚刚",
      updatedAt: "刚刚",
      onAt: form.onAt,
      onAtFull: form.onAt,
      offAt: "",
      status: "off",
      episodes: Number(form.episodes) || 1,
      latest: 0,
      onBy: "",
      offBy: "",
      year: form.year,
      duration: form.duration,
      region: form.region,
      related: form.related,
      highlight: form.highlight,
      intro: form.intro,
      director: form.director,
      producer: form.producer,
      crew: form.crew,
      composer: form.composer,
      singer: form.singer,
      search: form.search,
      parts: [],
    };
    videoState.albums.unshift(album);
    drawer.album = album;
  } else {
    Object.assign(drawer.album, {
      name: form.name.trim(),
      lang: form.lang,
      category: form.category,
      score: form.score,
      totalScore: form.totalScore,
      author: form.author,
      tags: form.tags || [],
      onAt: form.onAt,
      year: form.year,
      episodes: Number(form.episodes) || drawer.album.episodes,
      duration: form.duration,
      region: form.region,
      related: form.related,
      highlight: form.highlight,
      intro: form.intro,
      director: form.director,
      producer: form.producer,
      crew: form.crew,
      composer: form.composer,
      singer: form.singer,
      updatedAt: "刚刚",
    });
  }
  drawer.dirty = false;
  showToast("已保存内容信息");
  renderApp();
}

function onVideoClick(e) {
  const btn = e.target.closest("[data-video-act]");
  if (!btn) return;
  const act = btn.dataset.videoAct;
  if ((act === "toggle-all" || act === "toggle-one" || act === "part-all" || act === "part-one") && e.type !== "change") return;
  if (act === "reset") {
    videoState.filterDraft = blankVideoFilters();
    videoState.filters = blankVideoFilters();
    videoState.pickedTags = [];
    renderApp();
  } else if (act === "search") {
    videoState.filters = clone(videoState.filterDraft);
    renderApp();
  } else if (act === "toggle-filter") {
    videoState.filterCollapsed = !videoState.filterCollapsed;
    renderApp();
  } else if (act === "toast") showToast(btn.dataset.msg || "操作成功");
  else if (act === "toggle-all") {
    const rows = filteredVideoAlbums();
    videoState.selected = btn.checked ? rows.map((item) => item.id) : [];
    renderApp();
  } else if (act === "toggle-one") {
    const set = new Set(videoState.selected);
    if (btn.checked) set.add(btn.dataset.id);
    else set.delete(btn.dataset.id);
    videoState.selected = [...set];
  } else if (act === "view") {
    openVideoDrawer(videoAlbumById(btn.dataset.id), "info");
    renderApp();
  } else if (act === "create") {
    openVideoDrawer(null, "info");
    renderApp();
  } else if (act === "update-sel") {
    if (!videoState.selected.length) {
      showToast("请先勾选专辑", "error");
      return;
    }
    openVideoDrawer(videoAlbumById(videoState.selected[0]), "info");
    renderApp();
  } else if (act === "shelf") {
    if (!videoState.selected.length) {
      showToast("请先勾选专辑", "error");
      return;
    }
    videoState.albums.forEach((item) => {
      if (videoState.selected.includes(item.id)) {
        item.status = btn.dataset.to;
        if (btn.dataset.to === "on") item.onBy = "运营小王";
        else item.offBy = "运营小王";
      }
    });
    showToast(btn.dataset.to === "on" ? "已上架" : "已下架");
    renderApp();
  } else if (act === "fee") {
    if (!videoState.selected.length && !(videoState.drawer && videoState.drawer.album)) {
      showToast("请先勾选专辑", "error");
      return;
    }
    videoState.feeModal = { type: "", freeEps: "0", previewSec: "0", form: "member", member: "all" };
    renderApp();
  } else if (act === "pick-tag") {
    const set = new Set(videoState.pickedTags);
    if (set.has(btn.dataset.name)) set.delete(btn.dataset.name);
    else set.add(btn.dataset.name);
    videoState.pickedTags = [...set];
    renderApp();
  } else if (act === "clear-tags") {
    videoState.pickedTags = [];
    renderApp();
  } else if (act === "pick-cat") {
    videoState.filterDraft.tag = btn.dataset.name;
    videoState.filterDraft.category = btn.dataset.name;
    videoState.filters = clone(videoState.filterDraft);
    renderApp();
  } else if (act === "pick-group") {
    videoState.groupId = btn.dataset.id;
    videoState.subFilter = "";
    renderApp();
  } else if (act === "sub-filter") {
    videoState.subFilter = btn.dataset.id;
    renderApp();
  } else if (act === "tag-mode") {
    videoState.tagMode = btn.value;
    renderApp();
  }
}

function onVideoOverlayClick(e) {
  const btn = e.target.closest("[data-video-act]");
  if (!btn) {
    if (e.target.classList && e.target.classList.contains("mask") && !e.target.closest(".drawer") && !e.target.closest(".dialog")) {
      if (videoState.feeModal) {
        videoState.feeModal = null;
        renderApp();
      } else closeVideoDrawer();
    }
    return;
  }
  const act = btn.dataset.videoAct;
  if (act === "close-drawer") closeVideoDrawer();
  else if (act === "tab") {
    if (videoState.drawer) videoState.drawer.tab = btn.dataset.tab;
    renderApp();
  } else if (act === "save-info") saveVideoInfo();
  else if (act === "toast") showToast(btn.dataset.msg || "操作成功");
  else if (act === "part-all") {
    const parts = (videoState.drawer.album && videoState.drawer.album.parts) || [];
    videoState.drawer.partSelected = btn.checked ? parts.map((p) => p.id) : [];
    renderApp();
  } else if (act === "part-one") {
    const set = new Set(videoState.drawer.partSelected || []);
    if (btn.checked) set.add(btn.dataset.id);
    else set.delete(btn.dataset.id);
    videoState.drawer.partSelected = [...set];
  } else if (act === "part-shelf") {
    const album = videoState.drawer.album;
    const ids = videoState.drawer.partSelected || [];
    if (!ids.length) {
      showToast("请先勾选分集", "error");
      return;
    }
    (album.parts || []).forEach((p) => {
      if (ids.includes(p.id)) p.status = btn.dataset.to;
    });
    showToast(btn.dataset.to === "on" ? "已批量上线" : "已批量下线");
    renderApp();
  } else if (act === "part-one-shelf") {
    const p = (videoState.drawer.album.parts || []).find((item) => item.id === btn.dataset.id);
    if (p) p.status = p.status === "on" ? "off" : "on";
    renderApp();
  } else if (act === "batch-upload") {
    pickBatchEpisodeVideos();
  } else if (act === "search-pane") {
    videoState.drawer.searchPane = btn.dataset.id;
    renderApp();
  } else if (act === "fill-basic") {
    const album = videoState.drawer.album;
    const s = videoState.drawer.form.search;
    s.title = album ? album.name : videoState.drawer.form.name;
    s.keywords = (videoState.drawer.form.tags || []).join("、");
    s.summary = (videoState.drawer.form.intro || "").slice(0, 150);
    videoState.drawer.dirty = true;
    renderApp();
  } else if (act === "fill-plot") {
    videoState.drawer.form.search.plot = (videoState.drawer.form.intro || "").slice(0, 80);
    videoState.drawer.dirty = true;
    renderApp();
  } else if (act === "fill-geo") {
    const s = videoState.drawer.form.search;
    const album = videoState.drawer.album;
    s.geoTitle = album ? album.name : "";
    s.geoKeywords = (videoState.drawer.form.tags || []).join("、");
    s.geoDesc = (videoState.drawer.form.intro || "").slice(0, 150);
    s.geoType = "短剧";
    videoState.drawer.dirty = true;
    renderApp();
  } else if (act === "add-kw") {
    const s = videoState.drawer.form.search;
    const cur = s.keywords ? s.keywords.split(/[、,]/) : [];
    if (!cur.includes(btn.dataset.name)) cur.push(btn.dataset.name);
    s.keywords = cur.filter(Boolean).join("、");
    videoState.drawer.dirty = true;
    renderApp();
  } else if (act === "save-search") {
    if (videoState.drawer.album) videoState.drawer.album.search = clone(videoState.drawer.form.search);
    videoState.drawer.dirty = false;
    showToast("搜索推荐参数已提交");
    renderApp();
  } else if (act === "fee") {
    videoState.feeModal = { type: "", freeEps: "0", previewSec: "0", form: "member", member: "all" };
    renderApp();
  } else if (act === "close-fee") {
    videoState.feeModal = null;
    renderApp();
  } else if (act === "fee-type") {
    videoState.feeModal.type = btn.dataset.id;
    renderApp();
  } else if (act === "fee-ok") {
    if (!videoState.feeModal.type) {
      showToast("请选择免费或付费", "error");
      return;
    }
    const ids = videoState.selected.length ? videoState.selected : videoState.drawer && videoState.drawer.album ? [videoState.drawer.album.id] : [];
    videoState.albums.forEach((item) => {
      if (ids.includes(item.id)) {
        item.fee = videoState.feeModal.type;
        item.feeForm = videoState.feeModal.type === "paid" ? (videoState.feeModal.form === "member" ? "会员专辑" : "全部会员") : "";
        item.memberType = videoState.feeModal.type === "paid" ? (videoState.feeModal.member === "all" ? "全部会员" : "指定会员包") : "";
      }
    });
    videoState.feeModal = null;
    showToast("资费已调整");
    renderApp();
  }
}

function bindVideoOverlays() {
  const overlay = document.getElementById("overlay-root");
  overlay.innerHTML = renderVideoDrawer() + renderVideoFeeModal();
  const hasOverlay = Boolean(overlay.querySelector(".mask") || document.getElementById("confirm-modal"));
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.videoBound) {
    overlay.dataset.videoBound = "1";
    overlay.addEventListener("click", onVideoOverlayClick);
    overlay.addEventListener("change", (e) => {
      if (e.target.closest("[data-video-act]")) onVideoOverlayClick(e);
      const fee = e.target.closest("[data-video-fee]");
      if (fee && videoState.feeModal) videoState.feeModal[fee.dataset.videoFee] = fee.value;
    });
  }
  overlay.querySelectorAll("[data-video-form]").forEach((el) => {
    const sync = () => {
      if (!videoState.drawer) return;
      videoState.drawer.form[el.dataset.videoForm] = el.value;
      videoState.drawer.dirty = true;
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
  overlay.querySelectorAll("[data-video-search]").forEach((el) => {
    const sync = () => {
      if (!videoState.drawer) return;
      videoState.drawer.form.search[el.dataset.videoSearch] = el.value;
      videoState.drawer.dirty = true;
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
  const tagInput = overlay.querySelector("[data-video-form-tags]");
  if (tagInput) {
    tagInput.addEventListener("change", () => {
      videoState.drawer.form.tags = tagInput.value.split(/[、,，\s]+/).filter(Boolean);
      videoState.drawer.dirty = true;
    });
  }
}

function mountVideoPage(main) {
  if (!main.dataset.videoBound) {
    main.dataset.videoBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "video") return;
      onVideoClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "video") return;
      const filter = e.target.closest("[data-video-filter]");
      if (filter) videoState.filterDraft[filter.dataset.videoFilter] = filter.value;
      const act = e.target.closest("[data-video-act]");
      if (act) onVideoClick(e);
    });
  }
  main.innerHTML = renderVideoPage();
  bindVideoOverlays();
}

const TASK_TYPES = [
  { key: "week", label: "周任务", hint: "每周刷新任务进度" },
  { key: "day", label: "日任务", hint: "每日刷新任务进度" },
  { key: "advance", label: "进阶任务", hint: "每个账号的每个进阶任务只能完成一次" },
];

const TASK_GOALS = [
  { key: "post_publish", label: "发布内容", unit: "条" },
  { key: "read_novel", label: "看小说", unit: "章" },
  { key: "watch_video", label: "看视频", unit: "次" },
];

const TASK_PRIZES = [
  { id: "currency", name: "金币", code: "currency" },
  { id: "point", name: "积分", code: "point" },
  { id: "vip", name: "会员天数", code: "vip" },
];

function emptyTaskFilters() {
  return { goal: "", status: "", prizeId: "", type: "" };
}

const taskState = {
  filters: emptyTaskFilters(),
  filterDraft: emptyTaskFilters(),
  prizePicker: false,
  packPicker: false,
  modal: null,
  tasks: [
    {
      id: "6a92ac70762b2c4032aa118c",
      name: "哈哈哈哈-测试_副本_副本",
      goal: "post_publish",
      target: "1",
      link: "www.baidu.com",
      prizeId: "currency",
      reward: "1",
      strategy: "daily",
      type: "day",
      audience: ["pack_unpaid"],
      delay: false,
      online: false,
      operator: "管理员",
      updatedAt: "2026-08-29 17:54:56",
    },
    {
      id: "6a92ac14962b2c4032aa119b",
      name: "哈哈哈哈-测试_副本",
      goal: "post_publish",
      target: "1",
      link: "www.baidu.com",
      prizeId: "currency",
      reward: "1",
      strategy: "daily",
      type: "day",
      audience: ["pack_unpaid"],
      delay: false,
      online: false,
      operator: "管理员",
      updatedAt: "2026-08-29 17:54:48",
    },
    {
      id: "6a9157ddb0a5c71a4e1454d0",
      name: "哈哈哈哈-测试_副本",
      goal: "post_publish",
      target: "1",
      link: "www.baidu.com",
      prizeId: "currency",
      reward: "1",
      strategy: "daily",
      type: "day",
      audience: ["pack_unpaid"],
      delay: false,
      online: false,
      operator: "管理员",
      updatedAt: "2026-08-28 17:43:39",
    },
    {
      id: "6a9127ae787cc00678be0b93",
      name: "哈哈哈哈-测试_副本",
      goal: "post_publish",
      target: "1",
      link: "www.baidu.com",
      prizeId: "currency",
      reward: "1",
      strategy: "daily",
      type: "day",
      audience: ["pack_unpaid"],
      delay: false,
      online: false,
      operator: "管理员",
      updatedAt: "2026-08-28 14:16:14",
    },
    {
      id: "6a91be4c787cc006785ebad",
      name: "测试0826_副本_副本",
      goal: "read_novel",
      target: "3",
      link: "https://funhub-web-test.guodofun/novel/2365129888901767776",
      prizeId: "currency",
      reward: "1",
      strategy: "daily",
      type: "advance",
      audience: ["pack_new_day"],
      delay: true,
      online: false,
      operator: "管理员",
      updatedAt: "2026-08-28 14:07:16",
    },
  ],
};

function isTaskDirty() {
  return Boolean(taskState.modal && taskState.modal.mode !== "view" && taskState.modal.dirty);
}

function taskGoalByKey(key) {
  return TASK_GOALS.find((item) => item.key === key) || { key, label: key, unit: "次" };
}

function taskTypeByKey(key) {
  return TASK_TYPES.find((item) => item.key === key) || { key, label: key, hint: "" };
}

function taskAudienceText(ids) {
  const names = (ids || [])
    .map((id) => (typeof packById === "function" ? packById(id) : null))
    .filter(Boolean)
    .map((pack) => pack.name);
  return names.length ? names.join("、") : "未限定人群";
}

function taskPrizeById(id) {
  return TASK_PRIZES.find((item) => item.id === id);
}

function taskPrizeText(id) {
  const prize = taskPrizeById(id);
  return prize ? prize.name : "—";
}

function taskStrategyLabel(value) {
  return value === "once" ? "仅1次" : "每日1次";
}

function blankTaskForm() {
  return {
    name: "",
    goal: "",
    target: "",
    link: "",
    prizeId: "",
    reward: "1",
    strategy: "once",
    type: "",
    audience: [],
    delay: false,
  };
}

function formFromTask(task) {
  return {
    name: task.name,
    goal: task.goal,
    target: String(task.target),
    link: task.link,
    prizeId: task.prizeId,
    reward: String(task.reward),
    strategy: task.strategy,
    type: task.type || "",
    audience: clone(task.audience || []),
    delay: Boolean(task.delay),
  };
}

function filteredTasks() {
  const f = taskState.filters;
  return taskState.tasks.filter((item) => {
    if (f.goal && item.goal !== f.goal) return false;
    if (f.type && item.type !== f.type) return false;
    if (f.prizeId && item.prizeId !== f.prizeId) return false;
    if (f.status === "online" && !item.online) return false;
    if (f.status === "offline" && item.online) return false;
    return true;
  });
}

function renderTaskPage() {
  const d = taskState.filterDraft;
  const rows = filteredTasks();
  const table = rows.length
    ? `<table class="data-table">
        <thead>
          <tr>
            <th>任务id</th>
            <th>任务名称</th>
            <th>任务类型</th>
            <th>任务受众</th>
            <th>任务延期</th>
            <th>行为目标</th>
            <th>目标数值</th>
            <th>任务跳转链接</th>
            <th>关联奖品</th>
            <th>奖励数量</th>
            <th>展示策略</th>
            <th>上下线</th>
            <th>操作人</th>
            <th>修改时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((task) => {
              const goal = taskGoalByKey(task.goal);
              return `
            <tr>
              <td><code class="cell-code" style="margin:0">${task.id}</code></td>
              <td>${escapeHtml(task.name)}</td>
              <td>${escapeHtml(taskTypeByKey(task.type).label)}</td>
              <td>${escapeHtml(taskAudienceText(task.audience))}</td>
              <td>${task.delay ? "是" : "否"}</td>
              <td>${escapeHtml(goal.label)}</td>
              <td>${escapeHtml(task.target)} ${goal.unit}</td>
              <td class="task-link">${escapeHtml(task.link)}</td>
              <td>${escapeHtml(taskPrizeText(task.prizeId))}</td>
              <td>${escapeHtml(task.reward)}</td>
              <td>${taskStrategyLabel(task.strategy)}</td>
              <td>
                <label class="enable-switch ${task.online ? "on" : ""}">
                  <input type="checkbox" data-task-act="toggle" data-id="${task.id}" ${task.online ? "checked" : ""} />
                  <span class="enable-track"></span>
                  <span class="enable-text">${task.online ? "上线" : "下线"}</span>
                </label>
              </td>
              <td>${escapeHtml(task.operator)}</td>
              <td>${escapeHtml(task.updatedAt)}</td>
              <td class="ops">
                <button type="button" class="link" data-task-act="view" data-id="${task.id}">查看</button>
                <button type="button" class="link" data-task-act="copy" data-id="${task.id}">复制</button>
                <button type="button" class="link" data-task-act="edit" data-id="${task.id}">编辑</button>
                <button type="button" class="link danger" data-task-act="delete" data-id="${task.id}">删除</button>
              </td>
            </tr>`;
            })
            .join("")}
        </tbody>
      </table>
      <div class="pager">共 ${rows.length} 条</div>`
    : `<div class="empty">暂无任务</div>`;

  return `
    <header class="topbar">
      <div class="crumb">
        <span>增长运营</span>
        <span class="sep">/</span>
        <span class="current">任务管理</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="filter-bar">
        <label class="task-filter">状态
          <select class="input" data-task-filter="status">
            <option value="" ${d.status === "" ? "selected" : ""}>全部</option>
            <option value="online" ${d.status === "online" ? "selected" : ""}>上线</option>
            <option value="offline" ${d.status === "offline" ? "selected" : ""}>下线</option>
          </select>
        </label>
        <label class="task-filter">任务类型
          <select class="input" data-task-filter="type">
            <option value="">全部</option>
            ${TASK_TYPES.map(
              (item) =>
                `<option value="${item.key}" ${d.type === item.key ? "selected" : ""}>${item.label}</option>`,
            ).join("")}
          </select>
        </label>
        <label class="task-filter">奖品类型
          <select class="input" data-task-filter="prizeId">
            <option value="">全部</option>
            ${TASK_PRIZES.map(
              (item) =>
                `<option value="${item.id}" ${d.prizeId === item.id ? "selected" : ""}>${item.name}</option>`,
            ).join("")}
          </select>
        </label>
        <label class="task-filter">行为目标
          <select class="input" data-task-filter="goal">
            <option value="">全部</option>
            ${TASK_GOALS.map(
              (item) =>
                `<option value="${item.key}" ${d.goal === item.key ? "selected" : ""}>${item.label}</option>`,
            ).join("")}
          </select>
        </label>
        <button type="button" class="btn" data-task-act="reset">重置</button>
        <button type="button" class="btn btn-primary" data-task-act="search">搜索</button>
        <span class="task-toolbar-spacer"></span>
        <button type="button" class="btn btn-primary" data-task-act="create">添加任务</button>
      </div>
      <div class="table-card">${table}</div>
    </div>
  `;
}

function renderTaskViewModal() {
  const modal = taskState.modal;
  if (!modal || modal.mode !== "view") return "";
  const task = modal.task;
  const goal = taskGoalByKey(task.goal);
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">任务详情<button type="button" class="icon-x" data-task-act="close-modal">×</button></div>
        <div class="dialog-body">
          <div class="task-detail">
            <p><span>任务名称：</span>${escapeHtml(task.name)}</p>
            <p><span>任务类型：</span>${escapeHtml(taskTypeByKey(task.type).label)}</p>
            <p><span>任务受众：</span>${escapeHtml(taskAudienceText(task.audience))}</p>
            <p><span>任务延期：</span>${task.delay ? "是" : "否"}</p>
            <p><span>行为目标：</span>${escapeHtml(goal.label)} (${goal.key})</p>
            <p><span>目标数值：</span>${escapeHtml(task.target)} ${goal.unit}</p>
            <p><span>关联奖品：</span>${escapeHtml(taskPrizeText(task.prizeId))}</p>
            <p><span>奖励数量：</span>${escapeHtml(task.reward)}</p>
            <p><span>展示策略：</span>${taskStrategyLabel(task.strategy)}</p>
            <p><span>任务跳转链接：</span>${escapeHtml(task.link)}</p>
            <p><span>状态：</span>${task.online ? "上线" : "下线"}</p>
          </div>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-task-act="close-modal">关闭</button>
        </div>
      </div>
    </div>
  `;
}

function renderTaskFormModal() {
  const modal = taskState.modal;
  if (!modal || (modal.mode !== "create" && modal.mode !== "edit")) return "";
  const form = modal.form;
  const goal = form.goal ? taskGoalByKey(form.goal) : null;
  const prize = form.prizeId ? taskPrizeText(form.prizeId) : "";
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">${modal.mode === "edit" ? "编辑" : "新增"}<button type="button" class="icon-x" data-task-act="close-modal">×</button></div>
        <div class="dialog-body">
          <div class="task-form">
            <label>
              <span class="field-title"><span class="req">*</span>任务名称</span>
              <input class="input" data-task-form="name" value="${escapeHtml(form.name)}" placeholder="请输入任务名称" />
            </label>
            <label>
              <span class="field-title"><span class="req">*</span>任务类型</span>
              <select class="input" data-task-form="type">
                <option value="">请选择</option>
                ${TASK_TYPES.map(
                  (item) =>
                    `<option value="${item.key}" ${form.type === item.key ? "selected" : ""}>${item.label}</option>`,
                ).join("")}
              </select>
              ${form.type ? `<span class="field-hint">${escapeHtml(taskTypeByKey(form.type).hint)}</span>` : ""}
            </label>
            <div class="field-block">
              <span class="field-title"><span class="req">*</span>任务受众</span>
              <div class="task-prize-row">
                <input class="input" readonly value="${escapeHtml(form.audience && form.audience.length ? taskAudienceText(form.audience) : "")}" placeholder="请选择人群（来自用户圈选）" />
                <button type="button" class="btn" data-task-act="open-pack">选择</button>
                <button type="button" class="btn" data-task-act="goto-segment">查看/编辑人群</button>
              </div>
            </div>
            <div class="field-block">
              <span class="field-title">任务延期</span>
              <label class="enable-switch ${form.delay ? "on" : ""}">
                <input type="checkbox" data-task-form="delay" ${form.delay ? "checked" : ""} />
                <span class="enable-track"></span>
                <span class="enable-text">${form.delay ? "是" : "否"}</span>
              </label>
              <span class="field-hint">开启后表示用户已经开始任务但是任务/活动已到期时，用户可继续完成任务获得对应奖励。</span>
            </div>
            <label>
              <span class="field-title"><span class="req">*</span>行为目标</span>
              <select class="input" data-task-form="goal">
                <option value="">请选择</option>
                ${TASK_GOALS.map(
                  (item) =>
                    `<option value="${item.key}" ${form.goal === item.key ? "selected" : ""}>${item.label} (${item.key})</option>`,
                ).join("")}
              </select>
            </label>
            <label>
              <span class="field-title"><span class="req">*</span>目标数值</span>
              <div class="task-target-row">
                <input class="input" data-task-form="target" value="${escapeHtml(form.target)}" placeholder="请输入" />
                <span class="task-unit">${goal ? goal.unit : "次"}</span>
              </div>
            </label>
            <label>
              <span class="field-title"><span class="req">*</span>任务跳转链接</span>
              <input class="input" data-task-form="link" value="${escapeHtml(form.link)}" placeholder="请输入用户点击任务跳转的地址" />
            </label>
            <label>
              <span class="field-title"><span class="req">*</span>关联奖品</span>
              <div class="task-prize-row">
                <input class="input" readonly value="${escapeHtml(prize)}" placeholder="请选择奖品" />
                <button type="button" class="btn" data-task-act="open-prize">选择</button>
              </div>
            </label>
            <label>
              <span class="field-title"><span class="req">*</span>奖励数量</span>
              <input class="input" data-task-form="reward" value="${escapeHtml(form.reward)}" />
            </label>
            <div class="field-block">
              <span class="field-title"><span class="req">*</span>展示策略</span>
              <div class="radios">
                <label><input type="radio" name="taskStrategy" data-task-form="strategy" value="once" ${form.strategy === "once" ? "checked" : ""} /> 仅1次</label>
                <label><input type="radio" name="taskStrategy" data-task-form="strategy" value="daily" ${form.strategy === "daily" ? "checked" : ""} /> 每日1次</label>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn" data-task-act="reset-form">重置</button>
          <button type="button" class="btn btn-primary" data-task-act="save">提交</button>
        </div>
      </div>
    </div>
  `;
}

function renderTaskPrizePicker() {
  if (!taskState.prizePicker || !taskState.modal || !taskState.modal.form) return "";
  const selected = taskState.modal.form.prizeId;
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">选择奖品</div>
        <div class="dialog-body">
          ${TASK_PRIZES.map(
            (item) => `
            <label class="tag-option">
              <input type="radio" name="taskPrize" data-task-act="pick-prize" data-id="${item.id}" ${selected === item.id ? "checked" : ""} />
              <span>${escapeHtml(item.name)}</span>
            </label>
          `,
          ).join("")}
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn btn-primary" data-task-act="close-prize">完成</button>
        </div>
      </div>
    </div>
  `;
}

function renderTaskPackPicker() {
  if (!taskState.packPicker || !taskState.modal || !taskState.modal.form) return "";
  const selected = new Set(taskState.modal.form.audience || []);
  const packs = (typeof segmentState !== "undefined" && segmentState.packs) || [];
  return `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-title">选择人群</div>
        <div class="dialog-body">
          <p class="filter-hint">选项来自用户圈选中的人群包。</p>
          ${
            packs.length
              ? packs
                  .map(
                    (pack) => `
            <label class="tag-option">
              <input type="checkbox" data-task-act="toggle-pack" data-id="${pack.id}" ${selected.has(pack.id) ? "checked" : ""} />
              <span>${escapeHtml(pack.name)}</span>
            </label>`,
                  )
                  .join("")
              : '<div class="empty-inline">还没有人群包，请先去用户圈选新建</div>'
          }
        </div>
        <div class="dialog-foot">
          <button type="button" class="btn btn-primary" data-task-act="close-pack">完成</button>
        </div>
      </div>
    </div>
  `;
}

function closeTaskModal(force) {
  if (!force && isTaskDirty()) {
    confirmLeaveIfDirty(() => {
      taskState.modal = null;
      taskState.prizePicker = false;
      taskState.packPicker = false;
      renderApp();
    });
    return;
  }
  taskState.modal = null;
  taskState.prizePicker = false;
  taskState.packPicker = false;
  renderApp();
}

function saveTask() {
  const modal = taskState.modal;
  if (!modal || !modal.form) return;
  const form = modal.form;
  if (!form.name.trim() || !form.type || !form.goal || !String(form.target).trim() || !form.link.trim() || !form.prizeId || !String(form.reward).trim()) {
    showToast("请完善必填项", "error");
    return;
  }
  const payload = {
    name: form.name.trim(),
    type: form.type,
    audience: form.audience || [],
    delay: Boolean(form.delay),
    goal: form.goal,
    target: String(form.target).trim(),
    link: form.link.trim(),
    prizeId: form.prizeId,
    reward: String(form.reward).trim(),
    strategy: form.strategy || "once",
    operator: "运营小王",
    updatedAt: "刚刚",
  };
  if (modal.mode === "create") {
    taskState.tasks.unshift({
      id: Math.random().toString(16).slice(2, 26),
      online: false,
      ...payload,
    });
    showToast("已创建任务");
  } else {
    Object.assign(modal.task, payload);
    showToast("已保存任务");
  }
  taskState.modal = null;
  taskState.prizePicker = false;
  taskState.packPicker = false;
  renderApp();
}

function onTaskClick(e) {
  const btn = e.target.closest("[data-task-act]");
  if (!btn) return;
  const act = btn.dataset.taskAct;
  const id = btn.dataset.id;
  if (act === "toggle") {
    if (e.type !== "change") return;
    const task = taskState.tasks.find((item) => item.id === id);
    if (!task) return;
    task.online = btn.checked;
    task.updatedAt = "刚刚";
    renderApp();
    return;
  }
  if (act === "create") {
    taskState.modal = { mode: "create", form: blankTaskForm(), dirty: false };
    renderApp();
  } else if (act === "reset") {
    taskState.filters = emptyTaskFilters();
    taskState.filterDraft = emptyTaskFilters();
    renderApp();
  } else if (act === "search") {
    taskState.filters = clone(taskState.filterDraft);
    renderApp();
  } else if (act === "view") {
    const task = taskState.tasks.find((item) => item.id === id);
    taskState.modal = { mode: "view", task, dirty: false };
    renderApp();
  } else if (act === "edit") {
    const task = taskState.tasks.find((item) => item.id === id);
    taskState.modal = { mode: "edit", task, form: formFromTask(task), dirty: false };
    renderApp();
  } else if (act === "copy") {
    const task = taskState.tasks.find((item) => item.id === id);
    if (!task) return;
    const copy = clone(task);
    copy.id = Math.random().toString(16).slice(2, 26);
    copy.name = `${task.name}_副本`;
    copy.online = false;
    copy.updatedAt = "刚刚";
    const index = taskState.tasks.findIndex((item) => item.id === id);
    taskState.tasks.splice(index + 1, 0, copy);
    showToast("已复制任务");
    renderApp();
  } else if (act === "delete") {
    showConfirm({
      title: "删除任务",
      text: "确认删除该任务？删除后不可恢复。",
      okText: "删除",
      danger: true,
      onOk: () => {
        taskState.tasks = taskState.tasks.filter((item) => item.id !== id);
        showToast("已删除");
        renderApp();
      },
    });
  }
}

function onTaskOverlayClick(e) {
  const mask = e.target.classList && e.target.classList.contains("mask") ? e.target : null;
  if (mask && !e.target.closest(".dialog")) {
    if (taskState.prizePicker) {
      taskState.prizePicker = false;
      renderApp();
      return;
    }
    if (taskState.packPicker) {
      taskState.packPicker = false;
      renderApp();
      return;
    }
    closeTaskModal();
    return;
  }
  const btn = e.target.closest("[data-task-act]");
  if (!btn) return;
  const act = btn.dataset.taskAct;
  if (act === "close-modal") closeTaskModal();
  else if (act === "save") saveTask();
  else if (act === "reset-form") {
    const modal = taskState.modal;
    if (!modal) return;
    modal.form = modal.mode === "edit" && modal.task ? formFromTask(modal.task) : blankTaskForm();
    modal.dirty = false;
    renderApp();
  } else if (act === "open-prize") {
    taskState.prizePicker = true;
    renderApp();
  } else if (act === "close-prize") {
    taskState.prizePicker = false;
    renderApp();
  } else if (act === "pick-prize") {
    if (!taskState.modal) return;
    taskState.modal.form.prizeId = btn.dataset.id;
    taskState.modal.dirty = true;
  } else if (act === "open-pack") {
    taskState.packPicker = true;
    renderApp();
  } else if (act === "close-pack") {
    taskState.packPicker = false;
    renderApp();
  } else if (act === "toggle-pack") {
    const form = taskState.modal && taskState.modal.form;
    if (!form) return;
    const set = new Set(form.audience || []);
    if (btn.checked) set.add(btn.dataset.id);
    else set.delete(btn.dataset.id);
    form.audience = [...set];
    form.dirty = true;
    taskState.modal.dirty = true;
  } else if (act === "goto-segment") {
    const packs = (taskState.modal && taskState.modal.form && taskState.modal.form.audience) || [];
    taskState.packPicker = false;
    openPage("user-tag-segment");
    if (packs[0]) segmentState.selectedPackId = packs[0];
    renderApp();
  }
}

function bindTaskOverlays() {
  const overlay = document.getElementById("overlay-root");
  overlay.innerHTML =
    renderTaskViewModal() + renderTaskFormModal() + renderTaskPrizePicker() + renderTaskPackPicker();
  const hasOverlay = Boolean(overlay.querySelector(".mask") || document.getElementById("confirm-modal"));
  document.documentElement.classList.toggle("overlay-open", hasOverlay);
  if (!overlay.dataset.taskBound) {
    overlay.dataset.taskBound = "1";
    overlay.addEventListener("click", onTaskOverlayClick);
  }
  overlay.querySelectorAll("[data-task-form]").forEach((el) => {
    const sync = () => {
      if (!taskState.modal || !taskState.modal.form) return;
      if (el.type === "checkbox") taskState.modal.form[el.dataset.taskForm] = el.checked;
      else taskState.modal.form[el.dataset.taskForm] = el.value;
      taskState.modal.dirty = true;
      if (el.dataset.taskForm === "goal" || el.dataset.taskForm === "type" || el.dataset.taskForm === "delay") renderApp();
    };
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });
}

function mountTaskPage(main) {
  if (!main.dataset.taskBound) {
    main.dataset.taskBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "task") return;
      onTaskClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "task") return;
      const filter = e.target.closest("[data-task-filter]");
      if (filter) taskState.filterDraft[filter.dataset.taskFilter] = filter.value;
      const act = e.target.closest("[data-task-act]");
      if (act) onTaskClick(e);
    });
  }
  main.innerHTML = renderTaskPage();
  bindTaskOverlays();
}

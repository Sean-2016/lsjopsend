const financeState = {
  userId: "",
  asset: "",
  direction: "",
  qty: "",
  fileName: "",
};

function fillFinanceAdjust(userId, asset) {
  financeState.userId = String(userId || "");
  financeState.asset = asset === "point" ? "point" : "coin";
  financeState.direction = "add";
}

function isNaturalNumber(value) {
  return /^[1-9]\d*$/.test(String(value || "").trim());
}

function financeEstimateText() {
  if (financeState.asset === "point") return "—";
  if (financeState.asset !== "coin" || !isNaturalNumber(financeState.qty)) return "";
  if (typeof calcListPrice !== "function") return "";
  return calcListPrice(financeState.qty) || "";
}

function renderFinanceAdjustPage() {
  const estimate = financeEstimateText();
  const ratio = typeof exchangeRatio === "function" ? exchangeRatio() : 0;
  const canSubmit =
    financeState.userId.trim() &&
    financeState.asset &&
    financeState.direction &&
    isNaturalNumber(financeState.qty);
  return `
    <header class="topbar">
      <div class="crumb">
        <span>财务管理</span>
        <span class="sep">/</span>
        <span class="current">金币&积分赠扣</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <section class="finance-card">
        <h2>单个操作</h2>
        <div class="finance-form">
          <label>用户ID
            <input class="input" data-fin="userId" value="${escapeHtml(financeState.userId)}" placeholder="请输入用户ID" />
          </label>
          <div>
            <div class="label">资产类型</div>
            <div class="finance-picks">
              <label class="finance-pick${financeState.asset === "point" ? " on" : ""}">
                <input type="radio" name="fin-asset" data-fin="asset" value="point" ${financeState.asset === "point" ? "checked" : ""} />
                积分
              </label>
              <label class="finance-pick${financeState.asset === "coin" ? " on" : ""}">
                <input type="radio" name="fin-asset" data-fin="asset" value="coin" ${financeState.asset === "coin" ? "checked" : ""} />
                金币
              </label>
            </div>
          </div>
          <div>
            <div class="label">去向类型</div>
            <div class="finance-picks">
              <label class="finance-pick${financeState.direction === "add" ? " on" : ""}">
                <input type="radio" name="fin-dir" data-fin="direction" value="add" ${financeState.direction === "add" ? "checked" : ""} />
                增加
              </label>
              <label class="finance-pick${financeState.direction === "cut" ? " on" : ""}">
                <input type="radio" name="fin-dir" data-fin="direction" value="cut" ${financeState.direction === "cut" ? "checked" : ""} />
                扣减
              </label>
            </div>
          </div>
          <label>数量
            <input class="input" data-fin="qty" inputmode="numeric" value="${escapeHtml(financeState.qty)}" placeholder="请输入自然数" />
            ${financeState.qty && !isNaturalNumber(financeState.qty) ? '<span class="field-error">请填写大于 0 的整数</span>' : ""}
          </label>
          <label>预估金额
            <input class="input" data-fin-estimate value="${escapeHtml(estimate)}" readonly placeholder="${financeState.asset === "point" ? "积分不计算预估金额" : "由数量 ÷ 金币汇率自动计算"}" />
            <span class="field-hint">${
              financeState.asset === "point"
                ? "选择积分子项时不计算预估金额"
                : `金币汇率取自金币价值配置，当前比例 ${ratio || "—"}`
            }</span>
          </label>
        </div>
        <div class="finance-actions">
          <button type="button" class="btn btn-primary" data-fin-act="submit" ${canSubmit ? "" : "disabled"}>提交</button>
        </div>
      </section>
      <section class="finance-card">
        <h2>批量赠送</h2>
        <p class="finance-warn">备注说明：仅支持批量赠送，不支持批量扣除，请谨慎操作。</p>
        <div class="finance-batch">
          <label class="finance-upload">
            <input type="file" accept=".xls,.xlsx,.csv" data-fin-act="upload" hidden />
            <span class="btn">上传 Excel</span>
            <span class="finance-file">${financeState.fileName ? escapeHtml(financeState.fileName) : "未选择文件"}</span>
          </label>
          <button type="button" class="btn" data-fin-act="template">模板导出</button>
        </div>
      </section>
    </div>
  `;
}

function submitFinanceAdjust() {
  if (!financeState.userId.trim() || !financeState.asset || !financeState.direction || !isNaturalNumber(financeState.qty)) {
    showToast("请完整填写单个操作", "error");
    return;
  }
  const asset = financeState.asset === "coin" ? "金币" : "积分";
  const dir = financeState.direction === "add" ? "增加" : "扣减";
  const extra =
    financeState.asset === "coin" && financeEstimateText()
      ? `，预估金额 ${financeEstimateText()}`
      : "";
  showToast(`已${dir}用户 ${financeState.userId.trim()} ${financeState.qty} ${asset}${extra}`);
}

function exportFinanceTemplate() {
  const csv = "\uFEFF用户ID,资产类型,数量\n10001,金币,100\n10002,积分,50\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "批量赠送模板.csv";
  a.click();
  URL.revokeObjectURL(url);
  showToast("模板已导出");
}

function onFinanceClick(e) {
  const btn = e.target.closest("[data-fin-act]");
  if (!btn) return;
  const act = btn.dataset.finAct;
  if (act === "submit") submitFinanceAdjust();
  else if (act === "template") exportFinanceTemplate();
}

function onFinanceChange(e) {
  const field = e.target.closest("[data-fin]");
  if (field) {
    const key = field.dataset.fin;
    financeState[key] = field.value;
    renderApp();
    return;
  }
  if (e.target.closest("[data-fin-act='upload']") || e.target.dataset.finAct === "upload") {
    const file = e.target.files && e.target.files[0];
    financeState.fileName = file ? file.name : "";
    showToast(file ? `已选择 ${file.name}（演示，未实际上传）` : "已清除文件");
    renderApp();
  }
}

function mountFinanceAdjustPage(main) {
  if (!main.dataset.finBound) {
    main.dataset.finBound = "1";
    main.addEventListener("click", (e) => {
      if (activeKey !== "coin-point-adjust") return;
      onFinanceClick(e);
    });
    main.addEventListener("change", (e) => {
      if (activeKey !== "coin-point-adjust") return;
      onFinanceChange(e);
    });
    main.addEventListener("input", (e) => {
      if (activeKey !== "coin-point-adjust") return;
      const field = e.target.closest("[data-fin]");
      if (!field || field.type === "radio") return;
      financeState[field.dataset.fin] = field.value;
      const estimate = main.querySelector("[data-fin-estimate]");
      if (estimate) estimate.value = financeEstimateText();
      const submit = main.querySelector('[data-fin-act="submit"]');
      if (submit) {
        submit.disabled = !(
          financeState.userId.trim() &&
          financeState.asset &&
          financeState.direction &&
          isNaturalNumber(financeState.qty)
        );
      }
    });
  }
  main.innerHTML = renderFinanceAdjustPage();
}

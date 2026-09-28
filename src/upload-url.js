const UPLOAD_KINDS = [
  {
    key: "video",
    label: "视频",
    hint: "支持 MP4、MOV、WEBM、MKV 等视频文件",
    accept: "video/*,.mp4,.mov,.avi,.mkv,.webm,.m4v",
  },
  {
    key: "image",
    label: "图片",
    hint: "支持 JPG、PNG、GIF、WEBP 等图片文件",
    accept: "image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg",
  },
  {
    key: "doc",
    label: "文档",
    hint: "支持 PDF、Word、Excel、PPT、TXT 等文档",
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.md",
  },
];

const uploadUrlState = {
  items: { video: [], image: [], doc: [] },
};

function uploadKindMeta(key) {
  return UPLOAD_KINDS.find((item) => item.key === key);
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function fileMatchesKind(kind, file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  if (kind === "video") {
    return type.indexOf("video/") === 0 || /\.(mp4|mov|avi|mkv|webm|m4v)$/.test(name);
  }
  if (kind === "image") {
    return type.indexOf("image/") === 0 || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(name);
  }
  return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|md)$/.test(name);
}

function makeUploadUrl(kind, fileName) {
  const stamp = Date.now().toString(36);
  const safe = String(fileName || "file")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
  return "https://cdn.fullops.test/" + kind + "/" + stamp + "-" + (safe || "file");
}

function uploadStatusText(item) {
  if (item.status === "uploading") return "上传中 " + item.progress + "%";
  if (item.status === "done") return "上传完成";
  if (item.status === "error") return item.error || "上传失败";
  return "等待上传";
}

function copyUploadUrl(url) {
  const done = function () {
    showToast("已复制 URL");
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done).catch(function () {
      fallbackCopyUploadUrl(url, done);
    });
    return;
  }
  fallbackCopyUploadUrl(url, done);
}

function fallbackCopyUploadUrl(url, done) {
  const ta = document.createElement("textarea");
  ta.value = url;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    done();
  } catch (err) {
    showToast("复制失败，请手动复制", "error");
  }
  ta.remove();
}

function startUploadItems(kind, files) {
  const list = Array.prototype.slice.call(files || []);
  if (!list.length) return;
  list.forEach(function (file) {
    const item = {
      id: "up" + Math.random().toString(16).slice(2, 10),
      kind: kind,
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
      url: "",
      error: "",
    };
    if (!fileMatchesKind(kind, file)) {
      item.status = "error";
      item.error = "文件类型与入口不匹配";
      uploadUrlState.items[kind].unshift(item);
      return;
    }
    uploadUrlState.items[kind].unshift(item);
    const step = function () {
      if (item.status !== "uploading") return;
      item.progress = Math.min(100, item.progress + 8 + Math.floor(Math.random() * 18));
      if (item.progress >= 100) {
        item.progress = 100;
        item.status = "done";
        item.url = makeUploadUrl(kind, file.name);
        showToast(file.name + " 上传完成");
      }
      if (typeof activeKey !== "undefined" && activeKey === "upload-url") renderApp();
      if (item.status === "uploading") setTimeout(step, 180);
    };
    setTimeout(step, 120);
  });
  renderApp();
}

function renderUploadKindCard(kind) {
  const meta = uploadKindMeta(kind);
  const rows = uploadUrlState.items[kind];
  const list = rows.length
    ? rows
        .map(function (item) {
          const urlRow =
            item.status === "done"
              ? `<div class="upload-url-row">
                  <input class="input" readonly value="${escapeHtml(item.url)}" />
                  <button type="button" class="btn btn-primary" data-upload-act="copy" data-url="${escapeHtml(item.url)}">复制</button>
                </div>`
              : "";
          return `
            <div class="upload-file">
              <div class="upload-file-head">
                <div>
                  <div class="upload-file-name">${escapeHtml(item.name)}</div>
                  <div class="upload-file-meta">${formatFileSize(item.size)}</div>
                </div>
                <span class="pill ${item.status === "done" ? "green" : item.status === "error" ? "red" : "blue"}">${uploadStatusText(item)}</span>
              </div>
              <div class="upload-progress ${item.status}">
                <span style="width:${item.status === "error" ? 100 : item.progress}%"></span>
              </div>
              ${urlRow}
            </div>`;
        })
        .join("")
    : `<div class="upload-empty">尚未上传${meta.label}</div>`;

  return `
    <section class="upload-card">
      <div class="upload-card-head">
        <div class="upload-kind-icon ${kind}"></div>
        <div>
          <h2>${meta.label}</h2>
          <p>${meta.hint}</p>
        </div>
      </div>
      <label class="upload-drop">
        <input type="file" multiple data-upload-input="${kind}" accept="${meta.accept}" />
        <span>点击选择或拖拽文件到此处</span>
      </label>
      <div class="upload-list">${list}</div>
    </section>`;
}

function renderUploadUrlPage() {
  return `
    <header class="topbar">
      <div class="crumb">
        <span>内容中心</span>
        <span class="sep">/</span>
        <span class="current">上传文件获得地址</span>
      </div>
      <div class="topbar-right">
        <span class="env-chip">测试</span>
        <span class="user-chip">运营小王</span>
      </div>
    </header>
    <div class="page">
      <div class="upload-grid">
        ${UPLOAD_KINDS.map(function (item) {
          return renderUploadKindCard(item.key);
        }).join("")}
      </div>
    </div>
  `;
}

function onUploadUrlClick(e) {
  const btn = e.target.closest("[data-upload-act]");
  if (!btn) return;
  if (btn.dataset.uploadAct === "copy") copyUploadUrl(btn.dataset.url || "");
}

function onUploadUrlChange(e) {
  const input = e.target.closest("[data-upload-input]");
  if (!input) return;
  startUploadItems(input.dataset.uploadInput, input.files);
  input.value = "";
}

function mountUploadUrlPage(main) {
  if (!main.dataset.uploadUrlBound) {
    main.dataset.uploadUrlBound = "1";
    main.addEventListener("click", function (e) {
      if (activeKey !== "upload-url") return;
      onUploadUrlClick(e);
    });
    main.addEventListener("change", function (e) {
      if (activeKey !== "upload-url") return;
      onUploadUrlChange(e);
    });
    main.addEventListener("dragover", function (e) {
      if (activeKey !== "upload-url") return;
      if (!e.target.closest(".upload-drop")) return;
      e.preventDefault();
    });
    main.addEventListener("drop", function (e) {
      if (activeKey !== "upload-url") return;
      const drop = e.target.closest(".upload-drop");
      if (!drop) return;
      e.preventDefault();
      const input = drop.querySelector("[data-upload-input]");
      if (input) startUploadItems(input.dataset.uploadInput, e.dataTransfer.files);
    });
  }
  main.innerHTML = renderUploadUrlPage();
  const overlay = document.getElementById("overlay-root");
  if (overlay) overlay.innerHTML = "";
  document.documentElement.classList.remove("overlay-open");
}

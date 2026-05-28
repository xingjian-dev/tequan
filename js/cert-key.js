const mockData = [
  { id: 1, name: "支付网关 SSL 证书", type: "cert", typeLabel: "X.509 证书", asset: "api-pay-prod", expiry: "2026-10-01", status: "active", statusLabel: "正常有效" },
  { id: 2, name: "核心集群 SSH 密钥", type: "ssh", typeLabel: "SSH 密钥", asset: "10.0.x.x (50 台)", expiry: "2026-12-31", status: "active", statusLabel: "正常有效" },
  { id: 3, name: "开放平台 Open API Token", type: "api", typeLabel: "API Token", asset: "第三方调用者", expiry: "2026-06-02", status: "warning", statusLabel: "即将过期" },
  { id: 4, name: "内网测试环境自签证书", type: "cert", typeLabel: "X.509 证书", asset: "test-gateway", expiry: "2026-05-20", status: "danger", statusLabel: "已过期" },
  { id: 5, name: "前端静态资源 CDN 证书", type: "cert", typeLabel: "X.509 证书", asset: "cdn.domain.com", expiry: "2026-08-15", status: "active", statusLabel: "正常有效" },
  { id: 6, name: "日志收集服务 Token", type: "api", typeLabel: "API Token", asset: "ELK Stack", expiry: "2027-01-01", status: "active", statusLabel: "正常有效" },
  { id: 7, name: "数据库备份同步密钥", type: "ssh", typeLabel: "SSH 密钥", asset: "db-backup-server", expiry: "2026-05-30", status: "warning", statusLabel: "即将过期" },
];

let filteredData = [...mockData];
const itemsPerPage = 5;
let currentPage = 1;
let selectedIds = new Set();

function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filteredData.slice(start, end);
  
  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--muted); padding: 40px;">暂无匹配数据</td></tr>`;
    return;
  }

  pageData.forEach(item => {
    const statusClass = `status-${item.status}`;
    const isChecked = selectedIds.has(item.id) ? 'checked' : '';
    const row = `
      <tr>
        <td><input type="checkbox" class="row-checkbox" value="${item.id}" ${isChecked} onchange="toggleRowCheckbox(this, ${item.id})" /></td>
        <td><strong>${item.name}</strong></td>
        <td><span class="status-badge" style="background: rgba(255,255,255,0.05); color: var(--muted);">${item.typeLabel}</span></td>
        <td><span style="font-family: var(--mono);">${item.asset}</span></td>
        <td>${item.expiry}</td>
        <td><span class="status-badge ${statusClass}">${item.statusLabel}</span></td>
        <td>
          <a class="action-link" href="cert-detail.html?id=${item.id}">详情</a>
          <a class="action-link" onclick="openRotateModal('${item.name}')">轮换</a>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
  
  updatePagination();
  updateSelectAllCheckbox();
}

function toggleRowCheckbox(checkbox, id) {
  if (checkbox.checked) {
    selectedIds.add(id);
  } else {
    selectedIds.delete(id);
  }
  updateSelectAllCheckbox();
}

function toggleAllCheckboxes() {
  const selectAllCheckbox = document.getElementById("selectAll");
  const isChecked = selectAllCheckbox.checked;
  
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filteredData.slice(start, end);
  
  pageData.forEach(item => {
    if (isChecked) {
      selectedIds.add(item.id);
    } else {
      selectedIds.delete(item.id);
    }
  });
  
  renderTable();
}

function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById("selectAll");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filteredData.slice(start, end);
  
  if (pageData.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    return;
  }
  
  let checkedCount = 0;
  pageData.forEach(item => {
    if (selectedIds.has(item.id)) {
      checkedCount++;
    }
  });
  
  if (checkedCount === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCount === pageData.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

function filterTable() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const typeFilter = document.getElementById("typeFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;
  
  filteredData = mockData.filter(item => {
    const matchQuery = item.name.toLowerCase().includes(query) || item.asset.toLowerCase().includes(query);
    const matchType = typeFilter === "all" || item.type === typeFilter;
    
    // Simplistic status match for demo
    let matchStatus = true;
    if (statusFilter === "active") matchStatus = item.status === "active";
    if (statusFilter === "warning") matchStatus = item.status === "warning";
    if (statusFilter === "danger") matchStatus = item.status === "danger";
    
    return matchQuery && matchType && matchStatus;
  });
  
  currentPage = 1;
  renderTable();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  document.getElementById("pageInfo").innerText = `共 ${filteredData.length} 条记录，当前 ${currentPage}/${totalPages} 页`;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
}

// Drawer Interactions
function openDrawer(id) {
  const item = mockData.find(d => d.id === id);
  if(item) {
    document.getElementById("drawerTitle").innerText = item.name;
    document.getElementById("drawerType").innerText = item.typeLabel;
    document.getElementById("drawerExpiry").innerText = item.expiry;
  }
  document.getElementById("detailDrawer").classList.add("open");
}

function closeDrawer(force = false) {
  if (force === true || force.target === document.getElementById("detailDrawer")) {
    document.getElementById("detailDrawer").classList.remove("open");
  }
}

// Modal Interactions
function openModal() {
  document.getElementById("modalTitle").innerText = "新增凭据";
  const nameInput = document.getElementById('credNameInput');
  if(nameInput) {
    nameInput.value = '';
    nameInput.readOnly = false;
    nameInput.style.backgroundColor = '';
    nameInput.style.color = '';
  }
  document.getElementById("actionModal").classList.add("open");
}

function openRotateModal(name) {
  let selectedNames = [];
  if (name) {
    document.getElementById("modalTitle").innerText = `发起受控轮换 - ${name}`;
    selectedNames.push(name);
  } else {
    if (selectedIds.size === 0) {
      alert("请先勾选需要轮换的凭据");
      return;
    }
    document.getElementById("modalTitle").innerText = `批量发起受控轮换 (已选 ${selectedIds.size} 项)`;
    selectedNames = mockData.filter(d => selectedIds.has(d.id)).map(d => d.name);
  }
  
  // 将勾选的名称填入表单，并设置为只读
  const nameInput = document.getElementById('credNameInput');
  if(nameInput) {
    nameInput.value = selectedNames.join('; ');
    nameInput.readOnly = true;
    nameInput.style.backgroundColor = 'rgba(255,255,255,0.05)';
    nameInput.style.color = 'var(--muted)';
  }

  document.getElementById("actionModal").classList.add("open");
}

function closeModal() {
  document.getElementById("actionModal").classList.remove("open");
}

function submitModal() {
  const btn = document.querySelector(".modal-footer .primary-btn");
  const oldText = btn.innerText;
  btn.innerText = "提交中...";
  setTimeout(() => {
    btn.innerText = oldText;
    closeModal();
    alert("操作已提交审计并流转至审批中心。");
  }, 600);
}

// Initial render
renderTable();
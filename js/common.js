      const vaultData = {
        password: [
          {
            title: "核心 Oracle DBA",
            type: "高敏密码",
            status: "生产域 / 自动轮换",
            tone: "tone-success",
            meta: ["最近改密：10 分钟前", "责任人：数据库安全组", "策略：使用后即换"],
            actions: ["查看策略", "触发轮换"],
          },
          {
            title: "Windows 域管理员",
            type: "共享风险账号",
            status: "待收敛 / 需治理",
            tone: "tone-warn",
            meta: ["最近查看：今日 09:18", "审批要求：双人会签", "标签：AD / 高危"],
            actions: ["查看审计", "收敛建议"],
          },
          {
            title: "中间件服务账号",
            type: "服务密码",
            status: "推送同步中",
            tone: "tone-info",
            meta: ["配置中心：已绑定", "下次轮换：今晚 23:00", "回滚：已启用"],
            actions: ["查看推送", "立即验证"],
          },
        ],
        key: [
          {
            title: "SSH 运维主密钥",
            type: "私钥托管",
            status: "HSM 内部生成",
            tone: "tone-success",
            meta: ["算法：SM2", "导出策略：默认禁用", "最近使用：1 小时前"],
            actions: ["查看使用记录", "轮换计划"],
          },
          {
            title: "第三方供应商密钥对",
            type: "临时密钥",
            status: "7 天后失效",
            tone: "tone-warn",
            meta: ["有效期：短时授权", "绑定工单：WO-2026-0428", "录制：强制开启"],
            actions: ["查看工单", "立即回收"],
          },
          {
            title: "批处理签名密钥",
            type: "应用密钥",
            status: "轮换窗口开启",
            tone: "tone-info",
            meta: ["双版本并存：24h", "关联应用：6 个", "灰度进度：62%"],
            actions: ["查看灰度", "暂停轮换"],
          },
        ],
        cert: [
          {
            title: "支付核心证书",
            type: "X.509 证书",
            status: "15 天后到期",
            tone: "tone-warn",
            meta: ["CA：DigiCert", "部署目标：3 台网关", "自动续期：已开启"],
            actions: ["立即续期", "查看关联资产"],
          },
          {
            title: "内部服务网格证书",
            type: "双向认证",
            status: "续期成功",
            tone: "tone-success",
            meta: ["最近续期：今日 08:57", "算法：ECDSA", "部署方式：自动重部署"],
            actions: ["查看版本", "审计记录"],
          },
          {
            title: "旧版弱算法证书",
            type: "合规整改",
            status: "弱算法风险",
            tone: "tone-danger",
            meta: ["问题：RSA-1024", "整改期限：7 天", "状态：待替换"],
            actions: ["整改方案", "生成报告"],
          },
        ],
        token: [
          {
            title: "开放平台调用 Token",
            type: "API Token",
            status: "灰度轮换中",
            tone: "tone-info",
            meta: ["关联应用：12 个", "旧版本停用：18:00", "审计：开启"],
            actions: ["查看版本", "停止旧版"],
          },
          {
            title: "云资源访问令牌",
            type: "临时令牌",
            status: "有效期 4 小时",
            tone: "tone-success",
            meta: ["来源：自动签发", "绑定角色：运维只读", "落地：禁止"],
            actions: ["查看策略", "重新签发"],
          },
          {
            title: "第三方数据交换 Token",
            type: "外部接入",
            status: "待审批导出",
            tone: "tone-danger",
            meta: ["原因：供应商联调", "审批等级：高", "水印：强制"],
            actions: ["审批详情", "驳回原因"],
          },
        ],
      };

      const vaultList = document.getElementById("vaultList");
      const tabButtons = document.querySelectorAll("[data-tab]");
      const navPills = document.querySelectorAll("#navPills .pill");
      const toggleTimeline = document.getElementById("toggleTimeline");

      function renderVault(tab) {
        vaultList.innerHTML = vaultData[tab]
          .map(
            (item) => `
              <article class="entry-card">
                <div class="entry-top">
                  <div>
                    <h4>${item.title}</h4>
                    <div class="hint" style="margin-top:6px">${item.type}</div>
                  </div>
                  <span class="badge ${item.tone}">${item.status}</span>
                </div>
                <div class="entry-meta">
                  ${item.meta.map((text) => `<span>${text}</span>`).join("")}
                </div>
                <div class="entry-actions">
                  ${item.actions
                    .map(
                      (action, index) =>
                        `<button class="small-btn ${index === 0 ? "primary" : ""}">${action}</button>`
                    )
                    .join("")}
                </div>
              </article>
            `
          )
          .join("");
      }

      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          tabButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          renderVault(button.dataset.tab);
        });
      });

      navPills.forEach((button) => {
        button.addEventListener("click", () => {
          navPills.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
        });
      });

      toggleTimeline.addEventListener("click", () => {
        const hiddenEvents = document.querySelectorAll(".extra-event");
        const willShow = Array.from(hiddenEvents).some((item) => item.classList.contains("hidden"));
        hiddenEvents.forEach((item) => item.classList.toggle("hidden"));
        toggleTimeline.textContent = willShow ? "收起扩展事件" : "展开更多事件";
      });

      renderVault("password");

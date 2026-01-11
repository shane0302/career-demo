document.addEventListener("DOMContentLoaded", () => {
  const profile = loadProfile();
  if(!profile){
    // 沒資料就導回 survey
    window.location.href = "./survey.html";
    return;
  }


  const name = loadName();
  const titleEl = document.getElementById("resultTitle");
  if(titleEl){
    titleEl.innerHTML = name ? `${name} 的 Top 3 推薦職業` : `Top 3 推薦職業`;
  }

  const btnEditName = document.getElementById("btnEditName");
  if(btnEditName){
    btnEditName.addEventListener("click", () => {
      const n = prompt("想怎麼稱呼你？", loadName());
      if(n !== null){
        saveName(n);
        window.location.reload();
      }
    });
  }

  const btnClearAll = document.getElementById("btnClearAll");
  if(btnClearAll){
    btnClearAll.addEventListener("click", () => {
      if(confirm("確定要清除稱呼與問卷資料，重新開始嗎？")){
        clearName();
        clearProfile();
        window.location.href = "./index.html";
      }
    });
  }


  // 顯示你的選擇摘要
  const summary = document.getElementById("profileSummary");
  summary.style.display = "block";
  summary.innerHTML = `
    <strong><i class="fas fa-user-check"></i> 你的條件摘要：</strong>
    興趣：<code>${LABELS.interest[profile.interest]}</code>　
    體能：<code>${LABELS.phys[profile.phys]}</code>　
    技能：<code>${LABELS.skill[profile.skill]}</code>　
    時段：<code>${LABELS.time[profile.time]}</code>　
    數位：<code>${LABELS.tech[profile.tech]}</code>
  `;

  const ranked = rankJobs(profile).slice(0,3);
  const top3El = document.getElementById("top3");
  top3El.innerHTML = "";

  ranked.forEach((job, idx) => {
    const reasons = buildReason(profile, job, job.parts);
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-rank">
        <span class="rank-badge">TOP ${idx+1}</span>
        <span class="match">${job.scorePct}% 匹配</span>
      </div>
      <div class="job-name">${job.icon} ${job.name}${job.category ? `（${job.category}）` : ''}</div>
      <p class="job-desc">${job.desc}</p>

      <div class="job-tags">${job.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      <div class="bar"><div style="width:${job.scorePct}%"></div></div>

      <div class="reason">
        <div class="reason-title"><i class="fas fa-circle-check"></i> 推薦理由</div>
        <ul>${reasons.map(r=>`<li>${r}</li>`).join("")}</ul>
      </div>
    `;
    top3El.appendChild(card);
  });

  // 整體建議：取第一名的 tip（更像系統）
  document.getElementById("overallTip").innerText = ranked[0].tip;
});

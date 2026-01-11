document.addEventListener("DOMContentLoaded", () => {
  const elInterest = document.getElementById("q_interest");
  const elSkill = document.getElementById("q_skill");
  const elPhys = document.getElementById("q_phys");
  const elTime = document.getElementById("q_time");
  const elTech = document.getElementById("q_tech");

  // 顯示使用者稱呼
  const name = loadName();
  const hello = document.getElementById("helloName");
  if(hello){
    hello.innerHTML = name ? `您好，<strong>${name}</strong>！請填寫條件，我會為你產生專屬推薦。` : `你也可以回首頁輸入稱呼，讓推薦更個人化。`;
  }

  // 若已存過，回填
  const prev = loadProfile();
  if(prev){
    elInterest.value = prev.interest;
    if(prev.skill) elSkill.value = prev.skill;
    elPhys.value = prev.phys;
    elTime.value = prev.time;
    elTech.value = prev.tech;
  }

  const loader = document.getElementById("loader");

  document.getElementById("btnAnalyze").addEventListener("click", () => {
    // 若還沒填稱呼，這裡讓使用者快速補一下（可跳過）
    if(!loadName()){
      const n = prompt("想怎麼稱呼你？（可留空）");
      if(n) saveName(n);
    }

    const profile = {
      interest: elInterest.value,
      skill: elSkill.value,
      phys: elPhys.value,
      time: elTime.value,
      tech: elTech.value,
      savedAt: new Date().toISOString()
    };

    saveProfile(profile);

    loader.style.display = "block";

    setTimeout(() => {
      window.location.href = "./result.html";
    }, 1100);
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    clearProfile();
    // 保留畫面但提示一下
    alert("已清除 localStorage 內的問卷資料！");
  });
});

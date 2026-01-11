document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userName");
  const btnSave = document.getElementById("btnSaveName");
  if(input){
    input.value = loadName();
  }
  if(btnSave){
    btnSave.addEventListener("click", () => {
      saveName(input.value);
      alert("已儲存稱呼！接下來填問卷時會用這個稱呼顯示。");
    });
  }

  const btn = document.getElementById("btnGoResult");
  if(btn){
    btn.addEventListener("click", () => {
      const profile = loadProfile();
      if(profile){
        window.location.href = "./result.html";
      }else{
        window.location.href = "./survey.html";
      }
    });
  }
});

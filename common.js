/**
 * common.js
 * - localStorage keys
 * - job database
 * - scoring + reason builder
 */
const STORAGE_KEY = "silvercareer_profile_v1";
const NAME_KEY = "silvercareer_username_v1";

const WEIGHTS = { interest: 0.28, skill: 0.22, phys: 0.22, tech: 0.18, time: 0.10 };

const LABELS = {
  interest: { talk: "熱衷交流分享", fix: "專注手作修理", admin: "穩定行政處理" },
  skill: { doc: "文書", service: "服務", craft: "手作", guide: "導覽" },
  phys: { low: "希望室內靜態", mid: "可接受適度走動" },
  time: { flex: "彈性兼職", full: "穩定全職" },
  tech: { low: "基礎（手機使用）", high: "進階（電腦文書）" }
};

const JOBS = [
  {
    id: "digital_admin",
    name: "銀髮數位行政顧問",
    category: "行政／文書／支援類",
    icon: "<i class='fas fa-laptop-code'></i>",
    tags: ["高專業度", "腦力勞動", "環境舒適"],
    desc: "適合具備電腦文書與條理能力者，負責文件數位化、表單整理、行政協作，並傳承職場經驗。",
    pref: { interest: ["admin"], skill: ["doc"], phys: ["low"], tech: ["high"], time: ["flex","full"] },
    tip: "補強雲端文件（Google Drive/Office）與基本報表，遠端或彈性工時更容易找到友善職缺。"
  },
  {
    id: "tour_guide",
    name: "樂齡導覽大使",
    category: "門市／服務支援類",
    icon: "<i class='fas fa-map-marked-alt'></i>",
    tags: ["社交豐富", "成就感高", "步調友善"],
    desc: "適合熱衷交流分享、喜歡帶領與解說、能接受走動者，擔任社區/博物館導覽，讓人生故事成為城市亮點。",
    pref: { interest: ["talk"], skill: ["guide"], phys: ["mid"], tech: ["low","high"], time: ["flex","full"] },
    tip: "可先從社區活動志工/培訓開始，累積導覽講稿與帶團經驗，面試時更有說服力。"
  },
  {
    id: "repair_craft",
    name: "手作維修職人",
    category: "技術／經驗傳承型",
    icon: "<i class='fas fa-tools'></i>",
    tags: ["技術專門", "室內工作", "穩定節奏"],
    desc: "適合專注手作、喜歡修繕與工藝者，從小型家電、簡易修繕到工藝修補，能在舒適環境中發揮專長。",
    pref: { interest: ["fix"], skill: ["craft"], phys: ["low","mid"], tech: ["low","high"], time: ["flex"] },
    tip: "建立作品集（前後對照照片）與服務項目清單，兼職接案或小店合作會更順利。"
  },
  {
    id: "friendly_admin",
    name: "友善企業行政專員",
    category: "行政／文書／支援類",
    icon: "<i class='fas fa-briefcase'></i>",
    tags: ["環境安靜", "壓力較低", "穩定性高"],
    desc: "適合希望穩定、節奏友善者，提供行政支援、接待、文件整理與內勤協作，維持與社會連結。",
    pref: { interest: ["admin","talk"], skill: ["doc","service"], phys: ["low"], tech: ["low","high"], time: ["full","flex"] },
    tip: "優先選擇離家近、工作內容清楚的職缺；通勤縮短能提升長期續航與生活品質。"
  },
  {
    id: "community_helper",
    name: "社區關懷服務員",
    category: "照顧／陪伴／社區服務類",
    icon: "<i class='fas fa-hand-holding-heart'></i>",
    tags: ["助人價值", "人際互動", "在地連結"],
    desc: "適合喜歡與人互動、偏服務型技能者，協助活動支援、關懷訪視與簡易行政，成就感高且具意義。",
    pref: { interest: ["talk"], skill: ["service"], phys: ["low","mid"], tech: ["low"], time: ["flex"] },
    tip: "先參與社區據點活動，累積服務時數與證明，面試社福/據點工作更有優勢。"
  },
  {
    id: "store_assistant",
    name: "友善門市服務夥伴",
    category: "門市／服務支援類",
    icon: "<i class='fas fa-store'></i>",
    tags: ["簡單上手", "固定流程", "彈性排班"],
    desc: "適合想彈性排班且偏服務技能者，負責收銀/補貨/簡單接待；流程固定、好上手，適合重新回到職場。",
    pref: { interest: ["talk","admin"], skill: ["service"], phys: ["mid"], tech: ["low"], time: ["flex"] },
    tip: "先從短時數熟悉流程，再逐步增加工時；選擇排班透明的門市更安心。"
  }
];

function saveName(name){
  const trimmed = String(name || "").trim();
  if(trimmed) localStorage.setItem(NAME_KEY, trimmed);
}

function loadName(){
  return localStorage.getItem(NAME_KEY) || "";
}

function clearName(){
  localStorage.removeItem(NAME_KEY);
}

function saveProfile(profile){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function loadProfile(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return null;
  try { return JSON.parse(raw); } catch(e){ return null; }
}

function clearProfile(){
  localStorage.removeItem(STORAGE_KEY);
}

function normalizeScore(raw){
  // 0~1 -> 55~98 (展示用)
  const pct = Math.round(55 + raw * 43);
  return Math.max(55, Math.min(98, pct));
}

function matchPart(value, preferredList){
  return preferredList.includes(value) ? 1 : 0;
}

function jobScore(profile, job){
  const sInterest = matchPart(profile.interest, job.pref.interest);
  const sSkill = matchPart(profile.skill, job.pref.skill);
  const sPhys = matchPart(profile.phys, job.pref.phys);
  const sTech = matchPart(profile.tech, job.pref.tech);
  const sTime = matchPart(profile.time, job.pref.time);

  const raw =
    sInterest * WEIGHTS.interest +
    sSkill * WEIGHTS.skill +
    sPhys * WEIGHTS.phys +
    sTech * WEIGHTS.tech +
    sTime * WEIGHTS.time;

  return { raw, pct: normalizeScore(raw), parts: { sInterest, sSkill, sPhys, sTech, sTime } };
}

function buildReason(profile, job, parts){
  const reasons = [];

  if(parts.sInterest) reasons.push(`興趣方向符合「${LABELS.interest[profile.interest]}」`);
  else reasons.push(`興趣方向與此職業偏好不同（你選的是「${LABELS.interest[profile.interest]}」）`);

  if(parts.sSkill) reasons.push(`技能偏好吻合：${LABELS.skill[profile.skill]}`);
  else reasons.push(`技能偏好不同：你偏好「${LABELS.skill[profile.skill]}」`);

  if(parts.sPhys) reasons.push(`體能需求匹配「${LABELS.phys[profile.phys]}」`);
  else reasons.push(`體能條件較不吻合（你選的是「${LABELS.phys[profile.phys]}」）`);

  if(parts.sTech) reasons.push(`數位能力相符：${LABELS.tech[profile.tech]}`);
  else reasons.push(`數位能力落差：你目前是 ${LABELS.tech[profile.tech]}`);

  if(parts.sTime) reasons.push(`時段偏好一致：${LABELS.time[profile.time]}`);
  else reasons.push(`時段偏好不同（你選的是「${LABELS.time[profile.time]}」）`);

  reasons.push(`下一步：${job.tip}`);
  return reasons;
}

function rankJobs(profile){
  const ranked = JOBS
    .map(job => {
      const sc = jobScore(profile, job);
      return { ...job, scoreRaw: sc.raw, scorePct: sc.pct, parts: sc.parts };
    })
    .sort((a,b)=> b.scoreRaw - a.scoreRaw);
  return ranked;
}

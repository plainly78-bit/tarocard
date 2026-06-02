/* ==========================================================================
   MYSTIC TAROT - WEB APPLICATION CORE CONTROLLER (app.js)
   ========================================================================== */

// 1. Tarot Spread Layout Configurations (한글 네이밍 및 위치 의미 상세 정의)
const SPREAD_CONFIGS = {
  '1': {
    name: '오늘의 타로 (1장)',
    cardCount: 1,
    positions: [
      { num: 1, title: '오늘의 운세 및 흐름', desc: '오늘 하루 나에게 다가올 핵심적인 기운과 사건 흐름을 상징합니다.' }
    ]
  },
  '3': {
    name: '과거-현재-미래 (3장)',
    cardCount: 3,
    positions: [
      { num: 1, title: '과거 (Past)', desc: '현재 상황에 강력한 뿌리를 이룬 원인과 과거의 행동/기억을 상징합니다.' },
      { num: 2, title: '현재 (Present)', desc: '지금 내가 마주하고 있는 핵심적인 현실과 내적인 마음가짐을 상징합니다.' },
      { num: 3, title: '미래 (Future)', desc: '현재의 흐름이 유지되었을 때 다가올 미래 결과와 조언의 최종 수렴지입니다.' }
    ]
  },
  '4': {
    name: '관계와 소통 (4장)',
    cardCount: 4,
    positions: [
      { num: 1, title: '나의 상태 (My State)', desc: '상대방이나 관계를 바라보는 나의 솔직한 태도와 마음을 나타냅니다.' },
      { num: 2, title: '상대방의 상태 (Partner State)', desc: '나를 바라보거나 이 관계에 임하는 상대방의 생각과 속내를 보여줍니다.' },
      { num: 3, title: '현재 관계 역학 (Dynamics)', desc: '두 사람 사이에 형성된 결합 시너지 또는 보이지 않는 갈등 양상입니다.' },
      { num: 4, title: '관계 조언 및 미래 (Advice & Future)', desc: '두 사람이 더 조화롭고 건강한 파트너십으로 도약하기 위한 해결책과 미래입니다.' }
    ]
  },
  '5': {
    name: '에너지와 조언 (5장)',
    cardCount: 5,
    positions: [
      { num: 1, title: '현재의 에너지 (Current Energy)', desc: '질문이나 고민에 깔린 지금 이 순간의 지배적인 분위기입니다.' },
      { num: 2, title: '핵심 장애물 (Core Obstacle)', desc: '내가 극복하거나 마주해야 할 내면 또는 외부의 저항 요소입니다.' },
      { num: 3, title: '나아갈 길 (Way Forward - 행동)', desc: '상황을 돌파하기 위해 내가 취해야 할 실질적인 조치와 행동 지침입니다.' },
      { num: 4, title: '우주의 조언 (Advice)', desc: '눈에 보이지 않는 고차원적인 깨달음이나 영적인 정신적 훈수입니다.' },
      { num: 5, title: '가까운 미래 결과 (Upcoming Outcome)', desc: '조언을 이행하고 장애물을 뚫고 전진했을 때 다다를 희망찬 결과입니다.' }
    ]
  },
  '10': {
    name: '켈틱 크로스 (10장)',
    cardCount: 10,
    positions: [
      { num: 1, title: '현재 상황 (Present Situation)', desc: '질문자 본인이 현재 직면하고 있는 가장 핵심적인 중심 상태입니다.' },
      { num: 2, title: '장애물과 저항 (Immediate Obstacle)', desc: '현재 상황을 복잡하게 만들거나 발목을 꽉 잡고 있는 장애 요소입니다.' },
      { num: 3, title: '잠재의식 기반 (Foundation)', desc: '본인의 의식 밑단에 깔린 잠재의식적 원인과 오래된 생각의 뿌리입니다.' },
      { num: 4, title: '가까운 과거 (Recent Past)', desc: '현재 상황을 일으키는 데 직접적인 도화선이 되었던 최근의 사건입니다.' },
      { num: 5, title: '의식적 목표 (Conscious Goal)', desc: '내가 머리로 인식하고 갈망하는 최선의 이상향이자 바라는 모습입니다.' },
      { num: 6, title: '가까운 미래 (Near Future)', desc: '곧 마주하게 될 직관적이고 피할 수 없는 다가올 시간의 흐름입니다.' },
      { num: 7, title: '자신에 대한 태도 (My Attitude)', desc: '내가 처한 상황에 대해 나 자신을 대하는 감정과 행동 대처 능력입니다.' },
      { num: 8, title: '외부 환경 및 타인 시선 (Environment)', desc: '나를 감싸고 있는 가족, 사회적 영향력, 또는 나를 보는 주변인들의 시선입니다.' },
      { num: 9, title: '희망과 두려움 (Hopes & Fears)', desc: '내 마음 한구석에 도사리는 깊은 바람 또는 불안한 트라우마성 공포입니다.' },
      { num: 10, title: '최종 결과 (Final Outcome)', desc: '이 모든 기운들이 소통하고 충돌하며 수렴하여 도달할 대단원의 완성이자 대답입니다.' }
    ]
  }
};

// Global App State (역방향 제거 완료)
let selectedSpread = '1'; // '1', '3', '4', '5', '10'
let drawnCards = [];      // Array of: { card: Object, flipped: false }
let activeFocusedIndex = 0; // Current highlighted card index in interpretation panel
let activeFilter = 'all';
let searchKeyword = '';

// DOM Elements
const elements = {
  // Navigation
  logo: document.getElementById('btn-logo'),
  navLinks: document.querySelectorAll('.nav-link'),
  tabs: document.querySelectorAll('.tab-content'),
  
  // Spread Selector UI
  spreadChips: document.getElementById('spread-chips'),
  
  // Reading Room Core Elements
  tarotDeck: document.getElementById('tarot-deck'),
  deckLabel: document.getElementById('deck-label'),
  spreadBoard: document.getElementById('spread-board'),
  readingContainer: document.querySelector('.reading-container'),
  readingPanel: document.getElementById('interpretation-panel'),
  
  // Table Actions
  btnRevealAll: document.getElementById('btn-reveal-all'),
  btnDrawAgain: document.getElementById('btn-draw-again'),
  tableInstructionText: document.getElementById('table-instruction-text'),
  
  // Interpretation Panel Elements
  readingSpreadTitle: document.getElementById('reading-spread-title'),
  drawnCardsSummaryList: document.getElementById('drawn-cards-summary-list'),
  badgeDirection: document.getElementById('badge-direction'),
  readingCardTitle: document.getElementById('reading-card-title'),
  readingCardPositionName: document.getElementById('reading-card-position-name'),
  readingCardType: document.getElementById('reading-card-type'),
  readingCardSuit: document.getElementById('reading-card-suit'),
  readingKeywords: document.getElementById('reading-keywords'),
  readingMeaning: document.getElementById('reading-meaning'),
  readingAdvice: document.getElementById('reading-advice'),
  
  // Dynamic Combination Synthesis Elements
  synthesisElementDistribution: document.getElementById('synthesis-element-distribution'),
  synthesisText: document.getElementById('synthesis-text'),
  
  // Encyclopedia Base
  searchInput: document.getElementById('search-input'),
  btnClearSearch: document.getElementById('btn-clear-search'),
  filterChips: document.querySelectorAll('.filter-chip'),
  encyclopediaGrid: document.getElementById('encyclopedia-grid'),
  
  // Encyclopedia Subtabs
  btnSubtabIndividual: document.getElementById('btn-subtab-individual'),
  btnSubtabCombination: document.getElementById('btn-subtab-combination'),
  subtabIndividual: document.getElementById('subtab-individual'),
  subtabCombination: document.getElementById('subtab-combination'),
  
  // History Dashboard
  historyList: document.getElementById('history-list'),
  btnClearHistory: document.getElementById('btn-clear-history'),
  
  // Study Modal
  detailModal: document.getElementById('detail-modal'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalType: document.getElementById('modal-type'),
  modalSuit: document.getElementById('modal-suit'),
  modalCardImg: document.getElementById('modal-card-img'),
  modalCardArcana: document.getElementById('modal-card-arcana'),
  modalCardNameKo: document.getElementById('modal-card-name-ko'),
  modalCardNameEn: document.getElementById('modal-card-name-en'),
  modalKeywordsUp: document.getElementById('modal-keywords-up'),
  modalMeaningUp: document.getElementById('modal-meaning-up'),
  modalAdvice: document.getElementById('modal-advice'),
  
  // Sound
  soundChime: document.getElementById('sound-chime'),
  soundShuffle: document.getElementById('sound-shuffle')
};

// 2. Tab Navigation System
function switchTab(tabId) {
  // Update Navigation Active State
  elements.navLinks.forEach(link => {
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Switch Active Section
  elements.tabs.forEach(tab => {
    if (tab.id === `tab-${tabId}`) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Trigger special actions based on tab switch
  if (tabId === 'encyclopedia') {
    renderEncyclopedia();
  } else if (tabId === 'history') {
    renderHistory();
  }
}

// 3. Multi-Spread Reading Room Controller
function initReadingRoom() {
  // Spread selection chip listener
  elements.spreadChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.spread-chip');
    if (!chip || chip.classList.contains('active')) return;
    
    // Switch active chip style
    elements.spreadChips.querySelectorAll('.spread-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    
    selectedSpread = chip.getAttribute('data-spread');
    resetTable(); // Reset table completely for new board layout
  });

  // Click Deck to Draw NEXT Card
  elements.tarotDeck.addEventListener('click', () => {
    const config = SPREAD_CONFIGS[selectedSpread];
    if (drawnCards.length >= config.cardCount) return; // Full spread reached
    
    // Play Shuffle Sound
    playSound('shuffle');
    
    // Add jitter effect to deck
    elements.tarotDeck.classList.add('animate-pulse');
    
    setTimeout(() => {
      elements.tarotDeck.classList.remove('animate-pulse');
      dealNextCard();
    }, 500);
  });

  // "Reveal All" click handler
  elements.btnRevealAll.addEventListener('click', revealAllCards);

  // "Draw Again / Reset" click handler
  elements.btnDrawAgain.addEventListener('click', resetTable);
  
  // Set default spread slots
  setupSpreadBoard();
}

// Build empty slot placeholders dynamically on the board
function setupSpreadBoard() {
  elements.spreadBoard.innerHTML = '';
  elements.spreadBoard.className = `spread-board spread-${selectedSpread}`;
  
  const config = SPREAD_CONFIGS[selectedSpread];
  
  // Instruction text update
  elements.tableInstructionText.textContent = `눈을 감고 질문에 몰입하세요. [${config.name}]에 따라 총 ${config.cardCount}장의 카드를 차례로 드로우합니다.`;
  elements.deckLabel.textContent = `DRAW (0/${config.cardCount})`;

  // Celtic Cross requires left & right container splits
  if (selectedSpread === '10') {
    const leftCross = document.createElement('div');
    leftCross.className = 'celtic-cross-left';
    
    const rightStaff = document.createElement('div');
    rightStaff.className = 'celtic-cross-right';
    
    elements.spreadBoard.appendChild(leftCross);
    elements.spreadBoard.appendChild(rightStaff);
    
    // Dynamic slots inside Left Cross
    config.positions.forEach((pos, idx) => {
      if (pos.num === 1) {
        // Slot 1 and Slot 2 are stacked in the middle of left cross
        const container = document.createElement('div');
        container.setAttribute('data-slot', '1_2_container');
        container.innerHTML = `
          <div class="celtic-center-slot-1 dealt-card-slot hidden" data-slot="1" id="slot-1">
            <span class="slot-label-top" style="display:none">1번: 현재상황</span>
            ${createSlotCardInnerHTML(idx)}
          </div>
          <div class="celtic-center-slot-2 dealt-card-slot hidden" data-slot="2" id="slot-2">
            <span class="slot-label-top">2번: 장애물</span>
            ${createSlotCardInnerHTML(1)}
          </div>
        `;
        leftCross.appendChild(container);
      } else if (pos.num === 2) {
        return; // Skips since built together with slot 1
      } else if (pos.num <= 6) {
        const slotEl = document.createElement('div');
        slotEl.className = 'dealt-card-slot hidden';
        slotEl.setAttribute('data-slot', pos.num);
        slotEl.id = `slot-${pos.num}`;
        slotEl.innerHTML = `
          <span class="slot-label-top">${pos.num}번: ${pos.title.split(' ')[0]}</span>
          ${createSlotCardInnerHTML(idx)}
        `;
        leftCross.appendChild(slotEl);
      } else {
        const slotEl = document.createElement('div');
        slotEl.className = 'dealt-card-slot hidden';
        slotEl.setAttribute('data-slot', pos.num);
        slotEl.id = `slot-${pos.num}`;
        slotEl.innerHTML = `
          <span class="slot-label-top">${pos.num}번: ${pos.title.split(' ')[0]}</span>
          ${createSlotCardInnerHTML(idx)}
        `;
        rightStaff.appendChild(slotEl);
      }
    });
  } else {
    // Normal linear/grid Spreads (1, 3, 4, 5)
    config.positions.forEach((pos, idx) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'dealt-card-slot hidden';
      slotEl.setAttribute('data-slot', pos.num);
      slotEl.id = `slot-${pos.num}`;
      slotEl.innerHTML = `
        <span class="slot-label-top">${pos.num}번: ${pos.title}</span>
        ${createSlotCardInnerHTML(idx)}
      `;
      elements.spreadBoard.appendChild(slotEl);
    });
  }
  
  bindSlotClicks();
}

function createSlotCardInnerHTML(index) {
  return `
    <div class="slot-card-container">
      <div class="tarot-card-3d" data-index="${index}">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-border-gold">
              <div class="card-header-mini">
                <span class="card-arcana-badge">MAJOR</span>
              </div>
              <div class="card-img-container">
                <img src="" alt="Tarot Front" class="card-artwork-img">
                <div class="card-img-shimmer"></div>
              </div>
              <div class="card-footer-mini">
                <h3 class="slot-reveal-name-ko">바보</h3>
                <span class="slot-reveal-name-en">The Fool</span>
              </div>
            </div>
          </div>
          <div class="card-back">
            <div class="card-back-inner">
              <div class="gold-seal"><i class="fa-solid fa-moon"></i></div>
              <div class="gold-corners"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Deal Next Card logic (100% Upright Only)
function dealNextCard() {
  const config = SPREAD_CONFIGS[selectedSpread];
  const nextIndex = drawnCards.length;
  const nextSlotNum = nextIndex + 1;
  
  if (nextIndex === 0) {
    elements.spreadBoard.classList.remove('hidden');
  }

  // 1. Pick unique random card
  let randomCard = null;
  while (true) {
    const rIdx = Math.floor(Math.random() * TAROT_CARDS.length);
    const candidate = TAROT_CARDS[rIdx];
    const alreadyDrawn = drawnCards.some(item => item.card.id === candidate.id);
    if (!alreadyDrawn) {
      randomCard = candidate;
      break;
    }
  }

  // 2. Set direction to ALWAYS UPRIGHT
  const direction = 'upright';
  
  drawnCards.push({
    card: randomCard,
    flipped: false
  });

  elements.deckLabel.textContent = `DRAW (${drawnCards.length}/${config.cardCount})`;

  const slotEl = document.getElementById(`slot-${nextSlotNum}`);
  if (!slotEl) return;

  const cardImg = slotEl.querySelector('.card-artwork-img');
  cardImg.src = `https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${randomCard.img}`;
  
  slotEl.querySelector('.slot-reveal-name-ko').textContent = randomCard.nameKo;
  slotEl.querySelector('.slot-reveal-name-en').textContent = randomCard.nameEn;
  slotEl.querySelector('.card-arcana-badge').textContent = randomCard.type.toUpperCase();

  // Highlight slot 2 obstacle rotation, others are normal upright
  if (selectedSpread === '10' && nextSlotNum === 2) {
    slotEl.querySelector('.tarot-card-3d').style.transform = 'rotateZ(90deg)';
  } else {
    slotEl.querySelector('.tarot-card-3d').style.transform = 'rotateZ(0deg)';
  }

  slotEl.classList.remove('hidden');
  slotEl.classList.add('deal-animation');

  if (selectedSpread === '10' && nextSlotNum === 1) {
    document.querySelector('[data-slot="1_2_container"]').classList.remove('hidden');
  }

  playSound('chime');

  if (drawnCards.length >= config.cardCount) {
    elements.tarotDeck.classList.add('hidden');
    elements.btnRevealAll.classList.remove('hidden');
    elements.btnDrawAgain.classList.remove('hidden');
  }
}

// Add click listeners to slots dynamically
function bindSlotClicks() {
  const cardElements = elements.spreadBoard.querySelectorAll('.tarot-card-3d');
  cardElements.forEach(cardEl => {
    cardEl.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const slotEl = cardEl.closest('.dealt-card-slot');
      const slotNum = parseInt(slotEl.getAttribute('data-slot'));
      const stateIndex = slotNum - 1;
      
      const stateItem = drawnCards[stateIndex];
      if (!stateItem) return;

      if (!stateItem.flipped) {
        flipCardInSlot(slotEl, stateIndex);
      } else {
        focusCardDetails(stateIndex);
      }
    });
  });
}

// Flip individual card
function flipCardInSlot(slotEl, stateIndex) {
  const cardEl = slotEl.querySelector('.tarot-card-3d');
  const stateItem = drawnCards[stateIndex];
  
  playSound('chime');
  stateItem.flipped = true;
  slotEl.classList.add('slot-revealed');
  
  // Custom overlay rotation for Celtic cross Slot 2 obstacle card
  if (selectedSpread === '10' && stateIndex === 1) {
    cardEl.style.transform = 'rotateY(180deg) rotateZ(90deg)';
  } else {
    cardEl.style.transform = 'rotateY(180deg)';
  }

  renderInterpretationPanel();
  focusCardDetails(stateIndex);
}

// "Reveal All" flips
function revealAllCards() {
  elements.btnRevealAll.classList.add('hidden');
  
  drawnCards.forEach((item, index) => {
    if (item.flipped) return;
    
    const slotEl = document.getElementById(`slot-${index + 1}`);
    const cardEl = slotEl.querySelector('.tarot-card-3d');
    
    setTimeout(() => {
      playSound('chime');
      item.flipped = true;
      slotEl.classList.add('slot-revealed');
      
      if (selectedSpread === '10' && index === 1) {
        cardEl.style.transform = 'rotateY(180deg) rotateZ(90deg)';
      } else {
        cardEl.style.transform = 'rotateY(180deg)';
      }

      if (index === drawnCards.length - 1) {
        renderInterpretationPanel();
        focusCardDetails(0); // Focus first card
        saveSpreadToHistory();
      }
    }, index * 250);
  });
}

// Render interpretation sheet and load card list chips (Upright only)
function renderInterpretationPanel() {
  const config = SPREAD_CONFIGS[selectedSpread];
  
  elements.readingSpreadTitle.textContent = `${config.name} 리딩`;
  elements.drawnCardsSummaryList.innerHTML = '';
  
  drawnCards.forEach((item, idx) => {
    const pos = config.positions[idx];
    const chip = document.createElement('div');
    
    let chipText = `${pos.num}번: ${pos.title.split(' ')[0]}`;
    if (item.flipped) {
      chipText += ` (${item.card.nameKo})`;
    } else {
      chipText += ' (미공개)';
    }

    chip.className = `summary-item-chip ${item.flipped ? 'flipped' : ''} ${activeFocusedIndex === idx ? 'active' : ''}`;
    chip.innerHTML = `<i class="fa-solid ${item.flipped ? 'fa-circle-up text-success' : 'fa-circle-question'}"></i> <span>${chipText}</span>`;
    
    chip.addEventListener('click', () => {
      if (!item.flipped) {
        const slotEl = document.getElementById(`slot-${idx + 1}`);
        flipCardInSlot(slotEl, idx);
      } else {
        focusCardDetails(idx);
      }
    });

    elements.drawnCardsSummaryList.appendChild(chip);
  });

  elements.readingContainer.classList.add('active-drawn');
  elements.readingPanel.classList.remove('hidden');

  // Trigger dynamic combined combination synthesis if all cards are flipped
  const allFlipped = drawnCards.length > 0 && drawnCards.every(item => item.flipped);
  if (allFlipped) {
    generateCombinationSynthesis();
  }
}

// Spotlight slot card and load upright details into sheet
function focusCardDetails(index) {
  activeFocusedIndex = index;
  
  const chips = elements.drawnCardsSummaryList.querySelectorAll('.summary-item-chip');
  chips.forEach((c, idx) => {
    if (idx === index) c.classList.add('active');
    else c.classList.remove('active');
  });

  elements.spreadBoard.querySelectorAll('.dealt-card-slot').forEach(s => s.classList.remove('active-focus'));
  const activeSlot = document.getElementById(`slot-${index + 1}`);
  if (activeSlot) {
    activeSlot.classList.add('active-focus');
    activeSlot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const item = drawnCards[index];
  const config = SPREAD_CONFIGS[selectedSpread];
  const pos = config.positions[index];
  
  if (!item || !item.flipped) return;

  // Set focused panel contents (100% Upright)
  elements.badgeDirection.textContent = '타로 리딩 UPRIGHT';
  elements.badgeDirection.className = 'badge';
  
  elements.readingCardTitle.textContent = `${item.card.nameKo} (${item.card.nameEn})`;
  elements.readingCardPositionName.innerHTML = `<i class="fa-solid fa-circle-info gold-text"></i> ${pos.num}번 위치: <strong style="color:var(--color-gold-light);">${pos.title}</strong> &bull; <span style="font-size:0.8rem; color:var(--color-text-muted);">${pos.desc}</span>`;
  
  elements.readingCardType.textContent = item.card.type === 'major' ? '메이저 아르카나' : '마이너 아르카나';
  
  let suitKo = '슈트 없음';
  if (item.card.suit === 'wands') suitKo = '완드 (Wands - 행동)';
  else if (item.card.suit === 'cups') suitKo = '컵 (Cups - 감정)';
  else if (item.card.suit === 'swords') suitKo = '소드 (Swords - 생각)';
  else if (item.card.suit === 'pentacles') suitKo = '펜타클 (Pentacles - 물질)';
  elements.readingCardSuit.textContent = suitKo;

  elements.readingKeywords.innerHTML = item.card.keywordsUp.map(k => `<span class="chip">${k}</span>`).join('');
  elements.readingMeaning.textContent = item.card.meaningUp;
  elements.readingAdvice.textContent = item.card.advice;
  
  document.getElementById('focused-card-details').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 4. Dynamic Combination Synthesis Engine (인터넷 전문 자료 융합)
function generateCombinationSynthesis() {
  const total = drawnCards.length;
  if (total === 0) return;

  // 1. Calculate Element / Suit Distribution
  const counts = { major: 0, wands: 0, cups: 0, swords: 0, pentacles: 0 };
  drawnCards.forEach(item => {
    if (item.card.type === 'major') counts.major++;
    else if (item.card.suit === 'wands') counts.wands++;
    else if (item.card.suit === 'cups') counts.cups++;
    else if (item.card.suit === 'swords') counts.swords++;
    else if (item.card.suit === 'pentacles') counts.pentacles++;
  });

  // Build beautiful progress bar charts
  const percentage = (count) => Math.round((count / total) * 100);
  
  elements.synthesisElementDistribution.innerHTML = `
    <div class="element-bar" title="메이저 아르카나 (운명적 우주의 힘)">
      <div class="element-label"><span>우주 운명 (메이저)</span><span>${percentage(counts.major)}%</span></div>
      <div class="element-progress-bg"><div class="element-progress-fill fill-major" style="width:${percentage(counts.major)}%"></div></div>
    </div>
    <div class="element-bar" title="완드 (Wands - 불/행동/정열)">
      <div class="element-label"><span>행동·정열 (완드)</span><span>${percentage(counts.wands)}%</span></div>
      <div class="element-progress-bg"><div class="element-progress-fill fill-wands" style="width:${percentage(counts.wands)}%"></div></div>
    </div>
    <div class="element-bar" title="컵 (Cups - 물/감정/관계)">
      <div class="element-label"><span>감정·소통 (컵)</span><span>${percentage(counts.cups)}%</span></div>
      <div class="element-progress-bg"><div class="element-progress-fill fill-cups" style="width:${percentage(counts.cups)}%"></div></div>
    </div>
    <div class="element-bar" title="소드 (Swords - 공기/이성/결단)">
      <div class="element-label"><span>이성·결단 (소드)</span><span>${percentage(counts.swords)}%</span></div>
      <div class="element-progress-bg"><div class="element-progress-fill fill-swords" style="width:${percentage(counts.swords)}%"></div></div>
    </div>
    <div class="element-bar" title="펜타클 (Pentacles - 흙/물질/자산)">
      <div class="element-label"><span>현실·재물 (펜타클)</span><span>${percentage(counts.pentacles)}%</span></div>
      <div class="element-progress-bg"><div class="element-progress-fill fill-pentacles" style="width:${percentage(counts.pentacles)}%"></div></div>
    </div>
  `;

  // 2. Generate Synthesis text based on layout and elements
  if (total === 1) {
    elements.synthesisText.innerHTML = `
      현재 드로우는 단 1장의 원 포인트 리딩입니다. 복합적인 조합보다는 이 카드가 지닌 본질적인 기운인 
      <strong>"${drawnCards[0].card.nameKo}"</strong>의 핵심 키워드 <strong>[${drawnCards[0].card.keywordsUp.join(', ')}]</strong>에 
      모든 주의를 기울여 내적으로 성찰하는 것이 중요합니다.
    `;
    return;
  }

  // Multi-card synthesis logic (3, 4, 5, 10 Spreads)
  let analysis = `<strong>[스프레드 종합 조합 리포트]</strong><br>`;
  
  // High Major count check
  if (counts.major / total >= 0.4) {
    analysis += `• 현재 뽑힌 카드 중 하늘의 천운과 강력한 정신적 터닝포인트를 상징하는 <strong>메이저 아르카나 카드가 높은 비율(${percentage(counts.major)}%)</strong>로 존재합니다. 이는 질문하시는 사안이 단순한 일상사를 넘어, 본인의 영혼 성장과 거부할 수 없는 강력한 우주적 소명 및 흐름에 맞닿아 있음을 가리킵니다.<br><br>`;
  }

  // Dominant Suit check
  let dominantSuit = '';
  let maxCount = 0;
  Object.keys(counts).forEach(key => {
    if (key !== 'major' && counts[key] > maxCount) {
      maxCount = counts[key];
      dominantSuit = key;
    }
  });

  if (maxCount >= 2) {
    const suitNames = { wands: '불(완드 - 행동)', cups: '물(컵 - 감정)', swords: '공기(소드 - 생각)', pentacles: '흙(펜타클 - 물질)' };
    const suitExps = {
      wands: '현재 강력한 정열과 돌파 의지가 요구되는 때입니다. 주저하기보다 뜨겁고 신속하게 몸으로 부딪쳐 실행해야 이롭습니다.',
      cups: '현재 사안은 감정의 하모니와 사람 간의 마음 소통이 모든 열쇠를 쥐고 있습니다. 논리적 팩트보다 상대의 아픔에 공감하는 온정이 최고의 해법입니다.',
      swords: '차가운 이성과 단호한 지적 결단력이 팽팽히 요구됩니다. 감상주의에 젖지 말고 뼈아픈 팩트에 발을 디디며 예리하게 오려내고 정리할 타이밍입니다.',
      pentacles: '현실적인 자산, 금전적 실리, 묵묵한 장인 정신이 테마입니다. 뜬구름 잡는 아이디어보다 하루치의 노동과 단단한 현실 구축에 초점을 맞추세요.'
    };
    analysis += `• 이번 리딩의 핵심 원소는 <strong>${suitNames[dominantSuit]} (${percentage(maxCount)}%)</strong>입니다. ${suitExps[dominantSuit]}<br><br>`;
  }

  // Flow & Interaction Weaving based on spreads
  if (selectedSpread === '3') {
    // 3 Cards: Past, Present, Future
    const p1 = drawnCards[0].card;
    const p2 = drawnCards[1].card;
    const p3 = drawnCards[2].card;
    analysis += `• <strong>[흐름 조율 가이드]</strong> 과거의 <strong>"${p1.nameKo}"</strong> 기운이 씨앗이 되어 현재의 <strong>"${p2.nameKo}"</strong> 상황을 낳았습니다. 최종적으로 다가올 미래의 <strong>"${p3.nameKo}"</strong> 결실로 수렴되는 과정은 매우 유기적입니다. `;
    
    // Suit chemical reactions
    if (p1.suit === 'wands' && p3.suit === 'pentacles') {
      analysis += `완드의 뜨거운 정열(불)로 시작된 불씨가 결국 미래에 단단한 펜타클의 흙 에너지로 안전하게 영글어가는 <u>최고의 창조적이고 생산적인 조화로운 결실 흐름(성장)</u>입니다.`;
    } else if (p1.suit === 'cups' && p3.suit === 'swords') {
      analysis += `감정의 성배(물)로 관계를 도모해 오다 미래에는 차가운 검(공기)을 쥐고 불필요한 감정 소모를 싹둑 베어내야 하는 <u>냉철하고 지성적인 이성 확립의 전환기</u>입니다.`;
    } else {
      analysis += `주변에 뜬구름 잡는 몽상을 털고 마스터 조언 카드에 담긴 실질적 행동 지침인 <strong>"${p3.advice}"</strong>의 가르침을 믿고 차분히 전진할 때 가장 완전한 조화가 달성될 것입니다.`;
    }
  } else if (selectedSpread === '5') {
    // 5 Cards: Energy, Obstacle, Action, Advice, Outcome
    const energy = drawnCards[0].card;
    const obstacle = drawnCards[1].card;
    const action = drawnCards[2].card;
    const advice = drawnCards[3].card;
    const outcome = drawnCards[4].card;
    analysis += `• <strong>[종합 구조 설계]</strong> 질문자를 감싼 현재의 기본 에너지 <strong>"${energy.nameKo}"</strong>가 장애물 자리의 <strong>"${obstacle.nameKo}"</strong>의 도전에 부딪쳤습니다. 이를 현명하게 타파하기 위한 최선의 행동(Action) 처방전은 <strong>"${action.nameKo}"</strong>의 기운을 적극 발휘해 전진하는 것입니다.<br><br>`;
    analysis += `• <strong>[우주의 솔루션]</strong> 하늘이 훈수 두는 멘토의 강력한 공부 팁 <strong>"${advice.nameKo}"</strong>을 가슴속에 깊이 아로새겨 나쁜 아집을 버리고 실천할 때, 비로소 최종 도달점의 아름다운 성공 카드인 <strong>"${outcome.nameKo}"</strong>의 찬란한 영광이 활짝 문을 열어줄 것입니다.`;
  } else if (selectedSpread === '4') {
    // 4 Cards: Relationship
    const me = drawnCards[0].card;
    const partner = drawnCards[1].card;
    const dyn = drawnCards[2].card;
    const fut = drawnCards[3].card;
    analysis += `• <strong>[관계 역학 조율]</strong> 질문자 본인의 속내 <strong>"${me.nameKo}"</strong>와 마주 선 상대의 마음 <strong>"${partner.nameKo}"</strong>이 결합하여 만드는 현재 두 사람 사이의 보이지 않는 에너지는 <strong>"${dyn.nameKo}"</strong>입니다. `;
    if (me.suit === 'cups' && partner.suit === 'cups') {
      analysis += `두 사람 모두 감수성이 깊고 사랑(물 원소)이 가득하여 정서적인 공감 유대가 대단히 돈독합니다. 서로의 온정을 솔직하게 나눈다면 갈등은 눈 녹듯 사라질 것입니다.`;
    } else if (me.suit === 'swords' || partner.suit === 'swords') {
      analysis += `어느 한쪽이 검(공기 원소)을 쥐고 다소 매서운 비판이나 냉담한 선 긋기를 감행하고 있을 수 있어 대화의 기류가 팽팽합니다. 사소한 자존심 다툼을 경계하세요.`;
    } else {
      analysis += `각자의 고집을 낮추고 서로 조율할 때 미래 자리의 <strong>"${fut.nameKo}"</strong>이 말해주는 조화롭고 성숙한 동반자적 결실을 맞이할 수 있을 것입니다.`;
    }
  } else {
    // Celtic Cross (10 cards)
    const present = drawnCards[0].card;
    const obstacle = drawnCards[1].card;
    const outcome = drawnCards[9].card;
    analysis += `• <strong>[켈틱 크로스 핵심 융합]</strong> 질문을 관통하는 현재 상황 <strong>"${present.nameKo}"</strong>의 밭 위에 그것을 가로질러 옥죄고 있는 <strong>"${obstacle.nameKo} (장애물)"</strong>의 방해를 단호하게 직시하세요. 이 팽팽한 고난의 십자가를 이겨내고 전진했을 때 질문자가 최종적으로 거머쥐게 될 인생의 마스터 피스는 10번 결론 카드의 <strong>"${outcome.nameKo}"</strong>입니다.<br><br>`;
    analysis += `• <strong>[학습 종합 멘토링]</strong> 메이저/마이너 수치 비율이 말해주듯, 현재 본인의 의지로 바꿀 수 있는 행동 영역을 묵묵하게 농사짓다 보면, 우주가 보상하는 찬란한 터닝포인트가 곧 찾아와 깊은 깨달음을 얻게 될 것입니다.`;
  }

  elements.synthesisText.innerHTML = analysis;
}

// Reset drawing table
function resetTable() {
  elements.readingContainer.classList.remove('active-drawn');
  elements.readingPanel.classList.add('hidden');
  elements.spreadBoard.classList.add('hidden');
  elements.btnRevealAll.classList.add('hidden');
  elements.btnDrawAgain.classList.add('hidden');
  
  // Clear states
  drawnCards = [];
  activeFocusedIndex = 0;
  
  setupSpreadBoard();
  elements.tarotDeck.classList.remove('hidden');
  
  // Reset combination block text
  elements.synthesisElementDistribution.innerHTML = '';
  elements.synthesisText.innerHTML = '모든 카드를 드로우하고 뒤집으면, 이곳에 카드들의 원소(슈트) 상호작용 및 배열 흐름을 조합한 정밀 해석 보고서가 실시간으로 생성됩니다!';
}

// 5. Card Encyclopedia controller
function initEncyclopedia() {
  // Encyclopedia Subtab navigation triggers
  elements.btnSubtabIndividual.addEventListener('click', () => {
    elements.btnSubtabIndividual.classList.add('active');
    elements.btnSubtabCombination.classList.remove('active');
    elements.subtabIndividual.classList.add('active');
    elements.subtabIndividual.classList.remove('hidden');
    elements.subtabCombination.classList.add('hidden');
    elements.subtabCombination.classList.remove('active');
  });

  elements.btnSubtabCombination.addEventListener('click', () => {
    elements.btnSubtabIndividual.classList.remove('active');
    elements.btnSubtabCombination.classList.add('active');
    elements.subtabIndividual.classList.remove('active');
    elements.subtabIndividual.classList.add('hidden');
    elements.subtabCombination.classList.remove('hidden');
    elements.subtabCombination.classList.add('active');
  });

  elements.searchInput.addEventListener('keyup', (e) => {
    searchKeyword = e.target.value.toLowerCase().trim();
    if (searchKeyword.length > 0) elements.btnClearSearch.classList.remove('hidden');
    else elements.btnClearSearch.classList.add('hidden');
    renderEncyclopedia();
  });

  elements.btnClearSearch.addEventListener('click', () => {
    elements.searchInput.value = '';
    searchKeyword = '';
    elements.btnClearSearch.classList.add('hidden');
    renderEncyclopedia();
  });

  elements.filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter');
      renderEncyclopedia();
    });
  });
}

function renderEncyclopedia() {
  elements.encyclopediaGrid.innerHTML = '';
  
  const filtered = TAROT_CARDS.filter(card => {
    if (activeFilter === 'major' && card.type !== 'major') return false;
    if (activeFilter !== 'all' && activeFilter !== 'major' && card.suit !== activeFilter) return false;
    
    if (searchKeyword) {
      const matchNameKo = card.nameKo.toLowerCase().includes(searchKeyword);
      const matchNameEn = card.nameEn.toLowerCase().includes(searchKeyword);
      const matchKeywordsUp = card.keywordsUp.some(k => k.toLowerCase().includes(searchKeyword));
      return matchNameKo || matchNameEn || matchKeywordsUp;
    }
    return true;
  });

  if (filtered.length === 0) {
    elements.encyclopediaGrid.innerHTML = `
      <div class="no-history" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-folder-open"></i>
        <p>검색 조건에 맞는 타로 카드를 찾을 수 없습니다.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'study-card glass';
    cardEl.innerHTML = `
      <div class="card-border-gold">
        <div class="card-header-mini">
          <span class="card-arcana-badge">${card.type.toUpperCase()}</span>
        </div>
        <div class="card-img-container">
          <img src="https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${card.img}" alt="${card.nameKo}" class="card-artwork-img" loading="lazy">
        </div>
        <div class="card-footer-mini">
          <h3>${card.nameKo}</h3>
          <span>${card.nameEn}</span>
        </div>
      </div>
    `;
    
    cardEl.addEventListener('click', () => openStudyModal(card.id));
    elements.encyclopediaGrid.appendChild(cardEl);
  });
}

// 6. Detailed Study Modal controls (Upright Only)
function openStudyModal(cardId) {
  const card = TAROT_CARDS.find(c => c.id === cardId);
  if (!card) return;

  elements.modalTitle.textContent = `${card.nameKo} (${card.nameEn})`;
  elements.modalType.textContent = card.type === 'major' ? '메이저 아르카나' : '마이너 아르카나';
  
  let suitKo = '슈트 없음';
  if (card.suit === 'wands') suitKo = '완드 (Wands)';
  else if (card.suit === 'cups') suitKo = '컵 (Cups)';
  else if (card.suit === 'swords') suitKo = '소드 (Swords)';
  else if (card.suit === 'pentacles') suitKo = '펜타클 (Pentacles)';
  elements.modalSuit.textContent = suitKo;

  elements.modalCardImg.src = `https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${card.img}`;
  elements.modalCardArcana.textContent = card.type.toUpperCase();
  elements.modalCardNameKo.textContent = card.nameKo;
  elements.modalCardNameEn.textContent = card.nameEn;

  // Render Upright details directly
  elements.modalKeywordsUp.innerHTML = card.keywordsUp.map(k => `<span class="chip">${k}</span>`).join('');
  elements.modalMeaningUp.textContent = card.meaningUp;
  elements.modalAdvice.textContent = card.advice;

  elements.detailModal.classList.remove('hidden');
}

function initStudyModal() {
  elements.btnCloseModal.addEventListener('click', () => elements.detailModal.classList.add('hidden'));
  elements.detailModal.addEventListener('click', (e) => {
    if (e.target === elements.detailModal) elements.detailModal.classList.add('hidden');
  });
}

// 7. History Database Manager (Local Storage)
function saveSpreadToHistory() {
  const history = JSON.parse(localStorage.getItem('tarot_history')) || [];
  
  const spreadRecord = {
    id: Date.now(),
    spreadType: selectedSpread,
    cards: drawnCards.map(item => ({
      cardId: item.card.id
    })),
    time: new Date().toISOString()
  };

  history.unshift(spreadRecord);
  localStorage.setItem('tarot_history', JSON.stringify(history));
}

function renderHistory() {
  elements.historyList.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('tarot_history')) || [];

  if (history.length === 0) {
    elements.historyList.innerHTML = `
      <div class="no-history">
        <i class="fa-solid fa-hourglass-empty"></i>
        <p>아직 드로우한 타로 카드가 없습니다. 리딩룸에서 첫 번째 신비로운 카드를 뽑아보세요!</p>
      </div>
    `;
    elements.btnClearHistory.classList.add('hidden');
    return;
  }

  elements.btnClearHistory.classList.remove('hidden');

  history.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'history-item';
    
    const formattedTime = new Date(item.time).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const config = SPREAD_CONFIGS[item.spreadType || '1'];
    
    // Draw miniature thumbnails
    let thumbsHTML = '<div class="history-item-spread-thumbs">';
    item.cards.forEach(c => {
      const cardObj = TAROT_CARDS.find(tc => tc.id === c.cardId);
      if (cardObj) {
        thumbsHTML += `
          <div class="mini-thumb" title="${cardObj.nameKo}">
            <img src="https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${cardObj.img}" alt="${cardObj.nameKo}">
          </div>
        `;
      }
    });
    thumbsHTML += '</div>';

    itemEl.innerHTML = `
      ${thumbsHTML}
      <div class="history-info">
        <h4>${config.name} 리딩</h4>
        <p style="font-size:0.8rem; color:var(--color-text-muted); margin-top:2px;">
          ${item.cards.map(c => {
            const cardObj = TAROT_CARDS.find(tc => tc.id === c.cardId);
            return cardObj ? cardObj.nameKo : '';
          }).filter(Boolean).join(', ')}
        </p>
      </div>
      <span class="history-badge text-success glass">${item.cards.length}장 드로우</span>
      <span class="history-time">${formattedTime}</span>
    `;

    // Click item to load entire spread restore mockup
    itemEl.addEventListener('click', () => {
      switchTab('reading');
      
      selectedSpread = item.spreadType || '1';
      
      elements.spreadChips.querySelectorAll('.spread-chip').forEach(c => {
        if (c.getAttribute('data-spread') === selectedSpread) c.classList.add('active');
        else c.classList.remove('active');
      });

      resetTable();
      elements.tarotDeck.classList.add('hidden');
      elements.spreadBoard.classList.remove('hidden');
      elements.btnRevealAll.classList.add('hidden');
      elements.btnDrawAgain.classList.remove('hidden');

      item.cards.forEach((saved, idx) => {
        const cardObj = TAROT_CARDS.find(tc => tc.id === saved.cardId);
        if (!cardObj) return;

        drawnCards.push({
          card: cardObj,
          flipped: true
        });

        const slotEl = document.getElementById(`slot-${idx + 1}`);
        const cardEl = slotEl.querySelector('.tarot-card-3d');
        
        slotEl.querySelector('.card-artwork-img').src = `https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/${cardObj.img}`;
        slotEl.querySelector('.slot-reveal-name-ko').textContent = cardObj.nameKo;
        slotEl.querySelector('.slot-reveal-name-en').textContent = cardObj.nameEn;
        slotEl.querySelector('.card-arcana-badge').textContent = cardObj.type.toUpperCase();

        slotEl.classList.remove('hidden');
        slotEl.classList.add('slot-revealed');

        if (selectedSpread === '10' && idx === 1) {
          cardEl.style.transform = 'rotateY(180deg) rotateZ(90deg)';
        } else {
          cardEl.style.transform = 'rotateY(180deg)';
        }
      });

      renderInterpretationPanel();
      focusCardDetails(0);
    });

    elements.historyList.appendChild(itemEl);
  });
}

function initHistoryManager() {
  elements.btnClearHistory.addEventListener('click', () => {
    if (confirm('모든 리딩 기록을 영구적으로 삭제하시겠습니까?')) {
      localStorage.removeItem('tarot_history');
      renderHistory();
    }
  });
}

// 8. Sound Effects Player
function playSound(type) {
  try {
    if (type === 'chime') {
      elements.soundChime.currentTime = 0;
      elements.soundChime.volume = 0.35;
      elements.soundChime.play();
    } else if (type === 'shuffle') {
      elements.soundShuffle.currentTime = 0;
      elements.soundShuffle.volume = 0.45;
      elements.soundShuffle.play();
    }
  } catch (error) {
    console.warn("Audio playback prevented by browser auto-play restrictions.", error);
  }
}

// 9. Initialization Entry Point
document.addEventListener('DOMContentLoaded', () => {
  elements.logo.addEventListener('click', () => switchTab('lobby'));
  elements.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const tabId = link.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  initReadingRoom();
  initEncyclopedia();
  initStudyModal();
  initHistoryManager();
  
  switchTab('lobby');
});

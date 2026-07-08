// script.js — renders decks, all cards, and a 3-card reading UI.
// Uses local SVG placeholders for covers and cards included in the repo.
// NOTE: Place additional deck images at: assets/decks/<deckId>/<sanitized-card-name>.jpg
// Example: assets/decks/rider-waite/the-fool.jpg

document.addEventListener('DOMContentLoaded', ()=> {
  const decksContainer = document.getElementById('decks');
  const readingPanel = document.getElementById('reading-panel');
  const readingCardsEl = document.getElementById('reading-cards');
  const readingMeaningsEl = document.getElementById('reading-meanings');
  const closeBtn = document.getElementById('close-reading');
  const newReadingBtn = document.getElementById('new-reading');

  // Canonical 78 card names (Major + minor)
  const cardNames = [
    "The Fool","The Magician","The High Priestess","The Empress","The Emperor","The Hierophant","The Lovers",
    "The Chariot","Strength","The Hermit","Wheel of Fortune","Justice","The Hanged Man","Death","Temperance",
    "The Devil","The Tower","The Star","The Moon","The Sun","Judgement","The World",
    // Wands (Ace-King)
    "Ace of Wands","Two of Wands","Three of Wands","Four of Wands","Five of Wands","Six of Wands","Seven of Wands",
    "Eight of Wands","Nine of Wands","Ten of Wands","Page of Wands","Knight of Wands","Queen of Wands","King of Wands",
    // Cups
    "Ace of Cups","Two of Cups","Three of Cups","Four of Cups","Five of Cups","Six of Cups","Seven of Cups",
    "Eight of Cups","Nine of Cups","Ten of Cups","Page of Cups","Knight of Cups","Queen of Cups","King of Cups",
    // Swords
    "Ace of Swords","Two of Swords","Three of Swords","Four of Swords","Five of Swords","Six of Swords","Seven of Swords",
    "Eight of Swords","Nine of Swords","Ten of Swords","Page of Swords","Knight of Swords","Queen of Swords","King of Swords",
    // Pentacles
    "Ace of Pentacles","Two of Pentacles","Three of Pentacles","Four of Pentacles","Five of Pentacles","Six of Pentacles",
    "Seven of Pentacles","Eight of Pentacles","Nine of Pentacles","Ten of Pentacles","Page of Pentacles","Knight of Pentacles",
    "Queen of Pentacles","King of Pentacles"
  ];

  // Light sample deck list — change ids/names & add cover images under assets/decks/<id>/cover.svg
  const decks = [
    { id:'rider-waite', name:'Rider–Waite', cover:'assets/decks/rider-waite/cover.svg' },
    { id:'thoth', name:'Thoth', cover:'assets/decks/thoth/cover.svg' },
    { id:'marseilles', name:'Marseilles', cover:'assets/decks/marseilles/cover.svg' },
    { id:'devine', name:'Golden Devine', cover:'assets/decks/devine/cover.svg' },
    { id:'gypsy', name:'Gypsy Tarot', cover:'assets/decks/gypsy/cover.svg' },
    { id:'modern', name:'Modern Tarot', cover:'assets/decks/modern/cover.svg' },
    { id:'cosmic', name:'Cosmic Voyager', cover:'assets/decks/cosmic/cover.svg' },
    { id:'botanical', name:'Botanical Tarot', cover:'assets/decks/botanical/cover.svg' },
    { id:'vintage', name:'Vintage Deck', cover:'assets/decks/vintage/cover.svg' },
    { id:'minimal', name:'Minimalist Tarot', cover:'assets/decks/minimal/cover.svg' }
  ];

  // Simple meaning fallback (replace with a full meaning set if desired)
  const meaningMap = {};
  cardNames.forEach(name => {
    meaningMap[name] = `A concise meaning for "${name}". Reflect on how this archetype shows up in your life.`;
  });

  // Utilities
  function sanitize(name){
    return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  function createDeckTile(deck){
    const tile = document.createElement('article');
    tile.className = 'deck-tile';
    tile.innerHTML = `
      <div class="deck-cover">
        <img src="${deck.cover}" alt="${deck.name} cover" onerror="this.src='assets/card-placeholder.svg'">
      </div>
      <div class="deck-meta">
        <div class="deck-title">${deck.name}</div>
        <div class="deck-actions">
          <button class="btn view-btn">View Deck</button>
          <button class="btn" data-deck="${deck.id}">Free Reading</button>
        </div>
      </div>
      <div class="cards-wrap" style="display:none"></div>
    `;
    // View deck
    const viewBtn = tile.querySelector('.view-btn');
    const wrap = tile.querySelector('.cards-wrap');
    let expanded = false;
    viewBtn.addEventListener('click', ()=> {
      expanded = !expanded;
      wrap.style.display = expanded ? 'grid' : 'none';
      viewBtn.textContent = expanded ? 'Hide' : 'View Deck';
      if(expanded && wrap.childElementCount===0) renderDeckCards(deck, wrap);
    });

    // Free reading
    const readBtn = tile.querySelector('.btn[data-deck]');
    readBtn.addEventListener('click', ()=> openReading(deck.id));

    return tile;
  }

  function renderDeckCards(deck, container){
    cardNames.forEach(name=>{
      const cardDiv = document.createElement('figure');
      cardDiv.className = 'card-item';
      const img = document.createElement('img');
      const imgPath = `assets/decks/${deck.id}/${sanitize(name)}.jpg`;
      img.src = imgPath;
      img.alt = `${name} — ${deck.name}`;
      img.loading = 'lazy';
      img.onerror = function(){ this.src = `assets/card-placeholder.svg`; };
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = name;
      cardDiv.appendChild(img);
      cardDiv.appendChild(figcaption);
      container.appendChild(cardDiv);
    });
  }

  // Render deck tiles
  decks.forEach(d => decksContainer.appendChild(createDeckTile(d)));

  // Reading UI
  function openReading(deckId){
    runReading(deckId);
    readingPanel.setAttribute('aria-hidden','false');
  }

  function closeReading(){
    readingPanel.setAttribute('aria-hidden','true');
  }

  function runReading(deckId){
    // pick 3 unique random indices
    const indices = [];
    while(indices.length < 3){
      const r = Math.floor(Math.random() * cardNames.length);
      if(!indices.includes(r)) indices.push(r);
    }
    readingCardsEl.innerHTML = '';
    readingMeaningsEl.innerHTML = '';
    indices.forEach((i, idx) => {
      const name = cardNames[i];
      const reversed = Math.random() < 0.45; // ~45% reversed
      const cardEl = document.createElement('div');
      cardEl.className = 'reading-card' + (reversed ? ' reversed' : '');
      const img = document.createElement('img');
      // choose deck-specific image if available
      const deckImg = `assets/decks/${deckId}/${sanitize(name)}.jpg`;
      img.src = deckImg;
      img.alt = `${name} ${reversed ? '(reversed)' : ''}`;
      img.onerror = function(){ this.src = `assets/card-placeholder.svg`; };
      cardEl.appendChild(img);
      readingCardsEl.appendChild(cardEl);

      // meaning
      const block = document.createElement('div');
      block.className = 'meaning-block';
      const h = document.createElement('h4');
      h.textContent = `${['Past','Present','Future'][idx]} — ${name} ${reversed ? '(reversed)' : ''}`;
      const p = document.createElement('p');
      p.textContent = meaningMap[name] + (reversed ? ' (reversed interpretation — consider internal blocks or inner work.)' : '');
      block.appendChild(h);
      block.appendChild(p);
      readingMeaningsEl.appendChild(block);
    });
    // small animation
    setTimeout(()=> {
      const cards = readingCardsEl.querySelectorAll('.reading-card');
      cards.forEach((c,i)=> c.style.transform = `translateY(0) rotate(${(i-1)*2}deg)`);
    },50);
  }

  closeBtn.addEventListener('click', closeReading);
  newReadingBtn.addEventListener('click', ()=> {
    // find a deck id currently visible or default to first
    // For simplicity, use first deck if nothing else chosen
    const deckId = decks[0].id;
    runReading(deckId);
  });

  // keyboard escape to close
  document.addEventListener('keydown', e=> {
    if(e.key === 'Escape') closeReading();
  });
});

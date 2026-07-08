// script.js — renders decks, all cards, and a 3-card reading UI.
// Updated: includes a full upright/reversed meanings dictionary and expanded reading text.
// Uses local SVG placeholders for covers and cards included in the repo.

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
    "Ace of Wands","Two of Wands","Three of Wands","Four of Wands","Five of Wands","Six of Wands","Seven of Wands",
    "Eight of Wands","Nine of Wands","Ten of Wands","Page of Wands","Knight of Wands","Queen of Wands","King of Wands",
    "Ace of Cups","Two of Cups","Three of Cups","Four of Cups","Five of Cups","Six of Cups","Seven of Cups",
    "Eight of Cups","Nine of Cups","Ten of Cups","Page of Cups","Knight of Cups","Queen of Cups","King of Cups",
    "Ace of Swords","Two of Swords","Three of Swords","Four of Swords","Five of Swords","Six of Swords","Seven of Swords",
    "Eight of Swords","Nine of Swords","Ten of Swords","Page of Swords","Knight of Swords","Queen of Swords","King of Swords",
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

  // Full upright/reversed meanings dictionary (concise but descriptive)
  const meanings = {
    "The Fool":{
      upright:"New beginnings, spontaneity, trust in the journey. A leap of faith and openness to possibility.",
      reversed:"Hesitation, reckless choices, fear of the unknown. Consider grounding before you leap."
    },
    "The Magician":{
      upright:"Skill, resourcefulness, focused will. You have the tools to make things happen.",
      reversed:"Scattered energy or manipulation. Re-evaluate motives and ensure clear intent."
    },
    "The High Priestess":{
      upright:"Intuition, inner wisdom, quiet knowing. Pay attention to dreams and subtle signals.",
      reversed:"Hidden information or disconnection from intuition. Slow down and listen inwardly."
    },
    "The Empress":{
      upright:"Nurturing, abundance, creative fertility. A time of growth, comfort, and care.",
      reversed:"Creative blocks, overprotection, or dependence. Rebalance self-care and boundaries."
    },
    "The Emperor":{
      upright:"Structure, stability, leadership. Use logic and authority to create order.",
      reversed:"Rigidity, control issues, or misuse of power. Loosen your grip and invite flexibility."
    },
    "The Hierophant":{
      upright:"Tradition, guidance, shared values. Seek wise counsel or established systems.",
      reversed:"Questioning norms, unconventional choices. It's okay to follow your own path."
    },
    "The Lovers":{
      upright:"Partnership, alignment, meaningful choice. A heart-centered union or decision.",
      reversed:"Misalignment, difficult choices, imbalance in relationships. Clarify values before choosing."
    },
    "The Chariot":{
      upright:"Determination, willpower, progress through focus. Keep your eyes on the goal.",
      reversed:"Loss of control, scattered drive, or stalled progress. Regain focus and steady the course."
    },
    "Strength":{
      upright:"Courage, compassion, inner resilience. Gentle strength wins over force.",
      reversed:"Self-doubt, impatience, or inner weakness. Nurture courage and be kind to yourself."
    },
    "The Hermit":{
      upright:"Solitude, introspection, seeking truth. A period of quiet inner work and discernment.",
      reversed:"Isolation or avoidance. Reconnect with supportive people when ready."
    },
    "Wheel of Fortune":{
      upright:"Cycles, turning points, destiny. Change is happening — ride the wave.",
      reversed:"Resistance to change or unexpected setbacks. Look for lessons and adapt."
    },
    "Justice":{
      upright:"Fairness, cause and effect, clarity. Decisions based on truth and balance.",
      reversed:"Bias, unfair outcomes, or avoidance of responsibility. Seek honest resolution."
    },
    "The Hanged Man":{
      upright:"Surrender, new perspective, voluntary pause. See things differently to move forward.",
      reversed:"Stagnation or unwillingness to release. Consider what you must let go of."
    },
    "Death":{
      upright:"Transformation, endings leading to new beginnings. Clear closure for renewal.",
      reversed:"Fear of change or delayed transition. Embrace the necessary endings for growth."
    },
    "Temperance":{
      upright:"Balance, moderation, integration. Blend opposing forces with patience.",
      reversed:"Excess or imbalance. Recalibrate and restore harmony in your life."
    },
    "The Devil":{
      upright:"Attachment, material bondage, temptation. Identify patterns that keep you stuck.",
      reversed:"Release from bondage, reclaiming power. Break free from limiting behaviors."
    },
    "The Tower":{
      upright:"Sudden upheaval, revelation, clearing illusions. Destruction leads to rebuilding.",
      reversed:"Avoided disaster or prolonged crisis. Use the shake-up to reconstruct more honestly."
    },
    "The Star":{
      upright:"Hope, healing, renewed faith. A calm guide after turmoil; inspiration returns.",
      reversed:"Doubt or delayed healing. Tend to small steps and restore trust gradually."
    },
    "The Moon":{
      upright:"Mystery, dreams, subconscious currents. Pay attention to symbolism and intuition.",
      reversed:"Confusion cleared, truth emerging. Seek clarity and question assumptions."
    },
    "The Sun":{
      upright:"Joy, success, vitality. Confidence and clarity shine; celebrate progress.",
      reversed:"Temporary clouding or understated joy. Reconnect with simple pleasures."
    },
    "Judgement":{
      upright:"Awakening, reckoning, inner calling. A time of evaluation and rebirth.",
      reversed:"Self-judgment or resistance to change. Forgive yourself and answer your call."
    },
    "The World":{
      upright:"Completion, integration, achievement. A cycle fulfills; stand on your accomplishment.",
      reversed:"Delayed closure or new cycle pending. Tie up loose ends before moving on."
    },

    // Wands
    "Ace of Wands":{upright:"Creative spark, new energy, initiative.",reversed:"Missed opportunity or hesitation — rekindle your passion."},
    "Two of Wands":{upright:"Planning, vision, early progress.",reversed:"Fear of unknown or narrow perspective — expand your view."},
    "Three of Wands":{upright:"Long-term success, foresight, expansion.",reversed:"Obstacles to progress or delays — reassess expectations."},
    "Four of Wands":{upright:"Celebration, homecoming, community.",reversed:"Cancelled plans or inner instability — find small reasons to celebrate."},
    "Five of Wands":{upright:"Conflict, healthy competition, friction.",reversed:"Avoided conflict or internal struggle — address tensions constructively."},
    "Six of Wands":{upright:"Recognition, victory, public praise.",reversed:"Ego issues or delayed recognition — stay humble and persistent."},
    "Seven of Wands":{upright:"Defense, standing your ground.",reversed:"Overwhelm or feeling under attack — pick your battles wisely."},
    "Eight of Wands":{upright:"Swift movement, communication, momentum.",reversed:"Delays or miscommunications — clarify and be patient."},
    "Nine of Wands":{upright:"Resilience, perseverance after hardship.",reversed:"Burnout or defensiveness — rest and heal before continuing."},
    "Ten of Wands":{upright:"Burden, responsibility, completion under strain.",reversed:"Lightening load or refusing help — delegate and simplify."},
    "Page of Wands":{upright:"Enthusiastic message, new pursuit.",reversed:"Immaturity or scattered ideas — channel curiosity into practice."},
    "Knight of Wands":{upright:"Bold action, adventurous pursuit.",reversed:"Impulsiveness or recklessness — temper speed with planning."},
    "Queen of Wands":{upright:"Warmth, confidence, creative leadership.",reversed:"Jealousy or burnout — protect your energy and boundaries."},
    "King of Wands":{upright:"Visionary leadership, entrepreneurship.",reversed:"Domineering or unfocused drive — lead with integrity and care."},

    // Cups
    "Ace of Cups":{upright:"Emotional renewal, new love, compassion.",reversed:"Repressed feelings or blocked heart — allow vulnerability."},
    "Two of Cups":{upright:"Mutual attraction, partnership, harmony.",reversed:"Imbalance in relationship or miscommunication — realign intentions."},
    "Three of Cups":{upright:"Friendship, celebration, community support.",reversed:"Overindulgence or gossip — keep celebrations healthy."},
    "Four of Cups":{upright:"Contemplation, dissatisfaction, reassessment.",reversed:"New awareness or acceptance — open to offers you previously ignored."},
    "Five of Cups":{upright:"Loss, grief, focusing on the negative.",reversed:"Recovery, acceptance, seeing remaining blessings."},
    "Six of Cups":{upright:"Nostalgia, kindness, simple joys.",reversed:"Stuck in the past or unrealistic idealizing — ground yourself in the present."},
    "Seven of Cups":{upright:"Choices, imagination, tempting options.",reversed:"Clarity emerges or illusion fades — choose with discernment."},
    "Eight of Cups":{upright:"Leaving behind, spiritual searching.",reversed:"Avoidance or returning to what no longer serves — evaluate motives."},
    "Nine of Cups":{upright:"Satisfaction, wishes fulfilled, comfort.",reversed:"Complacency or fleeting pleasure — seek lasting fulfillment."},
    "Ten of Cups":{upright:"Emotional harmony, family contentment.",reversed:"Family tension or unmet expectations — communicate openly."},
    "Page of Cups":{upright:"Creative invitation, intuitive message.",reversed:"Emotional immaturity or creative block — nurture sensitive curiosity."},
    "Knight of Cups":{upright:"Romantic proposal, poetic action.",reversed:"Idealism without grounding — balance heart and reason."},
    "Queen of Cups":{upright:"Emotional intelligence, empathy, healer.",reversed:"Overly enmeshed or emotionally drained — set boundaries."},
    "King of Cups":{upright:"Compassionate leadership, steady emotional control.",reversed:"Emotional volatility or suppression — practice healthy expression."},

    // Swords
    "Ace of Swords":{upright:"Mental clarity, breakthrough truth.",reversed:"Confusion or clouded thinking — step back to gather facts."},
    "Two of Swords":{upright:"Difficult choice, stalemate, balanced decision.",reversed:"Avoidance or indecision — gain information and choose with courage."},
    "Three of Swords":{upright:"Heartbreak, sorrow, truth revealed.",reversed:"Healing after pain or delayed grief — allow time to mend."},
    "Four of Swords":{upright:"Rest, recuperation, meditation.",reversed:"Restlessness or forced pause — use downtime intentionally."},
    "Five of Swords":{upright:"Conflict, hollow victory, tension.",reversed:"Reconciliation or moving past conflict — repair where possible."},
    "Six of Swords":{upright:"Transition, moving toward calmer waters.",reversed:"Resistance to change or lingering trauma — seek support for passage."},
    "Seven of Swords":{upright:"Strategy, stealth, cleverness.",reversed:"Exposure of deceit or self-deception — come clean and realign ethics."},
    "Eight of Swords":{upright:"Restricted thinking, feeling trapped.",reversed:"Releasing limiting beliefs or seeing options — take small steps outward."},
    "Nine of Swords":{upright:"Anxiety, nightmares, worry.",reversed:"Easing anxiety or ongoing rumination — seek perspective and help."},
    "Ten of Swords":{upright:"Ruin, finality, painful ending.",reversed:"Recovery begins or resisting the end — focus on healing and new foundations."},
    "Page of Swords":{upright:"Curiosity, mental agility, news.",reversed:"Gossip or impatience — use discernment before speaking."},
    "Knight of Swords":{upright:"Swift action, assertive communication.",reversed:"Impulsiveness or aggression — temper speed with tact."},
    "Queen of Swords":{upright:"Clear thinking, honest boundaries.",reversed:"Bitterness or isolation — soften truth with compassion."},
    "King of Swords":{upright:"Intellectual authority, fair judgment.",reversed:"Cruelty or misuse of intellect — lead with ethics and empathy."},

    // Pentacles
    "Ace of Pentacles":{upright:"Material opportunity, new investment, prosperity.",reversed:"Missed opportunity or poor planning — prepare practically."},
    "Two of Pentacles":{upright:"Balance of priorities, adaptability.",reversed:"Overcommitment or poor time management — simplify and prioritize."},
    "Three of Pentacles":{upright:"Collaboration, skilled workmanship.",reversed:"Poor teamwork or lack of recognition — clarify roles and standards."},
    "Four of Pentacles":{upright:"Stability, holding on, financial caution.",reversed:"Greed or fear-based hoarding — open to sharing and trust."},
    "Five of Pentacles":{upright:"Hardship, exclusion, material worry.",reversed:"Recovery or seeking help — accept support to rebuild."},
    "Six of Pentacles":{upright:"Generosity, fair exchange, charity.",reversed:"Strings attached or imbalance in giving — create equitable arrangements."},
    "Seven of Pentacles":{upright:"Long-term investment, patience, appraisal.",reversed:"Impatience or lack of progress — reassess methods and expectations."},
    "Eight of Pentacles":{upright:"Apprenticeship, diligent practice, mastery.",reversed:"Perfectionism or wasted effort — focus on purposeful practice."},
    "Nine of Pentacles":{upright:"Self-sufficiency, comfort, refinement.",reversed:"Dependency or material insecurity — celebrate earned independence."},
    "Ten of Pentacles":{upright:"Legacy, family wealth, long-term security.",reversed:"Family disputes or unstable legacy — clarify values and sharing."},
    "Page of Pentacles":{upright:"Study, practical opportunity, grounded beginnings.",reversed:"Lack of follow-through or distractions — commit to one step at a time."},
    "Knight of Pentacles":{upright:"Steady progress, reliability, patient drive.",reversed:"Stagnation or obstinacy — introduce small, regular changes."},
    "Queen of Pentacles":{upright:"Practical nurturer, resourceful caregiver.",reversed:"Neglecting self-care or material worry — balance home and self."},
    "King of Pentacles":{upright:"Prosperous leader, steady provider.",reversed:"Materialism or controlling behavior — align wealth with values."}
  };

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
    readingPanel.focus && readingPanel.focus();
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
      const cardMeaning = meanings[name] || {upright: 'Meaning not found.', reversed: 'Meaning not found.'};
      p.textContent = reversed ? cardMeaning.reversed : cardMeaning.upright;

      // Add a short practical tip and affirmation
      const tip = document.createElement('p');
      tip.style.fontStyle = 'italic';
      tip.style.marginTop = '6px';
      tip.textContent = `${reversed ? 'Practical tip:' : 'Practical tip:'} ${generateTip(name, reversed)}\nAffirmation: ${generateAffirmation(name, reversed)}`;

      block.appendChild(h);
      block.appendChild(p);
      block.appendChild(tip);
      readingMeaningsEl.appendChild(block);
    });
    // small animation
    setTimeout(()=> {
      const cards = readingCardsEl.querySelectorAll('.reading-card');
      cards.forEach((c,i)=> c.style.transform = `translateY(0) rotate(${(i-1)*2}deg)`);
    },50);
  }

  function generateTip(name, reversed){
    // Small set of generalised tips based on suit or major arcana
    if(name.startsWith('Ace of')) return reversed ? 'Revisit your initial idea; refine it before acting.' : 'Take a concrete first step to manifest this opportunity.';
    if(['Wands','Cups','Swords','Pentacles'].some(s=> name.includes(s))) {
      if(name.includes('Wands')) return reversed ? 'Slow down and plan to avoid wasted energy.' : 'Act on inspired ideas with modest planning.';
      if(name.includes('Cups')) return reversed ? 'Name your feelings and share with a trusted person.' : 'Open your heart to connection and gratitude.';
      if(name.includes('Swords')) return reversed ? 'Get clarity before arguing; listen first.' : 'State your truth clearly and kindly.';
      if(name.includes('Pentacles')) return reversed ? 'Create a simple budget or task list.' : 'Invest your time with consistent effort.';
    }
    // Major arcana quick tips
    if(['The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World'].includes(name)){
      switch(name){
        case 'The Fool': return reversed ? 'Prepare rather than rush; gather information.' : 'Take a small brave step toward what excites you.';
        case 'The Magician': return reversed ? 'Clarify your goals and align your actions.' : 'Use one skill today to move your project forward.';
        case 'The High Priestess': return reversed ? 'Journal to reconnect with your inner voice.' : 'Notice your dreams and quiet prompts.';
        case 'The Empress': return reversed ? 'Make space for creativity and rest.' : 'Nurture a project or relationship with small acts.';
        case 'The Emperor': return reversed ? 'Loosen overly strict expectations.' : 'Set one clear boundary to stabilize your day.';
        case 'The Hierophant': return reversed ? 'Consider alternative perspectives.' : 'Seek mentorship or established guidance.';
        case 'The Lovers': return reversed ? 'Reflect on what you truly value.' : 'Have an honest conversation about needs.';
        case 'The Chariot': return reversed ? 'Reclaim small wins to rebuild momentum.' : 'Plan the next decisive step and commit.';
        case 'Strength': return reversed ? 'Practice kindness toward yourself.' : 'Use gentle persistence to face a challenge.';
        case 'The Hermit': return reversed ? 'Reach out to close friends for perspective.' : 'Take quiet time to reflect without distractions.';
        case 'Wheel of Fortune': return reversed ? 'Adapt to changes rather than resisting.' : 'Ride the change and position yourself for growth.';
        case 'Justice': return reversed ? 'Own any mistakes and make amends.' : 'Make a fair decision with clear evidence.';
        case 'The Hanged Man': return reversed ? 'Release the need to control outcomes.' : 'Allow a pause to gain fresh insight.';
        case 'Death': return reversed ? 'Acknowledge loss and identify one next step.' : 'Let go of what no longer serves to welcome new life.';
        case 'Temperance': return reversed ? 'Slow down and rebalance daily routines.' : 'Blend two approaches to create harmony.';
        case 'The Devil': return reversed ? 'Celebrate small steps toward freedom.' : 'Name one pattern you can begin to shift.';
        case 'The Tower': return reversed ? 'Use disruption to re-evaluate foundations.' : 'Accept the shake-up as a clearing for truth.';
        case 'The Star': return reversed ? 'Practice small acts of hope and self-care.' : 'Do one restorative thing that replenishes you.';
        case 'The Moon': return reversed ? 'Seek evidence to dispel fear-driven thoughts.' : 'Note dreams and intuition; record them.';
        case 'The Sun': return reversed ? 'Celebrate small successes and invite joy.' : 'Share your light with someone today.';
        case 'Judgement': return reversed ? 'Practice self-forgiveness and a new commitment.' : 'Answer the call to align with your purpose.';
        case 'The World': return reversed ? 'Complete one small task to close the cycle.' : 'Recognize your achievements and rest into completion.';
        default: return 'Take one small, practical next step.';
      }
    }
    return 'Take a practical small step aligned with this theme.';
  }

  function generateAffirmation(name, reversed){
    // Short affirmations that match card energy
    if(reversed) return 'I release what no longer serves me and choose clarity.';
    if(name.includes('Fool') || name==='The Fool') return 'I welcome new beginnings with curiosity and courage.';
    if(name.includes('Magician')) return 'I am capable and create with focused intention.';
    if(name.includes('Empress')) return 'I nurture and receive abundance easily.';
    if(name.includes('Sun')) return 'I shine with confidence and joy.';
    if(name.includes('Moon')) return 'I trust my intuition and honor my inner world.';
    if(name.includes('Star')) return 'I am guided and healing flows to me.';
    // General positive ones
    return 'I am open to guidance and act with wise intention.';
  }

  closeBtn.addEventListener('click', closeReading);
  newReadingBtn.addEventListener('click', ()=> {
    const deckId = decks[0].id;
    runReading(deckId);
  });

  // keyboard escape to close
  document.addEventListener('keydown', e=> {
    if(e.key === 'Escape') closeReading();
  });
});

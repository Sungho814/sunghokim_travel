// Data for demo
const experiences = [
  {
    id: 'cn-1',
    country: 'China',
    title: 'Historic Beijing Walk & Hutong Food Tour',
    description: 'Discover Beijing’s hutongs, local snacks, and a guided walk through heritage alleys.',
    price: 85.00,
    duration: '1 day'
  },
  {
    id: 'cn-2',
    country: 'China',
    title: 'Yangtze River Eco-Cruise (sample)',
    description: 'Short eco-focused cruise with local guides and community visits.',
    price: 220.00,
    duration: '3 days'
  },
  {
    id: 'bd-1',
    country: 'Bangladesh',
    title: 'Dhaka Street Food & Sari Market Experience',
    description: 'Explore Dhaka’s lively markets, street food, and cultural landmarks.',
    price: 45.00,
    duration: 'Half day'
  },
  {
    id: 'bd-2',
    country: 'Bangladesh',
    title: 'Sundarbans Boat & Wildlife Intro',
    description: 'A short guided boat tour to learn about mangrove conservation and wildlife.',
    price: 150.00,
    duration: '1 day'
  },
  {
    id: 'kr-1',
    country: 'South Korea',
    title: 'Seoul Cultural Immersion: Palaces & Hanbok',
    description: 'Visit palaces, try Hanbok, and enjoy a traditional tea ceremony.',
    price: 70.00,
    duration: '1 day'
  },
  {
    id: 'kr-2',
    country: 'South Korea',
    title: 'Jeju Food & Nature Mini Retreat',
    description: 'Local farms, citrus tastings, and coastal walks in Jeju Island.',
    price: 180.00,
    duration: '2 days'
  }
];

// DOM refs
const grid = document.getElementById('destinations');
const filter = document.getElementById('country-filter');
const search = document.getElementById('search');
const showAllBtn = document.getElementById('show-all');
const notionBtn = document.getElementById('show-notion');
const notionLink = document.getElementById('notion-link');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalClose = document.getElementById('modal-close');
const bookingForm = document.getElementById('booking-form');
const travelerName = document.getElementById('traveler-name');
const travelerCount = document.getElementById('traveler-count');
const pricePerPerson = document.getElementById('price-per-person');
const totalAmountEl = document.getElementById('total-amount');
const commissionAmountEl = document.getElementById('commission-amount');
const bookingResult = document.getElementById('booking-result');

// initial
document.getElementById('year').textContent = new Date().getFullYear();
notionLink.href = 'https://www.notion.so/your-prototype-link'; // replace with your Notion URL

// Render cards
function renderCards(data){
  grid.innerHTML = '';
  if(data.length === 0){
    grid.innerHTML = '<p style="grid-column:1/-1;color:var(--muted)">No experiences found.</p>';
    return;
  }
  data.forEach(exp => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="meta"><span class="badge">${exp.country}</span><span>${exp.duration}</span></div>
      <h4>${exp.title}</h4>
      <p>${exp.description}</p>
      <div class="meta"><strong>$${exp.price.toFixed(2)}</strong></div>
      <div class="actions">
        <button class="btn-details" data-id="${exp.id}">Details</button>
        <button class="btn-book" data-id="${exp.id}">Book (simulate)</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filter & search
function applyFilters(){
  const country = filter.value;
  const q = search.value.trim().toLowerCase();
  let results = experiences.filter(e => {
    return (country === 'all' || e.country === country) &&
           (q === '' || (e.title + ' ' + e.description).toLowerCase().includes(q));
  });
  renderCards(results);
}

// Modal controls
function openModal(exp){
  modal.setAttribute('aria-hidden','false');
  modalTitle.textContent = exp.title;
  modalDesc.textContent = `${exp.country} — ${exp.description}`;
  // preset booking form
  pricePerPerson.value = exp.price.toFixed(2);
  travelerCount.value = 1;
  travelerName.value = '';
  bookingResult.hidden = true;
  updateSummary();
  // store current id on form dataset
  bookingForm.dataset.expid = exp.id;
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
}

// Booking summary calculation
function updateSummary(){
  const count = Number(travelerCount.value) || 0;
  const price = Number(pricePerPerson.value) || 0;
  // compute total and commission (10%)
  const total = Math.round((count * price)*100)/100;
  const commission = Math.round((total * 0.10)*100)/100;
  totalAmountEl.textContent = `$${total.toFixed(2)}`;
  commissionAmountEl.textContent = `$${commission.toFixed(2)}`;
}

// Event listeners
filter.addEventListener('change', applyFilters);
search.addEventListener('input', applyFilters);
showAllBtn.addEventListener('click', () => { filter.value='all'; search.value=''; applyFilters(); });
notionBtn.addEventListener('click', () => window.open(notionLink.href,'_blank'));

// delegate card buttons
grid.addEventListener('click', (e) => {
  const detailsBtn = e.target.closest('.btn-details');
  const bookBtn = e.target.closest('.btn-book');
  if(detailsBtn){
    const id = detailsBtn.dataset.id;
    const exp = experiences.find(x => x.id === id);
    if(exp) openModal(exp);
  } else if(bookBtn){
    const id = bookBtn.dataset.id;
    const exp = experiences.find(x => x.id === id);
    if(exp) openModal(exp);
  }
});

// modal close
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if(e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeModal();
});

// update summary when inputs change
travelerCount.addEventListener('input', updateSummary);
pricePerPerson.addEventListener('input', updateSummary);

// booking submit
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const expid = bookingForm.dataset.expid;
  const exp = experiences.find(x => x.id === expid);
  const name = travelerName.value.trim();
  const count = Number(travelerCount.value) || 0;
  const price = Number(pricePerPerson.value) || 0;
  const total = Math.round((count * price)*100)/100;
  const commission = Math.round((total * 0.10)*100)/100;

  bookingResult.hidden = false;
  bookingResult.innerHTML = `
    <p><strong>Booking simulated for:</strong> ${name || 'Anonymous'}</p>
    <p><strong>Experience:</strong> ${exp.title}</p>
    <p><strong>Travelers:</strong> ${count}</p>
    <p><strong>Total (USD):</strong> $${total.toFixed(2)}</p>
    <p><strong>Platform commission (10%):</strong> $${commission.toFixed(2)}</p>
    <p style="color:green;font-weight:700">✅ Simulation complete — This is a mock booking (no payment taken)</p>
  `;
});

// initial render
renderCards(experiences);
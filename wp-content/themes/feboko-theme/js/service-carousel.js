(function() {
  var track = document.getElementById('service-carousel-track');
  var prev = document.getElementById('service-carousel-prev');
  var next = document.getElementById('service-carousel-next');

  if (!track || !prev || !next) return;

  var cards = track.querySelectorAll('.service-grid-card');
  var currentIndex = 0;

  function getVisible() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisible());
  }

  function update() {
    var gap = parseFloat(getComputedStyle(track).gap) || 40;
    var card = cards[0];
    if (!card) return;
    var cardWidth = card.offsetWidth;
    var offset = currentIndex * (cardWidth + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';
    prev.classList.toggle('service-carousel-arrow--disabled', currentIndex <= 0);
    next.classList.toggle('service-carousel-arrow--disabled', currentIndex >= getMaxIndex());
  }

  prev.addEventListener('click', function() {
    if (currentIndex > 0) { currentIndex--; update(); }
  });

  next.addEventListener('click', function() {
    if (currentIndex < getMaxIndex()) { currentIndex++; update(); }
  });

  window.addEventListener('resize', function() {
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    update();
  });

  update();
})();

// Collapsible table category sections with localStorage persistence
(function() {
  const STORAGE_KEY = 'tableCollapsed';

  function getCollapsedState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveCollapsedState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // localStorage unavailable
    }
  }

  function setCategory(categoryId, collapsed) {
    const headers = document.querySelectorAll('.category-header[data-category="' + categoryId + '"]');
    const rows = document.querySelectorAll('[data-category-row="' + categoryId + '"]');

    headers.forEach(function(el) {
      el.classList.toggle('collapsed', collapsed);
      el.setAttribute('aria-expanded', String(!collapsed));
    });

    rows.forEach(function(el) {
      el.classList.toggle('category-row-hidden', collapsed);
    });
  }

  function toggleCategory(categoryId) {
    const state = getCollapsedState();
    const collapsed = !state[categoryId];
    state[categoryId] = collapsed;
    if (!collapsed) delete state[categoryId];
    saveCollapsedState(state);
    setCategory(categoryId, collapsed);
  }

  // Apply saved state on load
  const state = getCollapsedState();
  Object.keys(state).forEach(function(categoryId) {
    if (state[categoryId]) {
      setCategory(categoryId, true);
    }
  });

  // Add click and keyboard listeners to category headers
  document.querySelectorAll('.category-header[data-category]').forEach(function(header) {
    header.addEventListener('click', function() {
      toggleCategory(this.getAttribute('data-category'));
    });
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCategory(this.getAttribute('data-category'));
      }
    });
  });
})();

(function () {
  let activePopover = null;

  function closeActive() {
    if (!activePopover) return;
    activePopover.remove();
    activePopover = null;
    const backdrop = document.querySelector('.note-backdrop');
    if (backdrop) backdrop.remove();
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  function createCloseBtn() {
    const btn = document.createElement('button');
    btn.className = 'note-close-btn';
    btn.setAttribute('aria-label', 'Close');
    btn.innerHTML = '&times;';
    btn.addEventListener('click', closeActive);
    return btn;
  }

  function showBottomSheet(content) {
    const backdrop = document.createElement('div');
    backdrop.className = 'note-backdrop';
    backdrop.addEventListener('click', closeActive);
    document.body.appendChild(backdrop);

    const sheet = document.createElement('div');
    sheet.className = 'note-bottom-sheet';
    sheet.appendChild(createCloseBtn());
    sheet.appendChild(content);
    document.body.appendChild(sheet);
    activePopover = sheet;

    // Force reflow then animate
    sheet.offsetHeight;
    backdrop.offsetHeight;
    backdrop.classList.add('active');
    sheet.classList.add('active');
  }

  function showPopover(content, trigger) {
    const popover = document.createElement('div');
    popover.className = 'note-popover';
    popover.appendChild(createCloseBtn());
    popover.appendChild(content);

    const arrow = document.createElement('div');
    arrow.className = 'note-popover-arrow';
    popover.appendChild(arrow);

    document.body.appendChild(popover);
    activePopover = popover;

    // Position relative to trigger
    const rect = trigger.getBoundingClientRect();
    const popRect = popover.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < popRect.height + 12 && spaceAbove > spaceBelow;

    let top;
    if (showAbove) {
      top = rect.top + scrollY - popRect.height - 10;
      arrow.classList.add('arrow-bottom');
    } else {
      top = rect.bottom + scrollY + 10;
      arrow.classList.add('arrow-top');
    }

    let left = rect.left + scrollX + rect.width / 2 - popRect.width / 2;
    // Clamp to viewport
    left = Math.max(scrollX + 8, Math.min(left, scrollX + window.innerWidth - popRect.width - 8));

    popover.style.top = top + 'px';
    popover.style.left = left + 'px';

    // Position arrow to point at trigger center
    let arrowLeft = rect.left + scrollX + rect.width / 2 - left;
    arrowLeft = Math.max(16, Math.min(arrowLeft, popRect.width - 16));
    arrow.style.left = arrowLeft + 'px';
  }

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[data-note-id]');
    if (link) {
      e.preventDefault();
      const noteId = link.getAttribute('data-note-id');
      const template = document.getElementById('note-content-' + noteId);
      if (!template) return;

      closeActive();
      const content = template.content.cloneNode(true);
      const wrapper = document.createElement('div');
      wrapper.appendChild(content);

      if (isMobile()) {
        showBottomSheet(wrapper);
      } else {
        showPopover(wrapper, link);
      }
      return;
    }

    // Close on click outside
    if (activePopover && !e.target.closest('.note-popover') && !e.target.closest('.note-bottom-sheet')) {
      closeActive();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeActive();
  });
})();

(function () {
  var activePopover = null;

  function closeActive() {
    if (!activePopover) return;
    activePopover.remove();
    activePopover = null;
    var backdrop = document.querySelector('.note-backdrop');
    if (backdrop) backdrop.remove();
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  function createCloseBtn() {
    var btn = document.createElement('button');
    btn.className = 'note-close-btn';
    btn.setAttribute('aria-label', 'Close');
    btn.innerHTML = '&times;';
    btn.addEventListener('click', closeActive);
    return btn;
  }

  function showBottomSheet(content) {
    var backdrop = document.createElement('div');
    backdrop.className = 'note-backdrop';
    backdrop.addEventListener('click', closeActive);
    document.body.appendChild(backdrop);

    var sheet = document.createElement('div');
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
    var popover = document.createElement('div');
    popover.className = 'note-popover';
    popover.appendChild(createCloseBtn());
    popover.appendChild(content);

    var arrow = document.createElement('div');
    arrow.className = 'note-popover-arrow';
    popover.appendChild(arrow);

    document.body.appendChild(popover);
    activePopover = popover;

    // Position relative to trigger
    var rect = trigger.getBoundingClientRect();
    var popRect = popover.getBoundingClientRect();
    var scrollY = window.scrollY;
    var scrollX = window.scrollX;

    var spaceAbove = rect.top;
    var spaceBelow = window.innerHeight - rect.bottom;
    var showAbove = spaceBelow < popRect.height + 12 && spaceAbove > spaceBelow;

    var top;
    if (showAbove) {
      top = rect.top + scrollY - popRect.height - 10;
      arrow.classList.add('arrow-bottom');
    } else {
      top = rect.bottom + scrollY + 10;
      arrow.classList.add('arrow-top');
    }

    var left = rect.left + scrollX + rect.width / 2 - popRect.width / 2;
    // Clamp to viewport
    left = Math.max(scrollX + 8, Math.min(left, scrollX + window.innerWidth - popRect.width - 8));

    popover.style.top = top + 'px';
    popover.style.left = left + 'px';

    // Position arrow to point at trigger center
    var arrowLeft = rect.left + scrollX + rect.width / 2 - left;
    arrowLeft = Math.max(16, Math.min(arrowLeft, popRect.width - 16));
    arrow.style.left = arrowLeft + 'px';
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-note-id]');
    if (link) {
      e.preventDefault();
      var noteId = link.getAttribute('data-note-id');
      var template = document.getElementById('note-content-' + noteId);
      if (!template) return;

      closeActive();
      var content = template.content.cloneNode(true);
      var wrapper = document.createElement('div');
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

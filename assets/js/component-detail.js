// Component detail page
(function() {
  var titleEl = document.getElementById('component-title');
  var subtitleEl = document.getElementById('component-subtitle');
  var contentEl = document.getElementById('component-content');

  if (!titleEl || !subtitleEl || !contentEl) return;

  if (typeof platformData === 'undefined' || typeof componentMeta === 'undefined') {
    contentEl.innerHTML = '<div class="p-4 text-red-600">Error: Platform data not loaded.</div>';
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var componentId = params.get('id');

  // Get sorted years (newest first)
  var years = Object.keys(platformData).sort().reverse();

  if (!componentId) {
    renderIndex();
    return;
  }

  // Find component metadata
  var componentInfo = findComponent(componentId);
  if (!componentInfo) {
    titleEl.textContent = 'Component Not Found';
    subtitleEl.textContent = 'The component "' + componentId + '" does not exist.';
    contentEl.innerHTML = '<div class="text-center"><a href="component.html" class="text-blue-600 dark:text-blue-400 hover:underline">Browse all components</a></div>';
    return;
  }

  renderDetail(componentInfo);

  function findComponent(id) {
    for (var i = 0; i < componentMeta.categories.length; i++) {
      var category = componentMeta.categories[i];
      for (var j = 0; j < category.items.length; j++) {
        var item = category.items[j];
        if (item.id === id) {
          return { item: item, category: category };
        }
      }
    }
    return null;
  }

  function getComponentValue(yearData, categoryId, itemId) {
    var section;
    if (categoryId === 'components') {
      section = yearData.components;
    } else {
      section = yearData[categoryId];
    }
    if (!section || !section[itemId]) return null;
    return section[itemId];
  }

  function renderDetail(info) {
    var item = info.item;
    var category = info.category;

    // Update hero
    titleEl.textContent = item.name;
    var subtitleParts = [category.name];
    if (item.subtitle) subtitleParts.push(item.subtitle);
    if (item.min_max) subtitleParts.push('Min version');
    subtitleEl.textContent = subtitleParts.join(' \u00B7 ');

    // Update page title
    document.title = item.name + ' \u2013 VFX Reference Platform';

    // Build version history (iterate oldest to newest so changes are detected correctly)
    var rows = [];
    var prevVersion = null;
    var yearsOldestFirst = years.slice().reverse();

    for (var i = 0; i < yearsOldestFirst.length; i++) {
      var year = yearsOldestFirst[i];
      var yearData = platformData[year];
      var entry = getComponentValue(yearData, category.id, item.id);
      var version = entry ? (entry.version || null) : null;
      var status = yearData.status || 'unknown';
      var note = entry ? (entry.note || null) : null;
      var changed = (prevVersion !== null && version !== prevVersion) || (prevVersion === null && i > 0 && version !== null);

      rows.push({
        year: year,
        version: version,
        status: status,
        note: note,
        changed: changed
      });

      prevVersion = version;
    }

    // Reverse so newest years display first
    rows.reverse();

    // Render table
    var html = '<div class="platform-table-wrapper" style="max-width:28rem;margin:0 auto"><div class="overflow-x-auto"><table class="platform-table"><thead><tr>';
    html += '<th class="text-left">Year</th>';
    html += '<th>Version</th>';
    html += '</tr></thead><tbody>';

    rows.forEach(function(row) {
      var rowClass = row.changed ? 'diff-changed' : '';
      html += '<tr class="' + rowClass + '">';
      html += '<td class="text-left font-medium">' + row.year + '</td>';
      html += '<td class="font-mono text-sm">' + (row.version || '\u2014') + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div></div>';

    contentEl.innerHTML = html;
  }

  function renderIndex() {
    titleEl.textContent = 'All Components';
    subtitleEl.textContent = 'Browse version history for any VFX Reference Platform component.';
    document.title = 'All Components \u2013 VFX Reference Platform';

    var html = '<div class="grid gap-8 md:grid-cols-2">';

    componentMeta.categories.forEach(function(category) {
      html += '<div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">';
      html += '<div class="bg-gray-100 dark:bg-gray-800 px-4 py-3 font-semibold">' + category.name + '</div>';
      html += '<ul class="divide-y divide-gray-100 dark:divide-gray-800">';

      category.items.forEach(function(item) {
        html += '<li><a href="component.html?id=' + item.id + '" class="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-blue-600 dark:text-blue-400 hover:underline">';
        html += item.name;
        if (item.subtitle) html += ' <span class="text-sm text-gray-500 dark:text-gray-400">' + item.subtitle + '</span>';
        html += '</a></li>';
      });

      html += '</ul></div>';
    });

    html += '</div>';

    contentEl.innerHTML = html;
  }
})();

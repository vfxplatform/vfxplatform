// Year comparison tool
(function() {
  const year1Select = document.getElementById('year1-select');
  const year2Select = document.getElementById('year2-select');
  const resultsContainer = document.getElementById('comparison-results');

  if (!year1Select || !year2Select || !resultsContainer) return;

  // Check if platformData is available
  if (typeof platformData === 'undefined' || typeof componentMeta === 'undefined') {
    resultsContainer.innerHTML = '<div class="p-4 text-red-600">Error: Platform data not loaded.</div>';
    return;
  }

  // Get sorted years (newest first)
  const years = Object.keys(platformData).sort().reverse();

  if (years.length === 0) {
    resultsContainer.innerHTML = '<div class="p-4 text-red-600">Error: No platform years found.</div>';
    return;
  }

  // Active filters (all enabled by default)
  var activeFilters = new Set(['unchanged', 'changed', 'added', 'removed']);

  // Populate select dropdowns
  function populateSelects() {
    years.forEach(function(year, index) {
      var option1 = new Option(year, year, index === 0, index === 0);
      var option2 = new Option(year, year, index === 1, index === 1);
      year1Select.add(option1);
      year2Select.add(option2);
    });
  }

  // Get component value from year data
  function getComponentValue(yearData, categoryId, itemId) {
    if (!yearData) return null;

    var section;
    if (categoryId === 'components') {
      section = yearData.components;
    } else {
      section = yearData[categoryId];
    }

    if (!section || !section[itemId]) return null;
    return section[itemId].version || null;
  }

  // Find differences between two years
  function findDifferences(year1, year2) {
    var data1 = platformData[year1];
    var data2 = platformData[year2];
    var diffs = [];

    componentMeta.categories.forEach(function(category) {
      category.items.forEach(function(item) {
        var val1 = getComponentValue(data1, category.id, item.id);
        var val2 = getComponentValue(data2, category.id, item.id);

        diffs.push({
          category: category.name,
          categoryId: category.id,
          component: item.name,
          componentId: item.id,
          value1: val1 || '\u2014',
          value2: val2 || '\u2014',
          type: getDiffType(val1, val2)
        });
      });
    });

    return diffs;
  }

  // Determine diff type
  // val1 is from year1 (newer), val2 is from year2 (older)
  function getDiffType(val1, val2) {
    if (!val1 && !val2) return 'unchanged';  // Both empty
    if (!val1) return 'removed';  // Missing in newer year = removed
    if (!val2) return 'added';    // Missing in older year = added
    if (val1 === val2) return 'unchanged';   // Same value
    return 'changed';
  }

  // Render comparison results
  function renderResults(year1, year2, differences) {
    // Filter by active filters
    var filtered = differences.filter(function(d) { return activeFilters.has(d.type); });

    var html = '<div class="platform-table-wrapper"><div class="overflow-x-auto"><table class="platform-table"><thead><tr>';
    html += '<th class="text-left">Category</th>';
    html += '<th class="text-left">Component</th>';
    html += '<th>' + year1 + '</th>';
    html += '<th>' + year2 + '</th>';
    html += '</tr></thead><tbody>';

    if (filtered.length === 0) {
      html += '<tr><td colspan="4" class="text-center py-8 text-gray-500 dark:text-gray-400">No components match the selected filters.</td></tr>';
    } else {
      var currentCategory = '';
      var categoryCount = {};

      // Count visible items per category for rowspan
      filtered.forEach(function(diff) {
        categoryCount[diff.category] = (categoryCount[diff.category] || 0) + 1;
      });

      filtered.forEach(function(diff) {
        var rowClass = 'diff-' + diff.type;
        var categoryCell = '';

        if (diff.category !== currentCategory) {
          categoryCell = '<td class="category-' + diff.categoryId + ' font-semibold align-middle" rowspan="' + categoryCount[diff.category] + '">' + diff.category + '</td>';
          currentCategory = diff.category;
        }

        html += '<tr class="' + rowClass + '">';
        html += categoryCell;
        html += '<td class="comp-name"><a href="component.html?id=' + diff.componentId + '" class="text-blue-600 dark:text-blue-400 hover:underline">' + diff.component + '</a></td>';
        html += '<td class="font-mono text-sm">' + diff.value1 + '</td>';
        html += '<td class="font-mono text-sm">' + diff.value2 + '</td>';
        html += '</tr>';
      });
    }

    html += '</tbody></table></div></div>';

    // Summary
    var totalDiffCount = differences.filter(function(d) { return d.type !== 'unchanged'; }).length;
    var showingCount = filtered.length;
    html += '<div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">';
    html += '<p class="text-sm text-gray-600 dark:text-gray-400">';
    html += '<strong>' + totalDiffCount + '</strong> difference' + (totalDiffCount === 1 ? '' : 's') + ' found out of <strong>' + differences.length + '</strong> components';
    if (showingCount < differences.length) {
      html += ' &middot; showing <strong>' + showingCount + '</strong>';
    }
    html += '</p></div>';

    resultsContainer.innerHTML = html;
  }

  // Update URL to reflect current selection
  function updateURL() {
    var url = new URL(window.location);
    url.searchParams.set('year1', year1Select.value);
    url.searchParams.set('year2', year2Select.value);

    // Only store filters in URL if not all active
    if (activeFilters.size === 4) {
      url.searchParams.delete('filters');
    } else {
      var filterList = [];
      activeFilters.forEach(function(f) { filterList.push(f); });
      url.searchParams.set('filters', filterList.join(','));
    }

    history.replaceState(null, '', url);
  }

  // Compare function
  function compare() {
    var year1 = year1Select.value;
    var year2 = year2Select.value;

    if (!year1 || !year2) return;

    var differences = findDifferences(year1, year2);
    renderResults(year1, year2, differences);
    updateURL();
  }

  // Set up filter buttons
  function initFilters() {
    var filterContainer = document.getElementById('diff-filters');
    if (!filterContainer) return;

    var buttons = filterContainer.querySelectorAll('.diff-filter');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filterType = btn.getAttribute('data-filter');

        if (activeFilters.has(filterType)) {
          // Don't allow deactivating the last filter
          if (activeFilters.size <= 1) return;
          activeFilters.delete(filterType);
          btn.classList.remove('active');
        } else {
          activeFilters.add(filterType);
          btn.classList.add('active');
        }

        compare();
      });
    });
  }

  // Restore filters from URL
  function restoreFilters() {
    var params = new URLSearchParams(window.location.search);
    var filtersParam = params.get('filters');
    if (filtersParam) {
      var urlFilters = filtersParam.split(',');
      var validTypes = ['unchanged', 'changed', 'added', 'removed'];
      var restored = urlFilters.filter(function(f) { return validTypes.indexOf(f) !== -1; });
      if (restored.length > 0) {
        activeFilters = new Set(restored);
        // Update button states
        var buttons = document.querySelectorAll('.diff-filter');
        buttons.forEach(function(btn) {
          var filterType = btn.getAttribute('data-filter');
          if (activeFilters.has(filterType)) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    }
  }

  // Initialize
  populateSelects();
  initFilters();

  // Apply URL parameters if present
  var params = new URLSearchParams(window.location.search);
  var urlYear1 = params.get('year1');
  var urlYear2 = params.get('year2');

  if (urlYear1 && years.indexOf(urlYear1) !== -1) year1Select.value = urlYear1;
  if (urlYear2 && years.indexOf(urlYear2) !== -1) year2Select.value = urlYear2;

  restoreFilters();
  compare();

  // Event listeners
  year1Select.addEventListener('change', compare);
  year2Select.addEventListener('change', compare);
})();

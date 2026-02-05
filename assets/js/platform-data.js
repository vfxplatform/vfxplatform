---
layout: null
permalink: /assets/js/platform-data.js
---
// Platform data generated from YAML at build time
const platformData = {
{% assign platform_keys = "" | split: "" %}
{% for file in site.data.platforms %}
  {% assign platform_keys = platform_keys | push: file[0] %}
{% endfor %}
{% for key in platform_keys %}
  "{{ key }}": {{ site.data.platforms[key] | jsonify }}{% unless forloop.last %},{% endunless %}
{% endfor %}
};

const componentMeta = {{ site.data.components | jsonify }};

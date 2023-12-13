---
layout: layout.liquid
eleventyComputed:
  metadata:
    title: "{{ 'site.title' | i18n }}"
    cta: false
pagination:
  data: languages
  alias: lang
  size: 1
  addAllPagesToCollections: true
tags: indexes
permalink: "{% if lang != 'en' %}/{{ lang }}/{% else %}/{% endif %}"
---
## {{ "home.songs" | i18n }}

{% for song in collections.songs %}
{% if song.data.song.language == lang %}
* [{{ song.data.song.title }}]({{ song.url }})
{% endif %}
{% endfor %}

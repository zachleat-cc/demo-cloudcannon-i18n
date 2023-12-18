---
layout: layout.liquid
eleventyComputed:
  metadata:
    title: "Taylor Swift {{ 'site.title' | i18n }}"
    titleHtml: "<b>Taylor Swift</b> {{ 'site.title' | i18n }}"
    cta: false
pagination:
  data: languages
  alias: lang
  size: 1
  addAllPagesToCollections: true
tags: indexes
permalink: "{% if lang != 'en' %}/{{ lang }}/{% else %}/{% endif %}"
---
## {{ "songs" | i18n }}

<div class="song-chooser">
{%- for song in collections.songs %}
  {%- if song.data.song.language == lang %}
    <a href="{{ song.url }}">
    {%- if song.data.albumArtUrl %}
      {% albumArt song.data.song.title, song.data.albumArtUrl %}
    {%- endif %}
    {{ song.data.song.title }}
    </a>
  {%- endif %}
{%- endfor %}
</div>
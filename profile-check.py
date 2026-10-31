import json,re, pathlib, subprocess
p=pathlib.Path('dist/author.html').read_text()
assert 'ひとつの表現から、仕組みや別の表現へ。' in p
assert 'https://djnaoyaman.github.io/profile.html' in p
assert '2026-10-31' in p
assert 'portfolio-grid' not in p
for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>',p):json.loads(s)
assert len(list(pathlib.Path('dist/expressions').glob('*.html')))==369
print('Compact profile and all 369 expression pages verified')

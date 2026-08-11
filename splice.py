import sys

content = open('index.html', 'r', encoding='utf-8').read()
start = content.find('<!-- SECTION 2: PROJECTS -->')
end = content.find('<!-- SECTION 3: EXPERIENCE -->')

new_projects = open('projects_section.html', 'r', encoding='utf-8').read()

new_content = content[:start] + new_projects + '\n      ' + content[end:]
open('index.html', 'w', encoding='utf-8').write(new_content)
print('Done. Total lines:', new_content.count('\n'))

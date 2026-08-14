import re

with open('src/components/ui/testimonial.tsx', 'r') as f:
    content = f.read()

# Pattern to remove <h2 ...>Name</h2> including any whitespace around it
pattern = re.compile(r'<h2[^>]*>.*?</h2>\s*', re.DOTALL)
new_content = pattern.sub('', content)

with open('src/components/ui/testimonial.tsx', 'w') as f:
    f.write(new_content)

print("Done removing names.")

import re

with open('src/components/ui/testimonial.tsx', 'r') as f:
    content = f.read()

# Add import Star
if 'import { Star }' not in content:
    content = content.replace('import { useRef } from "react";', 'import { useRef } from "react";\nimport { Star } from "lucide-react";')

# Pattern to replace the CEO text and img tag
# The CEO text is like: <p className="...">CEO of ...</p>
# and the img tag comes after the closing </div> of the div containing the CEO text.

# Let's write a regex that matches:
# <p className="[^"]*">C[ET]O of [^<]*</p>\s*</div>\s*<img[^>]*/>

pattern = re.compile(r'<p className="[^"]*">C[ET]O of [^<]*</p>\s*</div>\s*<img[^>]*/>', re.DOTALL)

stars_jsx = """<div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>"""

new_content = pattern.sub(stars_jsx, content)

with open('src/components/ui/testimonial.tsx', 'w') as f:
    f.write(new_content)

print("Done replacing.")

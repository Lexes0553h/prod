import re

with open('src/components/ui/testimonial.tsx', 'r') as f:
    content = f.read()

# 1. Update the parent container
# From: <div className="lg:grid lg:grid-cols-3 gap-2 flex flex-col w-full lg:py-10 pt-10 pb-4 lg:px-10 px-4">
# To: <div className="lg:grid lg:grid-cols-3 gap-4 grid grid-rows-2 grid-flow-col overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid-flow-row lg:grid-rows-none w-full lg:py-10 pt-10 pb-4 lg:px-10 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
content = content.replace(
    'className="lg:grid lg:grid-cols-3 gap-2 flex flex-col w-full lg:py-10 pt-10 pb-4 lg:px-10 px-4"',
    'className="lg:grid lg:grid-cols-3 gap-4 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[300px] overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid-flow-row lg:grid-rows-none lg:auto-cols-auto w-full lg:py-10 pt-10 pb-8 lg:px-10 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"'
)

# 2. Update the three column wrappers
# Column 1
content = content.replace(
    'className="md:flex lg:flex-col lg:space-y-2 h-full lg:gap-0 gap-2 "',
    'className="contents lg:flex lg:flex-col lg:space-y-2 h-full lg:gap-0"'
)

# Column 2
content = content.replace(
    'className="lg:h-full md:flex lg:flex-col h-fit lg:space-y-2 lg:gap-0 gap-2"',
    'className="contents lg:flex lg:flex-col lg:space-y-2 lg:gap-0"'
)

# Column 3
content = content.replace(
    'className="h-full md:flex lg:flex-col lg:space-y-2 lg:gap-0 gap-2"',
    'className="contents lg:flex lg:flex-col lg:space-y-2 lg:gap-0"'
)

# 3. Add snap-center and width to cards on mobile
# We can regex replace the TimelineContent classes to append ` w-full snap-center lg:w-auto `
# The cards have className="... flex flex-col justify-between ..."
# Let's just find `relative bg-` or something and inject before it.
# Actually, they all have `overflow-hidden rounded-lg`
content = content.replace(
    'overflow-hidden rounded-lg',
    'w-full snap-center lg:w-auto overflow-hidden rounded-lg'
)

with open('src/components/ui/testimonial.tsx', 'w') as f:
    f.write(content)

print("Done.")

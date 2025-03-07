import subprocess
import urllib.request
import os
import hashlib
import shutil
import colorsys

# capture the output of the command
x = subprocess.run(["eza", "-T", "./Technology"], capture_output=True)

x = x.stdout.decode("utf-8")

lines = x.split("\n")[:-1]
processed_lines = []
# colcolors = ["red", "peach", "yellow", "teal", "blue", "mauve", "green", "lavender"]
colcolors = ["red", "peach", "yellow", "teal", "text", "mauve", "green", "lavender"]

iconpath = "../public/ezaicons"  # icons will be downloaded to this path

# Clean up and recreate icons directory
if os.path.exists(iconpath):
    shutil.rmtree(iconpath)
os.makedirs(iconpath)

def hex_to_hsl(hex_color):
    # Remove the # if present
    hex_color = hex_color.lstrip('#')
    # Convert hex to RGB
    r = int(hex_color[:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:], 16) / 255.0
    # Convert RGB to HSL
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return (h * 360, s * 100, l * 100)

def hsl_to_hex(h, s, l):
    # Convert HSL to RGB
    h = h / 360
    s = s / 100
    l = l / 100
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    # Convert RGB to hex
    return "#{:02x}{:02x}{:02x}".format(
        int(r * 255),
        int(g * 255),
        int(b * 255)
    )

# Get the target lightness from #89dceb
target_lightness = hex_to_hsl("#bdc0ea")[2]

def adjust_color_lightness(hex_color):
    if not hex_color.startswith('#'):
        return hex_color
    h, s, _ = hex_to_hsl(hex_color)
    return hsl_to_hex(h, s, target_lightness)

# get more from https://icones.js.org
icons = {
    "Svelte": ["https://raw.githubusercontent.com/catppuccin/vscode-icons/89edb3d76872e0ec311773a1ca11cfa026088b82/icons/mocha/svelte.svg", "#FAB387", "https://svelte.dev/"],
    "Java": ["https://api.iconify.design/catppuccin:java.svg", "#E16C01", "https://www.java.com/"],
    "React": ["https://api.iconify.design/catppuccin:javascript-react.svg", "#91D7E3", "https://reactjs.org/"],
    "Cloudflare": ["https://api.iconify.design/logos:cloudflare-icon.svg", "#FBAD41", "https://www.cloudflare.com/" ],
    "MongoDB": ["https://api.iconify.design/vscode-icons:file-type-mongo.svg", "#52AB4D", "https://www.mongodb.com/" ],
    "MySQL": ["https://api.iconify.design/devicon:mysql.svg", "#00618A", "https://www.mysql.com/" ],
    "Node.js": ["https://api.iconify.design/logos:nodejs-icon.svg", "#539E43", "https://nodejs.org/" ],
    "Postgres": ["https://api.iconify.design/logos:postgresql.svg", "#336791", "https://www.postgresql.org/" ],
    "Python": ["https://api.iconify.design/logos:python.svg", "#FFE365", "https://www.python.org/" ],
    "Ruby on Rails": ["https://api.iconify.design/logos:ruby.svg", "#8A0F07", "https://rubyonrails.org/" ],
    "Docker": ["https://api.iconify.design/logos:docker-icon.svg", "#2396ED", "https://www.docker.com/" ],
    "Github Actions": ["https://api.iconify.design/devicon:githubactions.svg", "#79B8FF", "https://github.com/features/actions" ],
    "Astro": ["https://api.iconify.design/vscode-icons:file-type-astro.svg", "#E43A96", "https://astro.build/" ],
    "CSS": ["https://api.iconify.design/vscode-icons:file-type-css2.svg", "#1572B6", "https://developer.mozilla.org/en-US/docs/Web/CSS" ],
    "HTML": ["https://api.iconify.design/vscode-icons:file-type-html.svg", "#F1662A", "https://developer.mozilla.org/en-US/docs/Web/HTML" ],
    "Javascript": ["https://api.iconify.design/logos:javascript.svg", "#F7DF1E", "https://developer.mozilla.org/en-US/docs/Web/JavaScript" ],
    "Tailwind": ["https://api.iconify.design/devicon:tailwindcss.svg", "#00BCFF", "https://tailwindcss.com/" ],
    "Debian": ["https://api.iconify.design/vscode-icons:file-type-debian.svg", "#A80030", "https://www.debian.org/" ],
    "NixOS": ["https://api.iconify.design/devicon:nixos.svg?color=%23dc8add", "#5277C3", "https://nixos.org/" ],
    "Raspberry PI": ["https://api.iconify.design/logos:raspberry-pi.svg", "#C13832", "https://www.raspberrypi.com/" ],
    "Ubuntu": ["https://api.iconify.design/logos:ubuntu.svg", "#E95420", "https://ubuntu.com/" ],
    "Linux": ["https://api.iconify.design/devicon:linux.svg", "#F0C6C6", "https://www.linux.org/" ],
    "Tailscale": ["http://localhost:4321/tailscale.svg", "#F6F4F2", "https://tailscale.com/" ],
    "Blender": ["https://api.iconify.design/logos:blender.svg", "#F4792B", "https://www.blender.org/" ],
    "Firefox": ["https://api.iconify.design/logos:firefox.svg?color=%23dc8add", "#DC105F", "https://www.mozilla.org/en-US/firefox/" ], 
    "Zen Browser": ["https://raw.githubusercontent.com/zen-browser/desktop/refs/heads/dev/docs/assets/zen-light.svg", "#F76F53", "https://zen-browser.app/" ], 
    "VSCode": ["https://api.iconify.design/logos:visual-studio-code.svg?color=%23dc8add", "#4EB1F3", "https://code.visualstudio.com/" ], 
    "I use NixOS btw": ["https://api.iconify.design/catppuccin:nix.svg?color=%23dc8add", "#8AADF4", "https://nixos.org/" ],  
    "Obsidian": ["https://api.iconify.design/logos:obsidian-icon.svg?color=%23dc8add", "#4C239F", "https://obsidian.md/" ],  
}

for key, value in icons.items():
    icons[key][1] = adjust_color_lightness(value[1])
    # icons[key][1] = "#cdd6f4"

# Download icons and update paths
for key, value in icons.items():
    icon_url = value[0]
    # Create a filename based on the URL's hash to ensure uniqueness
    filename = hashlib.md5(icon_url.encode()).hexdigest() + '.svg'
    local_path = os.path.join(iconpath, filename)
    web_path = f'/ezaicons/{filename}'  # Path as seen by the browser
    
    try:
        # Create a request with headers to bypass restrictions
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://www.google.com',
            'Accept': 'image/svg+xml,image/webp,image/apng,image/*,*/*;q=0.8'
        }
        req = urllib.request.Request(icon_url, headers=headers)
        with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded {key} icon to {local_path}")
    except Exception as e:
        print(f"Failed to download {key} icon: {e}")
        # If download fails, try to use a fallback URL or skip
        continue
    
    # Update the icon path to use local file
    icons[key][0] = web_path


def process_line(line):
    parts = []
    content = ""
    current_col = 0
    i = 0
    if(lines[0] == line):
        j = 1
        parts.append(f'<span style="color:' + "{props.color}" + f'" class="text-3xl">{line}</span>')
        i += 999999999
        content = ""

    # First collect all the tree structure parts
    while i < len(line):
        # Handle tree structure
        if line[i] in "├└│":
            if line[i] in "├└":
                parts.append(f'<span class="text-{colcolors[current_col]} relative -top-[0.75px] -left-[1px]">{line[i]}</span>')
            else:
                parts.append(f'<span class="text-{colcolors[current_col]} ">{line[i]}</span>')
            if i + 2 < len(line) and line[i:i+3] in ["├──", "└──"]:
                parts.append(f'<span class="text-{colcolors[current_col]}">──</span>')
                i += 2
            current_col += 1
            i += 1
        # Handle Space Character
        elif line[i] == " ":
            parts.append("&nbsp;")
            i += 1
        # Handle Content
        else:
            # We've hit the content part
            content = line[i:].strip()
            # print(content)
            # Process the content part
            parts = parts[:-2]
            print(parts)
            if content:
                # Remove any leading dashes and spaces
                clean_content = content
                if clean_content in icons:
                    icon_url, color, link = icons[clean_content]
                    parts.append(f'<span class="pr-2" style="color: {color}">─</span>')
                    parts.append(f'<a href="{link}" class="inline-flex items-center gap-2 transition-colors duration-200 hover:brightness-125" target="_blank">')
                    parts.append(f'<span style="color: {color}" >{clean_content}</span>')
                    parts.append(f'<img loading="lazy" src="{icon_url}" class="w-4 h-4" alt="{clean_content} icon" />')
                    parts.append('</a>')
                else:
                    parts.append(f'<span class="text-{colcolors[current_col-1]} allign-middle">─</span><span class="text-{colcolors[current_col-1]}">{content}</span>')
            break
    
    return "".join(parts)

for line in lines:
    line = line.replace("'", "")
    processed = process_line(line)
    processed = processed.replace("&nbsp;&nbsp;", "&nbsp;")
    processed_lines.append(f'<div class="-mt-[5px]">{processed}</div>')

ezatreefile = "../src/components/homepage/ezatree.svelte"
content = "\n".join(processed_lines)
content = f"""<script>
    let props = $props();
</script>
<div class="">
{content}
</div>"""
open(ezatreefile, "w").write(content)

import os
import json
import subprocess

# Icon and color mapping for technologies
tech_data = {
    # Frontend
    "React": {"icon": "https://api.iconify.design/catppuccin:javascript-react.svg", "color": "#91D7E3", "url": "https://reactjs.org/"},
    "Svelte": {"icon": "https://raw.githubusercontent.com/catppuccin/vscode-icons/89edb3d76872e0ec311773a1ca11cfa026088b82/icons/mocha/svelte.svg", "color": "#FAB387", "url": "https://svelte.dev/"},
    "Astro": {"icon": "https://api.iconify.design/vscode-icons:file-type-astro.svg", "color": "#E43A96", "url": "https://astro.build/"},
    "Javascript": {"icon": "https://api.iconify.design/logos:javascript.svg", "color": "#F7DF1E", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"},
    "Tailwind": {"icon": "https://api.iconify.design/devicon:tailwindcss.svg", "color": "#00BCFF", "url": "https://tailwindcss.com/"},
    "HTML": {"icon": "https://api.iconify.design/vscode-icons:file-type-html.svg", "color": "#F1662A", "url": "https://developer.mozilla.org/en-US/docs/Web/HTML"},
    "CSS": {"icon": "https://api.iconify.design/vscode-icons:file-type-css2.svg", "color": "#1572B6", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS"},
    
    # Backend
    "Node.js": {"icon": "https://api.iconify.design/logos:nodejs-icon.svg", "color": "#539E43", "url": "https://nodejs.org/"},
    "Python": {"icon": "https://api.iconify.design/logos:python.svg", "color": "#FFE365", "url": "https://www.python.org/"},
    "Java": {"icon": "https://api.iconify.design/catppuccin:java.svg", "color": "#E16C01", "url": "https://www.java.com/"},
    "Postgres": {"icon": "https://api.iconify.design/logos:postgresql.svg", "color": "#336791", "url": "https://www.postgresql.org/"},
    "MongoDB": {"icon": "https://api.iconify.design/vscode-icons:file-type-mongo.svg", "color": "#52AB4D", "url": "https://www.mongodb.com/"},
    "MySQL": {"icon": "https://api.iconify.design/devicon:mysql.svg", "color": "#00618A", "url": "https://www.mysql.com/"},
    "Cloudflare": {"icon": "https://api.iconify.design/logos:cloudflare-icon.svg", "color": "#FBAD41", "url": "https://www.cloudflare.com/"},
    
    # DevOps and Cloud
    "Docker": {"icon": "https://api.iconify.design/logos:docker-icon.svg", "color": "#2396ED", "url": "https://www.docker.com/"},
    "Github Actions": {"icon": "https://api.iconify.design/devicon:githubactions.svg", "color": "#79B8FF", "url": "https://github.com/features/actions"},
    "Linux": {"icon": "https://api.iconify.design/devicon:linux.svg", "color": "#F0C6C6", "url": "https://www.linux.org/"},
    "NixOS": {"icon": "https://api.iconify.design/devicon:nixos.svg?color=%23dc8add", "color": "#5277C3", "url": "https://nixos.org/"},
    
    # Add fallback for unknown technologies
    "default": {"icon": "https://api.iconify.design/mdi:code-tags.svg", "color": "#cdd6f4", "url": "#"}
}

def scan_technology_folder():
    """Scan the Technology folder and build the skills data structure"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    tech_folder = os.path.join(script_dir, "Technology")
    skills_data = {}
    
    if not os.path.exists(tech_folder):
        print(f"Technology folder not found at {tech_folder}")
        return skills_data
    
    # Iterate through category folders
    for category in os.listdir(tech_folder):
        category_path = os.path.join(tech_folder, category)
        
        if not os.path.isdir(category_path):
            continue
            
        skills_data[category] = []
        
        # Iterate through technology files in each category
        for tech_file in os.listdir(category_path):
            tech_name = tech_file.replace('_', ' ')  # Handle underscores in filenames
            
            # Get tech data or use default
            if tech_name in tech_data:
                tech_info = tech_data[tech_name].copy()
            else:
                print(f"Warning: No data found for '{tech_name}', using default")
                tech_info = tech_data["default"].copy()
            
            tech_info["name"] = tech_name
            skills_data[category].append(tech_info)
    
    return skills_data

def main():
    print("Scanning Technology folder...")
    skills_data = scan_technology_folder()
    
    # Pretty print the structure for debugging
    print("\nFound categories and technologies:")
    for category, techs in skills_data.items():
        print(f"  {category}:")
        for tech in techs:
            print(f"    - {tech['name']}")
    
    # Write to JSON file  
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(script_dir, "..", "src", "data", "skills.json")
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(skills_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nSkills data generated successfully at {output_file}")
    print("You can now import this in your Astro component!")

if __name__ == "__main__":
    main()
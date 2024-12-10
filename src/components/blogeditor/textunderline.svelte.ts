import { visit } from 'unist-util-visit';

export default function rehypeColoredWords(mapping: any) {
    return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || parent.tagName === 'code' || parent.tagName === 'pre') {
        return;
      }

      const words = Object.keys(mapping);
      const pattern = new RegExp(`\\b(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
      
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = pattern.exec(node.value)) !== null) {
        const word = match[0];
        const mappedWord = mapping[word.toLowerCase()];
        
        if (lastIndex !== match.index) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }
        
    // if(mappedWord == undefined) continue;
        const [colors, url] = mappedWord;
        let borderStyle, hoverColor, mouseoutStyle;

        if (colors.includes('|')) {
          const [color1, color2] = colors.split('|');
          const gradient = `linear-gradient(to right, ${color1}, ${color2})`;
          borderStyle = `border-image: ${gradient}; border-image-slice: 1; border-bottom: 2px solid`;
          hoverColor = gradient;
          mouseoutStyle = `this.style.borderImage='${gradient}'; this.style.borderImageSlice='1'; this.style.borderBottom='2px solid'`;
        } else {
          borderStyle = `border-bottom: 2px solid ${colors}`;
          hoverColor = colors;
          mouseoutStyle = `this.style.borderBottom='2px solid ${colors}'`;
        }

        parts.push({
          type: 'element',
          tagName: 'a',
          properties: {
            href: url,
            target: '_blank',
            style: 'text-decoration: none;'
          },
          children: [{
            type: 'element',
            tagName: 'span',
            properties: {
              style: `${borderStyle}; transition: border-bottom 0.1s ease-out; color: inherit; cursor: pointer; background: none; -webkit-background-clip: initial; -webkit-text-fill-color: initial;`,
              onmouseover: `this.style.borderBottom='none'; this.style.background='${hoverColor}'; this.style.webkitBackgroundClip='text'; this.style.webkitTextFillColor='transparent'`,
              onmouseout: `this.style.background='none'; this.style.webkitBackgroundClip='initial'; this.style.webkitTextFillColor='initial'; ${mouseoutStyle}`
            },
            children: [{ type: 'text', value: word }]
          }]
        });

        lastIndex = pattern.lastIndex;
      }

      if (lastIndex !== node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex) });
      }

      if (parts.length > 0) {
        parent.children.splice(index, 1, ...parts);
        return index! + parts.length;
      }
    });
  };
}

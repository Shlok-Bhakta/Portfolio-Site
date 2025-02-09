import { visit } from 'unist-util-visit';
import type { Plugin } from "carta-md";
import type { Node } from 'unist';

function escapeForAttribute(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
}

function processIfembedContent(content: string): string {
  // Preserve <pre> tags content
  const preBlocks: string[] = [];
  let processedContent = content.replace(/<pre[\s\S]*?<\/pre>/g, (match) => {
    preBlocks.push(match);
    return `__PRE_BLOCK_${preBlocks.length - 1}__`;
  });

  // Remove blank lines
  processedContent = processedContent.split('\n').filter(line => line.trim() !== '').join('\n');

  // Restore <pre> blocks
  preBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(`__PRE_BLOCK_${index}__`, block);
  });

  return processedContent;
}

export const ifembedTransformer: Plugin = {
  transformers: [
    {
      execution: "sync",
      type: "remark",
      transform({ processor }) {
        processor.use(() => (tree: Node) => {
          visit(tree, 'html', (node: any) => {
            const openTag = '<ifembed>';
            const closeTag = '</ifembed>';
            const startIndex = node.value.indexOf(openTag);
            const endIndex = node.value.lastIndexOf(closeTag);

            console.log("Original node value:", node.value);
            console.log("Start index:", startIndex);
            console.log("End index:", endIndex);

            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
              console.log("Found ifembed");
              const rawContent = node.value.substring(startIndex + openTag.length, endIndex);
              const processedContent = processIfembedContent(rawContent);
              console.log("Processed content:", processedContent);
              
              // Create a data URI for the content
              const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      body { margin: 0; padding: 0; white-space: pre-wrap; }
                    </style>
                  </head>
                  <body>${processedContent}</body>
                </html>
              `)}`;

              node.value = `
                <iframe
                  style="width:80%;border:none;height:800px;margin:0 auto;"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                  src="${escapeForAttribute(dataUri)}"
                ></iframe>
              `;
            } else {
              console.log("ifembed not found or invalid");
            }
          });
        });
      },
    }
  ],
};

export default ifembedTransformer;
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const codeBlocks = document.querySelectorAll('pre code');

      codeBlocks.forEach((codeBlock) => {
        // Safely cast the codeBlock to HTMLElement so we can use innerText
        const pre = codeBlock.parentElement;

        // Ensure pre is not null
        if (!pre) return;

        // Skip if the button already exists
        if (pre.querySelector('.copy-button')) return;

        // Create the copy button
        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-button');
        const icon = document.createElement('img');
        icon.src = '/copy.svg';
        icon.alt = 'Copy';
        icon.classList.add('copy-icon');
        copyButton.appendChild(icon);

        // Add button to the pre block
        pre.appendChild(copyButton);

        // Handle copy action
        copyButton.addEventListener('click', () => {
          // Cast codeBlock to HTMLElement to safely access innerText
          const codeText = (codeBlock as HTMLElement).innerText;

          navigator.clipboard.writeText(codeText).then(() => {
            icon.src = '/check.svg';
            icon.alt = 'Copied!';
            setTimeout(() => {
              icon.src = '/copy.svg';
              icon.alt = 'Copy';
            }, 2000);
          });
        });
      });
    });
  }
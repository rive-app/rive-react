export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Overview', 'Playback Controls', 'State Machines'],
    },
  },
  viewMode: 'docs',
};

// The below function helps to default to the docs page, which contains all the documentation and examples
function clickDocsButtonOnFirstLoad() {
  window.removeEventListener("load", clickDocsButtonOnFirstLoad);

  try {
    const docsButtonSelector = window.parent.document.evaluate(
      "//button[contains(., 'Docs')]",
      window.parent.document,
      null,
      XPathResult.ANY_TYPE,
      null
    );

    const button = docsButtonSelector.iterateNext();

    button.click();
  } catch (error) {
    // Do nothing if it wasn't able to click on Docs button.
  }
}

window.addEventListener("load", clickDocsButtonOnFirstLoad);

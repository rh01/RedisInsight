import React from 'react'
import { isMacOs } from 'uiSrc/utils/handlePlatforms'

// TODO: use i18n file for labels & descriptions
const COMMON_SHORTCUTS = {
  _separator: '+',
  desktop: {
    newWindow: {
      description: 'Open a new window',
      keys: ['Ctrl', 'N']
    },
    reloadPage: {
      description: 'Reload the page',
      keys: ['Ctrl', 'R']
    }
  },
  cli: {
    autocompleteNext: {
      description: 'Autocomplete with the next command',
      keys: ['Tab']
    },
    autocompletePrev: {
      description: 'Autocomplete with the previous command',
      keys: ['Shift', 'Tab']
    },
    clearSearch: {
      description: 'Clear the screen',
      keys: ['Ctrl', 'L']
    },
    prevCommand: {
      description: 'Return to the previous command',
      keys: ['Up Arrow']
    },
    nextCommand: {
      description: 'Scroll the list of commands in the opposite direction to the Up Arrow',
      keys: ['Down Arrow']
    }
  },
  workbench: {
    runQuery: {
      label: 'Run',
      description: 'Run Command',
      keys: ['Ctrl', 'Enter'],
    },
    nextLine: {
      description: 'Go to the next line',
      keys: ['Enter'],
    },
    listOfCommands: {
      description: 'Display the list of commands and information about commands and their arguments in the suggestion list',
      keys: ['Ctrl', 'Space']
    }
  }
}

const MAC_SHORTCUTS = {
  _separator: '',
  desktop: {
    newWindow: {
      description: 'Open a new window',
      keys: [(<span className="cmdSymbol">⌘</span>), 'N']
    },
    reloadPage: {
      description: 'Reload the page',
      keys: [(<span className="cmdSymbol">⌘</span>), 'R']
    }
  },
  cli: {
    autocompleteNext: {
      description: 'Autocomplete with the next command',
      keys: ['Tab']
    },
    autocompletePrev: {
      description: 'Autocomplete with the previous command',
      keys: [(<span className="shiftSymbol">⇧</span>), 'Tab']
    },
    clearSearch: {
      description: 'Clear the screen',
      keys: [(<span className="cmdSymbol">⌘</span>), 'L']
    },
    prevCommand: {
      description: 'Return to the previous command',
      keys: [(<span className="badgeArrowUp">↑</span>)]
    },
    nextCommand: {
      description: 'Scroll the list of commands in the opposite direction to the Up Arrow',
      keys: [(<span className="badgeArrowDown">↓</span>)]
    }
  },
  workbench: {
    runQuery: {
      label: 'Run',
      description: 'Run Command',
      keys: [(<span className="cmdSymbol">⌘</span>), 'Enter'],
    },
    nextLine: {
      description: 'Go to the next line',
      keys: ['Enter'],
    },
    listOfCommands: {
      description: 'Display the list of commands and information about commands and their arguments in the suggestion list',
      keys: [(<span className="cmdSymbol">⌘</span>), 'Space']
    }
  }
}

export const KEYBOARD_SHORTCUTS = isMacOs() ? MAC_SHORTCUTS : COMMON_SHORTCUTS
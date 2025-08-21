import React, { useState, useEffect, useRef } from 'react';
import './1colors.css';
import './2mainStyles.css';
import './3initiativeList.css';
import './4addCharacterModal.css'; // Import the modal styling
import './5addConditionModal.css';
import './6conditionsDisplay.css';
import plusIcon from './media/plus-icon.png';
import viewIcon from './media/view-icon.png';
import './7deleteCharacterModal.css';
import minusIcon from './media/minus-icon.png';
import gearIcon from './media/gear-icon.png';
import './8customConditionModal.css';
import pencilIcon from './media/pencil-icon.png';
import trashcanIcon from './media/trashcan-icon.png';

export default function MainCode() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [round, setRound] = useState(0); // Add state for the round number
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(null); // Track the add-condition modal
  const [characterName, setCharacterName] = useState('');
  const [affiliation, setAffiliation] = useState('');

  const [rowVisibility, setRowVisibility] = useState(
    Array(20).fill(false).map((_, index) => index === 0)
  );

  const [overlayActive, setOverlayActive] = useState(
    Array(20).fill(false).map((_, index) => index === 0)
  );

  const [rowData, setRowData] = useState(
    Array(20).fill({ name: '', affiliation: '', initiative: null, conditions: [] })
  );

  const [sortedRowData, setSortedRowData] = useState([]);

  const [shiftedRowIndex, setShiftedRowIndex] = useState(null); // Track the index of the shifted row
  
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);

  const [editCharacterIndex, setEditCharacterIndex] = useState(null);

  const [viewCharacterIndex, setViewCharacterIndex] = useState(null);

  const [expirationTiming, setExpirationTiming] = useState("unknown");
  const [expirationType, setExpirationType] = useState(""); // "round" or "character"
  const [expirationTarget, setExpirationTarget] = useState(""); // round number or character name
  const [expirationRound, setExpirationRound] = useState("");

  const [isCustomConditionModalOpen, setIsCustomConditionModalOpen] = useState(false);

  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  const [showCustomConditionForm, setShowCustomConditionForm] = useState(false);
  const [customConditionName, setCustomConditionName] = useState('');
  const [customConditionAffect, setCustomConditionAffect] = useState('');
  const [customConditionDescription, setCustomConditionDescription] = useState('');
  const [customConditions, setCustomConditions] = useState([]);

  const [toggleAddConditionEnforcementMessage, setToggleAddConditionEnforcementMessage] = useState(false);

  const [conditionDescriptions, setConditionDescriptions] = useState({
    Blinded: "• Can’t See. You can’t see and automatically fail any ability check that requires sight. ???• Attacks Affected. Attack rolls against you have Advantage, and your attack rolls have Disadvantage.",
    Charmed: "• Can’t Harm the Charmer. You can’t attack the charmer or target the charmer with damaging abilities or magical effects.???• Social Advantage. The charmer has Advantage on any ability check to interact with you socially.",
    Deafened: "• Can’t Hear. You can’t hear and automatically fail any ability check that requires hearing.",
    Frightened: "• Ability Checks and Attacks Affected. You have Disadvantage on ability checks and attack rolls while the source of fear is within line of sight.???• Can’t Approach. You can’t willingly move closer to the source of fear.",
    Grappled: "• Speed 0. Your Speed is 0 and can’t increase.???• Attacks Affected. You have Disadvantage on attack rolls against any target other than the grappler.???• Movable. The grappler can drag or carry you when it moves, but every foot of movement costs it 1 extra foot unless you are Tiny or two or more sizes smaller than it.",
    Incapacitated: "• Inactive. You can’t take any action, Bonus Action, or Reaction.???• No Concentration. Your Concentration is broken.???• Speechless. You can’t speak.???• Surprised. If you’re Incapacitated when you roll Initiative, you have Disadvantage on the roll.",
    Invisible: "• Surprise. If you’re Invisible when you roll Initiative, you have Advantage on the roll.???• Concealed. You aren’t affected by any effect that requires its target to be seen unless the effect’s creator can somehow see you. Any equipment you are wearing or carrying is also concealed.???• Attacks Affected. Attack rolls against you have Disadvantage, and your attack rolls have Advantage. If a creature can somehow see you, you don’t gain this benefit against that creature.",
    Paralyzed: "• Incapacitated. You have the Incapacitated condition.???• Speed 0. Your Speed is 0 and can’t increase.???• Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.???• Attacks Affected. Attack rolls against you have Advantage.???• Automatic Critical Hits. Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you.",
    Petrified: "• Turned to Inanimate Substance. You are transformed, along with any nonmagical objects you are wearing and carrying, into a solid inanimate substance (usually stone). Your weight increases by a factor of ten, and you cease aging.???• Incapacitated. You have the Incapacitated condition.???• Speed 0. Your Speed is 0 and can’t increase.???• Attacks Affected. Attack rolls against you have Advantage.???• Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.???• Resist Damage. You have Resistance to all damage.???• Poison Immunity. You have Immunity to the Poisoned condition.",
    Poisoned: "• Ability Checks and Attacks Affected. You have Disadvantage on attack rolls and ability checks.",
    Prone: "• Restricted Movement. Your only movement options are to crawl or to spend an amount of movement equal to half your Speed (round down) to right yourself and thereby end the condition. If your Speed is 0, you can’t right yourself.???• Attacks Affected. You have Disadvantage on attack rolls. An attack roll against you has Advantage if the attacker is within 5 feet of you. Otherwise, that attack roll has Disadvantage.",
    Restrained: "• Speed 0. Your Speed is 0 and can’t increase.???• Attacks Affected. Attack rolls against you have Advantage, and your attack rolls have Disadvantage.???• Saving Throws Affected. You have Disadvantage on Dexterity saving throws.",
    Stunned: "• Incapacitated. You have the Incapacitated condition.???• Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.???• Attacks Affected. Attack rolls against you have Advantage.",
    Unconscious: "• Inert. You have the Incapacitated and Prone conditions, and you drop whatever you’re holding. When this condition ends, you remain Prone.???• Speed 0. Your Speed is 0 and can’t increase.???• Attacks Affected. Attack rolls against you have Advantage.???• Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.???• Automatic Critical Hits. Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you.???• Unaware. You’re unaware of your surroundings.",
    Exhaustion1: "• D20 Tests Affected. When you make a D20 Test, the roll is reduced by 2.???• Speed Reduced. Your Speed is reduced by 5 feet.???• Removing Exhaustion Levels. Finishing a Long Rest removes 1 of your Exhaustion levels. When your Exhaustion level reaches 0, the condition ends.",
    Exhaustion2: "• D20 Tests Affected. When you make a D20 Test, the roll is reduced by 4.???• Speed Reduced. Your Speed is reduced by 10 feet.???• Removing Exhaustion Levels. Finishing a Long Rest removes 1 of your Exhaustion levels. When your Exhaustion level reaches 0, the condition ends.",
    Exhaustion3: "• D20 Tests Affected. When you make a D20 Test, the roll is reduced by 6.???• Speed Reduced. Your Speed is reduced by 15 feet.???• Removing Exhaustion Levels. Finishing a Long Rest removes 1 of your Exhaustion levels. When your Exhaustion level reaches 0, the condition ends.",
    Exhaustion4: "• D20 Tests Affected. When you make a D20 Test, the roll is reduced by 8.???• Speed Reduced. Your Speed is reduced by 20 feet.???• Removing Exhaustion Levels. Finishing a Long Rest removes 1 of your Exhaustion levels. When your Exhaustion level reaches 0, the condition ends.",
    Exhaustion5: "• D20 Tests Affected. When you make a D20 Test, the roll is reduced by 10.???• Speed Reduced. Your Speed is reduced by 25 feet.???• Removing Exhaustion Levels. Finishing a Long Rest removes 1 of your Exhaustion levels. When your Exhaustion level reaches 0, the condition ends.",
    Exhaustion6: "• You are Dead.???• If you are revived after dying this way, you return to life with Exhaustion5.",
    "(Custom)": "Filler description for custom condition.",
  });  

  // const handleAddCondition = (rowIndex, conditions) => {
  //   const updatedData = [...rowData];
  //   conditions.forEach((condition) => {
  //     if (!updatedData[rowIndex].conditions.includes(condition)) {
  //       updatedData[rowIndex].conditions.push(condition); // Add the condition if it's not already present
  //     }
  //   });
  //   setRowData(updatedData);
  //   setIsAddConditionModalOpen(null); // Close the modal after adding the conditions
  // };

  const handleNewCombat = () => {
    let updatedData = [...rowData];
    let updatedVisibility = [...rowVisibility];
    let updatedOverlay = [...overlayActive];

    // Remove all Enemy, Ally, and Neutral/Environmental rows
    for (let i = updatedData.length - 1; i >= 0; i--) {
      const aff = updatedData[i].affiliation;
      if (aff === 'Enemy' || aff === 'Ally' || aff === 'Neutral/Environmental') {
        updatedData.splice(i, 1);
        updatedVisibility.splice(i, 1);
        updatedOverlay.splice(i, 1);
      }
    }

    // Remove all conditions and clear initiative from remaining rows
    updatedData = updatedData.map(row => ({
      ...row,
      conditions: [],
      initiative: null // Clear initiative input
    }));

    // Fill up to 20 rows with empty slots if needed
    while (updatedData.length < 20) {
      updatedData.push({ name: '', affiliation: '', initiative: null, conditions: [] });
      updatedVisibility.push(
        updatedData.length === 1
          ? true
          : updatedData[updatedData.length - 2].name !== ''
          ? true
          : false
      );
      updatedOverlay.push(
        updatedData.length === 1
          ? true
          : updatedData[updatedData.length - 2].name !== ''
          ? true
          : false
      );
    }

    setRowData(updatedData);
    setRowVisibility(updatedVisibility);
    setOverlayActive(updatedOverlay);
    setRound(0);
    setShiftedRowIndex(null);
    setViewCharacterIndex(null);
    setIsSettingsModalOpen(false); // Close the modal
  };

  const handleAddConditionClick = (rowIndex) => {
    setIsAddConditionModalOpen(rowIndex); // Open the modal for the specific row
  };

  const handleFullReset = () => {
    setRowData(
      Array(20).fill({ name: '', affiliation: '', initiative: null, conditions: [] })
    );
    setRowVisibility(Array(20).fill(false).map((_, idx) => idx === 0));
    setOverlayActive(Array(20).fill(false).map((_, idx) => idx === 0));
    setRound(0);
    setShiftedRowIndex(null);
    setViewCharacterIndex(null);
    setIsSettingsModalOpen(false); // Close the modal
  };
    
  const handleCloseAddConditionModal = () => {
    setIsAddConditionModalOpen(null); // Close the add-condition modal
    setSelectedConditions([]);        // Deselect all conditions
    setSelectedCharacters([]);        // Deselect all characters
    setIsCustomConditionModalOpen(false);
    setToggleAddConditionEnforcementMessage(false);
  };


  // Toggle selection for conditions
  const handleConditionClick = (condition) => {
    if (condition === '(Custom)') {
    const isAlreadySelected = selectedConditions.includes(condition);
    setIsCustomConditionModalOpen(!isAlreadySelected); // toggle modal open/close
    setShowCustomConditionForm(false); // always reset the form view
  }

    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleAddConditionSubmit = (e) => {
    e.preventDefault();

    const filteredSelectedConditions = selectedConditions.filter(cond => cond !== '(Custom)');

    // Enforce non-empty dropdowns and selections
    if (expirationType === "round") {
      if (expirationTiming === "uknown" || !expirationTarget ) {
        setToggleAddConditionEnforcementMessage(true);
        return;
      }
    } else if (expirationType === "character") {
      if (expirationTiming === "unknown" || !expirationTarget || !expirationRound) {
        setToggleAddConditionEnforcementMessage(true);
        return;
      }
    } else {
      setToggleAddConditionEnforcementMessage(true);
      return;
    }

    if (filteredSelectedConditions.length < 1 || selectedCharacters.length < 1) {
      setToggleAddConditionEnforcementMessage(true);
      return;
    }

    // Build the expiration string
    let expirationString = "";

    if (expirationTiming === "unknown") {
      expirationString = "Expires NA / Unknown";
    } else if (expirationType === "round") {
      // e.g. "Expires just after Round 2"
      expirationString = `Expires ${expirationTiming} Round ${expirationTarget}`;
    } else if (expirationType === "character") {
      // e.g. "Expires just after Alice's turn on Round 2"
      expirationString = `Expires ${expirationTiming} ${expirationTarget}'s turn on Round ${expirationRound}`;
    }

    const updatedRows = rowData.map(row => {
      if (selectedCharacters.includes(row.name)) {
        // Add new condition objects with expiration
        const newConditions = [
          ...row.conditions,
          ...filteredSelectedConditions
            .filter(cond => !row.conditions.some(c => typeof c === "object" ? c.name === cond : c === cond))
            .map(cond => ({ name: cond, expiration: expirationString }))
        ];
        return { ...row, conditions: newConditions };
      }
      return row;
    });

    setRowData(updatedRows);
    setIsAddConditionModalOpen(null);
    setSelectedConditions([]);
    setSelectedCharacters([]);
    setIsCustomConditionModalOpen(false);
    setToggleAddConditionEnforcementMessage(false);
    // Optionally reset expiration dropdowns here
  };

  // const handleAddNewCustomCondition = () => {
  //   alert("Add Custom Condition clicked!");
  //   // Later, this could open a form, input, or prompt for condition name and description
  // };

  // const handleAddCustomCondition = () => {
  //   if (customConditionName.trim() !== '') {
  //     setCustomConditions([...customConditions, customConditionName.trim()]);
  //     setCustomConditionName('');
  //     setCustomConditionAffect('');
  //     setCustomConditionDescription('');
  //     setShowCustomConditionForm(false); // Hide form again
  //   }
  // };

  // Toggle selection for characters
  const handleCharacterClick = (character) => {
    setSelectedCharacters((prev) =>
      prev.includes(character)
        ? prev.filter((c) => c !== character)
        : [...prev, character]
    );
  };

  const handleNextRound = () => {
      setRound((prevRound) => {
        const sortedRows = [...sortedRowData]
          .filter((_, index) => !overlayActive[index]) // Only consider visible rows without overlays
    
        const currentRowIndex = shiftedRowIndex ?? -1; // Start with no row shifted
        let nextRowIndex = null;
    
        // Find the next row to shift
        if (currentRowIndex === -1 || currentRowIndex === sortedRows.length - 1) {
          // If no row is shifted or the last row is shifted, start from the first row
          nextRowIndex = 0;
        } else {
          // Otherwise, find the next row in the sorted order
          // const currentIndexInSorted = sortedRows.findIndex((row) => row.index === currentRowIndex);
          nextRowIndex = currentRowIndex + 1;
        }

        setViewCharacterIndex(null);
    
        // Update the shifted row
        setShiftedRowIndex(nextRowIndex);
    
        // Increment the round counter only if we loop back to the first row
        return nextRowIndex === 0 ? prevRound + 1 : prevRound;
      });
    };
  
  const handlePreviousRound = () => {
    setRound((prevRound) => {
      const sortedRows = [...sortedRowData]
        .filter((_, index) => !overlayActive[index]) // Only consider visible rows without overlays
  
      const currentRowIndex = shiftedRowIndex ?? -1; // Start with no row shifted
      let previousRowIndex = null;
  
      // Find the previous row to shift
      if (currentRowIndex === -1 || currentRowIndex === 0) {
        // If no row is shifted or the first row is shifted, move to the last row
        previousRowIndex = sortedRows.length - 1;
      } else {
        // Otherwise, find the previous row in the sorted order
        previousRowIndex = currentRowIndex - 1;
      }

      setViewCharacterIndex(null);
  
      // Update the shifted row
      setShiftedRowIndex(previousRowIndex);
  
      // Decrement the round counter only if we loop back to the last row
      return previousRowIndex === sortedRows.length - 1 ? Math.max(prevRound - 1, 0) : prevRound;
    });
  };
  
  const handleOpenModal = (rowIndex) => {
    setIsModalOpen(rowIndex);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(null);
    setCharacterName('');
    setAffiliation('');
    setEditCharacterIndex(null);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate form inputs
    if (!characterName.trim() || !affiliation) {
      setErrorMessage('Please fill out all fields before submitting.');
      return;
    }

    const updatedData = [...rowData];

    if (editCharacterIndex !== null) {
      // Edit existing character
      updatedData[editCharacterIndex] = {
        ...updatedData[editCharacterIndex],
        name: characterName,
        affiliation: affiliation,
      };
      setRowData(updatedData);
      setEditCharacterIndex(null);
    } else {
      // Add new character logic
      updatedData[isModalOpen] = {
        ...updatedData[isModalOpen],
        name: characterName,
        affiliation: affiliation,
      };
      setRowData(updatedData);

      const updatedOverlay = [...overlayActive];
      updatedOverlay[isModalOpen] = false;
      if (isModalOpen + 1 < updatedOverlay.length) {
        updatedOverlay[isModalOpen + 1] = true;
      }
      setOverlayActive(updatedOverlay);

      const updatedVisibility = [...rowVisibility];
      if (isModalOpen + 1 < updatedVisibility.length) {
        updatedVisibility[isModalOpen + 1] = true;
      }
      setRowVisibility(updatedVisibility);
    }

    // Reset modal state
    setIsModalOpen(null);
    setCharacterName('');
    setAffiliation('');
    setErrorMessage('');
  };
  
  const handleInitiativeChange = (index, value) => {
    const updatedData = [...rowData];
    updatedData[index].initiative = value ? parseFloat(value) : null; // Save initiative value
    setRowData(updatedData);
  };

  const updateViewCharacterIndex = (index) => {
    if (viewCharacterIndex === index) {
      setViewCharacterIndex(null);
    } else {
      setViewCharacterIndex(index);
    }
  }

  const getConditionBackgroundColor = (condition) => {
    const conditionColors = {
      Blinded: 'var(--bad-condition-background)',
      Charmed: 'var(--bad-condition-background)',
      Deafened: 'var(--bad-condition-background)',
      Frightened: 'var(--bad-condition-background)',
      Grappled: 'var(--bad-condition-background)',
      Incapacitated: 'var(--bad-condition-background)',
      Invisible: 'var(--good-condition-background)',
      Paralyzed: 'var(--bad-condition-background)',
      Petrified: 'var(--bad-condition-background)',
      Poisoned: 'var(--bad-condition-background)',
      Prone: 'var(--neutral-condition-background)',
      Restrained: 'var(--bad-condition-background)',
      Stunned: 'var(--bad-condition-background)',
      Unconscious: 'var(--bad-condition-background)',
      'Exhaustion1': 'var(--bad-condition-background)',
      'Exhaustion2': 'var(--bad-condition-background)',
      'Exhaustion3': 'var(--bad-condition-background)',
      'Exhaustion4': 'var(--bad-condition-background)',
      'Exhaustion5': 'var(--bad-condition-background)',
      'Exhaustion6': 'var(--bad-condition-background)',
      Other1: 'var(--neutral-condition-background)',
      Other2: 'var(--neutral-condition-background)',
      Other3: 'var(--neutral-condition-background)',
      Other4: 'var(--neutral-condition-background)',
      '(Custom)': 'var(--neutral-condition-background)',
    };
  
    return conditionColors[condition] || 'var(--neutral-condition-background)'; // Default to neutral condition background
  };
  
  const getTextColor = (affiliation) => {
    switch (affiliation) {
      case 'Player Character':
        return 'darkblue';
      case 'Enemy':
        return 'red';
      case 'Ally':
        return 'purple';
      case 'Neutral/Environmental':
        return '#363636';
      default:
        return 'black';
    }
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (openMenuIndex !== null) {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setOpenMenuIndex(null);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuIndex]);

  useEffect(() => {
    const visibleRows = rowData
      .map((data, index) => ({ ...data, index }))
      .filter((_, i) => rowVisibility[i]);

    const normalRows = visibleRows
      .filter((row) => !overlayActive[row.index])
      .sort((a, b) => {
        if (b.initiative !== a.initiative) {
          return (b.initiative ?? -Infinity) - (a.initiative ?? -Infinity);
        }
        return (a.name || '').localeCompare(b.name || '');
      });
  
    const overlayRows = visibleRows.filter((row) => overlayActive[row.index]);
  
    const sortedRows = [...normalRows, ...overlayRows];

    setSortedRowData(sortedRows);
  }, [rowData])
  
  return (
   <>
    {isSettingsModalOpen && (
    <div className="modal-overlay settings-modal">
      <div className="modal">
        <h2>Settings</h2>
        <div className="settings-caution-text">
          Caution: these actions cannot be undone!
        </div>
        <div className="new-combat-button-and-description">
            <button
            className="settings-action-button"
            onClick={handleNewCombat}
          >
            New Combat
          </button>
          <div className="settings-description-text new-combat-description-text">
            • Changes the Round count to 0 <br></br> • Resets all conditions <br></br> • Removes all characters (except for player characters)
          </div>
        </div>
        <div className="full-reset-button-and-description">          
          <button
            className="settings-action-button"
            onClick={handleFullReset}
          >
            Full Reset
          </button>
          <div className="settings-description-text full-reset-description-text">
            • Changes the Round count to 0 <br></br> • Resets all conditions <br></br> • Removes all characters
          </div>
        </div>
        <button
          className="close-modal-button"
          onClick={() => setIsSettingsModalOpen(false)}
        >
          X
        </button>
      </div>
    </div>
  )}

    <div className="wrapper">
      <div className="container">
          <div className="initiative-list">
            <div className="initiative-banner">
              <div className="banner-gear-icon">
                <button
                  className="gear-icon-button"
                  onClick={() => setIsSettingsModalOpen(true)}
                  aria-label="Open Settings"
                >
                  <img src={gearIcon} alt="Settings" className="gear-icon-img" />
                </button>
              </div>
              <div className="round-counter">Round {round}</div>
              <div className="initiative-title">Initiative List</div>
              <div className="next-back">
                {/* Conditionally render the buttons based on the overlay of the first row */}
                {!overlayActive[0] && (
                  <>
                    <button className="back-button" onClick={handlePreviousRound}>
                      Back
                    </button>
                    <button className="next-button" onClick={handleNextRound}>
                      Next
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="initiative-list-content">
              {sortedRowData.map(({ index }, shiftedIndex) => (
                <div
                  key={index}
                  className={`row ${shiftedIndex === shiftedRowIndex ? 'shifted-row' : ''}`}
                  style={{
                    backgroundColor:
                      shiftedIndex === viewCharacterIndex
                        ? 'var(--view-character-background)'
                        : ''
                  }}
                >
                  {overlayActive[index] && (
                    <div className="add-new-character">
                      <button
                        className="add-character-button"
                        onClick={() => handleOpenModal(index)}
                      >
                        <img
                          src={plusIcon}
                          alt="Add Character"
                          className="add-character-icon"
                        />
                      </button>
                    </div>
                  )}
                  <div className="initiative-input">
                    <input
                      type="number"
                      className="initiative-textbox"
                      placeholder="#"
                      value={rowData[index].initiative ?? ''}
                      onChange={(e) => handleInitiativeChange(index, e.target.value)}
                    />
                  </div>
                  <div className="view-character-conditions">
                    <button className="view-button" onClick={() => { updateViewCharacterIndex(shiftedIndex); }}>
                      <img src={viewIcon} alt="View Icon" className="view-icon" />
                    </button>
                    <div className="edit-delete-group">
                    <button
                      className="editCharacterButton"
                      onClick={() => {
                        setEditCharacterIndex(index);
                        setCharacterName(rowData[index].name);
                        setAffiliation(rowData[index].affiliation);
                        setIsModalOpen(index);
                      }}
                    >
                      <img src={pencilIcon} alt="Edit" className="edit-icon" />
                    </button>
                    <button
                      className="deleteCharacterButton"
                      onClick={() => {
                        setDeleteConfirmIndex(index);
                      }}
                    >
                      <img src={trashcanIcon} alt="Delete" className="delete-icon" />
                    </button>
                    </div>
                  </div>
                  {/* Remove the character-menu and dropdown */}
                  <div className="name-input" style={{ color: getTextColor(rowData[index].affiliation) }}>
                    {rowData[index].name || 'No Name'}
                  </div>
                  <div className="personal-conditions">
                    {rowData[index].conditions.length > 0
                      ? rowData[index].conditions.map((condition, i) => (
                        <div
                          key={(typeof condition === "object" ? condition.name : condition) + i}
                          className="condition-section"
                          style={{
                            backgroundColor: getConditionBackgroundColor(
                              typeof condition === "object" ? condition.name : condition
                            ),
                            color: 'black',
                          }}
                        >
                          {typeof condition === "object" ? condition.name : condition}
                        </div>
                      ))
                      : '[No Conditions]'}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="conditions-list">
            {/* Banner */}
            <div className="conditions-list-banner">
                <div className="conditions-list-header">
                    Conditions</div>
                <div className="conditions-banner-button">
                    <button className="add-condition-button" onClick={handleAddConditionClick}>
                        Add Condition
                    </button>
                </div>
            </div>

            {/* Rows */}
            <div className="conditions-list-content"
              style={{ backgroundColor: viewCharacterIndex !== null ? 'var(--view-character-background)' : '' }}
            >
              {viewCharacterIndex !== null &&
                sortedRowData[viewCharacterIndex] &&
                rowData[sortedRowData[viewCharacterIndex].index] ? (
                  rowData[sortedRowData[viewCharacterIndex].index].conditions.map((condition, i) => (
                  <div key={condition + i} className="conditions-row">
                    <div className="remove-condition">
                      <button
                        className="remove-condition-button"
                        onClick={() => {
                          // Remove this condition from the shifted row
                          const updatedData = [...rowData];
                          const realIndex = sortedRowData[viewCharacterIndex].index;
                          updatedData[realIndex].conditions = updatedData[realIndex].conditions.filter(
                            (c) => c !== condition
                          );
                          setRowData(updatedData);
                        }}
                        aria-label={`Remove ${condition}`}
                      >
                        <img src={minusIcon} alt="Remove Condition" />
                      </button>
                    </div>
                    <div className="condition-description">
                      <div>
                        <strong>{typeof condition === "object" ? condition.name : condition}</strong>
                      </div>
                      <div>
                        {(conditionDescriptions[typeof condition === "object" ? condition.name : condition] || "Filler description for this condition.")
                          .split('???')
                          .map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                    <div className="condition-expiration">
                      {typeof condition === "object" ? (condition.expiration || "NA / Unknown") : "NA / Unknown"}
                    </div>
                  </div>
                ))
                ) : null
              }
              {shiftedRowIndex !== null &&
                viewCharacterIndex === null &&
                sortedRowData[shiftedRowIndex] &&
                rowData[sortedRowData[shiftedRowIndex].index] &&
                rowData[sortedRowData[shiftedRowIndex].index].conditions.length > 0 ? (
                  rowData[sortedRowData[shiftedRowIndex].index].conditions.map((condition, i) => (
                    <div key={condition + i} className="conditions-row">
                      <div className="remove-condition">
                        <button
                          className="remove-condition-button"
                          onClick={() => {
                            // Remove this condition from the shifted row
                            const updatedData = [...rowData];
                            const realIndex = sortedRowData[shiftedRowIndex].index;
                            updatedData[realIndex].conditions = updatedData[realIndex].conditions.filter(
                              (c) =>
                                typeof c === "object"
                                  ? c.name !== (condition.name || condition)
                                  : c !== (condition.name || condition)
                            );
                            setRowData(updatedData);
                          }}
                          aria-label={`Remove ${condition}`}
                        >
                          <img src={minusIcon} alt="Remove Condition" />
                        </button>
                      </div>
                      <div className="condition-description">
                        <div>
                          <strong>{typeof condition === "object" ? condition.name : condition}</strong>
                        </div>
                        <div>
                          {(conditionDescriptions[typeof condition === "object" ? condition.name : condition] || "Filler description for this condition.")
                            .split('???')
                            .map((line, idx) => (
                              <React.Fragment key={idx}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                        </div>
                      </div>
                      <div className="condition-expiration">
                        {typeof condition === "object" ? (condition.expiration || "NA / Unknown") : "NA / Unknown"}
                      </div>
                    </div>
                  ))
                ) : null
              }
            </div>
            </div>
        </div>
  
        {/* Add-Character Modal */}
      {isModalOpen !== null && (
        <div className="modal-overlay add-character-modal">
          <div className="modal">
            <h2>Add New Character</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="character-name">Character Name</label>
                <input
                  type="text"
                  id="character-name"
                  name="characterName"
                  className="form-input"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Affiliation</label>
                <div className="radio-group">
                  {['Player Character', 'Enemy', 'Ally', 'Neutral/Environmental'].map((type) => (
                    <label key={type}>
                      <input
                        type="radio"
                        name="affiliation"
                        value={type}
                        checked={affiliation === type}
                        onChange={(e) => setAffiliation(e.target.value)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="modal-button-group">
                <button type="button" className="close-modal-button" onClick={handleCloseModal}>
                  X
                </button>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{deleteConfirmIndex !== null && (
  <div className="modal-overlay delete-confirm-modal">
    <div className="modal">
      <p>
        Are you sure you want to delete{' '}
        <span style={{ color: 'darkblue' }}>
          {rowData[deleteConfirmIndex]?.name || 'this character'}
        </span>
        ?<br></br> This action cannot be undone.
      </p>
      <div className="character-delete-modal-button-group">
        <button
          className="character-delete-cancel-button"
          onClick={() => setDeleteConfirmIndex(null)}
        >
          Cancel
        </button>
        <button
          className="character-delete-submit-button"
          onClick={() => {
            let updatedData = [...rowData];
            let updatedVisibility = [...rowVisibility];
            let updatedOverlay = [...overlayActive];

            updatedData.splice(deleteConfirmIndex, 1);
            updatedVisibility.splice(deleteConfirmIndex, 1);
            updatedOverlay.splice(deleteConfirmIndex, 1);

            // Only add a new empty row if:
            // - There are fewer than 20 rows
            // - There is NOT already an empty row (row with no name)
            // const hasEmptyRow = updatedData.some(row => !row.name);
            // if (updatedData.length < 20 && !hasEmptyRow) {
              updatedData.push({ name: '', affiliation: '', initiative: null, conditions: [] });
              updatedVisibility.push(updatedData[updatedData.length - 2].name !== '' ? true : false); // or false, depending on your logic
              updatedOverlay.push(updatedData[updatedData.length - 2].name !== '' ? true : false);    // show the add-character button
            // }

            setRowData(updatedData);
            setRowVisibility(updatedVisibility);
            setOverlayActive(updatedOverlay);

            setDeleteConfirmIndex(null);
            setOpenMenuIndex(null);
          }}
        >
          Proceed
        </button>
      </div>
    </div>
  </div>
)}

{/* Add-Condition Modal */}
{isAddConditionModalOpen !== null && (
  <div className="modal-overlay">
    <div className="dual-modal-wrapper">
      <div className="condition-modal">
        <h2>Add Condition</h2>
        <form onSubmit={handleAddConditionSubmit}>
          {/* Choose Condition(s) Section */}
          <div className="characters-conditions">
          <div className="characters-section">
            <div className="form-group">
              <label htmlFor="characters">Apply to Character(s):</label>
              <div className="characters-checkbox-group">
                {rowData
                  .filter((row, index) => row.name && !overlayActive[index])
                  .sort((a, b) => a.name.localeCompare(b.name)) // <-- Add this line
                  .map((row, index) => (
                    <div
                      key={row.name}
                      className={`selectable-item${selectedCharacters.includes(row.name) ? ' selected' : ''}`}
                      onClick={() => handleCharacterClick(row.name)}
                    >
                      {row.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="conditions-section">
            <div className="form-group">
              <label htmlFor="conditions">Choose Condition(s):</label>
              <div className="conditions-checkbox-group">
                {[
                  'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated',
                  'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained',
                  'Stunned', 'Unconscious', 'Exhaustion1', 'Exhaustion2', 'Exhaustion3',
                  'Exhaustion4', 'Exhaustion5', 'Exhaustion6', 'Other1', 'Other2', 'Other3', 'Other4', '(Custom)'
                ].map((condition) => (
                  <div
                    key={condition}
                    className={`selectable-item${selectedConditions.includes(condition) ? ' selected' : ''}`}
                    onClick={() => {
                      handleConditionClick(condition);

                      if (condition === '(Custom)') {
                        if (selectedConditions.includes('(Custom)')) {
                          // If already selected, clicking again deselects it — so close the modal
                          setIsCustomConditionModalOpen(false);
                        } else {
                          // If not selected, clicking selects it — so open the modal
                          setIsCustomConditionModalOpen(true);
                        }
                      }
                    }}

                  >
                    {condition}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
            <div className="condition-expiration-selection">
              <label htmlFor="condition-expiration-timing" className="condition-expiration-label">
                Condition Expiration:
              </label>
              {/* First dropdown */}
              <select
                id="condition-expiration-timing"
                className="condition-expiration-dropdown"
                value={expirationTiming}
                onChange={e => {
                  setExpirationTiming(e.target.value);
                  setExpirationType("");
                  setExpirationTarget("");
                  setExpirationRound(""); // Reset fourth dropdown
                }}
              >
                <option>NA / Unknown</option>
                <option>At the beginning of</option>
                <option>Just before</option>
                <option>Just after</option>
                <option>At the end of</option>
              </select>
              {/* Second dropdown */}
              <select
                className="condition-expiration-dropdown"
                value={expirationType}
                onChange={e => {
                  setExpirationType(e.target.value);
                  setExpirationTarget("");
                  setExpirationRound(""); // Reset fourth dropdown
                }}
                disabled={expirationTiming === "unknown"}
              >
                {expirationTiming !== "unknown" && (
                  <>
                    <option value="">-- Select --</option>
                    <option value="round">Round</option>
                    <option value="character">Character's Turn:</option>
                  </>
                )}
              </select>
              {/* Third dropdown */}
              <select
                className="condition-expiration-dropdown"
                value={expirationTarget}
                onChange={e => setExpirationTarget(e.target.value)}
                disabled={expirationTiming === "unknown" || !expirationType}
              >
                {expirationTiming !== "unknown" && expirationType === "round" &&
                  <>
                    (
                      <option value="">--Select Round--</option>
                    )
                    {
                      [...Array(10)].map((_, i) => (
                        <option key={i} value={round + i}>
                          {round + i}
                        </option>
                      ))
                    }
                  </>
                }
                {expirationTiming !== "unknown" && expirationType === "character" &&
                  <>
                    <option value="">--Select Character--</option>
                    {
                      sortedRowData
                        .filter(row => row.name && !overlayActive[row.index])
                        .map(row => row.name)
                        .sort((a, b) => a.localeCompare(b))
                        .map(name => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))
                    }
                  </>
                }
              </select>
              {/* Fourth dropdown: only if "Character's Turn:" is selected */}
              {expirationTiming !== "unknown" && expirationType === "character" && (
                <select
                  className="condition-expiration-dropdown"
                  value={expirationRound}
                  onChange={e => setExpirationRound(e.target.value)}
                >
                  <option value="">--Select Round--</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={round + i}>
                      On Round {round + i}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              {
                toggleAddConditionEnforcementMessage && (
                  <h3 style={{color: "red"}}>Please ensure all fields are not empty</h3>
                )
              }
            </div>
            <div className="modal-button-group">
              <div className="submit-button-container">
                <button className="submit-button">Submit</button>
              </div>
              <button
                type="button"
                className="close-modal-button"
                onClick={handleCloseAddConditionModal}
              >
                X
              </button>
            </div>
        </form>
      </div>

      {isCustomConditionModalOpen && (
        <div className="custom-condition-modal">
          <h2>Custom Condition</h2>
            {!showCustomConditionForm ? (
                <button onClick={() => setShowCustomConditionForm(true)} className="new-custom-condition-button">
                  New Custom Condition
                </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const newName = customConditionName.trim();
                  if (!newName) return;

                  setCustomConditions((prevConditions) =>
                    [...prevConditions, {
                      name: newName,
                      affect: customConditionAffect,
                      description: customConditionDescription,
                    }].sort((a, b) => a.name.localeCompare(b.name))
                  );

                  setConditionDescriptions({...conditionDescriptions, [newName]: customConditionDescription});
                  console.log(conditionDescriptions);

                  setShowCustomConditionForm(false);
                  setCustomConditionName('');
                  setCustomConditionAffect('');
                  setCustomConditionDescription('');
                }}
            >
                <div className="form-group">
                  <label>Name</label>
                  <textarea
                    name="customConditionName"
                    value={customConditionName}
                    onChange={(e) => setCustomConditionName(e.target.value)}
                    rows={1}
                  />
                </div>

                <div className="form-group">
                  <label>Affect</label>
                  <div className="affect-buttons">
                    {['Positive', 'Neutral', 'Negative'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`${customConditionAffect === type ? 'selected' : ''} ${type.toLowerCase()}`}
                        onClick={() => setCustomConditionAffect(type)}
                      >
                        {type}
                      </button>
                    ))}

                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="customConditionDescription"
                    value={customConditionDescription}
                    onChange={(e) => setCustomConditionDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="modal-button-group">
                  <button type="submit">Add Condition</button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomConditionForm(false); // Hide the form
                      setCustomConditionName('');        // Clear name input
                      setCustomConditionAffect('');      // Clear affect selection
                      setCustomConditionDescription(''); // Clear description
                    }}
                  >
                    Cancel
                  </button>

                </div>
              </form>
              )}
              <div className="custom-condition-content">
              {!showCustomConditionForm && (
                <div className="custom-condition-list">
                  {customConditions.length > 0 ? (
                    customConditions.map((condition, index) => {
                      const isSelected = selectedConditions.includes(condition.name);

                      return (
                        <div
                          key={index}
                          className={`selectable-item ${condition.affect?.toLowerCase()}${isSelected ? ' selected' : ''}`}
                          onClick={() => handleConditionClick(condition.name)}
                        >
                          <button
                            type="button"
                            className="remove-condition-button"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent also selecting the item
                              setCustomConditions((prevConditions) =>
                                prevConditions.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            <img
                              src={require('./media/minus-icon.png')}
                              alt="Remove"
                              className="condition-icon"
                            />
                          </button>
                          {condition.name}
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-custom-conditions">No custom conditions added yet.</p>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  </div>
)}
              </div>
          </>
          );
        }
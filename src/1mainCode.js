import React, { useState, useEffect, useRef } from 'react';
import './1colors.css';
import './2mainStyles.css';
import './3initiativeList.css';
import './4addCharacterModal.css'; // Import the modal styling
import './5addConditionModal.css';
import './6conditionsDisplay.css';
import plusIcon from './media/plus-icon.png';
import viewIcon from './media/view-icon.png';
import threeDots from './media/three-dots.png';
import './7deleteCharacterModal.css';

export default function MainCode() {
    const [round, setRound] = useState(0); // Add state for the round number
    const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(null); // Track the add-condition modal
    const [characterName, setCharacterName] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [rowVisibility, setRowVisibility] = useState(
      Array(10).fill(false).map((_, index) => index === 0)
    );
    const [overlayActive, setOverlayActive] = useState(
      Array(10).fill(false).map((_, index) => index === 0)
    );
    const [rowData, setRowData] = useState(
        Array(10).fill({ name: '', affiliation: '', initiative: null, conditions: [] })
      );

    const [sortedRowData, setSortedRowData] = useState([]);

    const [shiftedRowIndex, setShiftedRowIndex] = useState(null); // Track the index of the shifted row
    
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);

    const [editCharacterIndex, setEditCharacterIndex] = useState(null);

    const handleAddConditionClick = (rowIndex) => {
        setIsAddConditionModalOpen(rowIndex); // Open the modal for the specific row
      };

      const handleAddCondition = (rowIndex, conditions) => {
        const updatedData = [...rowData];
        conditions.forEach((condition) => {
          if (!updatedData[rowIndex].conditions.includes(condition)) {
            updatedData[rowIndex].conditions.push(condition); // Add the condition if it's not already present
          }
        });
        setRowData(updatedData);
        setIsAddConditionModalOpen(null); // Close the modal after adding the conditions
      };
    
      const handleCloseAddConditionModal = () => {
        setIsAddConditionModalOpen(null); // Close the add-condition modal
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
      <div className="wrapper">
        <div className="container">
          <div className="initiative-list">
            <div className="initiative-banner">
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
            {sortedRowData.map(({ index }, shiftedIndex) => (
                <div
                    key={index}
                    className={`row ${shiftedIndex === shiftedRowIndex ? 'shifted-row' : ''}`}
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
                      <button className="view-button">
                        <img src={viewIcon} alt="View Icon" className="view-icon" />
                      </button>
                    </div>
                    <div className="character-menu" style={{ position: 'relative' }}>
                      <button
                        className="character-menu-dots"
                        onMouseDown={(e) => {
                          e.stopPropagation(); // Prevent the document handler from firing
                          setOpenMenuIndex(openMenuIndex === index ? null : index);
                        }}
                        type="button"
                      >
                        <img src={threeDots} alt="Menu" className="character-menu-icon" />
                      </button>
                      {openMenuIndex === index && (
                        <div className="character-dropdown-menu" ref={dropdownRef}>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setEditCharacterIndex(index);
                              setCharacterName(rowData[index].name);
                              setAffiliation(rowData[index].affiliation);
                              setIsModalOpen(index); // Open the modal
                              setOpenMenuIndex(null);
                            }}
                          >
                            Edit Character
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setDeleteConfirmIndex(index);
                              setOpenMenuIndex(null);
                            }}
                          >
                            Delete Character
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="name-input" style={{ color: getTextColor(rowData[index].affiliation) }}>
                      {rowData[index].name || 'No Name'}
                    </div>
                    <div className="personal-conditions">
                      {rowData[index].conditions.length > 0
                        ? rowData[index].conditions.map((condition, i) => (
                            <div
                              key={condition + i}
                              className="condition-section"
                              style={{
                                backgroundColor: getConditionBackgroundColor(condition), // Set background color based on condition
                                color: 'black', // Ensure text is always black
                              }}
                            >
                              {condition}
                            </div>
                          ))
                        : '[No Conditions]'}
                    </div>
                </div>
                ))}
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
            <div className="conditions-list-content">
                {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="conditions-row">
                    <div className="remove-condition">Remove Condition</div>
                    <div className="condition-description">Description</div>
                    <div className="condition-expiration">Expires</div>
                </div>
                ))}
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
            // - There are fewer than 10 rows
            // - There is NOT already an empty row (row with no name)
            // const hasEmptyRow = updatedData.some(row => !row.name);
            // if (updatedData.length < 10 && !hasEmptyRow) {
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
  <div className="modal-overlay add-condition-modal">
    <div className="condition-modal">
      <h2>Add Condition</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission behavior

          // Get selected conditions
          const selectedConditions = Array.from(
            document.querySelectorAll('input[name="conditions"]:checked')
          ).map((checkbox) => checkbox.value);

          // Get selected characters
          const selectedCharacters = Array.from(
            document.querySelectorAll('input[name="characters"]:checked')
          ).map((checkbox) => checkbox.value);

          // Apply conditions to the selected characters only
          selectedCharacters.forEach((characterName) => {
            const rowIndex = rowData.findIndex((row) => row.name === characterName);
            if (rowIndex !== -1) {
              const updatedRow = { ...rowData[rowIndex] };
              updatedRow.conditions = [
                ...new Set([...updatedRow.conditions, ...selectedConditions]), // Avoid duplicate conditions
              ];
              rowData[rowIndex] = updatedRow; // Update the row data
            }
          });

          setRowData([...rowData]); // Update the state with the modified rows
          setIsAddConditionModalOpen(null); // Close the modal
        }}
      >
        {/* Choose Condition(s) Section */}
            <div className="conditions-section">
            <div className="form-group">
                <label htmlFor="conditions">Choose Condition(s):</label>
                <div className="conditions-checkbox-group">
                {[
                    'Blinded',
                    'Charmed',
                    'Deafened',
                    'Frightened',
                    'Grappled',
                    'Incapacitated',
                    'Invisible',
                    'Paralyzed',
                    'Petrified',
                    'Poisoned',
                    'Prone',
                    'Restrained',
                    'Stunned',
                    'Unconscious',
                    'Exhaustion1',
                    'Exhaustion2',
                    'Exhaustion3',
                    'Exhaustion4',
                    'Exhaustion5',
                    'Exhaustion6',
                    '(Custom)',
                ].map((condition) => (
                    <div key={condition} className="checkbox-item">
                    <input
                        type="checkbox"
                        id={`condition-${condition.toLowerCase().replace(/\s+/g, '-')}`}
                        name="conditions"
                        value={condition}
                    />
                    <label
                        htmlFor={`condition-${condition.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                        {condition}
                    </label>
                    </div>
                ))}
                </div>
            </div>
            </div>

        {/* Apply to Character(s) Section */}
            <div className="characters-section">
            <div className="form-group">
                <label htmlFor="characters">Apply to Character(s):</label>
                <div className="characters-checkbox-group">
                {rowData
                    .filter((row, index) => row.name && !overlayActive[index]) // Exclude unnamed characters and rows with an overlay
                    .map((row, index) => (
                    <div key={index} className="checkbox-item">
                        <input
                        type="checkbox"
                        id={`character-${row.name.toLowerCase().replace(/\s+/g, '-')}`}
                        name="characters"
                        value={row.name}
                        />
                        <label
                        htmlFor={`character-${row.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                        {row.name}
                        </label>
                    </div>
                    ))}
                </div>
            </div>
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
  </div>
)}
            </div>
        );
        }
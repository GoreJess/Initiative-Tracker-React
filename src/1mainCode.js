import React, { useState, } from 'react';
import './1colors.css';
import './2mainStyles.css';
import './3initiativeList.css';
import './4addCharacterModal.css'; // Import the modal styling
import './5addConditionModal.css';
import './6conditionsDisplay.css';
import plusIcon from './media/plus-icon.png';
import viewIcon from './media/view-icon.png';
import threeDots from './media/three-dots.png';

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

    const [shiftedRowIndex, setShiftedRowIndex] = useState(null); // Track the index of the shifted row
  
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
          const sortedRows = [...rowData]
            .map((row, index) => ({ ...row, index })) // Include the original index for tracking
            .filter((row) => rowVisibility[row.index] && !overlayActive[row.index]) // Only consider visible rows without overlays
            .sort((a, b) => {
              if (b.initiative !== a.initiative) {
                return (b.initiative ?? -Infinity) - (a.initiative ?? -Infinity); // Sort by initiative descending
              }
              return (a.name || '').localeCompare(b.name || ''); // Resolve ties alphabetically
            });
      
          if (sortedRows.length === 0) {
            return prevRound; // No valid rows to shift
          }
      
          const currentRowIndex = shiftedRowIndex ?? -1; // Start with no row shifted
          let nextRowIndex = null;
      
          // Find the next row to shift
          if (currentRowIndex === -1 || currentRowIndex === sortedRows[sortedRows.length - 1].index) {
            // If no row is shifted or the last row is shifted, start from the first row
            nextRowIndex = sortedRows[0].index;
          } else {
            // Otherwise, find the next row in the sorted order
            const currentIndexInSorted = sortedRows.findIndex((row) => row.index === currentRowIndex);
            nextRowIndex = sortedRows[currentIndexInSorted + 1]?.index ?? sortedRows[0].index;
          }
      
          // Update the shifted row
          setShiftedRowIndex(nextRowIndex);
      
          // Increment the round counter only if we loop back to the first row
          return nextRowIndex === sortedRows[0].index ? prevRound + 1 : prevRound;
        });
      };
  
      const handlePreviousRound = () => {
        setRound((prevRound) => {
          const sortedRows = [...rowData]
            .map((row, index) => ({ ...row, index })) // Include the original index for tracking
            .filter((row) => rowVisibility[row.index] && !overlayActive[row.index]) // Only consider visible rows without overlays
            .sort((a, b) => {
              if (b.initiative !== a.initiative) {
                return (b.initiative ?? -Infinity) - (a.initiative ?? -Infinity); // Sort by initiative descending
              }
              return (a.name || '').localeCompare(b.name || ''); // Resolve ties alphabetically
            });
      
          if (sortedRows.length === 0) {
            return prevRound; // No valid rows to shift
          }
      
          const currentRowIndex = shiftedRowIndex ?? -1; // Start with no row shifted
          let previousRowIndex = null;
      
          // Find the previous row to shift
          if (currentRowIndex === -1 || currentRowIndex === sortedRows[0].index) {
            // If no row is shifted or the first row is shifted, move to the last row
            previousRowIndex = sortedRows[sortedRows.length - 1].index;
          } else {
            // Otherwise, find the previous row in the sorted order
            const currentIndexInSorted = sortedRows.findIndex((row) => row.index === currentRowIndex);
            previousRowIndex = sortedRows[currentIndexInSorted - 1]?.index ?? sortedRows[sortedRows.length - 1].index;
          }
      
          // Update the shifted row
          setShiftedRowIndex(previousRowIndex);
      
          // Decrement the round counter only if we loop back to the last row
          return previousRowIndex === sortedRows[sortedRows.length - 1].index ? Math.max(prevRound - 1, 0) : prevRound;
        });
      };
  
    const handleOpenModal = (rowIndex) => {
      setIsModalOpen(rowIndex);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(null);
      setCharacterName('');
      setAffiliation('');
    };
  
    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Validate form inputs
        if (!characterName.trim() || !affiliation) {
          setErrorMessage('Please fill out all fields before submitting.');
          return;
        }
    
        const updatedData = [...rowData];
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
    
        // Reset modal state
        setIsModalOpen(null);
        setCharacterName('');
        setAffiliation('');
        setErrorMessage(''); // Clear the error message
      };
  
    const handleInitiativeChange = (index, value) => {
      const updatedData = [...rowData];
      updatedData[index].initiative = value ? parseFloat(value) : null; // Save initiative value
      setRowData(updatedData);
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
  
    return (
      <div className="wrapper">
        <div className="container">
          <div className="initiative-list">
            <div className="initiative-banner">
              <div className="round-counter">Round {round}</div>
              <div className="initiative-title">Initiative Title</div>
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
            {sortedRows.map(({ index }) => (
                <div
                    key={index}
                    className={`row ${index === shiftedRowIndex ? 'shifted-row' : ''}`}
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
                    <div
                    className="name-input"
                    style={{ color: getTextColor(rowData[index].affiliation) }}
                    >
                    {rowData[index].name || 'No Name'}
                    </div>
                    <div className="view-character-conditions">
                    <button className="view-button">
                        <img src={viewIcon} alt="View Icon" className="view-icon" />
                    </button>
                    </div>
                    <div className="character-menu">
                    <button className="character-menu-dots">
                        <img src={threeDots} alt="Menu" className="character-menu-icon" />
                    </button>
                    </div>
                    <div className="personal-conditions">
                    {rowData[index].conditions.length > 0
                        ? rowData[index].conditions.join(', ') // Display conditions as a comma-separated list
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
                    <div className="remove-condition">Remove</div>
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

{/* Add-Condition Modal */}
{isAddConditionModalOpen !== null && (
  <div className="modal-overlay add-condition-modal">
    <div className="condition-modal">
      <h2>Add Condition</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const selectedConditions = Array.from(
            document.querySelectorAll('input[name="conditions"]:checked')
          ).map((checkbox) => checkbox.value);

          const selectedCharacters = Array.from(
            document.querySelectorAll('input[name="characters"]:checked')
          ).map((checkbox) => checkbox.value);

          // Handle adding conditions to selected characters
          selectedCharacters.forEach((characterName) => {
            const rowIndex = rowData.findIndex((row) => row.name === characterName);
            if (rowIndex !== -1) {
              handleAddCondition(rowIndex, selectedConditions);
            }
          });

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
                    'Exhaustion 1',
                    'Exhaustion 2',
                    'Exhaustion 3',
                    'Exhaustion 4',
                    'Exhaustion 5',
                    'Exhaustion 6',
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
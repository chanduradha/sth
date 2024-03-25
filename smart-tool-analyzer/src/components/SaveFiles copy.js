import React, { useState } from 'react';

const SaveFiles = ({ selectedFiles }) => {
  const [files, setFiles] = useState(selectedFiles.map(file => ({ name: file.name, checked: false })));

  const handleCheckboxChange = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index].checked = !updatedFiles[index].checked;
    setFiles(updatedFiles);
  };

  return (
    <div>
    <div>
      <h2>Selected Files:</h2>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={file.checked}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  
    </div>

    
  );
};

export default SaveFiles;
